<template>
    <div class="file">
      <el-container class="file">
          <el-aside width="200px" class="tree-file">
            <!-- 文件树 -->
            <el-tree
                class="filter-tree"
                :props="props"
                :load="loadNode"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                @node-expand="getFilter"
                @node-click="getMune"
                lazy
                ref="tree"
            >
            <!-- 过滤了文件，只显示文件夹 -->
            <span class="custom-tree-node" slot-scope="{ data }">
                <span v-if="!data.isFile">
                    <i class="el-icon-folder"></i>{{data.name}}
                </span>
              </span>
            </el-tree>
            </el-aside>
            <el-main>

            <el-row class="path-style row-padding">
              <!-- 文件表格顶部导航 -->
                <el-col :span="18">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item v-for="(item, index) in navigation" :key="index">
                      <!-- 导航最后一个没有点击事件 -->
                    <el-link @click="navigation.length !== index + 1 ? toOne(item, index): ''" :underline="false">
                        {{item}}
                    </el-link>
                    </el-breadcrumb-item>
                </el-breadcrumb>
                </el-col>
                <!-- 搜索框 -->
                <el-col :span="4" :offset="2">
                <el-input
                v-model="search"
                disabled
                suffix-icon="el-icon-search"
                placeholder="此功能暂未开放"/>
                </el-col>
            </el-row>
            <!-- 页面文件操作 -->
            <el-row class="doing row-padding">
                <el-col :span="15">
                <el-button @click="open(openPath)">
                    新建文件夹<i class="el-icon-circle-plus el-icon--right"></i>
                    </el-button>
                <el-button>
                    <el-upload
                        class="upload-demo"
                        :action= "uploadUrl + openPath"
                        :headers="myheader"
                        :show-file-list="false"
                        :data="{srcPath: this.openPath}"
                        :on-success="upFileSuccess"
                        :on-progress="progress"
                        :on-error="error"
                        :multiple="true"
                        :before-upload="fileName"
                        >
                        上传<i class="el-icon-upload el-icon--right"></i>
                    </el-upload>
                </el-button>
                <el-button @click="copy" v-show="copyPath" type="primary" plain>
                    粘贴到当前目录<i class="el-icon-s-claim el-icon--right"></i>
                </el-button>
                <el-button @click="move" v-show="movePath" type="primary" plain>
                    移动到此目录<i class="el-icon-receiving el-icon--right"></i>
                </el-button>
                </el-col>
            <el-col :span="4" :offset="5" class="unit">
                <el-button icon="el-icon-s-grid" @click="doFalutre()"></el-button>
                <el-button icon="el-icon-s-operation" @click="doFalutre()"></el-button>
                </el-col>
            </el-row>
            <!-- 文件表格 -->
            <el-table
            v-loading="loading"
            :element-loading-text="'已上传' + percent"
            :data="tableData"
            height="80%"
            border
            highlight-current-row
            @row-dblclick="tableClick"
            style="width: auto">
            <el-table-column
                prop="name"
                label="名称"
                width="200"
                sortable>
                <template slot-scope="scope">
                  <span size="medium" v-if="scope.row.type==='文件夹'"><el-link type="primary" @click="tableClick(scope.row)">{{ scope.row.name}}</el-link></span>
                  <span size="medium" v-if="scope.row.type!=='文件夹'">{{ scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="修改日期"
                width="160"
                sortable>
            </el-table-column>
            <el-table-column
                prop="type"
                sortable
                width="130px"
                label="类型">
                <template slot-scope="scope">
                    <span size="medium">{{ scope.row.type}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="fileSize"
                sortable
                width="90px"
                label="大小">
            <template slot-scope="scope">
                    <span size="medium" v-if="scope.row.fileSize !== 0">{{ conver(scope.row.fileSize)}}</span>
            </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                >
                <template slot-scope="scope">
                <el-button  type="text" size="small" @click="renameFileOrDir(scope.row)">重命名</el-button>
                <el-button  type="text" size="small" @click="getMovePath(scope.row)">移动</el-button>
                <el-button @click="coply(scope.row)" type="text" size="small">复制</el-button>
                <el-button @click="deleted(scope.row)" type="text" size="small">删除</el-button>
                <el-button v-if="scope.row.type !== '文件夹'" @click="upload(scope.row)" type="text" size="small">下载</el-button>
                <el-button type="text" v-if="scope.row.type!=='文件夹' && isRead(scope.row.name)" @click="readFile(scope.row)" size="small">编辑</el-button>
                </template>
            </el-table-column>
            </el-table>
                <!-- <el-progress type="circle" :percentage="100" status="success"></el-progress> -->
            </el-main>
            <el-dialog :title="readName" :visible.sync="dialogTableVisible">
              <textarea v-model="fileContent" id=""></textarea>
              <!-- <div style="white-space: pre-wrap;">
                {{fileContent}}
              </div> -->
              <el-button @click="writeContent()" class="read-button">保存</el-button>
            </el-dialog>
      </el-container>
    </div>
</template>
<script>
import Vue from 'vue';
import { defineComponent } from '@vue/composition-api';
import {
  allFiles, createFiles, deletedFiles, uploadFilesToPath, copyFileOrDir,
  moveFileOrDir, renameFileOrDir, checkFileExists, readFileContent, writeFileContent,
} from '../services/user';
// 文件下载路径 文件上传路径
import { uploadUrl, downLoadUrl } from '../services/config';
// vuex存得数据
import { TOKEN_TYPE } from '../store/mutation-types';

export default defineComponent({
  mounted() {
    // 初始化文件目录
    this.getFileInfo(this.openPath, (res) => {
      this.tableData = res.data.data;
      this.tableData = this.tableData.filter((element) => {
        const namearay = element.name.split('.');
        if (namearay.length === 1) {
          // eslint-disable-next-line no-param-reassign
          element.type = '文件夹';
        } else {
          // eslint-disable-next-line no-param-reassign
          element.type = `${namearay[namearay.length - 1]}文件`;
        }
        return element;
      });
      // 文件系统根目录
      this.rootPath = this.tableData[0].path.split('\\');
      this.rootPath = this.rootPath.splice(0, this.rootPath.length - 1);
      // 文件系统默认显示导航栏根目录
      this.navigation = [this.rootname];
    });
    // 禁止使用右击事件
    document.oncontextmenu = () => false;
  },
  methods: {
    filterNode(value) {
      if (!value) return true;
      return value === 'false';
    },

    /**
     * 过滤树中的文件，只保留文件夹
     * */
    getFilter(data) {
      this.$refs.tree.filter(data.isFile);
    },

    /**
     * 获取点击目录相信路径内容信息，右侧表格
     */
    getMune(data) {
      const { path } = data;
      // 将数组转化为字符换，拼接为点击目录
      const pathArray = path.split('\\');
      this.openPath = path;
      this.toTokenTime();
      this.getFileInfo(path, (res) => {
        this.tableData = res.data.data;
        // 将文件按照后缀拼接文件类型
        this.tableData = this.tableData.filter((element) => {
          const namearay = element.name.split('.');
          if (namearay.length === 1) {
            // eslint-disable-next-line no-param-reassign
            element.type = '文件夹';
          } else {
            // eslint-disable-next-line no-param-reassign
            element.type = `${namearay[namearay.length - 1]}文件`;
          }
          return element;
        });
        // 设置导航栏显示
        this.navigation = pathArray.splice(this.rootPath.length);
        this.navigation.unshift(this.rootname);
      });
    },

    /**
     * 创建文件列表
     */
    getTableMune(path) {
      // 记录接口访问事件
      this.toTokenTime();
      this.openPath = path;
      this.getFileInfo(path, (res) => {
        this.tableData = res.data.data;
        this.tableData = this.tableData.filter((element) => {
          const name = element.name.split('.');
          if (name.length === 1) {
            // eslint-disable-next-line no-param-reassign
            element.type = '文件夹';
          } else {
            // eslint-disable-next-line no-param-reassign
            element.type = `${name[name.length - 1]}文件`;
          }
          return element;
        });
        const pathArray = path.split('\\');
        if (path === '') {
          this.navigation = [this.rootname];
        } else {
          this.navigation = pathArray.splice(this.rootPath.length);
          this.navigation.unshift(this.rootname);
        }
      });
    },
    /**
     * 文件删除功能
     */
    deleted(item) {
      // 记录接口访问时间
      this.toTokenTime();
      const newPath = this.openPath;
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
        const { path } = item;
        deletedFiles(path).then(
          () => {
            // 跟新文件树
            this.updataFileTree();
            this.getTableMune(newPath);
          },
        );
      });
    },

    /*
     * 表格双击事件
     */
    tableClick(row) {
      this.toTokenTime();
      if (!row.isFile) {
        this.getTableMune(row.path, row.name);
      }
    },

    /**
     * 文件上传成功，刷新表格列表
     */
    upFileSuccess(response, file, fileList) {
      // 记录接口点击时间
      this.toTokenTime();
      if (file.name === fileList[fileList.length - 1].name) {
        this.loading = false;
        // 跟新文件树
        this.updataFileTree();
        this.getTableMune(this.openPath);
      }
    },

    /**
     * 懒加载文件tree
     */
    loadNode(node, resolve) {
      if (node.level === 0) {
        // 根路径
        const path = '';
        this.getFiles(path, resolve);
        this.node = node;
        this.resolve = resolve;
      } else {
        // 当前点击目录的路径
        const { path } = node.data;
        this.getFiles(path, resolve);
      }
    },

    /**
     * 打开创建文件夹弹框
     * @newPath 当前所在路径
     */
    open(newPath) {
      this.$prompt('请输入新建文件夹名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: this.createName,
        inputErrorMessage: '文件名称不能为空',
      }).then(({ value }) => {
        // 新建的文件夹的路径
        const path = `${newPath}\\${value}`;
        this.toTokenTime();
        this.checkFiles(path).then(
          (res) => {
            const flag = res;
            if (flag) {
              this.$confirm('此操作将覆盖同名文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                distinguishCancelAndClose: true,
                type: 'warning',
              }).then(() => {
                // 创建文件夹
                this.createFile(path, newPath);
              }).catch(() => {
                console.log('quxiao');
              });
            } else {
              // 创建文件夹
              this.createFile(path, newPath);
            }
          },
        );
      });
    },

    /**
     * 创建文件夹
     * @newpath 新建文件夹的路径
     */
    createFile(path, newpath) {
      createFiles(path).then(
        () => {
          this.$message({
            type: 'success',
            message: '新建文件夹成功',
          });
          // 跟新文件树
          this.updataFileTree();
          this.getTableMune(newpath);
        },
      ).catch(
        () => {
          this.$message({
            type: 'error',
            message: '新建失败，请重试',
          });
        },
      );
    },

    /**
     * 创建文件夹名称
     */
    createName(value) {
      this.toTokenTime();
      if (value) {
        return true;
      }
      return false;
    },

    /**
     * 更新文件树
     */
    updataFileTree() {
      this.node.childNodes = [];
      this.loadNode(this.node, this.resolve);
    },

    /**
     * 获取当前路径下服务器的文件和文件夹,并渲染到tree中
     * @path 当前所在路径
     */
    getFiles(path, resolve) {
      allFiles({ srcPath: path }).then(
        (res) => {
          // 过滤了文件
          const data1 = res.data.data.filter(
            (item) => !item.isFile,
          );
          // 渲染树形文件目录
          resolve(data1);
        },
      ).catch(
        (res) => null,
      );
    },

    /**
     * 根据路径获取文件
     */
    getFileInfo(path, callback) {
      allFiles({ srcPath: path }).then(callback);
    },

    /**
     * 上传文件
     */
    upFiles(param) {
      // uploadFilesToPath();
      const formData = new FormData();
      formData.append('srcPath', `${this.openPath}\\${param.file.name}`); // 额外参数
      formData.append('files', param.file);
      uploadFilesToPath(formData);
    },

    /**
     * 点击导航，进入到相应目录下
     */
    toOne(item, index) {
      this.navigation.splice(index + 1);
      if (index !== 0) {
        // 截取当前点击导航所在路径，并清除当前导航的子路径
        const pathOld = this.navigation.slice(1, index + 1);
        // 当前访问路径
        const pathString = pathOld.join('\\');
        // 文件系统根路径
        const rootPath = this.rootPath.join('\\');
        const path = `${rootPath}\\${pathString}`;
        // 渲染表格
        this.getTableMune(path);
      } else {
        this.getTableMune('');
      }
    },

    /**
     * 获取需要复制的文件路径
     */
    coply(item) {
      this.toTokenTime();
      const newPath = `${item.path}`;
      this.copyName = item.name;
      this.copyPath = newPath;
    },

    /**
     * 复制文件到指定路径
     */
    copy() {
      if (`${this.openPath}\\${this.copyName}` !== this.copyPath) {
        this.checkFiles(`${this.openPath}\\${this.copyName}`).then((res) => {
          const flag = res;
          if (flag) {
            this.$confirm('此操作将覆盖同名文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              distinguishCancelAndClose: true,
              type: 'warning',
            }).then(() => {
              copyFileOrDir(this.copyPath, `${this.openPath}\\${this.copyName}`).then(
                () => {
                  // 跟新文件树
                  this.updataFileTree();
                  this.copyPath = '';
                  this.getTableMune(this.openPath);
                },
              );
            });
          } else {
            copyFileOrDir(this.copyPath, `${this.openPath}\\${this.copyName}`).then(
              () => {
                // 跟新文件树
                this.updataFileTree();
                this.copyPath = '';
                this.getTableMune(this.openPath);
              },
            );
          }
        });
      } else {
        this.$message({
          type: 'warning',
          message: '禁止在同一目录下复制文件',
        });
      }
    },

    /**
     * 重命名文件
     */
    renameFileOrDir(item) {
      this.toTokenTime();
      this.$prompt('请输入重命名文件名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: this.createName,
        inputErrorMessage: '文件名称不能为空',
        inputValue: item.name,
      }).then(({ value }) => {
        if (item.name !== value) {
          this.checkFiles(`${this.openPath}\\${value}`).then(
            (res) => {
              const flag = res;
              if (flag) {
                this.$message({
                  type: 'warning',
                  message: '文件名称重复，请重新修改',
                });
              } else {
                this.$message({
                  type: 'success',
                  message: `文件重命名为: ${value}`,
                });
                renameFileOrDir(item.path, `${this.openPath}\\${value}`).then(
                  () => {
                    // 跟新文件树
                    this.updataFileTree();
                    this.getTableMune(this.openPath);
                  },
                );
              }
            },
          );
        }
      });
    },

    /**
     * 获取需要移动的文件路径
     */
    getMovePath(item) {
      // 更新token
      this.toTokenTime();
      // 保存需要移动文件相关信息
      this.movePath = item.path;
      this.moveName = item.name;
    },

    /**
     * 移动文件
     */
    move() {
      // 在同一目录下移动文件的操作不允许
      if (`${this.openPath}\\${this.moveName}` !== this.movePath) {
        // 检查文件是否存在
        this.checkFiles(`${this.openPath}\\${this.moveName}`).then((res) => {
          const flag = res;
          // 文件存在，显示提示框
          if (flag) {
            this.$confirm('此操作将覆盖同名文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              distinguishCancelAndClose: true,
              type: 'warning',
            }).then(() => {
              moveFileOrDir(this.movePath, `${this.openPath}\\${this.moveName}`).then(
                () => {
                  // 跟新文件树
                  this.updataFileTree();
                  // 更新table文件列表
                  this.getTableMune(this.openPath);
                  // 移动文件路径相关信息清空
                  this.moveName = '';
                  this.movePath = '';
                },
              );
            });
          } else { // 不存在，直接进行操作
            moveFileOrDir(this.movePath, `${this.openPath}\\${this.moveName}`).then(
              () => {
                // 跟新文件树
                this.updataFileTree();
                // 更新table文件列表
                this.getTableMune(this.openPath);
                // 移动文件路径相关信息清空
                this.moveName = '';
                this.movePath = '';
              },
            );
          }
        });
      } else { // 同一目录下给出提示
        this.$message({
          type: 'warning',
          message: '禁止在同一目录下移动文件',
        });
      }
    },

    /**
     * 暂未开通的功能，显示一个提示框
     */
    doFalutre() {
      this.$alert('此功能暂未开放', '', {
        confirmButtonText: '确定',
      });
    },

    /**
     * 检查文件合法性
     * @param path 文件路径
     */
    async checkFiles(path) {
      const flag = await checkFileExists(path).then(
        (res) => res.data.data,
      );
      return flag;
    },

    /**
     * 文件上传的时候显示动画和加载进度
     *  */
    progress(e) {
      this.loading = true;
      this.percent = `${e.percent.toFixed(0)}%`;
    },

    /**
     * 文件上传失败的提示信息
     */
    error() {
      this.loading = false;
      this.$message({
        type: 'warning',
        message: '文件上传失败',
      });
    },

    /**
     * 保存接口访问的时间，并且返回到父组件中,跟新token
     */
    toTokenTime() {
      this.tokenEndTime = Date.now();
      const timeLength = (this.tokenEndTime - this.tokenStartTime) / 1000;
      if (timeLength < this.tokenTimeOut) { // token没有过期
        if (timeLength > this.tokenTimeOut - 3000) {
          console.log('重新请求token');
          this.$store.commit(TOKEN_TYPE, 1); // 重新请求token
        } else {
          console.log('更新token');
          this.$store.commit(TOKEN_TYPE, 3); // 更新最后开始点击时间
        }
        this.$emit('tokenChild');
        return true;
      }
      console.log('token过期');
      this.$store.commit(TOKEN_TYPE, 2); // token过期，重新登录
      this.$emit('tokenChild');
      return false;
    },

    /**
     * 文件大小转换公式
     *@param limit 文件实际大小（kb）
     */
    conver(limit) {
      let size = '';
      if (limit < 0.1 * 1024) { // 如果小于0.1KB转化成B
        size = `${limit.toFixed(2)}B`;
      } else if (limit < 0.1 * 1024 * 1024) { // 如果小于0.1MB转化成KB
        size = `${(limit / 1024).toFixed(2)}KB`;
      } else if (limit < 0.1 * 1024 * 1024 * 1024) { // 如果小于0.1GB转化成MB
        size = `${(limit / (1024 * 1024)).toFixed(2)}MB`;
      } else { // 其他转化成GB
        size = `${(limit / (1024 * 1024 * 1024)).toFixed(2)}GB`;
      }
      const sizestr = `${size}`;
      const len = sizestr.indexOf('\\.');
      const dec = sizestr.substr(len + 1, 2);
      if (dec === '00') { // 当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
      }
      return sizestr;
    },
    /**
     *下载文件
     *@param item 文件相关信息
     */
    upload(item) {
      window.location.href = downLoadUrl + item.path;
    },
    /**
     * 读文件
     * @param row 当前文件基本信息
     */
    readFile(row) {
      this.dialogTableVisible = true;
      const { path, name } = row;
      this.readName = name;
      this.readUrl = path;
      readFileContent(path).then(
        (res) => {
          this.fileContent = res.data.data;
        },
      );
    },

    /**
     * 存文件
     */
    writeContent() {
      writeFileContent(this.readUrl, this.fileContent).then(
        (res) => {
          console.log(res);
          this.dialogTableVisible = false;
          this.$message({
            type: 'success',
            message: '文件修改成功',
          });
        },
      );
    },

    /**
     * 验证上传的文件是否已经在列表中存在，存在返回false
     * @param file 上传文件相关信息
     */
    fileName(file) {
      // 文件上传路径
      const path = `${this.openPath}\\${file.name}`;
      let flag = false;
      // 判断当前路径下，是否已经存在改文件
      return this.checkFiles(path).then(
        (res) => {
          flag = !res;
          if (flag === false) {
            return this.$confirm('此操作将覆盖同名文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              distinguishCancelAndClose: true,
              type: 'warning',
            }).then(() => {
              flag = true;
              return Promise.resolve(flag);
            }).catch(() => {
              flag = false;
              return Promise.reject(flag);
            });
          }
          return Promise.resolve(flag);
        },
      );
    },
    /**
     * 文件是否可以进行编辑，可以编辑返回 true 不能编辑返回 false
     * @param name 文件名称
     */
    isRead(name) {
      // 默认文件可以编辑
      let flag = true;
      this.isReadList.forEach(
        (res) => {
          const nameArray = name.split('.');
          // 不可编辑文件，返回false
          if (nameArray[nameArray.length - 1].indexOf(res) !== -1) {
            flag = false;
          }
        },
      );
      return flag;
    },
  },
  data() {
    return {
      navigation: [], // 文件访问路径
      rootname: 'root', // 默认展示根目录名称
      rootPath: [], // 文件系统根目录
      copyPath: '', // 复制路径
      movePath: '', // 移动文件路径
      copyName: '', // 复制文件名称
      moveName: '', // 移动文件名称
      uploadUrl, // 文件上传路径
      readUrl: '', // 文件读写路径
      props: { // 文件树默认配置
        label: 'name',
        children: 'zones',
      },
      isReadList: [
        'apk', 'png', 'jpg', 'ipa',
      ], // 不可编辑文件列表
      tableData: [], // 表格数据
      openPath: '', // 当前文件夹路径
      node: [], // 懒加载树信息
      reslove: [], // 懒加载节点信息
      search: '', // 搜索内容关键字
      readName: '', // 读取文件名称
      myheader: { // 上传文件时的header值 （存储的是token）
        authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
      }, // token
      loading: false, // 是否显示加载框
      percent: '', // 下载进度
      dialogTableVisible: false, // 弹出框
      fileContent: '', // 文件内容
    };
  },
  props: { // 父组件传值
    tokenStartTime: { // token请求开始时间
      type: Number,
    },
    tokenResStartTime: { // 请求接口的开始时间
      type: Number,
    },
    tokenTimeOut: { // token时间间隔
      type: Number,
    },
  },
});
</script>
<style>
.file {
  height: 100%;
}
  /* 文件树样式 */
  .tree-file {
    padding: 20px;
    border-right: 1px solid #dcdfe6;
  }
  /* 文件展示部分页面样式 */
  .el-main {
    padding-left: 0;
    padding-top: 0;
    padding-right: 0;
  }
  /* 树形文件目录内容样式 */
  .filter-tree .el-tree-node__content {
    height: 40px;
    font-size: 12px;
  }
  .el-row {
    padding: 3px 0;
  }
  .el-col {
    text-align: left;
  }
  .el-row .el-button {
    height: 100%;
  }
  .el-menu {
    width: 100% !important;
    background: none !important;
  }
  .custom-tree-node i {
    margin-right: 5px;
  }
  .doing .el-button {
    font-size: 13px;
    padding: 6px 10px;
  }
  /* 顶部导航路径样式 */
  .path-style {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    border-bottom: 1px solid #dcdfe6;
    margin-top: 0;
    margin-bottom: 20px;
    padding: 10px 0;
  }
  /* 文件地址样式 */
  .el-link {
    line-height: 20px;
  }
  /* 搜索框样式 */
  .el-input {
    margin-bottom: 0;
    height: 25px;
    border: 1px solid #ddd;
    border-radius: 3px;
    margin-top: 6px;
  }
  .el-input__inner {
    border: 0;
    height: 100%;
  }
  /* 搜索框图标 */
  .el-input__icon {
    line-height: 25px;
  }
  /* 操作按钮样式 */
  .unit {
    text-align: right;
  }
  /* 文件列表样式 */
  .el-table {
    font-size: 13px;
    border-top: 1px solid #dcdfe6;
    margin-top: 6px;
    margin-left: 20px;
    margin-right: 20px;
  }
  /* 表头样式 */
  .el-table thead th {
    background-color: #f5f5f5;
  }
  .el-table th.is-sortable {
    cursor: pointer;
    padding: 2px 0;
  }
  .el-table th, .el-table td {
    padding: 6px 0;
  }
  /* 选中导航样式 */
  .nav-selected {
    background-color: #0d80f74d;
  }
  /* 内边距样式 */
  .row-padding {
    padding-left: 20px;
    padding-right: 20px;
  }
  .el-dialog {
    width: 80%;
    height: 80%;
  }
  .el-dialog__body {
    padding: 30px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    height: 70%;
  }
  textarea {
    width: 100%;
    height: 100%;
    resize: none;
  }
  .read-button {
    padding: 10px;
    display: block;
  }
</style>
