<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        DP-GUI
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <deepmdkit/>
    </v-main>
  </v-app>
</template>

<script>
import deepmdkit from './components/deepmd-kit.vue';

export default {
  name: 'App',

  components: {
    deepmdkit,
  },

  data: () => ({
    //
  }),
};
</script>
