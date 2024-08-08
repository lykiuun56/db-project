<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Collaborated Database</h1>
        <v-btn color="primary" @click="exportToExcel">Export to Excel</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ag-grid-vue
            class="ag-theme-alpine custom-grid"
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
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

export default {
  name: 'CollaboratedDatabaseGrid',
  components: {
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [
        { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true, minWidth: 100 },
        { headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true, minWidth: 150 },
        { headerName: 'Tiktok URL', field: 'tiktok_url', sortable: true, filter: true, minWidth: 200 },
        { headerName: 'Followers', field: 'followers', sortable: true, filter: true, width: 100 },
        { headerName: 'Full Name', field: 'full_name', sortable: true, filter: true, minWidth: 150 },
        { headerName: 'Full Address', field: 'full_address', sortable: true, filter: true, minWidth: 200 },
        { headerName: 'Email', field: 'email', sortable: true, filter: true, minWidth: 200 },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true, width: 150 },
        { headerName: 'Collaborated Time', field: 'collaborated_times', sortable: true, filter: true, width: 150 },
        { headerName: 'Notes', field: 'notes', sortable: true, filter: true, minWidth: 150 },
        { headerName: 'POC', field: 'poc', sortable: true, filter: true, minWidth: 150 },
        { headerName: 'State', field: 'state', sortable: true, filter: true, width: 100 },
        { headerName: 'Categories', field: 'categories', sortable: true, filter: true, minWidth: 150 },
        {
          headerName: 'Is Blocked',
          field: 'is_Blocked',
          editable: true,
          cellRenderer: params => (params.value ? 'Yes' : 'No'), // Renders 'Yes' or 'No' based on the boolean value
          width: 100,
        }
      ],
      rowData: null,
      gridOptions: {
        pagination: true,
        paginationPageSize: 10,
        defaultColDef: {
          resizable: true,
          minWidth: 120,
        },
        rowHeight: 45, // Adjust row height for better readability
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
    exportToExcel() {
      if (!this.rowData || this.rowData.length === 0) {
        alert("No data available to export!");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(this.rowData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborated Database");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      this.saveAsExcelFile(excelBuffer, "collaborated_database");
    },
    saveAsExcelFile(buffer, fileName) {
      const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      FileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
    },
  },
};
</script>

<style>
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";

.custom-grid {
  width: 100%;
  height: auto;
  max-height: 600px; /* Cap the height for scrollability */
  border: 1px solid #e0e0e0;
  font-size: 14px; /* Adjust font size for better readability */
}

.ag-theme-alpine .ag-header {
  font-weight: bold;
  background-color: #f5f5f5; /* Light gray background for headers */
}

.ag-theme-alpine .ag-row {
  border-bottom: 1px solid #e0e0e0; /* Light gray border between rows */
}

.ag-theme-alpine .ag-row-hover {
  background-color: #f0f8ff; /* Light blue background on hover */
}

.ag-theme-alpine .ag-cell {
  padding: 8px;
}

.ag-theme-alpine .ag-paging-panel {
  background-color: #f5f5f5;
  padding: 8px;
  border-top: 1px solid #e0e0e0;
}
</style>
