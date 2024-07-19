<template>
    <v-app>
      <v-container>
        <v-row class="mb-5" justify="center">
          <v-col cols="12" md="5">
            <v-text-field label="Handle Name" outlined></v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <v-text-field label="Email" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mb-5" justify="center">
          <v-col cols="8" class="text-center">
            <v-btn color="primary" @click="search">Search</v-btn>
          </v-col>
        </v-row>
        <v-row class="mb-5" justify="center">
          <v-col cols="8" md="10">
            <h2>Search Result</h2>
            <v-data-table
              :headers="headers"
              :items="items"
              class="elevation-1"
              :items-per-page="5"
            ></v-data-table>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <v-btn color="primary" @click="remove">Remove</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
  export default {
    name: 'RemoveFromDatabase',
    data() {
      return {
        headers: [
          { text: 'Column 1', value: 'col1' },
          { text: 'Column 2', value: 'col2' },
          { text: 'Column 3', value: 'col3' },
          { text: 'Column 4', value: 'col4' }
        ],
        items: [
          { col1: 'Data 1', col2: 'Data 2', col3: 'Data 3', col4: 'Data 4' },
          { col1: 'Data 5', col2: 'Data 6', col3: 'Data 7', col4: 'Data 8' },
          { col1: 'Data 9', col2: 'Data 10', col3: 'Data 11', col4: 'Data 12' },
        ]
      };
    },
    methods: {
      search() {
      },
      remove() {
      }
    }
  };
  </script>
  
  <style>
  .text-center {
    text-align: center;
  }
  .mb-5 {
    margin-bottom: 10px;
  }
  .v-data-table {
    max-height: 400px; 
  }
  </style>
  