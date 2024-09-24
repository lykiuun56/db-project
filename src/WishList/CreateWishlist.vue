<template>
  <v-container>
    <v-card>
      <v-card-title>Create Wishlist</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
              v-model="userId"
              label="User ID"
              required
          ></v-text-field>
          <v-btn @click="createWishlist">Create</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<!--<script>-->
<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      userId: ''-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    // async createWishlist() {-->
<!--    //   if (!this.userId) {-->
<!--    //     alert("User ID is required");-->
<!--    //     return;-->
<!--    //   }-->
<!--    //   try {-->
<!--    //     const response = await this.$axios.post('/api/wishlists/create', null, {-->
<!--    //       params: { userId: this.userId }-->
<!--    //       response.-->
<!--    //     });-->
<!--    //     alert('Wishlist created successfully');-->
<!--    //   } catch (error) {-->
<!--    //     alert('Failed to create wishlist');-->
<!--    //   }-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->
