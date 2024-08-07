<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>Management Email</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="5">
        <v-text-field v-model="emailEnding" label="Enter Email Domain" outlined></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="submit">Submit</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ManagementEmail',
  data() {
    return {
      emailEnding: '',
    };
  },
  methods: {
    async submit() {
      if (!this.emailEnding) {
        alert('Please enter an email domain.');
        return;
      }

      const managementEmail = {
        emailEnding: this.emailEnding,
        // Add any other fields required by your backend
      };

      try {
        await axios.post('http://localhost:8081/api/management/add', managementEmail, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        alert('Email domain added successfully');
        this.emailEnding = '';
      } catch (error) {
        console.error(error);
        alert('Failed to add email domain.');
      }
    }
  }
};
</script>

<style>
.text-center {
  text-align: center;
}
.add-to-database-container {
  padding-top: 16px;
}
</style>
