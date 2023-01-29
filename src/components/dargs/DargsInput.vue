<template>
  <div class="dargs">
    <v-file-input
      v-model="file"
      :label="$t('message.load_json')"
      accept=".json"
      @change="from_json_file(file[0])"
    />
    <v-row v-if="examples">
      <v-col>
        <v-select
          v-model="example_select"
          :items="examples"
          item-title="name"
          item-value="url"
          :placeholder="$t('message.select_example')"
          :hint="$t('message.select_example')"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn @click="from_url(example_select)">
          {{ $t('message.load_example') }}
        </v-btn>
      </v-col>
    </v-row>
    <DargsItem
      ref="item"
      :jdata="jdata"
    />
    <v-btn
      block
      @click="to_json()"
    >
      {{ $t('message.save_json') }}
    </v-btn>
  </div>
</template>

<script>
import DargsItem from "./DargsItem.vue";

export default {
  name: "DargsInput",
  components: {
    DargsItem,
  },
  props: {
    jdata: [Object, Array],
    examples: [Array],
  },
  data() {
    return {
      file: null,
      example_select: null,
    };
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
     * Load from object.
     */
    from_obj: function (obj) {
      if (!obj) return;
      const item = this.$refs["item"];
      item.load(obj);
    },
    /**
     * Load from JSON.
     */
    from_json: function (str) {
      if (!str) return;
      const obj = JSON.parse(str);
      this.from_obj(obj);
    },
    /**
     * Load from JSON file.
     */
    from_json_file: function (file) {
      const that = this;
      // https://stackoverflow.com/a/26298948
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        that.from_json(e.target.result);
      };
      reader.readAsText(file);
    },
    /**
     * Load from URL.
     */
    from_url: function (url) {
      const that = this;
      if (url)
        this.axios.get(url).then((jdata) => {
          that.from_obj(jdata.data);
        });
    },
  },
};
</script>

<style scoped>
</style>
