<template>
  <div>
    <v-data-table :headers="headers" :items="items" :items-per-page="10">
      <template v-slot:[`item.template`]="{ item }">
        <v-btn :to="item.to">
          {{ $tc('message.template') }}
        </v-btn>
      </template>
      <template v-slot:[`item.delete`]="{ item }">
        <v-btn v-if="item.delete" @click="delete_item(item.id)"> Delete </v-btn>
      </template>
    </v-data-table>
    <v-btn to="/new"> {{ $t('message.add_new_template') }}</v-btn>
  </div>
</template>

<script>
import args from "@deepmodeling/args";
export default {
  name: "InputConfig",
  data() {
    return {
      headers: [
        { text: this.$t('message.name'), value: "name" },
        { text: this.$tc('message.template'), value: "template" },
        { text: this.$t('message.delete'), value: "delete" },
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
        ...Object.entries(this.$storage.get("CustomTemplate", {})).map(
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
      const curr = this.$storage.get("CustomTemplate", {});
      delete curr[key];
      this.$storage.set("CustomTemplate", curr);
      this.items = this.all_items();
      this.$root.$app.update_navi();
    },
  },
};
</script>
