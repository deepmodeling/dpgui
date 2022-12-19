<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense>
        <div v-for="(tool, ii) in tools" :key="ii">
          <!-- 1st -->
          <v-list-item v-if="!tool.sub" :to="tool.to">
            <v-list-item-icon v-if="tool.icon">
              <v-icon>{{ tool.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ tool.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group v-else :value="true" no-action>
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>{{ tool.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ tool.name }}</v-list-item-title>
            </template>
            <!-- 2st -->
            <v-list-group
              v-for="(subtool, jj) in tool.sub"
              :key="jj"
              :value="true"
              no-action
              sub-group
            >
              <template v-slot:activator>
                <v-list-item-title>{{ subtool.name }}</v-list-item-title>
              </template>
              <!-- 3rd -->
              <v-list-item
                v-for="(subsubtool, kk) in subtool.sub"
                :key="kk"
                :to="subsubtool.to"
                class="subsubitem"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ subsubtool.name }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon v-if="subsubtool.icon">
                  <v-icon>{{ subsubtool.icon }}</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-group>
          </v-list-group>
        </div>
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
import args from "@deepmodeling/args";

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
      const templates = this.templates();
      return [
        {
          name: this.$t("message.home"),
          icon: "fas fa-home",
          to: "/",
        },
        {
          name: this.$t("message.software_input"),
          icon: "fas fa-keyboard",
          sub: [
            {
              name: this.$tc("message.template", templates.length),
              sub: templates,
            },
            {
              name: this.$tc("message.setting", 2),
              sub: [
                {
                  name: this.$t("message.management"),
                  icon: "fas fa-cog",
                  to: "/input",
                },
                {
                  name: this.$t("message.add_new_template"),
                  icon: "fas fa-plus-circle",
                  to: "/new",
                },
              ],
            },
          ],
        },
      ];
    },
    templates: function () {
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
    update_navi: function () {
      this.tools = this.navi();
    },
  },
};
</script>

<style>
.subsubitem {
  padding-left: 25px;
}
</style>
