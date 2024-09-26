<template>
  <v-container fluid>
    <v-row
        align="center"
        justify="center"
        style="min-height: 100vh;"
    >
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-form @submit.prevent="handleSubmit" class="login-form" v-model="valid">
          <v-card class="pa-5">
            <v-card-title class="text-center text-h5 mb-4 custom-font custom-title">
              {{ isSignup ? 'Sign Up' : 'Login' }}
            </v-card-title>

            <v-text-field
                v-model="username"
                label="Username"
                :rules="[v => !!v || 'Username is required']"
                required
                class="input-field"
            ></v-text-field>

            <v-text-field
                v-if="isSignup"
                v-model="email"
                label="Email"
                type="email"
                :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
                required
                class="input-field"
            ></v-text-field>

            <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :rules="[v => !!v || 'Password is required']"
                required
                class="input-field"
            ></v-text-field>

            <v-text-field
                v-model="poc"
                label="Poc"
                :rules="[v => !!v || 'Poc is required']"
                required
                class="input-field"
            ></v-text-field>

            <v-text-field
                v-if="isSignup"
                v-model="confirmPassword"
                label="Confirm Password"
                type="password"
                :rules="[v => !!v || 'Password confirmation is required', v => v === password || 'Passwords must match']"
                required
                class="input-field"
            ></v-text-field>

            <v-row justify="center" class="mt-4">
              <v-btn
                  type="submit"
                  color="primary"
                  class="submit-btn"
                  :disabled="!valid || loading"
              >
                <v-icon left v-if="loading">mdi-loading</v-icon>
                {{ isSignup ? 'Sign Up' : 'Login' }}
              </v-btn>
            </v-row>

            <!-- Error Message -->
            <v-alert
                v-if="error"
                type="error"
                dismissible
                class="mt-4"
            >
              {{ error }}
            </v-alert>

            <!-- Success Message -->
            <v-alert
                v-if="successMessage"
                type="success"
                dismissible
                class="mt-4"
            >
              {{ successMessage }}
            </v-alert>

            <!-- Toggle Login/Signup -->
            <v-row align="center" justify="space-between" class="mt-4">
              <v-col cols="auto">
                <v-text>{{ isSignup ? 'Already have an account?' : 'Need an account?' }}</v-text>
              </v-col>
              <v-col cols="auto">
                <v-text>
                  <a href="#" @click.prevent="toggleMode" class="hyperlink-text">
                    {{ isSignup ? 'Login' : 'Sign Up' }}
                  </a>
                </v-text>
              </v-col>
            </v-row>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from '@/axios';
import { apiBaseUrl } from '@/config';
import { mapActions } from 'vuex';

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      email: '', // Added for signup
      password: '',
      confirmPassword: '', // Added for signup
      poc: '',
      error: null,
      successMessage: '', // Added for signup success
      valid: false,
      isSignup: false,
      loading: false,
    };
  },
  methods: {
    ...mapActions(['login']), // Map Vuex's login action

    /**
     * Handles form submission for login and signup.
     */
    async handleSubmit() {
      if (!this.valid) return;
      this.error = null;
      this.successMessage = '';
      this.loading = true;

      try {
        if (this.isSignup) {
          await this.signup();
        } else {
          await this.loginUser(); // Call the local loginUser method
        }
      } catch (error) {
        // Handle unexpected errors
        this.error = 'An unexpected error occurred. Please try again.';
        console.error('HandleSubmit Error:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Handles user login.
     */
    async loginUser() {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/login`, {
          username: this.username,
          password: this.password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Include cookies in the request if needed
        });

        if (response.data.success) {
          const userId = response.data.userId;
          // Removed the unused 'token' variable
          const poc = response.data.poc;
          const wishlistId = response.data.wishlistId;

          // Dispatch Vuex's login action
          await this.login({ username: this.username, password: this.password });

          // Optionally, handle additional data
          console.log('User ID in Login:', userId);
          console.log('User Poc in Login:', poc);
          console.log('User wishlistId in login:', wishlistId);

          // Emit event or navigate as needed
          this.$emit('login-success');
          this.$router.push('/view-wishlist'); // Redirect to wishlists page
        } else {
          this.error = response.data.error || 'Invalid username or password';
        }
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.response?.data?.error || 'An error occurred. Please try again.';
      }
    },

    /**
     * Handles user signup.
     */
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
          this.isSignup = false;
          this.username = '';
          this.email = '';
          this.password = '';
          this.confirmPassword = '';
          this.poc = '';
        } else {
          this.error = response.data.message || 'Signup failed';
        }
      } catch (error) {
        console.error('Signup error:', error);
        this.error = error.response?.data?.message || 'An error occurred during signup. Please try again.';
      }
    },

    /**
     * Toggles between login and signup modes.
     */
    toggleMode() {
      this.isSignup = !this.isSignup;
      this.error = null;
      this.successMessage = null;
      // Optionally, reset form fields
      if (!this.isSignup) {
        this.email = '';
        this.confirmPassword = '';
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  /* Add your custom styles here */
}

.input-field {
  margin-bottom: 1rem;
}

.submit-btn {
  width: 100%;
}

.hyperlink-text {
  color: #1976D2; /* Vuetify primary color */
  cursor: pointer;
  text-decoration: none;
}

.hyperlink-text:hover {
  text-decoration: underline;
}
</style>
