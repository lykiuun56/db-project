<template>
  <v-container class="database-preview-container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>Management Database Home</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="3">
        <v-btn block @click="$router.push('/md-add')">Add To Database</v-btn>
      </v-col>
<!--      <v-col cols="12" md="3">-->
<!--        <v-btn block @click="$router.push('/cd-remove')">Remove From Database</v-btn>-->
<!--      </v-col>-->
      <v-col cols="12" md="3">
        <v-btn block @click="$router.push('/md-find')">Find Creators</v-btn>
      </v-col>
<!--      <v-col cols="12" md="3">-->
<!--        <v-btn block @click="$router.push('/cd-change')">Change Information</v-btn>-->
<!--      </v-col>-->
      <v-col cols="12" md="3">
        <v-btn block @click="$router.push('/md-grid')"> View the database</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ManagementDatabase'
};
</script>

<style>
.text-center {
  text-align: center;
}
.database-preview-container {
  padding-top: 16px;
}
</style>