import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
/// #if !process.env.VUE_APP_CDN
import '@fortawesome/fontawesome-free/css/all.css'
/// #endif
Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'fa',
  },
});
