import Vue from 'vue';
import createVuetify from 'vuetify';
/// #if !process.env.VUE_APP_CDN
import '@fortawesome/fontawesome-free/css/all.css'
/// #endif
const vuetify = createVuetify({
  icons: {
    iconfont: 'fa',
  },
})
Vue.use(vuetify);

export default vuetify;
