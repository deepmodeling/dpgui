import 'vuetify/styles'
import { createVuetify } from 'vuetify';
import { aliases, fa } from 'vuetify/iconsets/fa-svg'
import { VDataTable } from 'vuetify/labs/VDataTable'

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
