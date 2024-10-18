<template>
  <v-app class="app-wrapper">
    <!-- Main App Bar (visible if logged in) -->
    <v-app-bar
        app
        :elevation="10"
        color="#121212"
        height="64"
        class="px-4"
        v-if="isLoggedIn"
    >
      <!-- App title or logo -->
      <v-app-bar-title class="text-h5 font-weight-bold color:#121212">
        <img src="@/assets/log1.png" alt="Puff-Media Logo" style="height: 120px; width: auto; object-fit: contain;">
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- User menu -->
      <v-menu bottom left>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" color="white">
            <v-avatar color="white" size="36">
              <v-icon color="#4700CF">mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="navigateTo('/wishlist-manager')">
            <v-list-item-title>
              <v-icon start color="red">mdi-heart</v-icon>
              Manage Wishlist
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>
              <v-icon start color="red">mdi-logout</v-icon>
              Logout
            </v-list-item-title>
          </v-list-item>
        </v-list>
        
      </v-menu>
    </v-app-bar>

    <!-- Main Content Area with Sidebar -->
    <v-main style="background:#121212">
      <v-container fluid class="fill-height pa-0 d-flex">
        <!-- Sidebar (visible if logged in) -->
        <AppSidebar v-if="isLoggedIn" />

        <!-- Router View / Login Form -->
        <v-container fluid class="pa-4 flex-grow-1">
          <LoginForm v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
          <router-view v-else></router-view>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import LoginForm from './components/LoginForm.vue'

const router = useRouter()
const isLoggedIn = ref(false)

onMounted(() => {
  // Check if user is logged in (e.g., by checking for a token in localStorage)
  isLoggedIn.value = !!localStorage.getItem('token')
})

const handleLoginSuccess = () => {
  isLoggedIn.value = true
  router.push('/') // Redirect to home page or dashboard after login
}

const navigateTo = (route) => {
  router.push(route)
}

const logout = () => {
  // Clear user session (e.g., remove token from localStorage)
  localStorage.removeItem('token')
  isLoggedIn.value = false
  router.push('/login')
}
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}

.v-main {
  background-color: #121212;
}

#app {
  background-color: #000000;
}

html, body {
  background-color: #121212;
  margin: 0;
  padding: 0;
}

.app-wrapper {
  background-color: #121212;
  min-height: 100vh;
}
</style>