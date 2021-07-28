<template>
  <div>
    <v-file-input
      label="Template File"
      v-model="file"
      accept=".json"
    ></v-file-input>
    <v-text-field
      placeholder="My Template"
      v-model="name"
      label="Name"
      clearable
    ></v-text-field>
    <v-btn @click="add"><v-icon>fas fa-plus</v-icon> Add</v-btn>
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