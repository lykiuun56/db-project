<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12"  >
        <h1 style="color: white">Total Database</h1>
      </v-col>
    </v-row>

    <!-- Dropdown Menus -->
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
            <v-list-item @click="blockSelected">
              <v-list-item-title>Block</v-list-item-title>
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
            <v-list-item @click="downloadTemplate">
              <v-list-item-title>Download Template</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>

      <!-- Actions Dropdown -->
      <v-col cols="auto">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="#4f1787" v-bind="props">
              Actions
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="showCBDForm">
              <v-list-item-title>Write To CBD</v-list-item-title>
            </v-list-item>
            <v-list-item @click="showMailchimpForm">
              <v-list-item-title>Send Mailchimp Email</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openSelectRandomDialog">
              <v-list-item-title>Select Random Creators</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-spacer></v-spacer>


      <!-- Download Template Button -->
      <v-col cols="auto">
        <v-btn color="#00b19e" @click="downloadTemplate" class="elevation-2">
          <v-icon left>mdi-file-download</v-icon>
          Template
        </v-btn>
      </v-col>

      <v-col cols ="auto">
        <v-btn color="#9f0000" @click="resetView" class="elevation-2">
          <v-icon left>mdi-refresh</v-icon>
          Reset
        </v-btn>
      </v-col>
    </v-row>

    <!-- AG Grid component -->
    <v-row>
      <v-col cols="12">
        <ag-grid-vue
            ref="agGrid"
            class="ag-theme-alpine-auto-dark"
            style="width: 100%; height: 600px;"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :sideBar="sideBar"
            :gridOptions="gridOptions"
            @grid-ready="onGridReady"
            :domLayout="'autoHeight'"
            @row-double-clicked="onRowDoubleClicked">
        </ag-grid-vue>
      </v-col>
    </v-row>

    <!-- Select Random Creators Dialog -->
    <v-dialog v-model="isSelectRandomDialogVisible" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Select Random Creators</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="selectRandomForm" @submit.prevent="submitSelectRandomForm">
            <v-container>
              <v-row>
                <!-- Input for Number of Rows -->
                <v-col cols="12">
                  <v-text-field
                      v-model="selectRandomNumber"
                      label="Number of Creators to Select"
                      type="number"
                      min="1"
                      required
                  />
                </v-col>
                <!-- Input for Project Name -->
                <v-col cols="12">
                  <v-text-field
                      v-model="selectRandomProjectName"
                      label="Project Name to Exclude"
                      required
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeSelectRandomDialog">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="submitSelectRandomForm">Select</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for Notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <v-btn color="white" text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>

    <!-- Loading Indicator -->
    <v-progress-linear v-if="isLoading" indeterminate color="primary"></v-progress-linear>

    <!-- Mailchimp Email Form Dialog -->
    <v-dialog v-model="isMailchimpDialogVisible" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Send Email via Mailchimp</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="mailchimpForm">
            <v-container>
              <v-row>
                <!-- Dropdown for Categories -->
                <v-col cols="12" sm="6">
                  <v-select v-model="mailchimpCategories" :items="categoriesList" label="Categories" required />
                </v-col>

                <!-- Input for Project Name -->
                <v-col cols="12" sm="6">
                  <v-text-field v-model="mailchimpProjectName" label="Project Name" required />
                </v-col>

                <!-- Input for POC -->
                <v-col cols="12" sm="6">
                  <v-text-field v-model="mailchimpPOC" label="POC" required />
                </v-col>

                <!-- Input for Subject Line -->
                <v-col cols="12" sm="6">
                  <v-text-field v-model="mailchimpSubject" label="Subject Line" required />
                </v-col>

                <!-- Template Dropdown -->
                <v-col cols="12" sm="6">
                  <v-select
                      v-if="mailchimpTemplates.length > 0"
                      v-model="selectedTemplateName"
                      :items="mailchimpTemplates"
                      label="Select Template"
                      required
                  />
                </v-col>

                <!-- Schedule time -->
                <v-col cols="12">
                  <v-text-field v-model="scheduledTime" label="Schedule Time" type="datetime-local" />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeMailchimpForm">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="submitMailchimpForm">Send Email</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- CollaboratedDB Form Dialog -->
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

                <!-- Dropdown for Categories -->
                <v-col cols="12" sm="6">
                  <v-select
                      v-model="categories"
                      :items="categoriesList"
                      label="Categories"
                      required
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

    <!-- Edit Dialog Component -->
    <edit-pop-out
        v-model="isEditDialogVisible"
        :rowData="selectedRow"
        :nonEditableFields="['id', 'handle_name', 'email', 'is_Blocked']"
        :isTDGrid="true"
        @save="onSaveEdit"
        @close="isEditDialogVisible = false" />

    <!-- Add Dialog Component -->
    <add-pop-out
        :visible="showAddForm"
        :title="'Add to Total Database'"
        :fields="fields"
        :formData="formData"
        :show-file-upload="true"
        @close="showAddForm = false"
        @save="submitAdd"
        @saveFile="submitFileAdd">
      <v-select
          v-model="formData.categories"
          :items="categoriesList"
          label="Categories"
          required
      />
    </add-pop-out>
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
// import 'ag-grid-enterprise';


export default {
  name: 'TotalDatabaseGrid',
  components: {
    EditPopOut,
    AgGridVue,
    AddPopOut,
  },
  data() {
    return {
      showAddForm: false,
      isCBDDialogVisible: false,
      poc: '',
      projectName: '',
      categories: '',
      scheduledTime: '',
      isMailchimpDialogVisible: false,
      mailchimpCategories: '',
      mailchimpProjectName: '',
      mailchimpPOC: '',
      mailchimpSubject: '',
      selectedTemplateName: '',  // Store the selected template name
      mailchimpTemplates: [],  // Store all template options
      categoriesList: [],  // For categories selection
      formData: {
        handle_name: '',
        followers: '',
        email: '',
      },
      fields: [
        { name: 'handle_name', label: 'Handle Name', required: true },
        { name: 'email', label: 'Email', required: true },
        { name: 'followers', label: 'Followers' },
        { name: 'categories', label: 'Categories', type: 'select', options: this.categoriesList },

      ],
      columnDefs: this.getColumnDefs(),
      rowData: null,
      gridOptions: this.getGridOptions(),
      selectedRow: null,
      isEditDialogVisible: false,
      fullRowData: [],
      sideBar: { // Sidebar Configuration Added
        toolPanels: [
          {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
          },
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
          },
        ],
        defaultToolPanel: 'filters', // Optional: Open Filters panel by default
        position: 'right',

      },
      // New data properties for Select Random Dialog
      isSelectRandomDialogVisible: false,
      selectRandomNumber: '',
      selectRandomProjectName: '',
      isLoading: false, // For loading indicator
      snackbar: { // For notifications
        show: false,
        message: '',
        color: 'success', // or 'error', etc.
      },
    };
  },
  created() {
    this.fetchCategories();
  },
  mounted() {
    this.fetchMailchimpTemplates();
  },
  methods: {
    showSnackbar(message, color = 'success') {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    async fetchCategories() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/collaborated_projects/partitionsList`);
        this.categoriesList = response.data;
        this.fields.find(field => field.name === 'categories').options = this.categoriesList; // Set options in the form
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    // Fetch Mailchimp templates for dropdown
    async fetchMailchimpTemplates() {
      try {
        // Fetch templates from the backend
        const response = await axios.get(`${apiBaseUrl}/api/total/templates`);

        // Since only names are returned, map them directly to the dropdown
        this.mailchimpTemplates = response.data;  // response.data is now just a list of names
      } catch (error) {
        console.error('Error fetching Mailchimp templates:', error);
      }
    },
    // Show Mailchimp email form dialog
    showMailchimpForm() {
      // Check if gridApi is available
      if (!this.gridApi) {
        console.error('Grid API is not available.');
        this.showSnackbar('Grid is not ready yet.', 'error');
        return;
      }

      const selectedNodes = this.gridApi.getSelectedNodes();
      if (selectedNodes.length === 1) {
        this.selectedRow = selectedNodes[0].data;
        this.isMailchimpDialogVisible = true;
      } else if (selectedNodes.length > 1) {
        this.showSnackbar('Please select only one row to send an email.', 'warning');
      } else {
        this.showSnackbar('Please select a row first.', 'warning');
      }
    },
    closeMailchimpForm() {
      this.isMailchimpDialogVisible = false;
    },

    // Submit the Mailchimp email form
    async submitMailchimpForm() {
      if (!this.mailchimpCategories || !this.mailchimpProjectName || !this.mailchimpPOC || !this.mailchimpSubject || !this.selectedTemplateName) {
        this.showSnackbar('Please fill in all the required fields.', 'error');
        return;
      }

      try {
        const { id } = this.selectedRow;  // Assuming each row has an 'id' field

        await axios.post(`${apiBaseUrl}/api/total/sendMailchimpEmail`, {
          totalDatabaseId: id,
          categories: this.mailchimpCategories,
          projectName: this.mailchimpProjectName,
          poc: this.mailchimpPOC,
          subject: this.mailchimpSubject,
          templateName: this.selectedTemplateName,
          scheduledTime: this.scheduledTime
        });

        this.showSnackbar('Email successfully scheduled.', 'success');
        this.closeMailchimpForm();
      } catch (error) {
        console.error('Error sending Mailchimp email:', error);
        this.showSnackbar('Failed to send email.', 'error');
      }
    },
    getColumnDefs() {
      return [
        {
          headerName: 'ID',
          field: 'id',
          sortable: true,
          filter: 'agNumberColumnFilter', // Number filter for ID
          checkboxSelection: true,
          headerCheckboxSelection: true,
          width: 100,
        },
        {
          headerName: 'Handle Name',
          field: 'handle_name',
          sortable: true,
          filter: 'agTextColumnFilter', // Text filter
        },
        {
          headerName: 'Followers',
          field: 'followers',
          sortable: true,
          filter: 'agNumberColumnFilter', // Number filter
        },
        {
          headerName: 'Email',
          field: 'email',
          sortable: true,
          filter: 'agTextColumnFilter', // Text filter
        },
        {
          headerName: 'Is Blocked',
          field: 'is_Blocked',
          sortable: true,
          filter: 'agSetColumnFilter', // Set filter for boolean values
          cellRenderer: params => (params.value ? 'Yes' : 'No'),
          width: 120,
        },
        {
          headerName: 'Categories',
          field: 'categories',
          sortable: true,
          filter: 'agSetColumnFilter', // Set filter for categorical data
        },
        // ... additional columns as needed ...
      ];
    },
    getGridOptions() {
      return {
        pagination: true,
        paginationPageSize: 10,
        defaultColDef: { resizable: true },
        autoHeight: true,
        rowSelection: 'multiple',
        // Enable multi-row selection via checkbox
        suppressRowClickSelection: true,
        // Other grid options as needed
        sideBar: this.sideBar,

      };
    },
    async onGridReady(params) {
      // Ensure APIs are set properly
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi || this.gridApi; // Fallback to gridApi if gridColumnApi is undefined

      console.log('Grid API:', this.gridApi);
      console.log('Grid Column API:', this.gridColumnApi);

      try {
        const response = await axios.get(`${apiBaseUrl}/api/total/all`, { withCredentials: true });
        console.log('API Response Data:', response.data);

        this.rowData = response.data;
        this.fullRowData = response.data;

        // Ensure the gridColumnApi (or gridApi) is defined before trying to auto-size columns
        if (this.gridColumnApi) {
          setTimeout(() => {
            this.autoSizeColumns();
          }, 100); // Adding a small delay to ensure grid is fully rendered
        } else {
          console.error('gridColumnApi is undefined. Cannot auto-size columns.');
        }
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        this.showSnackbar('Failed to fetch data from the server.', 'error');
      }
    },
    autoSizeColumns() {
      if (this.gridApi) {
        const allColumns = this.gridApi.getAllDisplayedColumns();
        if (allColumns && allColumns.length > 0) {
          const allColumnIds = allColumns.map(column => column.getColId());
          this.gridApi.autoSizeColumns(allColumnIds);
        } else {
          console.error('No columns found to auto-size.');
        }
      } else {
        console.error('Grid API is not available.');
      }
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
        this.showSnackbar('Record updated successfully.', 'success');
      } catch (error) {
        console.error('Error updating data:', error);
        this.showSnackbar('Failed to update the record.', 'error');
      } finally {
        this.isEditDialogVisible = false;
      }
    },
    async refreshGridData() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/total/all`);
        this.rowData = response.data;
        this.fullRowData = response.data; // Update fullRowData as well
      } catch (error) {
        console.error('Error refreshing data:', error);
        this.showSnackbar('Failed to refresh the data.', 'error');
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

      if (selectedData.length === 0) {
        this.showSnackbar('No rows selected for deletion.', 'warning');
        return;
      }

      if (!confirm(`Are you sure you want to delete ${selectedData.length} selected rows?`)) {
        return;
      }

      for (const data of selectedData) {
        try {
          const success = await deleteRecord(apiBaseUrl + '/api/total', data.id);
          if (success) {
            removeRecordFromGrid(this.gridApi, 'id', data.id);
          }
        } catch (error) {
          console.error(`Error deleting ID ${data.id}:`, error);
          this.showSnackbar(`Failed to delete ID ${data.id}.`, 'error');
        }
      }

      await this.refreshGridData();
      this.showSnackbar('Selected records have been deleted.', 'success');
    },

    async submitAdd(data) {
      // Handle the form submission
      try {
        const requiredFields = ['handle_name', 'email'];
        for (const field of requiredFields) {
          if (!data[field] || data[field].trim() === '') {
            this.showSnackbar(`Please fill out the required field: ${field.replace('_', ' ')}`, 'error');
            return;
          }
        }
        await axios.post(`${apiBaseUrl}/api/total/add`, data)
            .then(() => {
              this.refreshGridData();  // Refresh grid data after successful add
              this.showAddForm = false; // Close the form
              this.showSnackbar('Entry added successfully.', 'success');
            })
            .catch(error => {
              console.error('Error adding data:', error);
              this.showSnackbar('Failed to add entry.', 'error'); // Notify the user in case of an error
            });
      } catch (error) {
        console.error('Unexpected error:', error);
        this.showSnackbar('An unexpected error occurred.', 'error');
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
          this.showSnackbar('File uploaded successfully.', 'success');
        }).catch(error => {
          console.error('Error uploading file:', error);
          this.showSnackbar('Failed to upload file.', 'error');
        });
      } catch (error) {
        console.error('Unexpected error:', error);
        this.showSnackbar('An unexpected error occurred.', 'error');
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
          this.showSnackbar(`Failed to process ID ${data.id}.`, 'error');
        }
      }

      // Optionally refresh the grid or indicate success to the user
      await this.refreshGridData();
      this.showSnackbar('Selected users have been processed.', 'success');
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
        this.showSnackbar('Please select only one row to write to CBD.', 'warning');
      } else {
        this.showSnackbar('Please select a row first.', 'warning');
      }
    },
    closeCBDForm() {
      this.isCBDDialogVisible = false;
    },
    async submitCBDForm() {
      try {
        const { id } = this.selectedRow;
        await axios.post(`${apiBaseUrl}/api/collaborated/newCollaborated`, {
          id: id,
          poc: this.poc,
          projectName: this.projectName,
          categories: this.categories
        });
        this.showSnackbar('Successfully written to CollaboratedDB.', 'success');
      } catch (error) {
        console.error('Error writing to CollaboratedDB:', error);
        this.showSnackbar('Failed to write to CollaboratedDB.', 'error');
      } finally {
        this.closeCBDForm();
      }
    },

    // Select Random Creators: Updated with Project Name Exclusion
    async submitSelectRandomForm() {
      const numRows = parseInt(this.selectRandomNumber);
      const project_name = this.selectRandomProjectName.trim();

      // Input Validation
      if (isNaN(numRows) || numRows <= 0) {
        this.showSnackbar('Please enter a valid positive integer for the number of creators.', 'error');
        return;
      }

      if (project_name === '') {
        this.showSnackbar('Please enter a valid project name.', 'error');
        return;
      }

      try {
        this.isLoading = true; // Show loading indicator

        // Fetch user IDs who already have the specified project name
        const response = await axios.get(`${apiBaseUrl}/api/total_projects/users-with-project`, {
          params: { project_name },
        });

        const excludedUserIds = response.data; // Assuming it's an array of user IDs
        console.log('Excluded User IDs:', excludedUserIds);

        // Collect displayed nodes excluding the excluded users
        const eligibleNodes = [];
        this.gridApi.forEachNodeAfterFilterAndSort((node) => {
          if (!excludedUserIds.includes(node.data.id)) { // Adjust 'id' if different
            eligibleNodes.push(node);
          }
        });

        if (eligibleNodes.length === 0) {
          this.showSnackbar('No eligible users available for selection after excluding.', 'error');
          this.closeSelectRandomDialog();
          return;
        }

        if (numRows > eligibleNodes.length) {
          this.showSnackbar(`Only ${eligibleNodes.length} eligible rows are available after excluding.`, 'warning');
          this.selectRandomNumber = eligibleNodes.length; // Adjust to maximum available
        }

        const finalNumRows = Math.min(numRows, eligibleNodes.length);

        // Shuffle the eligible nodes using Fisher-Yates algorithm
        for (let i = eligibleNodes.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [eligibleNodes[i], eligibleNodes[j]] = [eligibleNodes[j], eligibleNodes[i]];
        }

        // Select the desired number of nodes
        const nodesToSelect = eligibleNodes.slice(0, finalNumRows);

        // Deselect all previously selected nodes
        this.gridApi.deselectAll();

        // Select the new nodes
        nodesToSelect.forEach((node) => node.setSelected(true));

        // Optionally, scroll to the first selected node
        if (nodesToSelect.length > 0) {
          this.gridApi.ensureIndexVisible(nodesToSelect[0].rowIndex, 'top');
        }

        // Select the nodes
        this.rowData = nodesToSelect.map(node => node.data);

        // Refresh the grid
        this.gridApi.setRowData(this.rowData);

        this.showSnackbar(`Selected ${finalNumRows} random creators excluding those already assigned to "${project_name}".`, 'success');

        // Close the dialog
        this.closeSelectRandomDialog();
      } catch (error) {
        console.error('Error during random selection:', error);
        this.showSnackbar('Failed to perform random selection. Please try again.', 'error');
      } finally {
        this.isLoading = false; // Hide loading indicator
      }
    },

    // Open the Select Random Dialog
    openSelectRandomDialog() {
      this.isSelectRandomDialogVisible = true;
    },

    // Close the Select Random Dialog
    closeSelectRandomDialog() {
      this.isSelectRandomDialogVisible = false;
      // Reset form data
      this.selectRandomNumber = '';
      this.selectRandomProjectName = '';
    },

    resetView() {
      this.rowData = this.fullRowData;
      this.gridApi.setRowData(this.rowData);
      // Optionally, clear filters and selections
      this.gridApi.setFilterModel(null);
      this.gridApi.deselectAll();
      this.showSnackbar('View has been reset.', 'info');
    }
  },
};
</script>

<style>
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";

/* AG Grid Custom Theme Adjustments */
.ag-theme-alpine-dark {
  width: 100%;
  height: 600px;
  background-color: transparent !important; /* Make grid background transparent */
  border: none !important; /* Remove grid border */
  box-shadow: none; /* Remove any default shadows */
}

.ag-theme-alpine-dark .ag-header {
  background-color: transparent !important; /* Transparent header background */
  color: #ffffff; /* Header text color */
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* Subtle border */
}

.ag-theme-alpine-dark .ag-header-cell {
  border: none; /* Remove default borders */
}

.ag-theme-alpine-dark .ag-cell {
  background-color: rgba(255, 255, 255, 0.05) !important; /* Slight transparent cell background */
  color: #e0e0e0; /* Cell text color */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* Subtle cell border */
}

.ag-theme-alpine-dark .ag-row:hover {
  background-color: rgba(0, 0, 0, 0.2) !important; /* Hover effect */
}

.ag-theme-alpine-dark .ag-row-selected {
  background-color: rgba(100, 181, 246, 0.3) !important; /* Selected row background */
  color: #ffffff; /* Selected row text color */
}

.ag-theme-alpine-dark .ag-root-wrapper {
  background-color: transparent !important; /* Transparent wrapper */
}

.ag-theme-alpine-dark .ag-icon {
  fill: #ffffff; /* White icons */
}

.ag-theme-alpine-dark .ag-row, .ag-cell {
  border: none !important; /* Remove default cell borders */
}

.ag-theme-alpine-dark .ag-ltr .ag-header-cell, .ag-theme-alpine-dark .ag-header {
  border-right: none !important; /* Remove right header border */
}

/* Customize scrollbar */
.ag-theme-alpine-dark .ag-body-horizontal-scroll {
  background-color: rgba(255, 255, 255, 0.1);
}

.ag-theme-alpine-dark .ag-body-horizontal-scroll .ag-horizontal-scroll-viewport::-webkit-scrollbar {
  height: 8px;
}

.ag-theme-alpine-dark .ag-body-horizontal-scroll .ag-horizontal-scroll-viewport::-webkit-scrollbar-track {
  background: transparent;
}

.ag-theme-alpine-dark .ag-body-horizontal-scroll .ag-horizontal-scroll-viewport::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.ag-theme-alpine-dark .ag-body-horizontal-scroll .ag-horizontal-scroll-viewport::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}



/* Optional: Adjust button spacing */
.button-spacing {
  margin-right: 8px;
}
</style>
