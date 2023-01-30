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
    plugins: [
      ...(
        process.env.VUE_APP_CDN
          ? [
            new WebpackCdnPlugin({
              modules: [
                { name: 'vue', var: 'Vue', path: 'dist/vue.runtime.min.js' },
                { name: 'vue-router', var: 'VueRouter', path: 'dist/vue-router.min.js' },
                { name: '@fortawesome/fontawesome-free', style: 'css/all.min.css', cssOnly: true },
                { name: 'vue3-storage', var: 'Vue3StoragePlugin', path: 'dist/vue3-storage.min.js' },
                { name: 'axios', path: 'dist/axios.min.js' },
                { name: 'vue-i18n', var: 'VueI18n', path: 'dist/vue-i18n.min.js' },
              ],
              prodUrl: npm_url(':name', ':version', ':path'),
            })]
          : [])
    ]
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
