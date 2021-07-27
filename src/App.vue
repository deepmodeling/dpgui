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
      <dargs/>
    </v-main>
  </v-app>
</template>

<script>
import dargs from './components/dargs/dargs.vue';

export default {
  name: 'App',

  components: {
    dargs,
  },

  data: () => ({
    //
  }),
};
</script>
