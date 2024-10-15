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

      <!-- Simple Search Button -->
      <v-col cols="auto">
        <v-btn color="#33007D" @click="showSimpleSearchDialog" class="elevation-2">
          <v-icon left>mdi-magnify</v-icon>
          Simple Search
        </v-btn>
      </v-col>

      <!-- Simple Search Dialog -->
      <v-dialog v-model="searchDialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Simple Search</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                      label="Handle Name"
                      v-model="searchHandleName"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      label="Email"
                      v-model="searchEmail"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="performSearch">Search</v-btn>
            <v-btn color="grey" @click="closeSearchDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
        {
          headerName: 'Handle Name',
          field: 'handle_name',
          sortable: true,
          filter: true,
          checkboxSelection: true,
          headerCheckboxSelection: true,
        },
        { headerName: 'Email', field: 'email', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'Categories', field: 'categories', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'Project Name', field: 'project_name', sortable: true, filter: true, flex: 1.5 },
        {
          headerName: 'Collaborated Times',
          field: 'collaborated_times',
          sortable: true,
          filter: true,
          flex: 1.5,
        },
      ],
      rowData: [],
      gridOptions: {
        pagination: true,
        paginationPageSize: 10,
        defaultColDef: {
          resizable: true,
          filter: true, // Ensure filtering is enabled
        },
        autoHeight: true,
      },
      selectedRow: null,
      // Dialog control
      searchDialog: false,
      searchHandleName: '',
      searchEmail: '',
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
        params.api.sizeColumnsToFit(); // Ensure columns fit the grid width
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    exportAllToExcel() {
      const allDisplayedData = [];
      this.gridApi.forEachNodeAfterFilterAndSort((node) => {
        allDisplayedData.push(node.data);
      });

      exportToExcel(allDisplayedData, 'collaborated_project_filtered');
    },
    exportSelectedToExcel() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map((node) => node.data);
      exportToExcel(selectedData, 'collaborated_project_selected');
    },
    // Methods for the Simple Search Dialog
    showSimpleSearchDialog() {
      // Reset search fields when dialog is opened
      this.searchHandleName = '';
      this.searchEmail = '';
      this.searchDialog = true;
    },
    closeSearchDialog() {
      this.searchDialog = false;
    },
    performSearch() {
      const filterModel = {};
      if (this.searchHandleName) {
        filterModel.handle_name = {
          type: 'contains',
          filter: this.searchHandleName,
        };
      }
      if (this.searchEmail) {
        filterModel.email = {
          type: 'contains',
          filter: this.searchEmail,
        };
      }
      this.gridApi.setFilterModel(filterModel);
      this.gridApi.onFilterChanged();
      this.closeSearchDialog();
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
