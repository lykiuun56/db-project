<template>
  <v-app>
    <v-navigation-drawer app permanent>
      <AppSidebar />
    </v-navigation-drawer>
    <v-app-bar app clipped-left>
      <v-toolbar-title>My Application</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <img src="@/assets/send.png" alt="Search" class="search-icon" />
      </v-btn>
      <v-avatar size="32" class="ml-3" color="primary">
        <span>A</span>
      </v-avatar>
    </v-app-bar>
    <v-main>
      <v-container fluid class="fill-height">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppSidebar from '@/components/AppSidebar.vue';

export default {
  name: 'App',
  components: {
    AppSidebar
  }
};
</script>

<style>
/* 添加一些全局样式 */
.v-main .v-container {
  padding-top: 16px;
}
.v-avatar {
  background-color: #42A5F5;
  color: white;
  font-weight: bold;
}
.v-app-bar {
  padding: 0 16px;
}
.ml-3 {
  margin-left: 16px;
}
.search-icon {
  width: 24px;
  height: 24px;
}
.fill-height {
  height: 100%;
}
</style>
