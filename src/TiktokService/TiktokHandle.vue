<template>
  <v-container class="add-to-database-container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>TikTok Search Handle Name</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="5">
        <v-file-input v-model="selectedFile" label="Select File" outlined></v-file-input>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="submit">Submit</v-btn>
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
  import axios from "axios";

  export default {
    name: 'TiktokHandle',
    data() {
      return {
        selectedFile: null,
        result: null,
      };
    },
    methods: {
      async submit() {
        if (!this.selectedFile) {
          alert('Please select a file before submitting.');
          return;
        }

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        try {
          const response = await axios.post('http://creator-tools.us-east-1.elasticbeanstalk.com/tiktok/searchHandleName', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob' // Important: ensures the response is treated as a binary file
          });

          // Create a link element, use it to trigger a download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'TikTokAPI_CreatorInfo.xlsx'); // Or dynamically set based on response headers
          document.body.appendChild(link);
          link.click();

          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error(error);
          alert('Failed to search TikTok creators by hashtag.');
        }
      }
    }
  }
  </script>
  
  <style>
  .text-center {
    text-align: center;
  }
  .add-to-database-container {
    padding-top: 16px;
  }
  </style>
  