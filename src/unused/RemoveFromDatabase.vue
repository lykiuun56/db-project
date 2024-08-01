<template>
  <v-app>
    <v-container>
      <v-row class="mb-5" justify="center">
        <v-col cols="12" md="5">
          <v-text-field v-model="handleName" label="Handle Name" outlined></v-text-field>
        </v-col>
        <v-col cols="12" md="5">
          <v-text-field v-model="email" label="Email" outlined></v-text-field>
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
            @click:row="selectItem"
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
import axios from 'axios';

export default {
  name: 'RemoveFromDatabase',
  data() {
    return {
      handleName: '',
      email: '',
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Column 1', value: 'col1' },
        { text: 'Column 2', value: 'col2' },
        { text: 'Column 3', value: 'col3' },
        { text: 'Column 4', value: 'col4' }
      ],
      items: [],
      selectedItem: null,
    };
  },
  methods: {
    async search() {
      try {
        const response = await axios.get('/api/total/search', {
          params: {
            handleName: this.handleName,
            email: this.email,
          },
        });
        this.items = response.data;
      } catch (error) {
        console.error(error);
        alert('Search failed');
      }
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    async remove() {
      if (!this.selectedItem) {
        alert('Please select an item to remove.');
        return;
      }

      try {
        await axios.delete(`/api/total/delete/${this.selectedItem.id}`);
        alert('Record removed successfully');
        this.search(); 
      } catch (error) {
        console.error(error);
        alert('Remove failed');
      }
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
