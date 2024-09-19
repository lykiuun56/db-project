<template>
  <v-container fluid>
    <v-row>
      <v-col cols="auto">
        <v-btn color="primary" @click="exportAllToExcel" class="button-spacing">Export All</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="secondary" @click="exportSelectedToExcel" class="button-spacing">Export Selected</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="showAddForm = true" class="button-spacing">Add</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="error" @click="deleteSelected" class="button-spacing">Delete</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="findMatchingEmails" class="button-spacing">Find Matching</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ag-grid-vue ref="agGrid" class="ag-theme-alpine" style="width: 100%; height: 600px;" :columnDefs="columnDefs"
                     :rowData="rowData" :gridOptions="gridOptions" @grid-ready="onGridReady" :domLayout="'autoHeight'"
                     @row-double-clicked="onRowDoubleClicked"></ag-grid-vue>
      </v-col>
    </v-row>


    <v-dialog v-model="isMatchingDialogVisible" max-width="800px">
      <v-card>
        <v-card-title>Matching Emails</v-card-title>
        <v-card-text>
          <ag-grid-vue
              ref="matchingGrid"
              class="ag-theme-alpine"
              style="width: 100%; height: 400px;"
              :columnDefs="matchingColumnDefs"
              :rowData="matchingEmails"
              :gridOptions="matchingGridOptions"
              @grid-ready="onMatchingGridReady"
          ></ag-grid-vue>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="isMatchingDialogVisible = false">Close</v-btn>
          <v-btn color="primary" @click="exportMatchingEmails" class="button-spacing">Export All</v-btn>
          <v-btn color="secondary" @click="exportMatchingSelectedToExcel" class="button-spacing">Export Selected</v-btn>



        </v-card-actions>
      </v-card>
    </v-dialog>

    <edit-pop-out
        v-model="isEditDialogVisible"
        :rowData="selectedRow"
        :nonEditableFields="['id', 'handle_name', 'email', 'is_Blocked']"
        :isTDGrid="true"
        @save="onSaveEdit"
        @close="isEditDialogVisible = false" />

    <add-pop-out
        :visible="showAddForm"
        :title="'Add to Management Database'"
        :fields="fields"
        :formData="formData"
        :show-file-upload="false"
        @close="showAddForm = false"
        @save="submitAdd"
    />

  </v-container>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import { apiBaseUrl } from '@/config';
import EditPopOut from "@/components/EditPopOut.vue";
import AddPopOut from "@/components/AddPopOut.vue";
import {exportToExcel} from "@/utils/exportUtils";
import {deleteRecord, removeRecordFromGrid} from "@/utils/deleteUtils";
// import templateFile from "@/assets/td_template.xlsx";

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

      isMatchingDialogVisible: false,


      formData: {
        id: '',
        emailEnding: '',
      },
      fields: [
        {name: 'id', label: 'ID', required: true},
        {name: 'emailEnding', label: 'Email Ending', required: true},
      ],
      columnDefs: this.getColumnDefs(),
      matchingColumnDefs: this.getMatchingColumnDefs(),
      rowData: null,
      gridOptions: this.getGridOptions(),
      matchingGridOptions: this.getGridOptions(), // Use the same grid options, or customize if needed
      selectedRow: null,
      isEditDialogVisible: false,
    };
  },
  methods: {
    getColumnDefs() {
      return [
        {
          headerName: 'ID',
          field: 'id',
          sortable: true,
          filter: true,
          checkboxSelection: true,
          headerCheckboxSelection: true
        },
        {headerName: 'Email Ending', field: 'emailEnding', sortable: true, filter: true},
      ];
    },
    getMatchingColumnDefs() {
      return [
        { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true },
        { headerName: 'Followers', field: 'followers', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
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
        setTimeout(() => {
          if (this.gridColumnApi) {
            this.autoSizeColumns();
          } else {
            console.error('gridColumnApi is undefined. Cannot auto-size columns.');
          }
        }, 100);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    onMatchingGridReady(params) {
      this.matchingGridApi = params.api;
      this.matchingGridColumnApi = params.columnApi;
      setTimeout(() => {
        if (this.matchingGridColumnApi) {
          this.autoSizeMatchingColumns();
        } else {
          console.error('matchingGridColumnApi is undefined. Cannot auto-size columns.');
        }
      }, 100);
    },
    autoSizeColumns() {
      const allColumnIds = this.gridColumnApi.getAllColumns()
          .map(column => column.getColId());
      this.gridColumnApi.autoSizeColumns(allColumnIds, true);
    },
    autoSizeMatchingColumns() {
      const allColumnIds = this.matchingGridColumnApi.getAllColumns()
          .map(column => column.getColId());
      this.matchingGridColumnApi.autoSizeColumns(allColumnIds, true);
    },
    onRowDoubleClicked(event) {
      this.selectedRow = event.data;
      // Remove the notes field
      delete this.selectedRow.notes;
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
      const allDisplayedData = [];
      this.gridApi.forEachNodeAfterFilterAndSort((node) => {
        allDisplayedData.push(node.data);
      });

      exportToExcel(allDisplayedData, "Management_Database_filtered");
    },
    exportMatchingEmails() {
      const allDisplayedData = [];
      this.matchingGridApi.forEachNodeAfterFilterAndSort((node) => {
        allDisplayedData.push(node.data);
      });

      exportToExcel(allDisplayedData, "Matching_Emails");
    },
    exportSelectedToExcel() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      exportToExcel(selectedData, "Management_Database_selected");
    },
    exportMatchingSelectedToExcel() {
      const selectedNodes = this.matchingGridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      exportToExcel(selectedData, "Matching_Emails_selected");
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
      // Handle the form submission
      try {
        const requiredFields = ['emailEnding'];
        for (const field of requiredFields) {
          if (!data[field] || data[field].trim() === '') {
            alert(`Please fill out the required field: ${field.replace('_', ' ')}`);
            return;
          }
        }
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
    async findMatchingEmails() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      if (selectedNodes.length === 0) {
        alert('Please select a row first.');
        return;
      }

      const selectedEmailEnding = selectedNodes[0].data.emailEnding;

      try {
        const response = await axios.get(`${apiBaseUrl}/api/management/findAllMatching/{emailEnding}`, {
          params: { emailEnding: selectedEmailEnding }
        });
        this.matchingEmails = response.data;
        this.isMatchingDialogVisible = true;
      } catch (error) {
        console.error('Error fetching matching emails:', error);
      }
    },
    // downloadTemplate() {
    //   const link = document.createElement('a');
    //   link.href = templateFile;
    //   link.setAttribute('download', 'TotalDatabaseTemplate.xlsx');
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // },


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
