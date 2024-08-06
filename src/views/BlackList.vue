<template>
  <v-container class="database-preview-container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>BlackList Database Home</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="3">
        <v-btn block @click="$router.push('/bl-add')">Add To BlackList</v-btn>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn block @click="$router.push('/bl-grid')"> View the BlackList</v-btn>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn block @click="$router.push('/bl-remove')"> Remove from BlackList</v-btn>
      </v-col>

    </v-row>
  </v-container>
</template>


<script>
export default {
  name: 'BlackListDatabase'
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