<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8" rounded="lg" class="login-card">
          <v-card-title class="text-center text-h4 font-weight-bold primary--text py-4">
            {{ isSignup ? 'Sign Up' : 'Login' }}
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit" v-model="valid" lazy-validation>
              <v-text-field
                  v-model="username"
                  label="Username"
                  prepend-icon="mdi-account"
                  :rules="[v => !!v || 'Username is required']"
                  required
                  outlined
                  dense
              ></v-text-field>

              <v-text-field
                  v-if="isSignup"
                  v-model="email"
                  label="Email"
                  prepend-icon="mdi-email"
                  type="email"
                  :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
                  required
                  outlined
                  dense
              ></v-text-field>

              <v-text-field
                  v-model="password"
                  label="Password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  :rules="[v => !!v || 'Password is required']"
                  required
                  outlined
                  dense
              ></v-text-field>

              <v-text-field
                  v-model="poc"
                  label="Poc"
                  prepend-icon="mdi-account-key"
                  :rules="[v => !!v || 'Poc is required']"
                  required
                  outlined
                  dense
              ></v-text-field>

              <v-text-field
                  v-if="isSignup"
                  v-model="confirmPassword"
                  label="Confirm Password"
                  prepend-icon="mdi-lock-check"
                  :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  @click:append="showConfirmPassword = !showConfirmPassword"
                  :rules="[v => !!v || 'Password confirmation is required', v => v === password || 'Passwords must match']"
                  required
                  outlined
                  dense
              ></v-text-field>

              <v-btn
                  type="submit"
                  color="primary"
                  block
                  large
                  :loading="loading"
                  :disabled="!valid || loading"
                  class="mt-4"
              >
                {{ isSignup ? 'Sign Up' : 'Login' }}
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center pb-4">
            <v-btn text color="primary" @click="toggleMode">
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
      showPassword: false,
      showConfirmPassword: false,
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
          this.$router.push('/td-grid'); // Redirect to wishlists page
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
          this.showSuccess = true;
          this.isSignup = false;
          this.username = '';
          this.resetForm();
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
