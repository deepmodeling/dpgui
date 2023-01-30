import { createApp, h } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import Vue3Storage from 'vue3-storage';
import axios from 'axios'
import VueAxios from 'vue-axios'
import './registerServiceWorker'
import i18n from './i18n'


const app = createApp({
  render: () => h(App),
})
app.use(vuetify)
app.use(router)
app.use(i18n)


app.use(Vue3Storage, {
  prefix: 'dpgui_',
  driver: 'local',
  ttl: 0, // for ever
  replacer: (key, value) => value,
});

app.use(VueAxios, axios);
app.mount('#app');
