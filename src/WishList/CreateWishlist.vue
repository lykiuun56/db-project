<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title>Create New Wishlist</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitWishlist" v-model="valid">
          <v-text-field
              v-model="name"
              label="Wishlist Name"
              :rules="[v => !!v || 'Name is required']"
              required
          ></v-text-field>
          <v-btn type="submit" color="primary" :disabled="!valid || loading">
            <v-icon left v-if="loading">mdi-loading</v-icon>
            Create
          </v-btn>
        </v-form>
        <v-alert v-if="error" type="error" dismissible class="mt-4">
          {{ error }}
        </v-alert>
        <v-alert v-if="successMessage" type="success" dismissible class="mt-4">
          {{ successMessage }}
        </v-alert>
      </v-card-text>
    </v-card>
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
</style>
