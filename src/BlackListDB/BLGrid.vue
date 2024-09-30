<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 style="color: white">Black List</h1>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <!-- Data Management Dropdown -->
      <v-col cols="auto">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="#4700cf" v-bind="props">
              Data Management
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="showAddForm = true">
              <v-list-item-title>Add</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteSelected">
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>

      <!-- Export Options Dropdown -->

      <v-col cols="auto">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="#33007D" v-bind="props">
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
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn color="#00b19e" @click="downloadTemplate" class="elevation-2">
          <v-icon left>mdi-file-download</v-icon>
          Template
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ag-grid-vue
            ref="agGrid"
            class="ag-theme-alpine-auto-dark"
            style="width: 100%; height: 600px;"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :gridOptions="gridOptions"
            @grid-ready="onGridReady"
            :domLayout="'autoHeight'"
            @row-double-clicked="onRowDoubleClicked"></ag-grid-vue>
      </v-col>
    </v-row>
    <edit-pop-out
        v-model="isEditDialogVisible"
        :rowData="selectedRow"
        @save="onSaveEdit"
        @close="isEditDialogVisible = false"
    />
    <add-pop-out
        :visible="showAddForm"
        :title="'Add to Black List'"
        :fields="fields"
        :formData="formData"
        @close="showAddForm = false"
        @save="submitAdd"
        @saveFile="submitFileAdd"
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
import AddPopOut from "@/components/AddPopOut.vue";
import templateFile from "@/assets/td_template.xlsx";

export default {
  name: 'BlackListGrid',
  components: {
    AddPopOut,
    EditPopOut,
    AgGridVue,
  },
  data() {
    return {

      showAddForm: false,

      formData: {
        handle_name: '',
        followers: '',
        email: '',
      },
      fields: [
        { name: 'handle_name', label: 'Handle Name', required: true },
        { name: 'email', label: 'Email', required: true},
      ],



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
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: [true, false] },
          valueFormatter: params => (params.value ? 'Yes' : 'No'),
          width: 100,
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
    },
    async submitAdd(data) {
      // Handle the form submission
      try {
        const requiredFields = ['handle_name', 'email'];
        for (const field of requiredFields) {
          if (!data[field] || data[field].trim() === '') {
            alert(`Please fill out the required field: ${field.replace('_', ' ')}`);
            return;
          }
        }
        await axios.post(`${apiBaseUrl}/api/black_list/addManual`, data)
            .then(() => {
              this.refreshGridData();  // Refresh grid data after successful add
              this.showAddForm = false; // Close the form
            })
            .catch(error => {
              console.error('Error adding data:', error);
              alert('Failed to add entry.'); // Notify the user in case of an error
            });
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    },
    downloadTemplate() {
      const link = document.createElement('a');
      link.href = templateFile;
      link.setAttribute('download', 'BlackListTemplate.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
