<template>
  <v-navigation-drawer
      app
      permanent
      class="modern-sidebar"
      width="280"
  >
    <v-list nav class="sidebar-list">
      <div v-for="(section, index) in menuSections" :key="index" class="menu-section">
        <v-list-subheader class="section-title">{{ section.title }}</v-list-subheader>
        <v-list-item
            v-for="item in section.items"
            :key="item.title"
            :to="item.route"
            class="menu-item"
            :class="{ 'sub-item': item.isSubItem }"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" class="menu-icon" />
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';

const menuSections = ref([
  {
    title: 'Database',
    items: [
      { title: 'Total Database', icon: 'mdi-home-circle', route: '/td-grid' },
      { title: 'Collaborated', icon: 'mdi-account-group', route: '/cd-grid' },
    ],
  },
  {
    title: 'Projects',
    items: [
      { title: 'Total Projects', icon: 'mdi-view-grid', route: '/tp-grid' },
      { title: 'Collaborated Projects', icon: 'mdi-account-group', route: '/cp-grid' },
      ],
  },
  {
    title: 'Management',
    items: [
      { title: 'Agency Email', icon: 'mdi-email', route: '/md-grid' },
      { title: 'Black List', icon: 'mdi-block-helper', route: '/bl-grid' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { title: 'Remove Duplicate', icon: 'mdi-content-duplicate', route: '/remove-duplicate' },
      { title: 'Email Extraction', icon: 'mdi-email-plus', route: '/email-extra' },
    ],
  },
  {
    title: 'TikTok',
    items: [
      { title: 'Hash Tag', icon: 'mdi-tag', route: '/tik-hash-tag' },
      { title: 'Handle Name', icon: 'mdi-alpha-n-box-outline', route: '/tik-search-name' },
    ],
  },
  {
    title: 'Status',
    items: [
      {title: 'Email Status', icon: 'mdi-email',route: '/email-status'},
      {title: 'Live Status', icon: 'mdi-video',route:'/live-status'},
    ],
  }, 
  {
    title: 'Campaign',
    items: [
      { title: 'Campaign', icon: 'mdi-email', route: '/campaign-grid' },
    ],
  },


]);
</script>

<style scoped>
.modern-sidebar {
  background-color: #121212;
  color: #e0e0e0;
}

.sidebar-list {
  padding: 16px 0;
}

.menu-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #e0e0e0;
  margin: 0 16px 8px;
  padding-bottom: 4px;
  border-bottom: 2px solid #0f3460;
}

.menu-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-icon {
  color: #4700cf;
  margin-right: 12px;
}

.v-list-item-title {
  font-size: 0.9rem;
  font-weight: 500;
}

.sub-item {
  padding-left: 48px;
  font-size: 0.85rem;
  opacity: 0.8;
}
</style>