<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-text-field v-model="email" label="Email" dense></v-text-field>
      </v-col>
      <v-col cols="3" class="text-center">
        <v-btn color="primary" @click="simpleSearch">Simple Search</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: '',
    }
  },
  methods: {
    simpleSearch() {
      this.$router.push({name: 'TPSearchResult', query: {email: this.email}});
    },
  }
};


</script>