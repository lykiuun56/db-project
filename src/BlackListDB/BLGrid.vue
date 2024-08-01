<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Black List Database</h1>
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
  name: 'BlackListGrid',
  components: {
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [
        { headerName: 'ID', field: 'id', sortable: true, filter: true, width: 70 },
        { headerName: 'Handle Name', field: 'handle_name',sortable: true, filter: true, flex: 2},
        { headerName: 'Email ', field: 'email', sortable: true, filter: true, flex: 2 },
        { headerName: 'Followers', field: 'followers', sortable: true, filter: true, flex: 1 },
        { headerName: 'Is_blocked', field: 'is_blocked', sortable: true, filter: true, flex: 1.5 },
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
        const response = await axios.get('http://localhost:8081/api/black_list/all');
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
