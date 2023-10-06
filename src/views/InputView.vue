<template>
  <v-container>
    <DargsInput
      v-if="jdata"
      :jdata="jdata"
      :examples="examples"
    />
    <div
      v-else-if="loading"
      class="text-center"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
      {{ $t('message.loading') }}
    </div>
    <div
      v-else
      class="text-center"
    >
      {{ $t('message.invalid_id') }}
    </div>
  </v-container>
</template>

<script>
import DargsInput from "../components/dargs/DargsInput.vue";
import args from "@deepmodeling/args";
export default {
  name: "InputView",
  components: {
    DargsInput,
  },
  beforeRouteUpdate(to, from, next) {
    Object.assign(this, this.load(to.params.id));
    next();
  },
  data() {
    return this.load(this.$route.params.id);
  },
  methods: {
    load: function (id) {
      const that = this;
      const prop = {
        loading: false,
        jdata: null,
        examples: null,
      };
      if (id) {
        const aa = args[id];
        if (aa) {
          // import from args directory
          import(
            /* webpackInclude: /\.json$/ */
            /* webpackExclude: /^args\.json$/ */
            /* webpackMode: "lazy" */
            /* webpackChunkName: "args" */
            `@deepmodeling/args/args/${aa.fn}`
          ).then((jdata) => {
            Object.assign(that, {
              jdata: jdata.default,
              loading: false,
              examples: aa.examples,
            });
          });
          Object.assign(prop, { loading: true });
        } else {
          // custom?
          const bb = (this.$storage.getStorageSync("CustomTemplate") || {})[id];
          if (bb) {
            Object.assign(prop, { jdata: bb.obj });
          } else {
            const cc = (this.$root.$app.installed_templates || {})[id];
            if (cc) {
              Object.assign(prop, { jdata: cc.obj });
            }
          }
        }
      }
      return prop;
    },
  },
};
</script>
