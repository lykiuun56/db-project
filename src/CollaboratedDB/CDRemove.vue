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
          <v-btn color="primary" @click="search" :loading="loading">Search</v-btn>
          <v-btn color="secondary" @click="reset" class="ml-3">Reset</v-btn>
        </v-col>
      </v-row>
      <v-row class="mb-5" justify="center">
        <v-col cols="8" md="10">
          <h2 v-if="items.length">Search Result</h2>
          <p v-else>No results found</p>
          <v-data-table
              v-if="items.length"
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
          <v-btn color="primary" @click="confirmRemove" :disabled="!selectedItem">Remove</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="confirmationDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Confirm</v-card-title>
        <v-card-text>Are you sure you want to remove this record?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmationDialog = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="remove">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        { text: 'Handle Name', value: 'handle_name' },
        { text: 'Email', value: 'email' },
        { text: 'Followers', value: 'followers' },
        { text: 'Is_Blocked', value: 'is_blocked'}
      ],
      items: [],
      selectedItem: null,
      loading: false,
      confirmationDialog: false,
    };
  },
  methods: {
    async search() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:8081/api/collaborated/singleSearch', {
          params: {
            handleName: this.handleName || null,
            email: this.email || null,
          },
        });
        this.items = response.data;
      } catch (error) {
        console.error(error);
        alert('Search failed');
      } finally {
        this.loading = false;
      }
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    confirmRemove() {
      if (!this.selectedItem) {
        alert('Please select an item to remove.');
        return;
      }
      this.confirmationDialog = true;
    },
    async remove() {
      this.confirmationDialog = false;
      if (!this.selectedItem) {
        alert('Please select an item to remove.');
        return;
      }

      try {
        const id = this.selectedItem.id;
        await axios.delete(`http://localhost:8081/api/collaborated/delete/${id}`);
        alert('Record removed successfully');
        this.search(); // Re-run the search to refresh the results after deletion
      } catch (error) {
        console.error(error);
        alert('Remove failed');
      }
    },
    reset() {
      this.handleName = '';
      this.email = '';
      this.items = [];
      this.selectedItem = null;
    }
  }
}
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
