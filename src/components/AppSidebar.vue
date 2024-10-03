<template>
  <v-navigation-drawer
      app
      permanent
      color="grey-darken-4"
      width="280"
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
            title="Collaborated"
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
            @click="$router.push('/md-grid')"
            title="Agency Email"
            prepend-icon="mdi-email"
        ></v-list-item>
        <v-list-item
            @click="$router.push('/bl-grid')"
            title="Black List"
            prepend-icon="mdi-block-helper"
        ></v-list-item>
      </v-list-group>

      <v-list-item
          @click="$router.push('/remove-duplicate')"
          prepend-icon="mdi-content-duplicate"
          title="Remove Duplicate"
      ></v-list-item>

      <v-list-group value="Tik Tok">
        <template v-slot:activator="{ props }">
          <v-list-item
              v-bind="props"
              prepend-icon="mdi-music-note"
              title="Tik Tok"
          ></v-list-item>
        </template>

        <v-list-item
            @click="$router.push('/tik-hash-tag')"
            title="Hash Tag"
            prepend-icon="mdi-tag"
        ></v-list-item>
        <v-list-item
            @click="$router.push('/tik-search-name')"
            title="Handle Name"
            prepend-icon="mdi-alpha-n-box-outline"
        ></v-list-item>
      </v-list-group>

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

        <v-list-group value="total-projects">
          <template v-slot:activator="{ props }">
            <v-list-item
                v-bind="props"
                prepend-icon="mdi-view-grid"
                title="Total project"
            ></v-list-item>
          </template>

          <v-list-item
              @click="$router.push('/tp-grid')"
              title="View"
              prepend-icon="mdi-grid-large"
          ></v-list-item>
          <v-list-item
              @click="$router.push('/tp-search')"
              title="Find"
              prepend-icon="mdi-magnify"
          ></v-list-item>
        </v-list-group>

        <v-list-group value="Collaborated-projects">
          <template v-slot:activator="{ props }">
            <v-list-item
                v-bind="props"
                prepend-icon="mdi-account-group"
                title="Collaborated project"
            ></v-list-item>
          </template>

          <v-list-item
              @click="$router.push('/cp-grid')"
              title="View"
              prepend-icon="mdi-grid-large"
          ></v-list-item>
          <v-list-item
              @click="$router.push('/cp-search')"
              title="Find"
              prepend-icon="mdi-magnify"
          ></v-list-item>
        </v-list-group>
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

/* Ensure all text is visible */
.v-list-item__content {
  white-space: normal;
  overflow: visible;
}
</style>