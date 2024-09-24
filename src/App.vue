<template>
  <v-app>
    <!-- Navigation Drawer for Sidebar (visible if logged in) -->
    <v-navigation-drawer app permanent v-if="isLoggedIn">
      <AppSidebar />
    </v-navigation-drawer>

    <!-- Main App Bar (visible if logged in) -->
    <v-app-bar app clipped-left v-if="isLoggedIn">
      <!-- Space between elements -->
      <v-spacer></v-spacer>

      <!-- Wishlist Dropdown Menu -->
      <v-menu offset-y :close-on-content-click="false" v-model="dropdownVisible">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-heart</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="navigateTo('/create-wishlist')">
            <v-list-item-title>Create Wishlist</v-list-item-title>
          </v-list-item>
          <v-list-item @click="navigateTo('/view-wishlist')">
            <v-list-item-title>View Wishlist</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- User Profile Button -->
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Wishlist Summary Bar (additional bar) -->
    <v-app-bar app color="primary" dense v-if="isLoggedIn && wishlist.length">
      <v-toolbar-title>
        Wishlist
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="navigateTo('/view-wishlist')">
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="fill-height">
        <!-- Login Form or Main Content Based on Authentication -->
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
    LoginForm
  },
  data() {
    return {
      isLoggedIn: false,
      dropdownVisible: false,
      wishlist: [] // Array to hold wishlist items
    };
  },
  methods: {
    handleLoginSuccess() {
      this.isLoggedIn = true;
      // Load wishlist items on login success (replace with actual data fetch)
      this.wishlist = this.loadWishlist();
    },
    navigateTo(path) {
      this.$router.push(path);
      this.dropdownVisible = false; // Close dropdown after navigation
    },
    loadWishlist() {
      // Placeholder method, replace with actual data fetch logic
      return [
        {id: 1, name: 'Wishlist Item 1'},
        {id: 2, name: 'Wishlist Item 2'}
      ];
    }
  }
};
</script>

<style>
.v-main .v-container {
  padding-top: 16px;
}

.v-avatar {
  background-color: #42A5F5;
  color: white;
  font-weight: bold;
}

.v-app-bar {
  padding: 0 16px;
}

.ml-3 {
  margin-left: 16px;
}

.search-icon {
  width: 24px;
  height: 24px;
}

.fill-height {
  height: 100%;
}
</style>