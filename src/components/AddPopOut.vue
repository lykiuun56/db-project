<template>
    <v-dialog v-model="localVisible" max-width="800px">
      <v-card color ="#222222">
        <v-card-title>
          <span class="text-h5">{{ title }}</span>
        </v-card-title>
  
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12" md="6" v-for="field in fields" :key="field.name">
                <!-- Render v-select if the field type is 'select' -->
                <v-select
                  v-if="field.type === 'select'"
                  v-model="localFormData[field.name]"
                  :items="field.options"
                  :label="field.label"
                  :outlined="true"
                  :dense="true"
                  :rules="field.rules || []"
                  :required="field.required || false"
                ></v-select>

                <!-- Render v-text-field for all other fields -->
                <v-text-field
                  v-else
                  v-model="localFormData[field.name]"
                  :label="field.label"
                  :outlined="true"
                  :dense="true"
                  :rules="field.rules || []"
                  :type="field.type || 'text'"
                  :required="field.required || false"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Conditionally render the file upload input -->
          <v-row v-if="showFileUpload">
            <v-col cols="12">
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

        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <template v-if="forTotalDatabase">
          <v-btn color="blue darken-1" text @click="submitForm">Save</v-btn>
          <v-btn color="blue darken-1" text @click="submitSaveToDB">Save to DB</v-btn>
          <v-btn color="green darken-1" text @click="submitSaveToBoth">Save to Both</v-btn>
        </template>
        <template v-if="forCollaboratedDatabase">
          <v-btn color="blue darken-1" text @click="submitForm">Save</v-btn>
          <v-btn color="green darken-1" text @click="submitSaveToBoth">Save to Both</v-btn>
        </template>
        <v-btn v-else color="blue darken-1" text @click="submitForm">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AddPopOut',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Add Entry',
    },
    fields: {
      type: Array,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
    showFileUpload: {
      type: Boolean,
      default: true, // Show the file upload input by default
    },
    forTotalDatabase: {  // New prop added here
      type: Boolean,
      default: false, // Default is false for all other use cases
    },
    forCollaboratedDatabase: { // New prop added here
      type: Boolean,
      default: false, // Default is false for all other use cases
    },
  },
  data() {
    return {
      valid: true,
      localVisible: this.visible,
      localFormData: { ...this.formData },
      selectedFile: null,
    };
  },
  watch: {
    visible(val) {
      this.localVisible = val;
    },
    localVisible(val) {
      this.$emit('update:visible', val);
    },
    formData: {
      handler(newVal) {
        this.localFormData = { ...newVal };
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.$emit('close');
      this.localVisible = false;
      this.resetForm();
    },
    submitForm() {
      if (this.$refs.form.validate()) {
        if (this.showFileUpload && this.selectedFile) {
          // If a file needs to be uploaded, emit an event with the form data and file.
          const formData = new FormData();
          formData.append('formData', JSON.stringify(this.localFormData));
          formData.append('file', this.selectedFile);

          // Emit a different event for file saving, such as saveFile
          this.$emit('saveFile', formData);
        } else {
          // For regular form submission without file
          this.$emit('save', { ...this.localFormData });
        }
        this.close();
      }
    },
    // submitForm() {
    //   if (this.$refs.form.validate()) {
    //     if (this.showFileUpload && this.selectedFile) {
    //       this.submitFile();
    //     } else {
    //       this.$emit('save', { ...this.localFormData });
    //       this.close();
    //     }
    //   }
    // },
    submitSaveToDB() {
      if (this.$refs.form.validate()) {
        const formData = new FormData();
        formData.append('formData', JSON.stringify(this.localFormData));
        if (this.selectedFile) {
          formData.append('file', this.selectedFile);
        }
        this.$emit('saveToDB', formData);  // Emitting the event with formData
        this.close();
      }
    },
    submitSaveToBoth() {
      if (this.$refs.form.validate()) {
        const formData = new FormData();
        formData.append('formData', JSON.stringify(this.localFormData));
        if (this.selectedFile) {
          formData.append('file', this.selectedFile);
        }
        this.$emit('saveToBoth', formData);  // Emitting the event with formData
        this.close();
      }
    },
    resetForm() {
      this.selectedFile = null;
      this.localFormData = { ...this.formData };
    },
  },
};
</script>
