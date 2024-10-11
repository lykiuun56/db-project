<template>
  <div>
    <v-btn icon @click="updateRow">
      <v-icon color="blue">mdi-pencil</v-icon>
    </v-btn>
    <v-btn icon @click="deleteRow">
      <v-icon color="red">mdi-delete</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'ActionCellRenderer',
  props: ['params'],
  methods: {
    updateRow() {
      // Since cells are editable, updating happens on cell edit.
      // Optionally, you can implement a separate update dialog.
      // For now, we'll just alert that the row can be edited directly.
      alert('You can edit the cells directly to update the row.');
    },
    deleteRow() {
      if (confirm('Are you sure you want to delete this entry?')) {
        this.params.context.componentParent.deleteLiveStatus(this.params.data.id);
      }
    },
  },
};
</script>

<style scoped>
.v-btn {
  margin: 0;
  padding: 0;
}
</style>
