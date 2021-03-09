<template>
  <div class="login-box">
    <div class="login">
      <div class="login-logo">
        <img src="../assets/images/logo.png">
        思路文件管理系统
      </div>
      <input type="text" v-model="userInfo.name" placeholder="请输入用户名" class="login-input login-user">
      <input type="password" v-model="userInfo.password" placeholder="请输入密码" class="login-input login-password">
      <p class="remember-password" :class="{'remember-password-yes':userInfo.rmbPas}" @click="setRmbPas">记住密码</p>
      <button class="login-btn" @click="getLogin">登录</button>
      <p class="login-info">注意：请使用个人域账号登录。</p>
    </div>
  </div>
</template>

<script>
import { user } from '@/services/config';
import { login } from '../services/user';

export default {
  name: 'login',
  data() {
    return {
      // 账号信息
      userInfo: {
        name: '', // 用户名
        password: '', // 密码
        rmbPas: false, // 记住密码
        time: '', // 缓存数据的时间
        token: '', // 接口token
      },
    };
  },
  mounted() {
    // 获取缓存的用户信息
    this.getUserInfo();
  },
  methods: {
    /**
     * 登录
     */
    getLogin() {
      if (!this.userInfo.name) {
        this.$message.error('请输入用户名');
      } else if (!this.userInfo.password) {
        this.$message.error('请输入密码');
      } else {
        login(this.userInfo.name, this.userInfo.password).then((response) => {
          const { data } = response.data;
          if (data) {
            if (response.data.code === 0 && data.ret === 'success') {
              // 存用户信息的时间，以时间戳方式存储
              this.userInfo.time = new Date().getTime();
              this.userInfo.token = data.data.token;
              this.userInfo.tokenTime = data.data.expires_in;
              // this.$store.commit('SET_TOKEN', '33333');
              // 存储用户信息
              localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
              // 登录成功，跳转页面
              this.$router.replace({
                path: '/home',
              });
            } else {
              if (data.ret === 'fail') {
                this.$message.error('账号或密码错误');
                return;
              }
              this.$message.error('网络异常');
            }
          }
        });
      }
    },
    /**
     * 获取缓存的用户信息
     */
    getUserInfo() {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      // 用户信息存在，且是记住密码的状态才回显
      if (userInfo && userInfo.rmbPas) {
        this.userInfo = userInfo;
      }
    },
    /**
     * 设置记住密码
     */
    setRmbPas() {
      this.userInfo.rmbPas = !this.userInfo.rmbPas;
    },
  },
};
</script>
<style scoped>
.login-box {
  width: 100%;
  height: 100%;
  background: url(../assets/images/login/bg.png) no-repeat;
  background-size: 100% 100%;
}
.login {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 470px;
  padding: 47px 145px;
  background: url(../assets/images/login/bg-white.png) no-repeat;
  background-size: 100% 100%;
  transform: translate(-50%, -50%);
}
.login-logo {
  margin: 0 auto;
  line-height: 48px;
  text-align: center;
  color: #4a81e1;
  font-size: 32px;
}
.login-logo img {
  width: 48px;
  height: 48px;
  margin: 0 auto 15px;
  display: block;
}
.login-input {
  margin-top: 32px;
  padding-left: 50px;
  width: calc(100% - 50px);
  height: 50px;
  border: solid 1px #d4d4d4;
  font-size: 16px;
  border-radius: 25px;
  display: block;
  outline: none;
}
.login-user {
  background: url(../assets/images/login/user.png) no-repeat 18px 12px;
}
.login-password {
  background: url(../assets/images/login/password.png) no-repeat 18px 14px;
}
.login-input:focus {
  border-color: #4a81e1;
}
.login-user:focus {
  background: url(../assets/images/login/user-on.png) no-repeat 18px 12px;
}
.login-password:focus {
  background: url(../assets/images/login/password-on.png) no-repeat 18px 14px;
}
.remember-password {
  margin-top: 32px;
  padding-left: 22px;
  height: 16px;
  background: url(../assets/images/login/radio_off.png) no-repeat;
  color: #7b7b7b;
  line-height: 16px;
  display: inline-block;
  cursor: pointer;
}
.remember-password-yes {
  background: url(../assets/images/login/radio_on.png) no-repeat;
}
.login-btn {
  margin-top: 32px;
  width: 100%;
  height: 50px;
  background: linear-gradient(to right, #4a81e1, #31b4f8);
  border: none;
  font-size: 18px;
  line-height: 36px;
  letter-spacing: 1px;
  color: #fff;
  box-shadow: 0px 2px 8px 0px rgba(39, 147, 248, 0.77);
  border-radius: 25px;
  cursor: pointer;
  outline: none;
  display: block;
}
.login-info {
  margin-top: 25px;
  color: #999;
}
input::-webkit-input-placeholder {
  color: #afacac;
}
</style>
