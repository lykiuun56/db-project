<template>
  <v-navigation-drawer
      app
      permanent
      color="grey-darken-4"
      width="240"
  >

    <v-list density="compact" nav>
      <v-list-group value="database">
        <template v-slot:activator="{ props }">
          <v-list-item
              v-bind="props"
              prepend-icon="mdi-database"
              title="Database"
          ></v-list-item>
        </template>

        <v-list-item
            @click="$router.push('/td-grid')"
            title="Total Database Home"
            prepend-icon="mdi-home-circle"
        ></v-list-item>
        <v-list-item
            @click="$router.push('/cd-grid')"
            title="Collaborated Database"
            prepend-icon="mdi-account-group"
        ></v-list-item>
      </v-list-group>

      <v-list-group value="management">
        <template v-slot:activator="{ props }">
          <v-list-item
              v-bind="props"
              prepend-icon="mdi-shield-account"
              title="Management"
          ></v-list-item>
        </template>

        <v-list-item
            @click="$router.push('/block-someone/management-email')"
            title="Management Email"
            prepend-icon="mdi-email"
        ></v-list-item>
        <v-list-item
            @click="$router.push('/block-someone/black-list')"
            title="Black List"
            prepend-icon="mdi-block-helper"
        ></v-list-item>
      </v-list-group>

      <v-list-item
          @click="$router.push('/remove-duplicate')"
          prepend-icon="mdi-content-duplicate"
          title="Remove Duplicate"
      ></v-list-item>
      <v-list-item
          @click="$router.push('/tiktok-home')"
          prepend-icon="mdi-music-note"
          title="TikTok Service"
      ></v-list-item>
      <v-list-item
          @click="$router.push('/email-extra')"
          prepend-icon="mdi-email-plus"
          title="Email Extraction"
      ></v-list-item>

      <v-list-group value="projects">
        <template v-slot:activator="{ props }">
          <v-list-item
              v-bind="props"
              prepend-icon="mdi-briefcase"
              title="Projects"
          ></v-list-item>
        </template>

        <v-list-item
            @click="$router.push('/total-project')"
            title="Total Project"
            prepend-icon="mdi-view-grid"
        ></v-list-item>
        <v-list-item
            @click="$router.push('/collaborated-project')"
            title="Collaborated Project"
            prepend-icon="mdi-account-group"
        ></v-list-item>
      </v-list-group>
    </v-list>

  </v-navigation-drawer>
</template>

<script setup>
// import { useRouter } from 'vue-router'

</script>

<style scoped>
.v-list-item__prepend > .v-icon {
  margin-inline-end: 8px;
}

.v-list-group__items .v-list-item {
  padding-inline-start: 16px;
}
</style>