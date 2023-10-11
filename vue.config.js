const { VuetifyPlugin } = require('webpack-plugin-vuetify')

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
      new VuetifyPlugin(),
    ],
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
