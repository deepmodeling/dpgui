<template>
  <div class="dargs">
    <v-list>
      <v-list-item v-for="item in jdata" :key="item.name">
        <v-list-item-content>
          <DargsItem :jdata="item" ref="subitem" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-btn block v-on:click="dvalue()"> Save JSON </v-btn>
  </div>
</template>

<script>
import DargsItem from "./DargsItem.vue";
import jdata from "../../args/deepmd-kit-2.0.json";

export default {
  name: "dargs",
  props: {},
  data() {
    return {
      jdata,
    };
  },
  components: {
    DargsItem,
  },
  methods: {
    dvalue: function () {
      const json = Object.fromEntries(
        new Map(
          this.$refs["subitem"]
            .filter((vv) => !vv.jdata.optional || vv.check)
            .map((vv) => [vv.jdata.name, vv.dvalue()])
        )
      );
      const data = JSON.stringify(json, null, 2);
      // https://stackoverflow.com/a/48612128/9567349
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = "input.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },
  },
};
</script>

<style scoped>
</style>
