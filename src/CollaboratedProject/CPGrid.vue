<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 style="color: white">Collaborated Project</h1>
      </v-col>

      <!-- Export Options Dropdown -->
      <v-col cols="auto">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="#4700cf" v-bind="props">
              Export Options
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="exportAllToExcel">
              <v-list-item-title>Export All</v-list-item-title>
            </v-list-item>
            <v-list-item @click="exportSelectedToExcel">
              <v-list-item-title>Export Selected</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
            rowSelection="multiple"

        ></ag-grid-vue>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { apiBaseUrl } from '@/config';
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import { exportToExcel } from '@/utils/exportUtils';


export default {
  name: 'CollaboratedProjectGrid',
  components: {
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [
        // {headerName: 'Id', field: 'id', sortable: true, filer: true},
        { headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
        { headerName: 'Email', field: 'email', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'Categories', field: 'categories', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'Project Name', field: 'project_name', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'collaborated Times', field:'collaborated_times', sortable: true, filter: true, flex:1.5 }
      ],
      rowData: [],
      gridOptions: {
        pagination: true,
        paginationPageSize: 10,
        defaultColDef: {
          resizable: true,
        },
        autoHeight: true,

      },
      selectedRow: null,

    };
  },
  methods: {
    async onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      try {
        const response = await axios.get(`${apiBaseUrl}/api/collaborated_projects/all`);

        this.rowData = response.data;
        console.log(response.data);
        params.api.sizeColumnsToFit();  // Ensure columns fit the grid width
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    // dateFormatter(params) {
    //   const date = new Date(params.value);
    //   if (!isNaN(date.getTime())) {
    //     // Customize the date format as needed
    //     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    //   } else {
    //     return ''; // or some other placeholder
    //   }
    // },
    exportAllToExcel() {
      const allDisplayedData = [];
      this.gridApi.forEachNodeAfterFilterAndSort((node) => {
        allDisplayedData.push(node.data);
      });

      exportToExcel(allDisplayedData, "collaborated_project_filtered");
    },
    exportSelectedToExcel() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      exportToExcel(selectedData, "collaborated_project_selected");
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
