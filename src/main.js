import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
/// #if !process.env.VUE_APP_CDN
import { Plugin } from 'vue2-storage';
/// #else
// #import Plugin from 'vue2-storage'
/// #endif
import './registerServiceWorker'

Vue.config.productionTip = false

Vue.use(Plugin, {
  prefix: 'dpgui_',
  driver: 'local',
  ttl: 0, // for ever
  replacer: (key, value) => value,
});

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
