import axios from 'axios';

const service = axios.create({
  baseURL: 'https://ths.com.cn/fileManager/', // 生产环境地址
  // baseURL: 'http://182.48.115.108:8887/fileManager/', // 测试环境地址
  // withCredentials: true, // 如跨域请求时要带上cookies,则设置为true
  timeout: 5000, // 请求超时时长
});

service.interceptors.request.use(
  (config) => {
    const configHeader = config;
    if (config.url !== 'auth/login') {
      const userInfo = localStorage.getItem('userInfo');
      if (typeof userInfo === 'string') {
        const user = JSON.parse(userInfo);
        const header = config.headers;
        header.authorization = `Bearer ${user.token}`;
        configHeader.headers = header;
      }
    }
    // 按需添加内容
    // eslint-disable-next-line no-empty
    if (config.method === 'post') {

    }
    return configHeader;
  },
  (error) => Promise.reject(error),
);

service.interceptors.response.use(
  (response) => {
    // 如果返回的状态不是200 就报错 按需修改
    if (response.status && (response.status !== 200 && response.status !== 201)) {
      return Promise.reject(new Error('Error'));
    }
    return response;
  },
  (error) => Promise.reject(error),
);

export default service;
