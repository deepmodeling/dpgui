import 'vuetify/styles'
import { createVuetify } from 'vuetify';
import { aliases, fa } from 'vuetify/iconsets/fa'
import { VDataTable } from 'vuetify/labs/VDataTable'
import '@fortawesome/fontawesome-free/css/all.css'

const vuetify = createVuetify({
  components : {
    VDataTable,
  },
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
  theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme: {
        dark: false,
        colors: {
          primary: '#1f2676',
        }
      }
    }
  }
})

export default vuetify;
