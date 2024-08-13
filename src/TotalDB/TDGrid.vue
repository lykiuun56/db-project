<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Total Database</h1>
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
import { apiBaseUrl } from '@/config';

export default {
  name: 'TotalDatabaseGrid',
  components: {
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [
        { headerName: 'ID', field: 'id', sortable: true, filter: true, width: 70 },
        { headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true, flex: 2 },
        { headerName: 'Followers', field: 'followers', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'Email', field: 'email', sortable: true, filter: true, flex: 1 },
        {
          headerName: 'Is Blocked',
          field: 'is_Blocked',
          sortable: true,
          filter: true,
          flex: 2,
          cellRenderer: (params) => params.value ? 'Yes' : 'No' // Correctly handling boolean values
        },
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
        const response = await axios.get(`${apiBaseUrl}/api/total/all`);
        this.rowData = response.data;
        console.log(response.data)
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Total Database");

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
