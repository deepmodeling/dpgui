const WebpackCdnPlugin = require('webpack-cdn-plugin');
const { gh_url, npm_url } = require('jsdelivr_url');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: process.env.CDN_COMMIT ? gh_url("deepmodeling", "dpgui", process.env.CDN_COMMIT, '') : '/dpgui/',
  configureWebpack: {
    plugins: [
      ...(
        process.env.CDN_COMMIT
          ? [
            new WebpackCdnPlugin({
              modules: [
                { name: 'vue', var: 'Vue', path: 'dist/vue.runtime.min.js' },
                { name: 'vue-router', var: 'VueRouter', path: 'dist/vue-router.min.js' },
                { name: '@fortawesome/fontawesome-free', style: 'css/all.min.css', cssOnly: true },
                { name: 'vue2-storage', var: 'Vue2Storage', path: 'dist/vue2-storage.min.js' },
              ],
              prodUrl: npm_url(':name', ':version', ':path');
            })]
          : [])
    ]
  },
}
