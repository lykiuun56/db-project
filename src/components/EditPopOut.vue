<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Edit Row</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" v-for="(value, key) in editedData" :key="key">
                <v-text-field 
                  v-model="editedData[key]" 
                  :label="key" 
                  :readonly="isNonEditableField(key)"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="saveChanges">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EditPopOut',
  props: {
    value: Boolean,   // Controls the dialog visibility
    rowData: Object,  // The row data to edit
    nonEditableFields: {
      type: Array,
      default: () => [] // Provide a default empty array
    },
  },
  data() {
    return {
      dialog: false,
      editedData: {},
    };
  },
  watch: {
    value(val) {
      this.dialog = val;
    },
    rowData: {
      immediate: true,
      handler(newValue) {
        this.editedData = { ...newValue }; // Copy the row data for editing
      },
    },
  },
  methods: {
    closeDialog() {
      this.dialog = false;
      this.$emit('close'); // Emit event to close the dialog
    },
    saveChanges() {
      this.$emit('save', this.editedData); // Emit the updated data
      this.closeDialog();
    },
    isNonEditableField(fieldName) {
      return this.nonEditableFields.includes(fieldName);
    },
  },
};
</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
