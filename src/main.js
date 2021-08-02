import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
/// #if !process.env.VUE_APP_CDN
import { Plugin } from 'vue2-storage';
/// #else
// #code import Plugin from 'vue2-storage'
/// #endif
import axios from 'axios'
import VueAxios from 'vue-axios'
import './registerServiceWorker'
import i18n from './i18n'

Vue.config.productionTip = false

Vue.use(Plugin, {
  prefix: 'dpgui_',
  driver: 'local',
  ttl: 0, // for ever
  replacer: (key, value) => value,
});

Vue.use(VueAxios, axios);

new Vue({
  vuetify,
  router,
  render: h => h(App),
  i18n,
}).$mount('#app')
