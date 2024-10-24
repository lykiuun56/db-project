<template>
  <v-card class="mb-3" @click="handleClick">
    <v-card-title>{{ email.subject }}</v-card-title>
    <v-card-subtitle>
      From: {{ email.from }} | To: {{ email.to }} | Date: {{ email.date }}
    </v-card-subtitle>
    <v-card-text>
      {{ email.snippet }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    email: Object
  },
  methods: {
    handleClick() {
      this.$emit('email-clicked', this.email.id);
    }
  }
};
</script>

<style scoped>
.mb-3 {
  margin-bottom: 1rem;
}
</style>
