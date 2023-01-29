import 'vuetify/styles'
import { createVuetify } from 'vuetify';
import { aliases, fa } from 'vuetify/iconsets/fa'
import { VDataTable } from 'vuetify/labs/VDataTable'
/// #if !process.env.VUE_APP_CDN
import '@fortawesome/fontawesome-free/css/all.css'
/// #endif

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components : {
    ...components,
    VDataTable,
  },
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
})

export default vuetify;
