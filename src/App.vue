<template>
  <v-app>
    <!-- Navigation Drawer for Sidebar (visible if logged in and sidebar is not hidden) -->
    <v-navigation-drawer
        v-model="showSidebar"
        app
        v-if="isLoggedIn"
        :temporary="true"
        :permanent="false"
        color="grey-darken-3"
        width="240"
        class="pa-0"
    >
      <AppSidebar />
    </v-navigation-drawer>

    <!-- Main App Bar (visible if logged in) -->
    <v-app-bar
        app
        :elevation="2"
        color="primary"
        height="64"
        v-if="isLoggedIn"
    >
      <!-- Toggle sidebar button -->
      <v-app-bar-nav-icon @click="toggleSidebar" color="white"></v-app-bar-nav-icon>

      <!-- App title or logo -->
      <v-app-bar-title class="text-h5 font-weight-bold">
        <span class="text-white">Puff-Media</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Navigation Menu -->
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
            v-for="item in menuItems"
            :key="item.title"
            text
            @click="navigateTo(item.route)"
            class="text-white"
        >
          <v-icon start>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>

      <!-- Mobile menu -->
      <v-menu bottom left v-if="isMobile">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" color="white">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
              v-for="item in menuItems"
              :key="item.title"
              @click="navigateTo(item.route)"
          >
            <v-list-item-title>
              <v-icon start>{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- User menu -->
      <v-menu bottom left>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" color="white">
            <v-avatar color="white" size="36">
              <v-icon color="primary">mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="navigateTo('/profile')">
            <v-list-item-title>
              <v-icon start>mdi-account</v-icon>
              Profile
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>
              <v-icon start>mdi-logout</v-icon>
              Logout
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main>
      <v-container fluid class="fill-height pa-0">
        <!-- Display Login Form if not logged in, else show routed views -->
        <LoginForm v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
        <router-view v-else></router-view>
      </v-container>
    </v-main>

    <!-- Footer -->
<!--    <v-footer app color="primary" class="px-4 py-3" :relative="true">-->
<!--      <span class="text-white">&copy; {{ new Date().getFullYear() }} Puff-Media</span>-->
<!--      <v-spacer></v-spacer>-->
<!--      <v-btn-->
<!--          v-for="icon in socialIcons"-->
<!--          :key="icon"-->
<!--          icon-->
<!--          class="mx-1"-->
<!--          color="white"-->
<!--      >-->
<!--        <v-icon>{{ icon }}</v-icon>-->
<!--      </v-btn>-->
<!--    </v-footer>-->
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import AppSidebar from './components/AppSidebar.vue'
import LoginForm from './components/LoginForm.vue'

const router = useRouter()
const { mobile } = useDisplay()
const isLoggedIn = ref(false)
const showSidebar = ref(false)

const isMobile = computed(() => mobile.value)

const menuItems = [
  { title: 'Create Wishlist', icon: 'mdi-heart-plus', route: '/create-wishlist' },
  { title: 'View Wishlist', icon: 'mdi-heart', route: '/view-wishlist' },
]

// const socialIcons = ['mdi-facebook', 'mdi-twitter', 'mdi-instagram']

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

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
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
  background-color: #f5f5f5;
}

.v-navigation-drawer {
  top: 64px !important;
}
</style>