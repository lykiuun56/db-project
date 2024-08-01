<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Collaborated Database</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ag-grid-vue
            class="ag-theme-alpine"
            style="width: 100%; height: 600px;"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :gridOptions="gridOptions"
            @grid-ready="onGridReady"
            :domLayout="'autoHeight'"
        ></ag-grid-vue>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';

export default {
  name: 'CollaboratedDatabaseGrid',
  components: {
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [
        { headerName: 'ID', field: 'id', sortable: true, filter: true, width: 70 },
        { headerName: 'Handle Name', field: 'handle_name',sortable: true, filter: true, flex: 2},
        { headerName: 'TikTok URL', field: 'tiktok_url', sortable: true, filter: true, flex: 2 },
        { headerName: 'Categories', field: 'categories', sortable: true, filter: true, flex: 1 },
        { headerName: 'Full Name', field: 'full_name', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'State', field: 'state', sortable: true, filter: true, flex: 1 },
        { headerName: 'Full Address', field: 'full_address', sortable: true, filter: true, flex: 2 },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true, flex: 1.5 },
      ],
      rowData: null,
      gridOptions: {
        pagination: true,
        paginationPageSize: 10,
        defaultColDef: {
          resizable: true,
        },
        autoHeight: true,
      },
    };
  },
  methods: {
    async onGridReady(params) {
      try {
        const response = await axios.get('http://localhost:8081/api/collaborated/all');
        this.rowData = response.data;
        params.api.sizeColumnsToFit();  // Ensure columns fit the grid width
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
};
</script>

<style>
/* Ensure you have included the ag-Grid styles correctly */
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";

.ag-theme-alpine {
  width: 100%;
  height: 400px; /* Adjust this height based on your needs */
}
</style>
