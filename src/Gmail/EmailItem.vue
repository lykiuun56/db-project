<template>
    <v-list-item @click="$emit('email-clicked', email.id)">
      <v-list-item-avatar>
        <v-icon :color="email.isUnread ? 'error' : 'grey'">
          mdi-email
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="d-flex align-center">
          <span :class="{ 'font-weight-bold': email.isUnread }">{{ email.from }}</span>
          <v-icon v-if="email.isUnread" color="error" small class="ml-2">mdi-circle</v-icon>
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ email.subject }}
        </v-list-item-subtitle>
        <v-list-item-subtitle class="text--secondary">
          {{ email.snippet }}
        </v-list-item-subtitle>
        <v-chip-group v-if="email.labels && email.labels.length">
          <v-chip
            v-for="label in email.labels"
            :key="label"
            x-small
            class="mr-1"
          >
            {{ label }}
          </v-chip>
        </v-chip-group>
      </v-list-item-content>
      <v-list-item-action class="text-right">
        <v-list-item-action-text>{{ formatDate(email.date) }}</v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
  </template>
  
  <script>
  export default {
    props: ['email'],
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
        if (diffDays === 0) {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays < 7) {
          return date.toLocaleDateString([], { weekday: 'short' });
        } else {
          return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .v-list-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
  .v-chip-group {
    margin-top: 4px;
  }
  </style>