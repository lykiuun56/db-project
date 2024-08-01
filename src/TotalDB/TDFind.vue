<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-text-field v-model="handleName" label="Handle Name" dense></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="email" label="Email" dense></v-text-field>
      </v-col>
      <v-col cols="3" class="text-center">
        <v-btn color="primary" @click="search">Search</v-btn>
      </v-col>
    </v-row>

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
    </v-row>

    <v-row class="text-center">
      <v-col>
        <v-btn color="primary" @click="searchProcess">Search(Process Button)</v-btn>
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
            <tr v-for="item in items" :key="item.id">
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
      items: []
    };
  },
  methods: {
    async search() {
      try {
        const response = await axios.get('http://localhost:8081/api/total/search', {
          params: {
            handleName: this.handleName,
            email: this.email,
            state: this.state,
            followerOption: this.followerOption,
            followerNumber: this.followerNumber,
            categories: this.selectedCategories
          }
        });
        this.items = response.data;
      } catch (error) {
        console.error(error);
        alert('Search failed');
      }
    },
    async searchProcess() {
      try {
        const response = await axios.post('http://localhost:8081/api/total/searchProcess', {
          handleName: this.handleName,
          email: this.email,
          state: this.state,
          followerOption: this.followerOption,
          followerNumber: this.followerNumber,
          categories: this.selectedCategories
        });
        this.items = response.data;
      } catch (error) {
        console.error(error);
        alert('Search process failed');
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
