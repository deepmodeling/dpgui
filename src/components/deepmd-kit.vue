<template>
  <div>
    <dargs :jdata="jdata" />
  </div>
</template>

<script>
import dargs from "./dargs/dargs.vue";
import jdata from "../args/deepmd-kit-2.0.json";
export default {
  name: "deepmd-kit",
  data() {
    return {
      jdata,
    };
  },
  components: {
    dargs,
  },
};
</script>