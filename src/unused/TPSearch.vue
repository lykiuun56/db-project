<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-text-field style="color: white"  v-model="email" label="Email" dense></v-text-field>
        <v-text-field style="color: white" v-model="handleName" label="handleName" dense></v-text-field>
      </v-col>
      <v-col cols="3" class="text-center">
        <v-btn  color="primary" @click="simpleSearch">Simple Search</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      handleName: '',
    }
  },
  methods: {
    simpleSearch() {
      console.log('Simple Search', this.handleName, this.email);
      this.$router.push({
        name: 'TPSearchResult',
        query: {
          handleName: this.handleName,
          email: this.email,
        },
      });
    },
  }
};


</script>