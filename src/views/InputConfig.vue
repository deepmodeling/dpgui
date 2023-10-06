<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
    >
      <template #item.template="{ item }">
        <v-btn :to="item.to">
          {{ $tc('message.template') }}
        </v-btn>
      </template>
      <template #item.delete="{ item }">
        <v-btn
          v-if="item.delete"
          @click="delete_item(item.id)"
        >
          Delete
        </v-btn>
      </template>
    </v-data-table>
    <v-btn to="/new">
      {{ $t('message.add_new_template') }}
    </v-btn>
  </v-container>
</template>

<script>
import args from "@deepmodeling/args";
export default {
  name: "InputConfig",
  data() {
    return {
      headers: [
        { title: this.$t('message.name'), key: "name" },
        { title: this.$tc('message.template'), key: "template" },
        { title: this.$t('message.delete'), key: "delete" },
      ],
      items: this.all_items(),
    };
  },
  methods: {
    all_items: function () {
      return [
        ...Object.entries(this.$root.$app.installed_templates || {}).map(
          ([kk, vv]) => ({
            name: vv.name,
            id: kk,
            to: `/input/${kk}`,
            delete: false,
          })
        ),
        ...Object.entries(args).map(([kk, vv]) => ({
          name: vv.name,
          id: kk,
          to: `/input/${kk}`,
          delete: false,
        })),
        ...Object.entries(this.$storage.getStorageSync("CustomTemplate") || {}).map(
          ([kk, vv]) => ({
            name: vv.name,
            id: kk,
            to: `/input/${kk}`,
            delete: true,
          })
        ),
      ];
    },
    delete_item: function (key) {
      const curr = this.$storage.getStorageSync("CustomTemplate") || {};
      delete curr[key];
      this.$storage.setStorageSync("CustomTemplate", curr);
      this.items = this.all_items();
      this.$root.$app.update_navi();
    },
  },
};
</script>
