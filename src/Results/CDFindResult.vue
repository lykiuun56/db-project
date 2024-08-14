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
        :enableRangeSelection="true"
        :enableClipboard="true"
        :clipboardDeliminator="','"
        :suppressClickEdit="true"
        :enterMovesDownAfterEdit="true"
        :editType="'fullRow'"
        :paginationPageSizeSelector="[10, 20, 50]"
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
        { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true, width: 80 },
        { headerName: 'HandleName', field: 'handle_name', sortable: true, filter: true, minWidth: 150 },
        { headerName: 'Tiktok URL', field: 'tiktok_url', sortable: true, filter: true, minWidth: 200 },  // Ensure field name matches the backend response
        { headerName: 'Followers', field: 'followers', sortable: true, filter: true, width: 100 },
        { headerName: 'Full Name', field: 'full_name', sortable: true, filter: true, minWidth: 150 },
        { headerName: 'Full Address', field: 'full_address', sortable: true, filter: true, minWidth: 200 },
        { headerName: 'Email', field: 'email', sortable: true, filter: true, minWidth: 200 },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true, width: 150 },
        { headerName: 'Collaborated Time', field: 'collaborated_times', sortable: true, filter: true, width: 150 },
        { headerName: 'Notes', field: 'notes', sortable: true, filter: true, minWidth: 150 },  // Ensure field name is correct (e.g., lowercase 'n' if that's how it's stored)
        { headerName: 'POC', field: 'poc', sortable: true, filter: true, minWidth: 150 },
        { headerName: 'State', field: 'state', sortable: true, filter: true, width: 100 },
        { headerName: 'Categories', field: 'categories', sortable: true, filter: true, minWidth: 150 },
        {
          headerName: 'Is Blocked',
          field: 'is_blocked',
          editable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: [true, false],
          },
          valueFormatter: params => (params.value ? 'Yes' : 'No'),  // Formatting the boolean value for better readability
          width: 100,
        }
      ],

      defaultColDef: {
        flex: 1,
        minWidth: 150,
        resizable: true,
        editable: true,
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
      if (query.state) {
        searchCriteriaList.push({key: 'state', operation: ':', value: query.state});
      }
      if (query.minFollowers && query.maxFollowers) {
        // Both min and max followers are provided
        searchCriteriaList.push({
          key: 'followers',
          operation: 'BETWEEN',
          value: query.minFollowers,
          secondValue: query.maxFollowers,
        });
      } else if (query.minFollowers !== null) {
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
      if (query.selectedCategories) {
        const categoriesArray = query.selectedCategories.split(',');
        categoriesArray.forEach(category => {
          searchCriteriaList.push({key: 'categories', operation: ':', value: category});
        });
      }

      axios.post(`${apiBaseUrl}/api/collaborated/search`, searchCriteriaList)
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
  height: 500px; /* Set a fixed height or adjust as needed */
}
</style>
