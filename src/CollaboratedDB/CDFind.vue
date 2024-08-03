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
        <v-text-field v-model="state" label="State" dense></v-text-field>
      </v-col>
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
        <h4>Categories:</h4>
        <v-select
            v-model="selectedCategories"
            :items="categoriesOptions"
            label="Categories"
            dense
            multiple
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
              <th class="col-25">State</th>
              <th class="col-25">Categories</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items" :key="item.handle_name">
              <td class="col-25">{{ item.handle_name }}</td>
              <td class="col-25">{{ item.email }}</td>
              <td class="col-25">{{ item.state }}</td>
              <td class="col-25">{{ Array.isArray(item.categories) ? item.categories.join(', ') : item.categories }}</td>
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
      state: '',
      followerOption: null,
      followerNumber: '',
      selectedCategories: [],
      followerOptions: ['Less than', 'More than'],
      categoriesOptions: [
        'Electronics/3C', 'Beauty & Personal Care', 'Health & Wellness',
        'Outdoor & Gardening', 'Arts & Crafts', 'Food & Beverage',
        'Automotive & Motorcycle', 'Family & Couple', 'Apparel Clothing',
        'Toy & Games', 'Jewelry & Accessories', 'Sports & Recreation',
        'Pets & Animal', 'Luggage & Bags', 'Mother & Baby', 'Others'
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

        const response = await axios.get('http://localhost:8081/api/collaborated/singleSearch', { params });
        this.items = response.data;
      } catch (error) {
        console.error(error);
        alert('Simple search failed');
      }
    },
    async advancedSearch() {
      if (!this.state && !this.followerOption && !this.selectedCategories.length) {
        alert('Please enter at least one advanced search criteria.');
        return;
      }
      try {
        const searchCriteriaList = [];

        if (this.state) {
          searchCriteriaList.push({key: 'state', operation: ':', value: this.state});
        }
        if (this.followerOption && this.followerNumber) {
          const operation = this.followerOption === 'Less than' ? '<' : '>';
          searchCriteriaList.push({key: 'followers', operation, value: this.followerNumber});
        }
        if (this.selectedCategories.length) {
          searchCriteriaList.push({key: 'categories', operation: ':', value: this.selectedCategories});
        }

        const response = await axios.post('http://localhost:8081/api/collaborated/search', searchCriteriaList);
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
