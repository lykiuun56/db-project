<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card color="#222222" elevation="8" rounded="lg" class="login-card">
          <v-card-title class="text-h4 font-weight-bold d-flex justify-center align-center text-center white--text">
            My Wishlists
          </v-card-title>
          <v-card-text>
            <!-- Show loader while fetching wishlists -->
            <v-progress-circular
                v-if="loading"
                indeterminate
                color="#4700CF"
                class="my-4 d-flex justify-center mx-auto"
            ></v-progress-circular>

            <!-- Display wishlists or message if none found -->
            <v-list v-if="wishlists.length" class="dark-list">
              <v-list-item
                  v-for="wishlist in wishlists"
                  :key="wishlist.id"
                  @click="viewWishlist(wishlist.id)"
                  class="wishlist-item mb-2 dark-list-item"
                  rounded="lg"
              >
                <v-list-item-content>
                  <v-list-item-title class="white--text">{{ wishlist.name }}</v-list-item-title> <!-- Text will be white -->
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <!-- No wishlists found message -->
            <v-alert v-else-if="!loading && fetched" type="info" prominent color="#4700CF" class="white--text">
              No wishlists found for your account.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

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
      if (newUserId) {
        this.fetchWishlists(newUserId);
      } else {
        this.$store.commit('SET_WISHLISTS', []);
      }
    }
  },
  mounted() {
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
/* Dark theme background for the entire application */
v-application {
  background-color: #121212 !important;
}

.v-card {
  background-color: #222222 !important;
}

/* Styling for the wishlist items */
.wishlist-item {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.wishlist-item:hover {
  background-color: #4700CF !important;
}

/* Ensure the v-list and v-list-item backgrounds are dark */
.dark-list {
  background-color: #222222 !important;
}

.dark-list-item {
  background-color: #333333 !important;
}

/* Make sure wishlist names are white */
.v-list-item-title {
  color: white !important;
}

.v-alert {
  margin-top: 16px;
}

.my-4 {
  margin: 16px 0;
}
</style>
