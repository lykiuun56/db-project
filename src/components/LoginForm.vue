<template>
  <v-form @submit.prevent="handleSubmit" class="login-form" v-model="valid">
    <v-card-title class="text-center text-h4 mb-4 custom-font custom-title">
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
        type="poc"
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
    <v-btn type="submit" color="primary" class="submit-btn" :disabled="!valid">
      {{ isSignup ? 'Sign Up' : 'Login' }}
    </v-btn>
    <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>
    <v-alert v-if="successMessage" type="success" dismissible>{{ successMessage }}</v-alert>
    <v-row align="center" justify="space-between" class="mt-4">
      <v-col cols="auto">
        <v-text>{{ isSignup ? 'Already have an account?' : 'Need an account?' }}</v-text>
      </v-col>
      <v-col cols="auto">
        <v-btn color="secondary" @click="toggleMode">
          {{ isSignup ? 'Login' : 'Sign Up' }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
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
      password: '',
      poc: '',
      error: null,
      valid: false,
      isSignup: false,
      loading: false,
    };
  },
  methods: {
    ...mapActions(['setUserId']), // Map Vuex actions

    async handleSubmit() {
      if (!this.valid) return;
      this.error = null;
      this.loading = true;

      try {
        if (this.isSignup) {
          await this.signup();
        } else {
          await this.loginUser(); // Call the local loginUser method
        }
      } finally {
        this.loading = false;
      }
    },
    async loginUser() {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/login`, {
          username: this.username,
          password: this.password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Include cookies in the request
        });

        if (response.data.success) {
          const userId = response.data.userId;
          console.log('User ID in Login:', response.data.userId);
          console.log('User Poc in Login:', response.data.poc);
          console.log('User wishlistId in login:',response.data.wishlistId);

          await this.setUserId(userId); // Commit userId to Vuex store
          this.$emit('login-success'); // Emit event on successful login

        } else {
          this.error = response.data.error || 'Invalid username or password';
        }
      } catch (error) {
        console.error('Login error:', error); // Log the error details
        this.error = error.response?.data?.error || 'An error occurred. Please try again.';
      }
    },
    async signup() {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/signup`, {
          username: this.username,
          email: this.email,
          password: this.password,
          poc:this.poc,
        });

        if (response.data.success) {
          this.successMessage = 'Sign up successful! Please log in with your new account.';
          this.isSignup = false;
          this.username = '';
          this.password = '';
          this.confirmPassword = '';
          this.poc = '';
        } else {
          this.error = response.data.message || 'Signup failed';
        }
      } catch (error) {
        this.error = 'An error occurred during signup. Please try again.';
      }
    },
    toggleMode() {
      this.isSignup = !this.isSignup;
      this.error = null;
      this.successMessage = null;
    },
  },
};
</script>
