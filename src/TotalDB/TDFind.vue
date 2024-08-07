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
        <v-text-field v-model="minFollowers" label="Min Followers" dense></v-text-field>
        <v-text-field v-model="maxFollowers" label="Max Followers" dense></v-text-field>
      </v-col>
      <v-col cols="3">
        <h4>Blocked:</h4>
        <v-select
            v-if="Is_blockedOptions.length > 0"
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
      selectedIs_blocked: null,  // Set to null or Boolean
      Is_blockedOptions: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
    };
  },

  methods: {
    simpleSearch() {
      this.$router.push({ name: 'TDFindResult', query: { handleName: this.handleName, email: this.email } });
    },
    advancedSearch() {
      this.$router.push({
        name: 'TDFindResult',
        query: {
          handleName: this.handleName,
          email: this.email,
          minFollowers: this.minFollowers,
          maxFollowers: this.maxFollowers,
          is_blocked: this.selectedIs_blocked,
        }
      });
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
