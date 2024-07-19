<template>
    <v-container class="database-preview-container">
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <h1>Total Database Home</h1>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="3">
          <v-btn block @click="$router.push('/add-to-database')">Add To Total Database</v-btn>
        </v-col>
        <v-col cols="12" md="3">
            <v-btn block @click="$router.push('/remove-from-database')">Remove From Total Database</v-btn>
        </v-col>
        <v-col cols="12" md="3">
            <v-btn block @click="$router.push('/find-creator')">Find Creators</v-btn>
        </v-col>
        <v-col cols="12" md="3">
            <v-btn block @click="$router.push('/change-info')">Change Information</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'TotalDatabaseHome'
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
  