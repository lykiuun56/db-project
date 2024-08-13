<template>
  <div class="ag-theme-alpine" style="height: 500px; width: 100%;">
    <ag-grid-vue
        class="ag-theme-alpine"
        style="width: 100%; height: 600px;"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :rowSelection="'multiple'"
        :animateRows="true"
        @grid-ready="onGridReady"
        :domLayout="'autoHeight'"
        :defaultColDef="defaultColDef"
        :pagination="true"
        :paginationPageSize="10"
        ref="grid"
    ></ag-grid-vue>
    <v-btn color="primary" @click="selectAllRows">Select All Rows</v-btn>
    <v-btn color="primary" @click="exportSelectedRows">Export Selected Rows</v-btn>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { apiBaseUrl } from '@/config';

export default {
  components: {
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [
        { headerName: 'Email', field: 'email', sortable: true, filter: true, width: 200 },
        { headerName: 'Anker', field: 'anker', sortable: true, filter: true, flex: 1.5, valueFormatter: this.dateFormatter },
        { headerName: 'ProjectB', field: 'projectB', sortable: true, filter: true, flex: 1.5, valueFormatter: this.dateFormatter },
        { headerName: 'ProjectC', field: 'projectC', sortable: true, filter: true, flex: 1.5, valueFormatter: this.dateFormatter },
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 150,
        resizable: true,
      },
      rowData: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
    },
    fetchData() {
      const query = this.$route.query;

      // Make the GET request to singleSearch endpoint with the required parameters
      axios.get(`${apiBaseUrl}/api/total_projects/singleSearch`, {
        params: {
          email: query.email,
        },
      })
          .then(response => {
            console.log('API Response:', response.data); // Log the API response
            this.rowData = response.data;
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },
    selectAllRows() {
      this.gridApi.selectAll();
    },
    exportSelectedRows() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);

      const worksheet = XLSX.utils.json_to_sheet(selectedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Rows');
      XLSX.writeFile(workbook, 'selected_rows.xlsx');
    }
  }
};
</script>

<style scoped>
.ag-theme-alpine {
  width: 100%;
  height: 500px;
}
</style>
