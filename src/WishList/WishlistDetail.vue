<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-btn icon @click="backToList">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span>Wishlist: {{ wishlist.name }}</span>
      </v-card-title>
      <v-card-text>
        <!-- Display Wishlist Items -->
        <v-list>
          <v-list-item
              v-for="item in wishlist.items"
              :key="item.id"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                Quantity: {{ item.quantity }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider class="my-4"></v-divider>

        <!-- Display Creators of the Wishlist -->
        <v-card-subtitle>Creators</v-card-subtitle>
        <v-list v-if="creators.length">
          <v-list-item v-for="creator in creators" :key="creator.id">
            <v-list-item-content>
              <v-list-item-title>{{ creator.name }}</v-list-item-title>
              <v-list-item-subtitle>Email: {{ creator.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-alert v-else-if="!loading && creators.length === 0" type="info">
          No creators found for this wishlist.
        </v-alert>
        <v-progress-circular v-if="loading" indeterminate color="primary" class="my-4"></v-progress-circular>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'WishlistDetail',
  props: {
    wishlist: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      creators: [], // Array to store the list of creators
      loading: false, // Loading state for the creators API call
    };
  },
  methods: {
    backToList() {
      this.$router.push({ name: 'ViewWishlist' }); // Navigate back to the wishlist list view
    },
    async fetchCreators() {
      this.loading = true;
      try {
        const response = await this.$axios.get(`/${this.wishlist.id}/creators`);
        this.creators = response.data;
      } catch (error) {
        console.error('Failed to fetch creators', error);
        this.$emit('alert', 'Failed to fetch creators');
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchCreators(); // Fetch creators when the component is mounted
  }
};
</script>

<style scoped>
/* Add custom styles if needed */
.my-4 {
  margin: 16px 0;
}
</style>
