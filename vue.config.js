const WebpackCdnPlugin = require('webpack-cdn-plugin');
const { npm_url } = require('unpkg_url');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: process.env.BASE_URL ? process.env.BASE_URL : '/dpgui/',
  configureWebpack: {
    resolve: {
      fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
      },
    },
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "DP-GUI";
        return args;
      }).end()
      .module
      .rule('js')
      .test(/\.m?jsx?$/)
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('ifdef-loader')
      .loader('ifdef-loader')
      .options({
        "ifdef-uncomment-prefix": "// #code ",
      })
      .end()
  }
}
