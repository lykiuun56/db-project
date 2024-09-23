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
        <v-btn color="black" @click="blockSelected" class="button-spacing">Block</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" class="button-spacing" @click="downloadTemplate">Download Template</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="success" @click="showCBDForm" class="button-spacing">Write To CBD</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ag-grid-vue ref="agGrid" class="ag-theme-alpine" style="width: 100%; height: 600px;" :columnDefs="columnDefs"
          :rowData="rowData" :gridOptions="gridOptions" @grid-ready="onGridReady" :domLayout="'autoHeight'"
          @row-double-clicked="onRowDoubleClicked"></ag-grid-vue>
      </v-col>
    </v-row>

    <v-dialog v-model="isCBDDialogVisible" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Write To CollaboratedDB</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" v-for="(value, key) in selectedRow" :key="key">
                  <v-text-field 
                    v-model="selectedRow[key]" 
                    :label="key" 
                    readonly
                  />
                </v-col>

                <!-- Additional fields for POC and Project Name -->
                <v-col cols="12" sm="6">
                  <v-text-field 
                    v-model="poc" 
                    label="POC"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field 
                    v-model="projectName" 
                    label="Project Name"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeCBDForm">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="submitCBDForm">Write To CBD</v-btn>
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
      :title="'Add to Total Database'"
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
import axios from '@/axios';
import EditPopOut from '@/components/EditPopOut.vue';
import { apiBaseUrl } from '@/config';
import { exportToExcel } from '@/utils/exportUtils';
import { deleteRecord, removeRecordFromGrid } from '@/utils/deleteUtils';
import AddPopOut from '@/components/AddPopOut.vue';
import templateFile from '@/assets/td_template.xlsx';

export default {
  name: 'TotalDatabaseGrid',
  components: {
    EditPopOut,
    AgGridVue,
    AddPopOut
  },
  data() {
    return {
      showAddForm: false,

      isCBDDialogVisible: false,
      poc: '',
      projectName: '',
    
      formData: {
        handle_name: '',
        followers: '',
        email: '',
      },

      fields: [
        { name: 'handle_name', label: 'Handle Name', required: true },
        { name: 'email', label: 'Email', required: true},
        { name: 'followers', label: 'Followers' },
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
        { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true },
        { headerName: 'Followers', field: 'followers', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
        {
          headerName: 'Is Blocked',
          field: 'is_Blocked',
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: [true, false] },
          valueFormatter: params => (params.value ? 'Yes' : 'No'),
          width: 100,
          // sortable: true,
          // filter: true,
          // cellRenderer: (params) => params.value ? 'Yes' : 'No' // Correctly handling boolean values
        },
      ];

    },
    getGridOptions() {
      return {
        pagination: true,
        paginationPageSize: 10,
        defaultColDef: { resizable: true },
        autoHeight: true,
        rowSelection: 'multiple',
      };
    },
    async onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      try {
        const response = await axios.get(`${apiBaseUrl}/api/total/all`,{withCredentials: true});
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
    autoSizeColumns() {
      const allColumnIds = this.gridColumnApi.getAllColumns()
        .map(column => column.getColId());
      this.gridColumnApi.autoSizeColumns(allColumnIds, true);
    },
    onRowDoubleClicked(event) {
      this.selectedRow = event.data;
      // Remove the notes field
      delete this.selectedRow.notes;
      this.isEditDialogVisible = true;
    },
    async onSaveEdit(updatedData) {
      try {
        await axios.put(`${apiBaseUrl}/api/total/update/${updatedData.id}`, updatedData);
        this.refreshGridData();
      } catch (error) {
        console.error('Error updating data:', error);
      } finally {
        this.isEditDialogVisible = false;
      }
    },
    async refreshGridData() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/total/all`);
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

      exportToExcel(allDisplayedData, "total_Database_filtered");
    },
    exportSelectedToExcel() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      exportToExcel(selectedData, "total_Database_selected");
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
        const success = await deleteRecord(apiBaseUrl + '/api/total', data.id);
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
        await axios.post(`${apiBaseUrl}/api/total/add`, data)
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

    async submitFileAdd(formData) {
      try {
        await axios.post(`${apiBaseUrl}/api/total/addByFile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then(() => {
          this.refreshGridData();  // Refresh grid data after successful file upload
          this.showAddForm = false; // Close the form
        }).catch(error => {
          console.error('Error uploading file:', error);
          alert('Failed to upload file.');
        });
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    },

    downloadTemplate() {
      const link = document.createElement('a');
      link.href = templateFile;
      link.setAttribute('download', 'TotalDatabaseTemplate.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    async blockSelected() {
      // const selectedNodes = this.gridApi.getSelectedNodes();
      const visibleSelectedData = [];

      this.gridApi.forEachNodeAfterFilterAndSort((node) => {
        if (node.isSelected()) {
          visibleSelectedData.push(node.data);
        }
      });

      for (const data of visibleSelectedData) {
        try {
          if (data.is_Blocked) {
            // If the user is already blocked, delete them from the blacklist
            await axios.delete(`${apiBaseUrl}/api/black_list/delete/${data.id}`);
            console.log(`User with ID ${data.id} removed from blacklist.`);
          } else {
            // Otherwise, block the user
            await axios.post(`${apiBaseUrl}/api/black_list/add/${data.id}`);
            console.log(`User with ID ${data.id} blocked.`);
          }
        } catch (error) {
          console.error(`Error processing ID ${data.id}:`, error);
          alert(`Failed to process ID ${data.id}.`);
        }
      }

      // Optionally refresh the grid or indicate success to the user
      await this.refreshGridData();
      alert('Selected users have been processed.');
    },
    onRowSelected(event) {
      // Update selectedRow based on the last selected row
      this.selectedRow = event.node.data;
    },
    showCBDForm() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      if (selectedNodes.length === 1) {
        this.selectedRow = selectedNodes[0].data;
        this.isCBDDialogVisible = true;
      } else if (selectedNodes.length > 1) {
        alert('Please select only one row to write to CBD.');
      } else {
        alert('Please select a row first.');
      }
    },
    closeCBDForm() {
      this.isCBDDialogVisible = false;
    },
    async submitCBDForm() {
      try {
        const { id } = this.selectedRow;
        await axios.post(`${apiBaseUrl}/api/collaborated/newCollaborated/${id}/${this.poc}/${this.projectName}`);
        alert('Successfully written to CollaboratedDB.');
      } catch (error) {
        console.error('Error writing to CollaboratedDB:', error);
        alert('Failed to write to CollaboratedDB.');
      } finally {
        this.closeCBDForm();
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