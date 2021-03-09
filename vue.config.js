/**
 * 判断是否是生产环境
 * @returns {boolean}
 */
function isProd() {
  return process.env.NODE_ENV === 'production';
}

// 设置HTTP请求的base url，需修改
process.env.VUE_APP_BASE_API = isProd() ? '' : '';

module.exports = {
  publicPath: isProd() ? './' : '/', // 其中test要改为项目名称
  productionSourceMap: false,
  runtimeCompiler: false,
  configureWebpack: (config) => {
    if (isProd()) {
      // 去除 console
      Object.assign(
        config.optimization.minimizer[0].options.terserOptions.compress, {
          drop_console: true,
        },
      );

      if (process.platform !== 'win32') {
        // 压缩图片
        config.module.rules.push({
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: [{
            loader: 'image-webpack-loader',
          }],
        });
      }

      // 单独将 elementUI 拆包
      Object.assign(config.optimization.splitChunks.cacheGroups, {
        elementUI: {
          name: 'chunk-elementUI',
          priority: 20, // 权重要大于 vendors 和 app 不然会被打包进 vendors 或者 app
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          chunks: 'all',
        },
      });
    }
  },
  // 可全局引用element的变量
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/assets/styles/element-variables.scss";',
      },
    },
  },
};
