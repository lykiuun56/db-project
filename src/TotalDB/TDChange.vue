<template>
  <v-container fluid>
    <!-- Search Section -->
    <v-row>
      <v-col cols="4">
        <v-text-field v-model="handleName" label="Handle Name" dense></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field v-model="email" label="Email" dense></v-text-field>
      </v-col>
      <v-col cols="4" class="text-center">
        <v-btn color="primary" @click="search">Search</v-btn>
      </v-col>
    </v-row>

    <!-- AG Grid Section -->
    <v-row v-if="rowData.length">
      <v-col cols="12">
        <ag-grid-vue
            class="ag-theme-alpine"
            style="width: 100%; height: 400px;"
            :rowData="rowData"
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"
            @cellValueChanged="onCellValueChanged"
            :frameworkComponents="frameworkComponents"
        ></ag-grid-vue>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';

export default {
  components: {
    AgGridVue
  },
  data() {
    return {
      handleName: '',  // This is used for the search input
      email: '',
      rowData: [], // Data to be displayed in the grid
      columnDefs: [
        { headerName: "ID", field: "id", editable: false }, // Non-editable
        { headerName: "Handle Name", field: "handle_name", editable: true }, // Matches the database field
        { headerName: "Followers", field: "followers", editable: true },
        { headerName: "Email", field: "email", editable: true },
        {
          headerName: 'Is Blocked',
          field: 'is_Blocked',
          sortable: true,
          filter: true,
          flex: 2,
          cellRenderer: (params) => params.value ? 'Yes' : 'No' // Correctly handling boolean values
        },
      ],
      defaultColDef: {
        editable: true, // Make all columns editable by default
        sortable: true,
        filter: true,
        resizable: true,
      },
      frameworkComponents: {}
    };
  },
  methods: {
    async search() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:8081/api/total/singleSearch', {
          params: {
            handleName: this.handleName || null,
            email: this.email || null,
          },
        });
        this.rowData = response.data;
      } catch (error) {
        console.error(error);
        alert('Search failed');
      } finally {
        this.loading = false;
      }
    },
    async onCellValueChanged(event) {
      const updatedData = event.data;
      try {
        await axios.put(`http://localhost:8081/api/total/update/${updatedData.id}`, updatedData);
        alert('Update successful');
      } catch (error) {
        console.error('Error updating data:', error);
        alert('Update failed');
      }
    }
  }
};
</script>

<style scoped>
.ag-theme-alpine {
  height: 100%;
  width: 100%;
}
</style>
