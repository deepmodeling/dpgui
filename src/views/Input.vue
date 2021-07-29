<template>
  <div>
    <dargs v-if="jdata" :jdata="jdata" />
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
    const { loading, jdata } = this.load(this.$route.params.id);
    return {
      jdata,
      loading,
    };
  },
  components: {
    dargs,
  },
  methods: {
    load: function (id) {
      const that = this;
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
            that.jdata = jdata.default;
            that.loading = false;
          });
          return { loading: true, jdata: null };
        } else {
          // custom?
          const bb = this.$storage.get("CustomTemplate", {})[id];
          if (bb) {
            return { loading: false, jdata: bb.obj };
          }
          return { loading: false, jdata: null };
        }
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    const { loading, jdata } = this.load(to.params.id);
    this.loading = loading;
    this.jdata = jdata;
    next();
  },
};
</script>