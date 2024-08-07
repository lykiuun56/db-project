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
            v-model="selectedIsBlocked"
            :items="isBlockedOptions"
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
      selectedIsBlocked: null,  // Ensure this is initialized
      isBlockedOptions: [       // Declare options correctly
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
    };
  },

  methods: {
    validateInputs() {
      const min = this.minFollowers ? Number(this.minFollowers) : null;
      const max = this.maxFollowers ? Number(this.maxFollowers) : null;

      if ((min !== null && isNaN(min)) || (max !== null && isNaN(max))) {
        this.$notify({ type: 'error', text: 'Min and Max Followers must be numbers' });
        return false;
      }

      return true;
    },

    simpleSearch() {
      this.$router.push({ name: 'TDFindResult', query: { handleName: this.handleName, email: this.email } });
    },

    advancedSearch() {
      if (!this.validateInputs()) {
        return;
      }

      this.$router.push({
        name: 'TDFindResult',
        query: {
          handleName: this.handleName,
          email: this.email,
          minFollowers: this.minFollowers,
          maxFollowers: this.maxFollowers,
          is_blocked: this.selectedIsBlocked,
        },
      });
    }
  },
};
</script>
