<template>
  <v-container>
    <v-card>
      <v-card-title>My Wishlists</v-card-title>
      <v-card-text>
        <!-- Show loader while fetching wishlists -->
        <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
            class="my-4"
        ></v-progress-circular>

        <!-- Display wishlists or message if none found -->
        <v-list v-if="wishlists.length">
          <v-list-item
              v-for="wishlist in wishlists"
              :key="wishlist.id"
              @click="viewWishlist(wishlist.id)"
              class="wishlist-item"
          >
            <v-list-item-content>
              <v-list-item-title>{{ wishlist.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <!-- No wishlists found message -->
        <v-alert v-else-if="!loading && fetched" type="info" prominent>
          No wishlists found for your account.
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'; // Import mapState and mapActions for Vuex state mapping

export default {
  name: 'ViewWishlist',
  data() {
    return {
      loading: false, // Loading state for API call
      fetched: false, // Indicates if data has been fetched at least once
    };
  },
  computed: {
    ...mapState(['userId', 'wishlists']), // Map userId and wishlists from Vuex store state
  },
  watch: {
    userId(newUserId) {
      // Fetch wishlists automatically when userId changes
      if (newUserId) {
        this.fetchWishlists(newUserId);
      } else {
        // If userId becomes null (e.g., user logs out), clear the wishlists
        this.$store.commit('SET_WISHLISTS', []);
      }
    }
  },
  mounted() {
    // Fetch wishlists on mount if userId is already available
    if (this.userId) {
      this.fetchWishlists(this.userId);
    }
  },
  methods: {
    ...mapActions(['fetchWishlists']), // Map the 'fetchWishlists' action

    viewWishlist(wishlistId) {
      this.$router.push({ name: 'WishlistDetail', params: { wishlistId: Number(wishlistId) } });
    }
  }
};
</script>

<style scoped>
/* Styling for the wishlist items */
.wishlist-item {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.wishlist-item:hover {
  background-color: #f0f0f0;
}

.my-4 {
  margin: 16px 0;
}
</style>
