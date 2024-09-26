<template>
  <v-btn
      color="primary"
      small
      @click="handleClick"
  >
    Add to Wishlist
  </v-btn>
</template>

<script>
export default {
  name: 'AddToWishlistButton',
  props: {
    // ag-Grid passes all cell parameters via the 'params' prop
    params: {
      type: Object,
      required: true
    },
  },
  methods: {
    handleClick() {
      // Emit an event to the parent component with the row data
      if (this.params.context && typeof this.params.context.addToWishlist === 'function') {
        this.params.context.addToWishlist(this.params.data);
      } else {
        console.error('addToWishlist function is not defined in context.');
      }
    }
  }
};
</script>

<style scoped>
/* Optional: Add styles specific to the button */
</style>
