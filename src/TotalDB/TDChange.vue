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
            <tr v-for="item in items" :key="item.id" @click="selectItem(item)">
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
import axios from 'axios';

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
      options: [],
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
        const response = await axios.get('http://localhost:8081/api/total/singleSearch', {
          params: {
            handleName: this.handleName,
            email: this.email,
          },
        });
        this.items = response.data;
        this.options = response.data.map(item => ({ text: item.handleName, value: item.id }));
      } catch (error) {
        console.error(error);
        alert('Search failed');
      }
    },
    selectItem(item) {
      this.selectedOption = item.id;
      this.newHandleName = item.handleName;
      this.newEmail = item.email;
      this.followers = item.followers;
      this.gmv = item.gmv;
      this.name = item.name;
      this.selectedCategories = item.categories;
    },
    async submit() {
      if (!this.selectedOption) {
        alert('Please select an item to update.');
        return;
      }

      const data = {
        handleName: this.newHandleName,
        email: this.newEmail,
        followers: this.followers,
        gmv: this.gmv,
        name: this.name,
        categories: this.selectedCategories
      };

      try {
        await axios.put(`http://localhost:8081/api/total/update/${this.selectedOption}`, data);
        alert('Update successful');
        this.search();
      } catch (error) {
        console.error(error);
        alert('Update failed');
      }
    }
  }
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
