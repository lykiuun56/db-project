<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Collaborated Database</h1>
        <v-btn color="primary" @click="exportToExcel">Export to Excel</v-btn> <!-- Button to trigger export -->
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
        {headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true},
        {headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true},
        {headerName: 'Tiktok_Url', field: 'tiktok_Url', sortable: true, filter: true, flex: 1.5},
        {headerName: 'Followers', field: 'followers', sortable: true, filter: true, flex: 1.5},
        {headerName: 'Full Name', field: 'full_name', sortable: true, filter: true, flex: 1.5},
        {headerName: 'Full Address', field: 'full_address', sortable: true, filter: true},
        {headerName: 'Email', field: 'email', sortable: true, filter: true},
        {headerName: 'Phone', field: 'phone', sortable: true, filter: true, flex: 1.5},
        {headerName: 'Is Blocked', field: 'is_blocked', sortable: true, filter: true, flex: 1.5},
        {headerName: 'Collaborated Time', field: 'collaborated_time', sortable: true, filter: true, flex: 1.5},
        {headerName: 'Notes', field: 'Notes', sortable: true, filter: true, flex: 1.5},
        {headerName: 'POC', field: 'poc', sortable: true, filter: true, flex: 1.5},
        {headerName: 'State', field: 'state', sortable: true, filter: true},
        {headerName: 'Categories', field: 'categories', sortable: true, filter: true}
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

.ag-theme-alpine {
  width: 100%;
  height: 400px;
}
</style>
