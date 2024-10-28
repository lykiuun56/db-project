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
        <v-text-field v-model="minFollowers" label="Min Followers" dense type="number"></v-text-field>
        <v-text-field v-model="maxFollowers" label="Max Followers" dense type="number"></v-text-field>
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
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      handleName: '',
      email: '',
      state: '',
      minFollowers: '',
      maxFollowers: '',
      selectedCategories: [],
      categoriesOptions: [
        'Electronics/3C', 'Beauty & Personal Care', 'Health & Wellness',
        'Outdoor & Gardening', 'Arts & Crafts', 'Food & Beverage',
        'Automotive & Motorcycle', 'Family & Couple', 'Apparel Clothing',
        'Toy & Games', 'Jewelry & Accessories', 'Sports & Recreation',
        'Pets & Animal', 'Luggage & Bags', 'Mother & Baby', 'Others'
      ],
    };
  },
  methods: {
    simpleSearch() {
      console.log('Simple Search', this.handleName, this.email);
      this.$router.push({
        name: 'CDFindResult',
        query: {
          handleName: this.handleName,
          email: this.email,
        },
      });
    },
    advancedSearch() {
      console.log('Advanced Search', {
        handleName: this.handleName,
        email: this.email,
        state: this.state,
        minFollowers: this.minFollowers,
        maxFollowers: this.maxFollowers,
        selectedCategories: this.selectedCategories
      });

      const minFollowers = this.minFollowers !== '' ? Number(this.minFollowers) : null;
      const maxFollowers = this.maxFollowers !== '' ? Number(this.maxFollowers) : null;

      this.$router.push({
        name: 'CDFindResult',
        query: {
          handleName: this.handleName,
          email: this.email,
          state: this.state,
          minFollowers: minFollowers,
          maxFollowers: maxFollowers,
          selectedCategories: this.selectedCategories.join(',')
        },
      });
    },
  },
};
</script>
