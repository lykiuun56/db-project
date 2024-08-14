<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Black List Database</h1>
        <v-btn color="primary" @click="exportAllToExcel">Export All to Excel</v-btn>
        <v-btn color="secondary" @click="exportSelectedToExcel">Export Selected to Excel</v-btn>
        <v-btn color="error" @click="deleteSelected">Delete Selected</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ag-grid-vue
            ref="agGrid"
            class="ag-theme-alpine"
            style="width: 100%; height: 600px;"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :gridOptions="gridOptions"
            @grid-ready="onGridReady"
            :domLayout="'autoHeight'"
            @row-double-clicked="onRowDoubleClicked"
        ></ag-grid-vue>
      </v-col>
    </v-row>
    <edit-pop-out
        v-model="isEditDialogVisible"
        :rowData="selectedRow"
        @save="onSaveEdit"
        @close="isEditDialogVisible = false"
    />
  </v-container>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import EditPopOut from '@/components/EditPopOut.vue';
import { apiBaseUrl } from '@/config';
import { exportToExcel } from '@/utils/exportUtils';
import { deleteRecord, removeRecordFromGrid } from '@/utils/deleteUtils';

export default {
  name: 'BlackListGrid',
  components: {
    EditPopOut,
    AgGridVue,
  },
  data() {
    return {
      columnDefs: this.getColumnDefs(),
      rowData: null,
      gridOptions: this.getGridOptions(),
      selectedRow: null,
      isEditDialogVisible: false,
    };
  },
  methods: {
    getColumnDefs() {
      return [
        {headerName: 'ID', field: 'id', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
        {headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true},
        {headerName: 'Followers', field: 'followers', sortable: true, filter: true},
        {headerName: 'Email', field: 'email', sortable: true, filter: true},
        {
          headerName: 'Is Blocked',
          field: 'is_Blocked',
          sortable: true,
          filter: true,
          cellRenderer: (params) => params.value ? 'Yes' : 'No' // Correctly handling boolean values
        },
      ];

    },
    getGridOptions() {
      return {
        pagination: true,
        paginationPageSize: 10,
        defaultColDef: {resizable: true},
        autoHeight: true,
        rowSelection: 'multiple',
      };
    },
    async onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      try {
        const response = await axios.get(`${apiBaseUrl}/api/black_list/all`);
        this.rowData = response.data;
        this.gridApi.setDomLayout('autoHeight');
        this.autoSizeColumns();
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    autoSizeColumns() {
      const allColumnIds = this.gridColumnApi.getAllColumns()
          .map(column => column.getColId());
      this.gridColumnApi.autoSizeColumns(allColumnIds, true);
    },
    onRowDoubleClicked(event) {
      this.selectedRow = event.data;
      this.isEditDialogVisible = true;
    },
    async onSaveEdit(updatedData) {
      try {
        await axios.put(`${apiBaseUrl}/api/black_list/update/${updatedData.id}`, updatedData);
        this.refreshGridData();
      } catch (error) {
        console.error('Error updating data:', error);
      } finally {
        this.isEditDialogVisible = false;
      }
    },
    async refreshGridData() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/black_list/all`);
        this.rowData = response.data;
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    },
    exportAllToExcel() {
      const allDisplayedData = [];
      this.gridApi.forEachNodeAfterFilterAndSort((node) => {
        allDisplayedData.push(node.data);
      });

      exportToExcel(allDisplayedData, "Black_List_filtered");
    },
    exportSelectedToExcel() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      exportToExcel(selectedData, "Black_List_selected");
    },
    async deleteSelected() {
      const selectedNodes = [];
      this.gridApi.forEachNodeAfterFilterAndSort((node) => {
        if (node.isSelected()) {
          selectedNodes.push(node);
        }
      });

      const selectedData = selectedNodes.map(node => node.data);

      for (const data of selectedData) {
        const success = await deleteRecord(apiBaseUrl + '/api/black_list', data.id);
        if (success) {
          removeRecordFromGrid(this.gridApi, 'id', data.id);

          await this.refreshGridData();
        }
      }
    }
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
