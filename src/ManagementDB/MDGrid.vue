<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Management Email Endings</h1>
        <v-btn color="primary" @click="exportAllToExcel">Export All to Excel</v-btn>
        <v-btn color="secondary" @click="exportSelectedToExcel">Export Selected to Excel</v-btn>
        <v-btn color="primary" @click="showAddForm = true">Add Entry</v-btn>
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
    <add-pop-out
        :visible="showAddForm"
        :title="'Add to Collaborated Database'"
        :fields="fields"
        :formData="formData"
        @close="showAddForm = false"
        @save="submitAdd"
    />



  </v-container>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import EditPopOut from '@/components/EditPopOut.vue';
import AddPopOut from '@/components/AddPopOut.vue';
import { apiBaseUrl } from '@/config';
import { exportToExcel } from '@/utils/exportUtils';
import { deleteRecord, removeRecordFromGrid } from '@/utils/deleteUtils';

export default {
  name: 'ManagementGrid',
  components: {
    AddPopOut,
    EditPopOut,
    AgGridVue,
  },
  data() {
    return {
      showAddForm: false,
      formData: {
        id: '',
        emailEnding: ''
      },
      fields: [
        {name: 'id', label: 'ID',},
        {name: 'emailEnding', label: 'Email Ending', required: true},
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
        { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true, headerCheckboxSelection: true},
        {headerName: 'Email Ending', field: 'emailEnding', sortable: true, filter: true, flex: 1.5},

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
        const response = await axios.get(`${apiBaseUrl}/api/management/all`);
        this.rowData = response.data;

        this.gridApi.setDomLayout('autoHeight');
        this.autoSizeColumns();
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
        await axios.put(`${apiBaseUrl}/api/management/update/${updatedData.id}`, updatedData);
        this.refreshGridData();
      } catch (error) {
        console.error('Error updating data:', error);
      } finally {
        this.isEditDialogVisible = false;
      }
    },
    async refreshGridData() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/management/all`);
        this.rowData = response.data;
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    },
    exportAllToExcel() {
      // exportToExcel(this.rowData, "collaborated_database_all");
      const allDisplayedData = [];
      this.gridApi.forEachNodeAfterFilterAndSort((node) => {
        allDisplayedData.push(node.data);
      });

      exportToExcel(allDisplayedData, "management_database_filtered");
    },
    exportSelectedToExcel() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      exportToExcel(selectedData, "management_database_selected");
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
        const success = await deleteRecord(apiBaseUrl + '/api/management', data.id);
        if (success) {
          removeRecordFromGrid(this.gridApi, 'id', data.id);

          await this.refreshGridData();
        }
      }
    },

    async submitAdd(data) {
      try {
        const requiredFields = ['emailEnding'];
        for (const field of requiredFields) {
          if (!data[field] || data[field].trim() === '') {
            alert(`Please fill out the required field: ${field.replace('_', ' ')}`);
            return;
          }
        }
        // const emailEnding = data.emailEnding;

        console.log("Submitting Data: ", data);
        console.log("Endpoint: ", `${apiBaseUrl}/api/management/add`);

        await axios.post(`${apiBaseUrl}/api/management/add`, data)
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
