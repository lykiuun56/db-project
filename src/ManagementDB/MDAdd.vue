<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>Management Email</h1>
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
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ManagementEmail',
  data() {
    return {
      selectedFile: null,
    };
  },
  methods: {
    async submit() {
      if (!this.selectedFile) {
        alert('Please select a file to upload.');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        await axios.post('http://localhost:8081/api/management/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('File uploaded successfully');
        this.selectedFile = null;
      } catch (error) {
        console.error(error);
        alert('Failed to upload file.');
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