<template>
  <v-container fluid>
    <!-- Simple Search Row -->
    <v-row>
      <v-col cols="3">
        <v-text-field v-model="handleName" label="Handle Name" dense></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="email" label="Email" dense></v-text-field>
      </v-col>
      <v-col cols="3" class="text-center">
        <v-btn color="primary" @click="simpleSearch">Simple Search</v-btn>
      </v-col>
    </v-row>

    <!-- Advanced Search Row -->
    <v-row>
      <v-col cols="3">
        <h4>Followers:</h4>
        <v-select
            v-model="followerOption"
            :items="followerOptions"
            label="Followers"
            dense
        ></v-select>
        <v-text-field v-model="followerNumber" label="Number" dense></v-text-field>
      </v-col>
      <v-col cols="3">
        <h4>Blocked:</h4>
        <v-select
            v-model="selectedIs_blocked"
            :items="Is_blockedOptions"
            item-text="text"
            item-value="value"
            label="Is Blocked"
            dense
        ></v-select>
      </v-col>
      <v-col cols="3" class="text-center">
        <v-btn color="primary" @click="advancedSearch">Advanced Search</v-btn>
      </v-col>
    </v-row>

    <!-- Search Results -->
    <v-row>
      <v-col cols="12">
        <h3 class="text-center">Search Results</h3>
        <v-simple-table class="full-width">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="col-25">Handle Name</th>
              <th class="col-25">Email</th>
              <th class="col-25">Is Blocked</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items" :key="item.handle_name">
              <td class="col-25">{{ item.handle_name }}</td>
              <td class="col-25">{{ item.email }}</td>
              <td class="col-25">{{ item.is_blocked === 1 ? 'Yes' : 'No' }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      handleName: '',
      email: '',
      followerOption: null,
      followerNumber: '',
      selectedIs_blocked: null,
      followerOptions: ['Less than', 'More than'],
      Is_blockedOptions: [
        { text: 'Yes', value: 1 },
        { text: 'No', value: 0 }
      ],
      items: [],
    };
  },
  methods: {
    async simpleSearch() {
      if (!this.handleName && !this.email) {
        alert('Please enter either Handle Name or Email for search.');
        return;
      }
      try {
        const params = {};
        if (this.handleName) params.handleName = this.handleName;
        if (this.email) params.email = this.email;

        const response = await axios.get('http://localhost:8081/api/total/singleSearch', { params });
        this.items = response.data;
      } catch (error) {
        console.error(error);
        alert('Search failed');
      }
    },
    async advancedSearch() {
      if (!this.followerOption && this.selectedIs_blocked === null) {
        alert('Please enter at least one advanced search criteria.');
        return;
      }
      try {
        const searchCriteriaList = [];

        if (this.followerOption && this.followerNumber) {
          const operation = this.followerOption === 'Less than' ? '<' : '>';
          searchCriteriaList.push({ key: 'followers', operation, value: this.followerNumber });
        }
        if (this.selectedIs_blocked !== null) {
          searchCriteriaList.push({ key: 'is_blocked', operation: '=', value: this.selectedIs_blocked });
        }

        const response = await axios.post('http://localhost:8081/api/total/search', searchCriteriaList);
        this.items = response.data;
      } catch (error) {
        console.error(error);
        alert('Advanced search failed');
      }
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
