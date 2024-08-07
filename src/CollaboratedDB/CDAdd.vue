<template>
  <v-container class="add-to-database-container">
    <v-row justify="center">
      <v-col cols="12" class="text-center mb-4">
        <h1>Add to Collaborated Database</h1>
      </v-col>
    </v-row>
    <v-row justify="center" class="mb-3">
      <v-col cols="12" md="4">
        <v-text-field
            v-model="poc"
            label="Project Name"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
            v-model="projectName"
            label="PoC"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" class="mb-3">
      <v-col cols="12" md="4">
        <v-text-field
            v-model="handle_name"
            label="Handle Name"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
            v-model="tiktok_url"
            label="TikTok URL"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
            v-model="followers"
            label="Followers"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" class="mb-3">
      <v-col cols="12" md="4">
        <v-text-field
            v-model="categories"
            label="Categories"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
            v-model="full_name"
            label="Full Name"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
            v-model="state"
            label="State"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" class="mb-3">
      <v-col cols="12" md="4">
        <v-text-field
            v-model="full_address"
            label="Full Address"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
            v-model="email"
            label="Email"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
            v-model="phone"
            label="Phone"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" class="mb-3">
      <v-col cols="12" md="4">
        <v-text-field
            v-model="collaborated_times"
            label="Collaborated Time"
            outlined
            dense
            color="primary"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
            v-model="notes"
            label="Notes"
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
        <v-btn color="secondary" @click="submitFile" block large :disabled="!selectedFile">提交 (导入文件)</v-btn>
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
      projectName: '', // Input for Project Name
      poc: '', // Input for POC
      handle_name: '',
      tiktok_url: '',
      followers: '',
      categories: '',
      full_name: '',
      state: '',
      full_address: '',
      email: '',
      phone: '',
      collaborated_times: '',
      notes: '',
      selectedFile: null,
    };
  },
  methods: {
    async submitManual() {
      try {
        const projectName = this.projectName || null;
        const poc = this.poc || null;

        if (!projectName || !poc) {
          alert('Please enter Project Name and POC');
          return;
        }

        // Prepare data for manual addition
        const data = {
          handle_name: this.handle_name || null,
          tiktok_url: this.tiktok_url || null,
          followers: this.followers || null,
          categories: this.categories || null,
          full_name: this.full_name || null,
          state: this.state || null,
          full_address: this.full_address || null,
          email: this.email || null,
          phone: this.phone || null,
          collaborated_times: this.collaborated_times || null,
          notes: this.notes || null,
        };

        // Add to CollaboratedDatabase with Project Name and POC
        const response = await axios.post(`http://localhost:8081/api/collaborated/add/${projectName}/${poc}`, data);

        if (response.status === 200) {
          alert('Successfully added to Collaborated Database');
          this.resetForm();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert('Failed to add to Collaborated Database: ' + error.response.data.message);
        } else {
          console.error(error);
          alert('An unexpected error occurred');
        }
      }
    },
    async submitFile() {
      try {
        const formData = new FormData();
        if (this.selectedFile) {
          formData.append('file', this.selectedFile);
        }

        const response = await axios.post('http://localhost:8081/api/collaborated/addByFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          alert('File submission succeeded');
          this.resetForm();
        }
      } catch (error) {
        console.error(error);
        alert('File submission failed');
      }
    },
    resetForm() {
      this.projectName = '';
      this.poc = '';
      this.handle_name = '';
      this.tiktok_url = '';
      this.followers = '';
      this.categories = '';
      this.full_name = '';
      this.state = '';
      this.full_address = '';
      this.email = '';
      this.phone = '';
      this.collaborated_times = '';
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