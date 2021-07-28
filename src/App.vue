<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense>
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>fas fa-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group :value="true" no-action>
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon>fas fa-keyboard</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Software Input</v-list-item-title>
          </template>
          <v-list-group :value="true" no-action sub-group>
            <template v-slot:activator>
              <v-list-item-title>Templates</v-list-item-title>
            </template>
            <v-list-item v-for="(tool, ii) in tools" :key="ii" :to="tool.to">
              <v-list-item-content>
                <v-list-item-title>{{ tool.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-group :value="true" no-action sub-group>
            <template v-slot:activator>
              <v-list-item-title>Settings</v-list-item-title>
            </template>
            <v-list-item to="/input">
              <v-list-item-content>
                <v-list-item-title>Management</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>fas fa-cog</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item to="/new">
              <v-list-item-content>
                <v-list-item-title>Create Template</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>fas fa-plus-circle</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">DP-GUI</div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import args from "./args/args.json";

export default {
  name: "App",

  components: {},

  data: () => ({
    drawer: null,
    tools: [],
  }),
  created: function () {
    this.$root.$app = this;
    this.tools.push(...this.navi());
  },
  methods: {
    navi: function () {
      return [
        ...Object.entries(args).map(([kk, vv]) => ({
          name: vv.name,
          to: `/input/${kk}`,
        })),
        ...Object.entries(this.$storage.get("CustomTemplate", {})).map(
          ([kk, vv]) => ({
            name: vv.name,
            to: `/input/${kk}`,
          })
        ),
      ];
    },
    update_navi: function() {
      this.tools = this.navi();
    },
  },
};
</script>
