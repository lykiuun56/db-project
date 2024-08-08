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
        <v-text-field v-model="minFollowers" label="Min Followers" dense type="number"></v-text-field>
        <v-text-field v-model="maxFollowers" label="Max Followers" dense type="number"></v-text-field>
      </v-col>
      <v-col cols="3">
        <h4>Blocked:</h4>
        <v-radio-group v-model="selectedIs_blocked" dense>
          <v-radio label="Yes" :value="true"></v-radio>
          <v-radio label="No" :value="false"></v-radio>
        </v-radio-group>
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
      minFollowers: '',
      maxFollowers: '',
      selectedIs_blocked: null, 
    };
  },
  methods: {
    simpleSearch() {
      console.log('Simple Search', this.handleName, this.email);
      this.$router.push({
        name: 'TDFindResult',
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
        minFollowers: this.minFollowers,
        maxFollowers: this.maxFollowers,
        is_Blocked: this.selectedIs_blocked,
      });

      const minFollowers = this.minFollowers !== '' ? Number(this.minFollowers) : null;
      const maxFollowers = this.maxFollowers !== '' ? Number(this.maxFollowers) : null;

      const query = {
        handleName: this.handleName,
        email: this.email,
        minFollowers,
        maxFollowers,
      }
      if (this.selectedIs_blocked !== null) {
        query.is_Blocked = this.selectedIs_blocked;
      }

      this.$router.push({
        name: 'TDFindResult',
        query
      }); 
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
