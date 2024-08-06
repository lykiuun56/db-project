<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="projectName" label="Project Name" dense></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="userCount" label="Number of Users" type="number" dense></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="fetchUsers">Select Users</v-btn>
      </v-col>
    </v-row>

    <!-- Search Results -->
    <v-row v-if="users.length">
      <v-col cols="12">
        <h3 class="text-center">Selected Users</h3>
        <v-data-table
            :headers="headers"
            :items="users"
            item-key="id"
            class="elevation-1"
            dense
        >
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      projectName: '',
      userCount: 0,
      users: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        // Add more headers depending on the fields you expect
      ],
    };
  },
  methods: {
    fetchUsers() {
      if (!this.projectName || this.userCount <= 0) {
        alert('Please provide a valid project name and user count.');
        return;
      }

      axios.get('http://localhost:8081/api/select', {
        params: {
          projectName: this.projectName,
          userCount: this.userCount,
        }
      })
          .then(response => {
            this.users = response.data;
          })
          .catch(error => {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users');
          });
    }
  }
};
</script>

<style scoped>
.full-width {
  width: 100%;
}

.text-center {
  text-align: center;
}
</style>
