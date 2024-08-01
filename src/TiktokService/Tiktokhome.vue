<template>
    <v-container class="database-preview-container">
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <h1>Tik Tok Service</h1>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="4">
          <v-btn block @click="$router.push('/tik-hash-tag')">Search by Hash Tag</v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn block @click="$router.push('/tik-search-name')">Search Handle Name</v-btn>
        </v-col>
        
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'TiktokHome'
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
  