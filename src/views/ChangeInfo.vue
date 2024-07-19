<template>
    <v-container fluid>
      
      
      <v-row>
        <v-col cols="4">
          <v-text-field v-model="handleName" label="Handle Name" dense></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="email" label="Email" dense></v-text-field>
        </v-col>
        <v-col cols="4" class="text-center">
          <v-btn color="primary" @click="search">Search</v-btn>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12">
          <h3 class="text-center">Search Result</h3>
          <v-simple-table class="full-width">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="col-25">Column 1</th>
                  <th class="col-25">Column 2</th>
                  <th class="col-25">Column 3</th>
                  <th class="col-25">Column 4</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.col1">
                  <td class="col-25">{{ item.col1 }}</td>
                  <td class="col-25">{{ item.col2 }}</td>
                  <td class="col-25">{{ item.col3 }}</td>
                  <td class="col-25">{{ item.col4 }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12" class="text-center">
          <h3>Index (Which one you want to change)</h3>
          <v-select
            v-model="selectedOption"
            :items="options"
            label="Select Option"
            dense
          ></v-select>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="2">
          <v-text-field v-model="newHandleName" label="Handle Name" dense></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field v-model="newEmail" label="Email" dense></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field v-model="followers" label="Followers" dense></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field v-model="gmv" label="GMV" dense></v-text-field>
        </v-col>
        <v-col cols="2">
            <v-text-field v-model="name" label="Name" dense></v-text-field>
          </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12" class="text-center">
          <v-select
            v-model="selectedCategories"
            :items="categoriesOptions"
            label="Add or Remove Categories"
            multiple
            dense
          ></v-select>
        </v-col>
      </v-row>
  
      <v-row>
        
        <v-col cols="8" class="text-center">
          <v-btn color="primary" @click="submit">Submit</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        handleName: '',
        email: '',
        newHandleName: '',
        newEmail: '',
        followers: '',
        gmv: '',
        name: '',
        selectedCategories: [],
        selectedOption: null,
        options: ['选项1', '选项2', '选项3', '选项4'],
        categoriesOptions: ['选项1', '选项2', '选项3', '选项4'],
        items: [
          { col1: 'Data 1', col2: 'Data 2', col3: 'Data 3', col4: 'Data 4' },
          { col1: 'Data 5', col2: 'Data 6', col3: 'Data 7', col4: 'Data 8' },
          { col1: 'Data 9', col2: 'Data 10', col3: 'Data 11', col4: 'Data 12' },
          { col1: 'Data 13', col2: 'Data 14', col3: 'Data 15', col4: 'Data 16' },
        ],
      };
    },
    methods: {
      search() {
        // Your search logic here
      },
      submit() {
        // Your submit logic here
      },
    },
  };
  </script>
  
  <style scoped>
  .full-width {
    width: 100%;
  }
  
  .col-25 {
    width: 25%;
    text-align: center;
  }
  </style>
  