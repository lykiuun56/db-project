<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Collaborated Database</h1>
        <!-- <v-btn color="primary" @click="exportToExcel">Export to Excel</v-btn> -->
        <!-- <v-btn color="primary" @click="exportAllToExcel" class="button-spacing">Export All to Excel</v-btn>
        <v-btn color="secondary" @click="exportSelectedToExcel" class="button-spacing">Export Selected to Excel</v-btn>
        <v-btn color="primary" @click="showAddForm = true" class="button-spacing">Add Entry</v-btn>
        <v-btn color="error" @click="deleteSelected" class="button-spacing">Delete Selected</v-btn> -->
      </v-col>
    </v-row>

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
        <v-btn color="black" class="button-spacing">Block</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" class="button-spacing" @click="downloadTemplate">Download Template</v-btn>
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
      :nonEditableFields="['id', 'handle_name', 'email', 'collaborated_times', 'is_Blocked']"
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
      @saveFile="submitFileAdd"
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
import templateFile from '@/assets/cbd_template.xlsx';

export default {
  name: 'CollaboratedDatabaseGrid',
  components: {
    AgGridVue,
    EditPopOut,
    AddPopOut
  },
  data() {
    return {
      showAddForm: false,
      formData: {
        email: '',
        handle_name: '',
        tiktok_url: '',
        followers: '',
        categories: '',
        full_name: '',
        state: '',
        full_address: '',
        phone: '',
        collaborated_times: '',
        notes: '',
        poc: '',
        project_name: '',
      },

      fields: [
        // { name: '', label: ''},
        { name: 'project_name', label: 'Project Name', required: true},
        { name: 'poc', label: 'POC', required: true},
        { name: 'handle_name', label: 'Handle Name', required: true },
        { name: 'tiktok_url', label: 'TikTok URL' },
        { name: 'followers', label: 'Followers' },
        { name: 'categories', label: 'Categories' },
        { name: 'full_name', label: 'Full Name' },
        { name: 'state', label: 'State' },
        { name: 'full_address', label: 'Full Address' },
        { name: 'email', label: 'Email', required: true},
        { name: 'phone', label: 'Phone' },
        { name: 'collaborated_times', label: 'Collaborated Times' },
        { name: 'notes', label: 'Notes' },
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
        { headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true },
        { headerName: 'Tiktok URL', field: 'tiktok_url', sortable: true, filter: true, width: 300 },
        { headerName: 'Followers', field: 'followers', sortable: true, filter: true },
        { headerName: 'Full Name', field: 'full_name', sortable: true, filter: true },
        { headerName: 'Full Address', field: 'full_address', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
        { headerName: 'Collaborated Time', field: 'collaborated_times', sortable: true, filter: true},
        { headerName: 'Notes', field: 'notes', sortable: true, filter: true },
        { headerName: 'POC', field: 'poc', sortable: true, filter: true },
        { headerName: 'State', field: 'state', sortable: true, filter: true },
        { headerName: 'Categories', field: 'categories', sortable: true, filter: true },
        {
          headerName: 'Is Blocked',
          field: 'is_Blocked',
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: [true, false] },
          valueFormatter: params => (params.value ? 'Yes' : 'No'),
          width: 100,
        }
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
        const response = await axios.get(`${apiBaseUrl}/api/collaborated/all`);
        this.rowData = response.data;

        this.gridApi.setDomLayout('autoHeight');
        this.autoSizeColumns();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    autoSizeColumns() {
      const allColumnIds = this.gridColumnApi.getAllColumns()
        .filter(column => column.getColId() !== 'tiktok_url')
        .map(column => column.getColId());

      this.gridColumnApi.autoSizeColumns(allColumnIds, true);
    },
    onRowDoubleClicked(event) {
      this.selectedRow = event.data;
      this.isEditDialogVisible = true;
    },
    async onSaveEdit(updatedData) {
      try {
        await axios.put(`${apiBaseUrl}/api/collaborated/update/${updatedData.id}`, updatedData);
        this.refreshGridData();
      } catch (error) {
        console.error('Error updating data:', error);
      } finally {
        this.isEditDialogVisible = false;
      }
    },
    async refreshGridData() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/collaborated/all`);
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

      exportToExcel(allDisplayedData, "collaborated_database_filtered");
    },
    exportSelectedToExcel() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      exportToExcel(selectedData, "collaborated_database_selected");
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
        const success = await deleteRecord(apiBaseUrl + '/api/collaborated', data.id);
        if (success) {
          removeRecordFromGrid(this.gridApi, 'id', data.id);

          await this.refreshGridData();
        }
      }
    },

    async submitAdd(data) {
      // Handle the form submission
      try {
        const requiredFields = ['project_name', 'poc', 'handle_name', 'email'];
        for (const field of requiredFields) {
          if (!data[field] || data[field].trim() === '') {
            alert(`Please fill out the required field: ${field.replace('_', ' ')}`);
            return;
          }
        }
        const projectName = data.project_name;
        const poc = data.poc;

        await axios.post(`${apiBaseUrl}/api/collaborated/add/${projectName}/${poc}`, data)
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
        await axios.post(`${apiBaseUrl}/api/collaborated/addByFile`, formData, {
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
      link.setAttribute('download', 'CollaboratedDatabaseTemplate.xlsx');
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
