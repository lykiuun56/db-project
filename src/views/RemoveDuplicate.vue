<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>Remove Duplicate</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="5">
        <v-file-input
            label="Select Input File"
            outlined
            v-model="inputFile"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="5">
        <v-file-input
            label="Select Blacklist File"
            outlined
            v-model="blackListFile"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="submit">Submit</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import fileDownload from 'js-file-download';

export default {
  name: 'RemoveDuplicate',
  data() {
    return {
      inputFile: null,
      blackListFile: null,
    };
  },
  methods: {
    async submit() {
      if (!this.inputFile || !this.blackListFile) {
        alert('Please select both files.');
        return;
      }

      const formData = new FormData();
      formData.append('input_file', this.inputFile);
      formData.append('black_list', this.blackListFile);

      try {
        const response = await axios.post('/remove-duplicates', formData, {
          responseType: 'blob',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Download the file
        fileDownload(response.data, 'output.xlsx');
      } catch (error) {
        console.error('Error during file upload:', error);
        alert('Failed to process files. Please try again.');
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
