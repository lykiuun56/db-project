<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>Add New Entry</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model="entry.handleName"
            label="Handle Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="entry.email"
            label="Email"
            type="email"
            required
          ></v-text-field>
          <v-text-field
            v-model="entry.tiktokUrl"
            label="TikTok URL"
            required
          ></v-text-field>
          <v-select
            v-model="entry.status"
            :items="statusOptions"
            label="Status"
            required
          ></v-select>
          <v-text-field
            v-model="entry.poc"
            label="POC"
            required
          ></v-text-field>
          <v-text-field
            v-model.number="entry.price"
            label="Price"
            type="number"
            prefix="$"
            required
          ></v-text-field>
          <v-textarea
            v-model="entry.note"
            label="Note"
            rows="3"
          ></v-textarea>
          <v-checkbox
            v-model="entry.completion"
            label="Completion"
          ></v-checkbox>
          <v-select
            v-model="entry.type"
            :items="typeOptions"
            label="Type"
            required
          ></v-select>
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
  name: 'AddEntryDialog',
  props: {
    value: Boolean,
  },
  data() {
    return {
      dialog: this.value,
      entry: {
        handleName: '',
        email: '',
        tiktokUrl: '',
        status: '',
        poc: '',
        price: null,
        note: '',
        completion: false,
        type: '',
      },
      statusOptions: ['Active', 'Inactive', 'Pending'], // Adjust as needed
      typeOptions: ['Type 1', 'Type 2', 'Type 3'], // Adjust as needed
    };
  },
  watch: {
    value(val) {
      this.dialog = val;
    },
    dialog(val) {
      this.$emit('input', val);
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.resetForm();
    },
    submitForm() {
      if (this.validateForm()) {
        this.$emit('submit', this.entry);
        this.close();
      }
    },
    validateForm() {
      // Add your validation logic here
      // Return true if the form is valid, false otherwise
      return true;
    },
    resetForm() {
      this.entry = {
        handleName: '',
        email: '',
        tiktokUrl: '',
        status: '',
        poc: '',
        price: null,
        note: '',
        completion: false,
        type: '',
      };
    },
  },
};
</script>
