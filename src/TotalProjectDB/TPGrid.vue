<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 style="color: white" >Total Project</h1>
        <v-btn color="#4700cf" @click="exportAllToExcel">Export to Excel</v-btn> <!-- Button to trigger export -->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ag-grid-vue
            class="ag-theme-alpine-dark"
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
import { apiBaseUrl } from '@/config';
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import {exportToExcel} from "@/utils/exportUtils";

export default {
  name: 'TotalProjectGrid',
  components: {
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [
        // { headerName: 'Id', field: 'id', sortable: true, filer: true},
        { headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true},
        { headerName: 'Email', field: 'email', sortable: true, filter: true, width: 200 },
        { headerName: 'Categories', field: 'categories', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'Project Name', field: 'project_name', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'Sending Date', field: 'sending_date', sortable: true, filter: true, flex: 1.5, valueFormatter: this.dateFormatter },
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
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      try {
        const response = await axios.get(`${apiBaseUrl}/api/total_projects/all`);
        this.rowData = response.data;
        params.api.sizeColumnsToFit();  // Ensure columns fit the grid width
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    dateFormatter(params) {
      const value = params.value;

      // Check if the value is null, undefined, or an empty string
      if (value == null || value === '') {
        return ''; // Return an empty string if the value is null or undefined
      }

      const date = new Date(value);

      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        // Customize the date format as needed
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } else {
        return ''; // Return an empty string for invalid dates
      }
    },
    exportAllToExcel() {
      // exportToExcel(this.rowData, "collaborated_database_all");
      const allDisplayedData = [];
      this.gridApi.forEachNodeAfterFilterAndSort((node) => {
        allDisplayedData.push(node.data);
      });

      exportToExcel(allDisplayedData, "Total_Project_filtered");
    },
  }
};
</script>

<style>
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";

.ag-theme-alpine {
  width: 100%;
  height: 400px;
}
</style>
