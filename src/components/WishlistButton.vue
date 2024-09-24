<template>
  <v-icon
      class="wishlist-icon"
      @click="addToWishlist"
      color="red"
  >
    mdi-heart
  </v-icon>
</template>

<script>
export default {
  props: ['params'],
  methods: {
    addToWishlist() {
      console.log('Adding to wishlist:', this.params.data);
      this.$emit('add-to-wishlist', this.params.data);
    }
  }
}
</script>

<style scoped>
.wishlist-icon {
  cursor: pointer;
}
</style>
