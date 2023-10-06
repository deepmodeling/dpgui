<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      :width="512"
    >
      <v-list dense>
        <div
          v-for="(tool, ii) in tools"
          :key="ii"
        >
          <!-- 1st -->
          <v-list-item
            v-if="!tool.sub"
            :to="tool.to"
            :prepend-icon="tool.icon"
          >
            <v-list-item-title>{{ tool.name }}</v-list-item-title>
          </v-list-item>
          <v-list-group
            v-else
            :value="'tool_' + ii"
            no-action
          >
            <template #activator="{ props }">
              <v-list-item
                :prepend-icon="tool.icon"
                v-bind="props"
              >
                <v-list-item-title>{{ tool.name }}</v-list-item-title>
              </v-list-item>
            </template>
            <!-- 2st -->
            <v-list-group
              v-for="(subtool, jj) in tool.sub"
              :key="jj"
              :value="'subtool_' + jj"
              no-action
              sub-group
            >
              <template #activator="{ props }">
                <v-list-item v-bind="props">
                  <v-list-item-title>{{ subtool.name }}</v-list-item-title>
                </v-list-item>
              </template>
              <!-- 3rd -->
              <v-list-item
                v-for="(subsubtool, kk) in subtool.sub"
                :key="kk"
                :to="subsubtool.to"
                :append-icon="subsubtool.icon"
                class="mx-n4"
              >
                <v-list-item-title>{{ subsubtool.name }}</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <div class="d-flex align-center">
        DP-GUI
      </div>

      <v-spacer />
    </v-app-bar>

    <v-main>
      <router-view />
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
      const builtin_templates = this.builtin_templates();
      const customized_templates = this.customized_templates();
      const installed_templates = this.installed_templates();
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
              name: this.$tc("message.installed_template", installed_templates.length),
              sub: installed_templates,
            },
            {
              name: this.$tc("message.builtin_template", builtin_templates.length),
              sub: builtin_templates,
            },
            {
              name: this.$tc("message.customized_template", customized_templates.length),
              sub: customized_templates,
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
    builtin_templates: function () {
      return [
        ...Object.entries(args).map(([kk, vv]) => ({
          name: vv.name,
          to: `/input/${kk}`,
        })),
      ]
    },
    customized_templates: function () {
      return [
        ...Object.entries(this.$storage.getStorageSync("CustomTemplate") || {}).map(
          ([kk, vv]) => ({
            name: vv.name,
            to: `/input/${kk}`,
          })
        ),
      ];
    },
    installed_templates: function () {
      // TODO
      return [];
    },
    update_navi: function () {
      this.tools = this.navi();
    },
  },
};
</script>
