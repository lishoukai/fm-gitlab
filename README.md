# vue2-admin-ts

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


#### npm run build 之前的注意事项
在打包之前需要修改 router/index.js中的基础路径，测试环境时使用测试基础路径 /ths-dev/, 正式环境时使用正式服务基础路径 /ths-fm/
打包前需要修改config.js中的接口地址（主要是系统中文件的上传下载）
打包前需要修改request.js中的baseUrl
