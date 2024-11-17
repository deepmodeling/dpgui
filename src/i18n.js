import { createI18n } from "vue-i18n";
import { en, zhHans } from "vuetify/locale";

function loadLocaleMessages() {
  const locales = require.context(
    "./locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i,
  );
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  messages["en"]["$vuetify"] = en;
  messages["zh"]["$vuetify"] = zhHans;
  return messages;
}

export default createI18n({
  legacy: false,
  locale:
    process.env.VUE_APP_I18N_LOCALE || navigator.language.split("-")[0] || "en",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: loadLocaleMessages(),
  fallbackWarn: false,
});
