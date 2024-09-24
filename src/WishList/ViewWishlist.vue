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
              <v-list-item-title>Wishlist: {{ wishlist.name }}</v-list-item-title>
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
import { mapState } from 'vuex'; // Import mapState for Vuex state mapping
import axios from '@/axios';
import { apiBaseUrl } from '@/config';

export default {
  name: 'ViewWishlist',
  data() {
    return {
      wishlists: [], // Array to store fetched wishlists
      loading: false, // Loading state for API call
      fetched: false, // Indicates if data has been fetched at least once
    };
  },
  computed: {
    ...mapState(['userId']), // Map userId from Vuex store state
  },
  watch: {
    userId(newUserId) {
      // Fetch wishlists automatically when userId changes
      if (newUserId) {
        this.fetchWishlists(newUserId);
      }
    }
  },
  mounted() {
    // Fetch wishlists on mount if userId is already available
    console.log('User ID:', this.userId); // Check if userId is available
    if (this.userId) {
      this.fetchWishlists(this.userId);
    }
  },
  methods: {
    async fetchWishlists(userId) {
      this.loading = true;
      this.fetched = false;

      try {
        const response = await axios.get(`${apiBaseUrl}/api/wishlists/user/${userId}`);
        console.log('Fetched wishlists:', response.data); // Log response data
        this.wishlists = response.data.map(wishlist => ({
          ...wishlist,
          items: wishlist.items || [] // Default to empty array if 'items' is undefined
        }));
      } catch (error) {
        console.error('Failed to fetch wishlists', error);
        this.$emit('alert', 'Failed to fetch wishlists');
      } finally {
        this.loading = false;
        this.fetched = true;
      }
    },
    viewWishlist(wishlistId) {
      console.log('Navigating to WishlistDetail with ID:', wishlistId);
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
