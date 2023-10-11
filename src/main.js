import { createApp, h } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import Vue3Storage from 'vue3-storage';
import axios from 'axios'
import VueAxios from 'vue-axios'
import './registerServiceWorker'
import i18n from './i18n'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'


const app = createApp({
  render: () => h(App),
})

app.component('FontAwesomeIcon', FontAwesomeIcon)
library.add(fas)
library.add(far)

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
