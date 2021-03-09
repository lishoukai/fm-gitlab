<template>
    <div class="main">
      <el-container class="main">
        <el-main>
        <el-row class="top">
          <div>
            <span class="searchName">用户：</span>
              <el-input
              class="search-input"
              v-model="pageInfo.userName"
              clearable
              prefix-icon="el-icon-search"
              placeholder="请输入用户账号"/>
          </div>
          <div>
            <span class="searchName">操作：</span>
             <el-select v-model="pageInfo.requestUrl" placeholder="请选择">
              <el-option
                v-for="item in logFilter"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div>
            <span class="searchName">开始时间：</span>
              <el-date-picker
                v-model="pageInfo.startTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
          </div>
          <div>
            <span class="searchName">结束时间：</span>
              <el-date-picker
                v-model="pageInfo.endTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
          </div>
            <el-button type="primary" icon="el-icon-search" class="button-search" @click="searchOr()">搜索</el-button>
        </el-row>
      <el-table
      :data="tableData"
      max-height="600"
      width='auto'>
      <el-table-column
        width="100px"
        label="用户"
        prop="userName">
      </el-table-column>
      <el-table-column
        label="操作"
        prop="requestUrl"
        width="100px">
      </el-table-column>
      <el-table-column
      label="源文件/目录"
      prop="path"
      >
      </el-table-column>
       <el-table-column
      label="目标文件/目录"
      prop="endPath"
      >
      </el-table-column>
      <el-table-column
        label="时间"
        prop="date"
        width="180px">
      </el-table-column>
    </el-table>
     <el-pagination
        class="page"
        @current-change="handleCurrentChange"
        :current-page="this.pageInfo.pageIndex"
        :page-size="this.pageInfo.pageSize"
        background
        layout="prev, pager, next, jumper"
        :total="this.pageInfo.totalSize">
      </el-pagination>
   </el-main>
  </el-container>
    </div>
</template>

<script>
import { getLogs } from '../services/user';
// vuex存得数据
import { TOKEN_TYPE } from '../store/mutation-types';

export default {
  data() {
    return {
      tableData: [], // 日志表格数据
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        userName: '', // 用户名称
        requestUrl: '', // 操作类型
        totalSize: 0, // 日志总数
      },
      logFilter: [ // 日志记录类型
        {
          text: '全部',
          value: '',
        },
        {
          text: '新建文件夹',
          value: '/file-manage/createFileDir',
        },
        {
          text: '上传文件',
          value: '/file-manage/uploadFilesToPath',
        },
        {
          text: '删除文件',
          value: '/file-manage/removeFileOrDir',
        },
        {
          text: '移动文件',
          value: '/file-manage/moveFileOrDir',
        },
        {
          text: '复制文件',
          value: '/file-manage/copyFileOrDir',
        },
        {
          text: '重命名文件',
          value: '/file-manage/renameFileOrDir',
        },
        {
          text: '查看文件',
          value: '/file-manage/readFileContent',
        },
        {
          text: '修改文件',
          value: '/file-manage/writeFileContent',
        },
      ],
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
  mounted() {
    // 初始化日志表格
    this.getLog();
  },
  methods: {
    /**
     * 分页跳转
     */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageInfo.pageIndex = val;
      this.getLog();
    },

    /**
     * 获取日志信息
     */
    getLog() {
      this.toTokenTime();
      getLogs(this.pageInfo.pageIndex, this.pageInfo.pageSize,
        this.pageInfo.userName, this.pageInfo.requestUrl,
        this.pageInfo.startTime, this.pageInfo.endTime).then(
        (res) => {
          this.tableData = res.data.data.logs;
          // 日志总数，计算日志页数是用到
          this.pageInfo.totalSize = res.data.data.totalCount;
          this.tableData = this.tableData.filter(
            (item) => {
              // 将时间戳转化为日期格式
              const time = this.timestampToTime(item.requestTime);
              // eslint-disable-next-line no-param-reassign
              item.date = time;
              // 按照接口地址，保存对应的操作名称
              this.logFilter.forEach(
                (el) => {
                  if (el.value !== '' && item.requestUrl.includes(el.value)) {
                    // eslint-disable-next-line no-param-reassign
                    item.requestUrl = el.text;
                  }
                },
              );
              // 文件操作的位置
              if (item.requestParam !== '') {
                // eslint-disable-next-line no-param-reassign
                item.path = JSON.parse(item.requestParam).srcPath;
                // eslint-disable-next-line no-param-reassign
                item.endPath = JSON.parse(item.requestParam).destPath;
              }
              return item;
            },
          );
        },
      );
    },

    /**
     * 多条件查询
     */
    searchOr() {
      this.pageInfo.pageIndex = 1;
      if (this.pageInfo.startTime !== '' && this.pageInfo.endTime !== '' && this.pageInfo.endTime.valueOf() - this.pageInfo.startTime.valueOf() < 0) {
        this.$message({
          type: 'error',
          message: '时间选择失效，结束时间不能小于开始时间',
        });
        return false;
      }
      this.getLog();
      return true;
    },
    // 保存接口访问的时间，并且返回到父组件中
    toTokenTime() {
      this.tokenEndTime = Date.now();
      const timeLength = (this.tokenEndTime - this.tokenStartTime) / 1000;
      if (timeLength < this.tokenTimeOut) { // token没有过期
        if (timeLength > this.tokenTimeOut - 3000) {
          this.$store.commit(TOKEN_TYPE, 1); // 重新请求token
        } else {
          this.$store.commit(TOKEN_TYPE, 3); // 更新最后开始点击时间
        }
        this.$emit('tokenChild');
        return true;
      }
      this.$store.commit(TOKEN_TYPE, 2); // token过去，重新登录
      this.$emit('tokenChild');
      return false;
    },

    /**
     * 将时间戳转化为日期
     */
    timestampToTime(timestamp) {
      // eslint-disable-next-line radix
      const date = new Date(parseInt(timestamp));// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      const Y = `${date.getFullYear()}-`;
      const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
      const D = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} `;
      const h = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:`;
      const m = `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:`;
      const s = (date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds());
      const strDate = Y + M + D + h + m + s;
      return strDate;
    },
  },
};
</script>
<style scoped>
.el-contaion {
  width: 100%;
  height: 100%;
}
.main {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
}
.el-main {
  height: 100%;
  padding-right: 20px;
}
.el-pager li {
    color: black;
}
.el-table {
  margin-right: 0;
}
.page {
  padding-top: 10px;
  text-align: right;
}
.el-input {
  margin-top: 0;
}
.el-pagination__editor {
  margin-top: 0 !important;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: wrap;
  margin-left: 20px;
  height: 60px;
  font-size: 14px;
}
.searchName {
  display: inline-block;
  width: 70px;
}
.button-search {
  height: 30px;
  padding: 0 15px;
}
.searchName span{
  line-height: 33px;
}
.search-input {
  width: auto;
}
</style>
