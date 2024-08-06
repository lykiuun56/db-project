<template>
  <v-container class="add-to-database-container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>TikTok Hash Search</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="5">
        <v-file-input v-model="selectedFile" label="选择文件" outlined></v-file-input>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="submit">提交</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" v-if="result">
      <v-col cols="12" md="8">
        <h2>Search Results</h2>
        <p>{{ result }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TiktokHash',
  data() {
    return {
      selectedFile: null,
      result: null,
    };
  },
  methods: {
    async submit() {
      try {
        const response = await axios.get('http://localhost:8081/tiktok/searchCreatorsByHashtag');
        this.result = response.data;
      } catch (error) {
        console.error(error);
        alert('Failed to search TikTok creators by hashtag.');
      }
    }
  }
};
</script>

<style>
.text-center {
  text-align: center;
}
.add-to-database-container {
  padding-top: 16px;
}
</style>
