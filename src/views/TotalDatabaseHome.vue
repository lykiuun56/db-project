<template>
    <v-container class="database-preview-container">
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <h1>Total Database Home</h1>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="3">
          <v-btn block @click="$router.push('/td-add')">Add To Total Database</v-btn>
        </v-col>
        <v-col cols="12" md="3">
            <v-btn block @click="$router.push('/td-remove')">Remove From Total Database</v-btn>
        </v-col>
        <v-col cols="12" md="3">
            <v-btn block @click="$router.push('/td-find')">Find Creators</v-btn>
        </v-col>
        <v-col cols="12" md="3">
            <v-btn block @click="$router.push('/td-change')">Change Information</v-btn>
        </v-col>
        <v-col cols="12" md="3">
          <v-btn block @click="$router.push('/td-grid')"> View the database</v-btn>
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
  