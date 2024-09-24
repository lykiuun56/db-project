<template>
  <v-container fluid class="fill-height">
    <v-row>
      <!-- Sidebar -->
      <!-- Main Content Area -->
      <v-col cols="10">
        <router-view /> <!-- Display child components here -->
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
// import AppSidebar from '@/components/AppSidebar.vue';

export default {
  name: 'HomePage',
  components: {

  }
};
</script>

<style scoped>
/* Add styles specific to the home page if needed */
</style>
