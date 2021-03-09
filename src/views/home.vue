<template>
<div class="content">
  <!-- <file></file> -->
  <el-container direction="vertical" @contextmenu.prevent>
            <el-container>
            <el-aside width="70px" class="nav">
            <ul class="nav-ul">
                <li>
                <img src="../assets/images/logo.png" width="30px">
                </li>
                <li :class="componentName==='file'?'nav-selected':'11111'" @click="mune('file')">
                <!-- <i class="el-icon-folder"></i> -->
                <img src="../assets/images/file.png" width="20">
                <p>文件管理</p>
                </li>
                <li :class="componentName==='log'?'nav-selected':''" @click="mune('log')">
                <img src="../assets/images/rizhi.png" width="20">
                <p>日志</p>
                </li>
                <li :class="componentName==='instruction'?'nav-selected':''" @click="mune('instruction')">
                <img src="../assets/images/sm.png" width="20">
                <p>操作说明</p>
                </li>
                <li class="user">
                <el-popover
                placement="right"
                width="200"
                trigger="click">
                <el-row :gutter="24">
                    <el-dropdown-item @click.native="doFalutre()">个人信息</el-dropdown-item>
                    <el-dropdown-item  @click.native="doFalutre()">关于</el-dropdown-item>
                    <el-dropdown-item divided @click.native="logout()">退出</el-dropdown-item>
                </el-row>
                <div slot="reference">
                <img src="../assets/images/user.jpg" width="20">
                </div>
                </el-popover>
                </li>
            </ul>
            </el-aside>
                <log
                v-if="componentName==='log'"
                :tokenStartTime="tokenStartTime"
                :tokenResStartTime="tokenResStartTime"
                :tokenTimeOut="tokenTimeOut"
                @tokenChild="tokenCHange"
                ></log>
                <file
                v-if="componentName==='file'"
                :tokenStartTime="tokenStartTime"
                :tokenResStartTime="tokenResStartTime"
                :tokenTimeOut="tokenTimeOut"
                @tokenChild="tokenCHange"
                ></file>
                <instruction
                v-if="componentName==='instruction'"
                >
                </instruction>
            </el-container>

        </el-container>
</div>
</template>

<script>
import { defineComponent } from '@vue/composition-api';
import file from '../components/file.vue';
import log from '../components/log.vue';
import instruction from '../components/Instructions.vue';
import { login } from '../services/user';

export default defineComponent({
  name: 'name',
  components: {
    file, // 文件组件
    log, // 日志组件
    instruction, // 操作说明组件
  },
  methods: {
    mune(name) {
      this.componentName = name;
    },
    // 计算两次接口访问之间，token是否过期
    tokenCHange(val) {
      if (this.$store.state.user.tokenType === 1) {
        // 重新请求一个token
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        login(this.userInfo.name, this.userInfo.password).then((response) => {
          const { data } = response.data;
          if (data) {
            if (data.ret === 'success') {
              // 存用户信息的时间，以时间戳方式存储
              this.userInfo.time = new Date().getTime();
              this.userInfo.token = data.data.token;
              this.userInfo.tokenTime = data.data.expires_in;
              // this.$store.commit('SET_TOKEN', '33333');
              // 更新token
              localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
              this.tokenStartTime = Date.now();
              this.tokenResStartTime = this.tokenStartTime;
            }
          }
        });
      } else if (this.$store.state.user.tokenType === 2) {
        // 跳转到登录界面
        this.logout();
      } else if (this.$store.state.user.tokenType === 3) { // 更新点击开始时间
        console.log('更新接口点击时间');
        this.tokenResStartTime = Date.now();
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
     * 退出登录
     */
    logout() {
      this.$router.replace('/');
    },
  },
  mounted() {
    // 保存第一次访问页面的时间
    this.tokenStartTime = Date.now();
    this.tokenResStartTime = Date.now();
    const userInfo = localStorage.getItem('userInfo');
    if (typeof userInfo === 'string') {
      const user = JSON.parse(userInfo);
      this.tokenTimeOut = user.tokenTime;
    }
  },

  data() {
    return {
      componentName: 'file',
      tokenTimeOut: 10, // touen时长
      tokenStartTime: Date.now(), // 第一次请求接口时间
      tokenEndTime: Date.now(), // 第二次请求接口时间
      tokenResStartTime: Date.now(), // 第一次请求token的时间
    };
  },
});
</script>
<style scoped>
.content {
  height: 100%;
}
.file {
    height: 100%;
    width: 100%;
  }
  /* 主体内容样式 */
  .el-container {
    height: 100%;
  }
  /* 用户头像样式 */
  .user {
    position: absolute;
    bottom: 0;
    left: 0;
    padding-top: 0;
    display: block;
    border-radius: 50%;
  }
  .user div {
    width: 31px;
    height: 30px;
    margin: 20px;
    border-radius: 50%;
    overflow: hidden;
  }
  .user img {
    width: 100%;
  }
  /* 导航栏样式 */
  .nav {
    background: #409EFF;
    text-align: center;
    font-size: 12px;
  }
  .nav-ul li {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
  .nav-ul li:hover {
    background-color: #0d80f74d;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  ul li {
    margin: 0;
    padding: 0;
    list-style: none;
    height: 70px;
    color: #fff;
    cursor: pointer;
    text-align: center;
  }
  ul li i {
    font-size: 20px;
  }
</style>
