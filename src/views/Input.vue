<template>
  <div>
    <dargs v-if="jdata" :jdata="jdata" :examples="examples" />
    <div v-else-if="loading" class="text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      Loading...
    </div>
    <div v-else class="text-center">Invalid ID!</div>
  </div>
</template>

<script>
import dargs from "../components/dargs/dargs.vue";
import args from "../args/args.json";
export default {
  name: "Input",
  data() {
    return this.load(this.$route.params.id);
  },
  components: {
    dargs,
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
            `../args/${aa.fn}`
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
          const bb = this.$storage.get("CustomTemplate", {})[id];
          if (bb) {
            Object.assign(prop, { jdata: bb.obj });
          }
        }
      }
      return prop;
    },
  },
  beforeRouteUpdate(to, from, next) {
    Object.assign(this, this.load(to.params.id));
    next();
  },
};
</script>