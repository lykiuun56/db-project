<template>
  <div class="ag-theme-alpine" style="width: 100%;">
    <ag-grid-vue
        class="ag-theme-alpine-dark"
        style="width: 100%; height: 600px;"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :rowSelection="'multiple'"
        :animateRows="true"
        @grid-ready="onGridReady"
        :defaultColDef="defaultColDef"
        :pagination="true"
        :paginationPageSize="10"
        ref="grid"
    ></ag-grid-vue>
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
        { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true },
        { headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
        { headerName: 'Followers', field: 'followers', sortable: true, filter: true },
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
      rowData: []
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

      // Construct the search criteria list as an array
      const searchCriteriaList = [];

      if (query.handleName) {
        searchCriteriaList.push({key: 'handle_name', operation: ':', value: query.handleName});
      }
      if (query.email) {
        searchCriteriaList.push({key: 'email', operation: ':', value: query.email});
      }
      if (query.minFollowers && query.maxFollowers) {
        // Both min and max followers are provided
        searchCriteriaList.push({
          key: 'followers',
          operation: 'BETWEEN',
          value: query.minFollowers,
          secondValue: query.maxFollowers,
        });
      } else if (query.minFollowers !==null) {
        // Only min followers is provided
        searchCriteriaList.push({
          key: 'followers',
          operation: '>',
          value: query.minFollowers,
        });
      } else if (query.maxFollowers !== null) {
        // Only max followers is provided
        searchCriteriaList.push({
          key: 'followers',
          operation: '<',
          value: query.maxFollowers,
        });
      }
      if (query.is_Blocked !== undefined) {
        // Convert to boolean before sending
        searchCriteriaList.push({
          key: 'is_blocked',
          operation: ':',
          value: query.is_Blocked === 'true' || query.is_Blocked === true,
        });
      }

      axios.post(`${apiBaseUrl}/api/total/search`, searchCriteriaList)
          .then(response => {
            console.log('API Response:', response.data);
            this.rowData = response.data;
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
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
  height: 600px; /* Set a fixed height or adjust as needed */
}
</style>
