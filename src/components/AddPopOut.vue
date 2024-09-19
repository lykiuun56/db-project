<template>
    <v-dialog v-model="localVisible" max-width="800px">
      <v-card>
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

            <!-- File upload input -->
          <v-row>
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
          <v-btn color="blue darken-1" text @click="submitForm">Save</v-btn>
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
          if (this.selectedFile) {
            this.submitFile();
          } else {
            this.$emit('save', { ...this.localFormData });
            this.close();
          }
        }
      },
      submitFile() {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('formData', JSON.stringify(this.localFormData));
        this.$emit('saveFile', formData);
        this.close();
      },
      resetForm() {
        this.selectedFile = null;
        this.localFormData = { ...this.formData };
      },

    },
  };
  </script>
  