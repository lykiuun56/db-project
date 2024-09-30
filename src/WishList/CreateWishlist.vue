<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card color = "#222222" elevation="8" rounded="lg" class="login-card bg-indigo-800">
          <v-card-title class="text-h4 font-weight-bold d-flex justify-center align-center text-center">
            Create New Wishlist</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitWishlist" v-model="valid">
              <v-text-field
                  v-model="name"
                  label="Wishlist Name"
                  :rules="[v => !!v || 'Name is required']"
                  required
                  dark
                  filled
                  color="#4700CF"
              ></v-text-field>

              <div class="d-flex justify-center">
                <v-btn
                  type="submit"
                  color="#4700CF"
                  :disabled="!valid || loading"
                  class="mt-4"
                  :loading="loading"
              >
                Create
                </v-btn>
              </div>
            </v-form>
            <v-alert v-if="error" type="error" dismissible class="mt-4">
              {{ error }}
            </v-alert>
            <v-alert v-if="successMessage" type="success" dismissible class="mt-4">
              {{ successMessage }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'CreateWishlist',
  data() {
    return {
      name: '',
      valid: false,
      loading: false,
      error: null,
      successMessage: '',
    };
  },
  methods: {
    ...mapActions(['createWishlist']),
    async submitWishlist() {
      if (!this.valid) return;
      this.error = null;
      this.successMessage = '';
      this.loading = true;

      try {
        await this.createWishlist({ name: this.name });
        this.successMessage = 'Wishlist created successfully!';
        this.name = ''; // Reset form
        // Optionally, navigate or emit an event
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.mt-4 {
  margin-top: 1rem;
}
.v-application {
  background-color: #121212 !important;
}

.v-card {
  background-color: #1E1E1E !important;
}

.v-btn {
  text-transform: none;
}

</style>
