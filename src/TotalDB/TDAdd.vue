<template>
  <v-container class="add-to-database-container">
    <v-row justify="center">
      <v-col cols="12" class="text-center mb-4">
        <h1>Add to Total Database</h1>
      </v-col>
    </v-row>
    <v-row justify="center" class="mb-3">
      <v-col cols="12" md="3">
        <v-text-field
            v-model="handle_name"
            label="Handle Name"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
            v-model="email"
            label="Email"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
            v-model="followers"
            label="Followers"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" class="mb-4">
      <v-col cols="12" md="9" class="text-center">
        <v-btn color="primary" @click="submitManual" block large>提交 (手动输入)</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" class="mb-3">
      <v-col cols="12" md="9">
        <v-file-input
            v-model="selectedFile"
            label="选择文件"
            outlined
            dense
            color="primary"
            prepend-icon="mdi-file-upload"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="9" class="text-center">
        <v-btn color="secondary" @click="submitFileImport" block large :disabled="!selectedFile">提交 (导入文件)</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { apiBaseUrl } from '@/config';
import axios from 'axios';

export default {
  name: 'TDAdd',
  data() {
    return {
      handle_name: '',
      email: '',
      followers: '',
      selectedFile: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const contents = e.target.result;
          this.parseFile(contents);
        };
        reader.readAsText(file);
      }
    },
    parseFile(contents) {
      // Assuming the file contains JSON or CSV data
      try {
        const data = JSON.parse(contents); // For JSON files
        // Example structure: { handleName: 'name', email: 'email@example.com', followers: 1000 }
        this.handle_name = data.handle_name || '';
        this.email = data.email || '';
        this.followers = data.followers || '';
      } catch (e) {
        console.error('File parsing failed:', e);
        alert('文件解析失败，请确保文件格式正确。');
      }
    },
    async submitManual() {
      try {
        const data = {
          handle_name: this.handle_name,
          email: this.email,
          followers: this.followers,
        };
        const response = await axios.post(`${apiBaseUrl}/api/total/add`, data);

        if (response.status === 200) {
          alert('手动提交成功');
          this.resetForm();
        }
      } catch (error) {
        console.error(error);
        alert('手动提交失败');
      }
    },
    async submitFileImport() {
      try {
        const formData = new FormData();
        if (this.selectedFile) {
          formData.append('file', this.selectedFile);
        }

        const response = await axios.post(`${apiBaseUrl}/api/total/addByFile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          alert('文件提交成功');
          this.resetForm();
        }
      } catch (error) {
        console.error(error);
        alert('文件提交失败');
      }
    },
    resetForm() {
      this.handle_name = '';
      this.email = '';
      this.followers = '';
      this.selectedFile = null;
    }
  },
};
</script>

<style scoped>
.add-to-database-container {
  max-width: 900px;
  margin: 0 auto;
  padding-top: 20px;
  padding-bottom: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.text-center {
  text-align: center;
}

.v-text-field,
.v-file-input {
  width: 100%;
}

.v-btn {
  font-weight: bold;
}
</style>
