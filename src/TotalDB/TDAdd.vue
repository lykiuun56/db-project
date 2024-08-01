<template>
  <v-container class="add-to-database-container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>Add to Total Database</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="5">
        <v-textarea v-model="inputText" label="请输入" outlined></v-textarea>
      </v-col>
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
  name: 'CDAdd',
  data() {
    return {
      inputText: '',
      selectedFile: null,
    };
  },
  methods: {
    async submit() {
      try {
        const formData = new FormData();
        formData.append('text', this.inputText);
        if (this.selectedFile) {
          formData.append('file', this.selectedFile);
        }

        const response = await axios.post('http://localhost:8081/api/total/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          alert('提交成功');
          this.inputText = '';
          this.selectedFile = null;
        }
      } catch (error) {
        console.error(error);
        alert('提交失败');
      }
    },
  },
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
