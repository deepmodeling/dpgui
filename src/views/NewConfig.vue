<template>
  <div>
    <v-file-input
      :label="$t('message.template_file')"
      v-model="file"
      accept=".json"
    ></v-file-input>
    <v-text-field
      :placeholder="$t('message.my_template')"
      v-model="name"
      :label="$t('message.name')"
      clearable
    ></v-text-field>
    <v-btn @click="add"><v-icon>fas fa-plus</v-icon>{{ $t('message.add') }}</v-btn>
  </div>
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
        const curr = that.$storage.get("CustomTemplate", {});
        curr[hash] = {
          name: name,
          obj: obj,
        };
        that.$storage.set("CustomTemplate", curr);
        that.$router.push("/input");
        that.$root.$app.update_navi();
      };
      reader.readAsText(this.file);
    },
  },
};
</script>