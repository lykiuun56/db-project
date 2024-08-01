<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2>Black List</h2>
      </v-col>
    </v-row>
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
        <v-btn color="primary" @click="add">Add</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BLAdd',
  data() {
    return {
      handleName: '',
      email: '',
    };
  },
  methods: {
    async add() {
      if (!this.handleName || !this.email) {
        alert('Please enter both handle name and email.');
        return;
      }

      const blackListData = {
        handleName: this.handleName,
        email: this.email,
      };

      try {
        await axios.post('http://localhost:8081/api/black_list/add', blackListData);
        alert('Added to black list successfully');
        this.handleName = '';
        this.email = '';
      } catch (error) {
        console.error(error);
        alert('Failed to add to black list.');
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