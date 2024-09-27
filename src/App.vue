<template>
  <v-app>
    <!-- Navigation Drawer for Sidebar (visible if logged in) -->
    <v-navigation-drawer app permanent v-if="isLoggedIn">
      <AppSidebar />
    </v-navigation-drawer>

    <!-- Main App Bar (visible if logged in) -->
    <v-app-bar app clipped-right v-if="isLoggedIn">
      <!-- Wishlist Dropdown Menu -->
      <v-bottom-navigation
          v-if="isLoggedIn"
          app
          grow
      >
        <!-- Wishlist Navigation -->
        <v-btn @click="navigateTo('/create-wishlist')">
          <v-icon>mdi-heart-plus</v-icon>
          <span>Create Wishlist</span>
        </v-btn>

        <v-btn @click="navigateTo('/view-wishlist')">
          <v-icon>mdi-heart</v-icon>
          <span>View Wishlist</span>
        </v-btn>

        <!-- User Profile Navigation -->
        <v-btn @click="navigateTo('/profile')">
          <v-icon>mdi-account</v-icon>
          <span>Profile</span>
        </v-btn>
      </v-bottom-navigation>


    </v-app-bar>


    <!-- Main Content Area -->
    <v-main>
      <v-container fluid class="fill-height">
        <!-- Display Login Form if not logged in, else show routed views -->
        <LoginForm v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
        <router-view v-else></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>






<script>
import AppSidebar from '@/components/AppSidebar.vue';
import LoginForm from '@/components/LoginForm.vue';

export default {
  name: 'App',

  components: {
    AppSidebar,
    LoginForm,
  },

  data() {
    return {
      isLoggedIn: false,       // Tracks user authentication status
      dropdownVisible: false,  // Controls visibility of the wishlist dropdown
      wishlist: [],            // Holds wishlist items
    };
  },

  methods: {
    /**
     * Handles successful login by updating the state and loading the wishlist.
     */
    handleLoginSuccess() {
      this.isLoggedIn = true;
      this.fetchWishlist();
    },

    /**
     * Navigates to the specified route and closes the dropdown menu.
     * @param {string} path - The route path to navigate to.
     */
    navigateTo(path) {
      this.$router.push(path);
      this.dropdownVisible = false; // Close dropdown after navigation
    },

  },
};
</script>

<style scoped>
/* Ensures the main container takes full height */
.fill-height {
  height: 100%;
}

/* Adds padding to the main container */
.v-main .v-container {
  padding-top: 16px;
}

/* Styles for avatar components */
.v-avatar {
  background-color: #42A5F5;
  color: white;
  font-weight: bold;
}

/* Adds horizontal padding to the app bar */
.v-app-bar {
  padding: 0 16px;
}

/* Utility class for left margin */
.ml-3 {
  margin-left: 16px;
}

/* Styles the search icon dimensions */
.search-icon {
  width: 24px;
  height: 24px;
}
</style>
