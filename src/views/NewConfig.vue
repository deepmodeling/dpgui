<template>
  <v-container>
    <v-file-input
      v-model="file"
      :label="$t('message.template_file')"
      accept=".json"
    />
    <v-text-field
      v-model="name"
      :placeholder="$t('message.my_template')"
      :label="$t('message.name')"
      clearable
    />
    <v-btn @click="add">
      <v-icon>fas fa-plus</v-icon>{{ $t('message.add') }}
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: "NewConfig",
  data() {
    return {
      name: "",
      file: "",
    };
  },
  methods: {
    add: function () {
      const name = this.name;
      const that = this;
      const reader = new FileReader();
      reader.onload = function (e) {
        const hash = require("crypto")
          .createHash("sha256")
          .update(e.target.result)
          .digest("hex");
        const obj = JSON.parse(e.target.result);
        const curr = that.$storage.getStorageSync("CustomTemplate") || {};
        curr[hash] = {
          name: name,
          obj: obj,
        };
        that.$storage.setStorageSync("CustomTemplate", curr);
        that.$router.push("/input");
        that.$root.$app.update_navi();
      };
      reader.readAsText(this.file[0]);
    },
  },
};
</script>
