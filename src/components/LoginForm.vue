<template>
  <v-container fluid class="fill-height bg-indigo-900">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card color = "#222222" elevation="8" rounded="lg" class="login-card bg-indigo-800">
          <v-card-title class="text-center py-4">
            <div class="mx-auto mb-4 w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
              <img src="@/assets/logo.png" alt="Puff-Media Logo" style="height: 120px; width: 120px; object-fit: contain;">
            </div>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit" v-model="valid" lazy-validation>
              <v-text-field
                  v-model="username"
                  label="Username"
                  prepend-inner-icon="mdi-account"
                  :rules="[v => !!v || 'Username is required']"
                  required
                  outlined
                  dense
                  dark
                  color="#4700CF"
                  class="mb-4"
              ></v-text-field>

              <v-text-field
                  v-if="isSignup"
                  v-model="email"
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
                  required
                  outlined
                  dense
                  dark
                  color="#4700CF"
                  class="mb-4"
              ></v-text-field>

              <v-text-field
                  v-model="password"
                  label="Password"
                  prepend-inner-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  :rules="[v => !!v || 'Password is required']"
                  required
                  outlined
                  dense
                  dark
                  color="#4700CF"
                  class="mb-4"
              ></v-text-field>

              <v-text-field
                  v-model="poc"
                  label="POC"
                  prepend-inner-icon="mdi-account-key"
                  :rules="[v => !!v || 'POC is required']"
                  required
                  outlined
                  dense
                  dark
                  color="#4700CF"
                  class="mb-4"
              ></v-text-field>

              <v-text-field
                  v-if="isSignup"
                  v-model="confirmPassword"
                  label="Confirm Password"
                  prepend-inner-icon="mdi-lock-check"
                  :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  @click:append="showConfirmPassword = !showConfirmPassword"
                  :rules="[v => !!v || 'Password confirmation is required', v => v === password || 'Passwords must match']"
                  required
                  outlined
                  dense
                  dark
                  color="#4700CF"
                  class="mb-4"
              ></v-text-field>

              <v-btn
                  type="submit"
                  color="#4700CF"
                  block
                  large
                  :loading="loading"
                  :disabled="!valid || loading"
                  class="mt-4 text-white"
              >
                {{ isSignup ? 'Sign Up' : 'LOGIN' }}
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center pb-4">
            <v-btn text color="white" @click="toggleMode">
              {{ isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up' }}
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-snackbar
            v-model="showError"
            color="error"
            timeout="5000"
            top
        >
          {{ error }}
          <template v-slot:action="{ attrs }">
            <v-btn
                text
                v-bind="attrs"
                @click="showError = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>

        <v-snackbar
            v-model="showSuccess"
            color="success"
            timeout="5000"
            top
        >
          {{ successMessage }}
          <template v-slot:action="{ attrs }">
            <v-btn
                text
                v-bind="attrs"
                @click="showSuccess = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from 'vuex';
import axios from '@/axios';
import { apiBaseUrl } from '@/config';

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      email: '', // For signup
      password: '',
      confirmPassword: '', // For signup
      poc: '',
      error: null,
      successMessage: '',
      valid: false,
      isSignup: false,
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
    };
  },

  created() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.loginWithToken(token);
    }
  },
  methods: {
    ...mapActions(['login', 'logout']), // Map Vuex's login and logout actions

    async handleSubmit() {
      if (!this.valid) return;
      this.error = null;
      this.successMessage = '';
      this.loading = true;

      try {
        if (this.isSignup) {
          await this.signup();
        } else {
          await this.loginUser();
        }
      } catch (error) {
        this.error = 'An unexpected error occurred. Please try again.';
        console.error('HandleSubmit Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async handleLogout() {
      await this.logout(); // Call the Vuex logout action

      // Redirect to login page after logging out
      this.$router.push('/login');
    },
    async loginUser() {
      try {
        await this.login({ username: this.username, password: this.password });

        // Redirect to another page (like the wishlist page)
        this.$emit('login-success');
        this.$router.push('/td-grid');
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.response?.data?.error || 'Invalid username or password';
      }
    },

    async signup() {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/signup`, {
          username: this.username,
          email: this.email,
          password: this.password,
          poc: this.poc,
        });

        if (response.data.success) {
          this.successMessage = 'Sign up successful! Please log in with your new account.';
          this.showSuccess = true;
          this.isSignup = false;
          this.resetForm();
        } else {
          this.error = response.data.message || 'Signup failed';
        }
      } catch (error) {
        console.error('Signup error:', error);
        this.error = error.response?.data?.message || 'An error occurred during signup. Please try again.';
      }
    },

    async loginWithToken(token) {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/verify-token`, null, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in Authorization header
          },
        });

        if (response.data.success) {
          // If the token is valid, log the user in via Vuex
          await this.login({ username: response.data.username, token });
          await this.fetchWishlists(response.data.userId); // Fetch wishlists after login
          this.$router.push('/td-grid');
        } else {
          this.logout(); // If token is invalid, log out the user
        }
      } catch (error) {
        console.error('Token verification error:', error);
        this.logout(); // Log out the user if token verification fails
      }
    },


    toggleMode() {
      this.isSignup = !this.isSignup;
      this.resetForm();
    },

    resetForm() {
      this.username = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.poc = '';
      this.error = null;
      this.successMessage = '';
    },
  },
};
</script>

<style scoped>
.login-form {
  /* Add custom styles here */
}
</style>
