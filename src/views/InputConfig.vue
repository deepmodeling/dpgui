<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
    >
      <template #item.template="{ item }">
        <v-btn :to="item.props.title.to">
          {{ $tc('message.template') }}
        </v-btn>
      </template>
      <template #item.delete="{ item }">
        <v-btn
          v-if="item.props.title.delete"
          @click="delete_item(item.props.title.id)"
        >
          Delete
        </v-btn>
      </template>
    </v-data-table>
    <v-btn to="/new">
      {{ $t('message.add_new_template') }}
    </v-btn>
  </div>
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
      this.$storage.set("CustomTemplate", curr);
      this.items = this.all_items();
      this.$root.$app.update_navi();
    },
  },
};
</script>
