<template>
  <div class="dargs">
    <v-file-input
      truncate-length="15"
      label="Load JSON"
      v-model="file"
      @change="from_json"
      accept="*.json"
    ></v-file-input>
    <DargsItem :jdata="jdata" ref="item" />
    <v-btn block v-on:click="to_json()"> Save JSON </v-btn>
  </div>
</template>

<script>
import DargsItem from "./DargsItem.vue";

export default {
  name: "dargs",
  props: {
    jdata: [Object, Array],
  },
  data() {
    return {
      file: null,
    };
  },
  components: {
    DargsItem,
  },
  methods: {
    /**
     * Export to json.
     */
    to_json: function () {
      const data = JSON.stringify(this.$refs["item"].dvalue(), null, 2);
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
    /**
     * Load from JSON.
     */
    from_json: function () {
      const item = this.$refs["item"];
      // https://stackoverflow.com/a/26298948
      if (!this.file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        const obj = JSON.parse(e.target.result);
        item.load(obj);
      };
      reader.readAsText(this.file);
    },
  },
};
</script>

<style scoped>
</style>
