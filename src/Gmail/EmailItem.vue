<template>
  <v-list-item @click="$emit('email-clicked', email.id)">
    <template v-slot:prepend>
      <v-icon :color="email.isUnread ? 'error' : 'grey'">
        mdi-email
      </v-icon>
    </template>

    <div>
      <v-list-item-title class="d-flex align-center">
        <span :class="{ 'font-weight-bold': email.isUnread }">{{ email.from }}</span>
        <v-icon v-if="email.isUnread" color="error" size="small" class="ml-2">
          mdi-circle
        </v-icon>
      </v-list-item-title>

      <v-list-item-subtitle>
        <span :class="{ 'font-weight-bold': email.isUnread }">
          {{ email.subject }}
        </span>
      </v-list-item-subtitle>

      <v-list-item-subtitle class="text-truncate">
        {{ email.snippet }}
      </v-list-item-subtitle>

      <v-chip-group v-if="email.labels && email.labels.length">
        <v-chip
          v-for="label in email.labels"
          :key="label"
          size="x-small"
          class="mr-1"
        >
          {{ label }}
        </v-chip>
      </v-chip-group>
    </div>

    <template v-slot:append>
      <span class="text-caption">
        {{ formatDate(email.date) }}
      </span>
    </template>
  </v-list-item>
</template>

<script>
export default {
  props: {
    email: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
      
      return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }
};
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.v-chip-group {
  margin-top: 4px;
}
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
