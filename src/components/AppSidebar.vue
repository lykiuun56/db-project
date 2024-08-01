<template>
  <v-app>
    <v-navigation-drawer app>
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Main Menu</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="$router.push('/')" style="margin-top:20vh">
          <v-btn text block>Total Database</v-btn>
        </v-list-item>
        <v-list-item @click="$router.push('/total-database-home')">
          <v-btn text block>Total Database Home</v-btn>
        </v-list-item>
        <v-list-item @click="$router.push('/collaborated-database')">
          <v-btn text block>Collaborated Database</v-btn>
        </v-list-item>
        <v-list-item @click="$router.push('/remove-duplicate')">
          <v-btn text block>Remove Duplicate</v-btn>
        </v-list-item>
        <v-expansion-panels>
          <v-expansion-panel class="exp">
            <v-expansion-panel-title class="exp-title">
              Block Someone
              <img src="@/assets/down.png" alt="down" class="exp-icon" />
            </v-expansion-panel-title>
            <v-expansion-panel-text class="exp-text">
              <v-list-item @click="$router.push('/block-someone/black-list')">Black List</v-list-item>
              <v-list-item @click="$router.push('/block-someone/management-email')">Management Email</v-list-item>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-list-item @click="$router.push('/tiktok-home')">
          <v-btn text block>Tik Tok Service</v-btn>
        </v-list-item>
        <v-list-item @click="$router.push('/email-extra')">
          <v-btn text block>Email Extraction</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
  name: 'AppSidebar'
};
</script>

<style>
.v-navigation-drawer {
  background-color: white;
}
.v-list-item-title {
  font-weight: bold;
}
.v-divider {
  margin: 8px 0;
}
.v-btn {
  margin: 8px 0;
}
.exp-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 30px;
}

.exp-icon {
  margin-left: 28px;
}
.exp-text {
  text-align: center;
}
</style>
