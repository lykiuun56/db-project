<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Total Database</h1>
      </v-col>
    </v-row>
    <v-row>
      <!-- Action Buttons -->
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
        <v-btn color="primary" @click="downloadTemplate" class="button-spacing">Download Template</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="success" @click="showCBDForm" class="button-spacing">Write To CBD</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="success" @click="showMailchimpForm" class="button-spacing">Send Mailchimp Email</v-btn>
      </v-col>
      <v-col cols="auto">
        <!-- Updated to open the Select Random Dialog -->
        <v-btn color="primary" @click="openSelectRandomDialog" class="button-spacing">Select Random creators</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="resetView" class="button-spacing">Reset</v-btn>
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
                <!-- Tag Selection -->
                <v-col cols="12" sm="6">
                  <v-select
                    v-if="mailchimpTags.length > 0"
                    v-model="selectedTag"
                    :items="mailchimpTags"
                    label="Select Tag"
                    required
                  />
                </v-col>
                <!-- Schedule time -->
                <v-col cols="12">
                  <v-text-field v-model="scheduledTime" label="Schedule Time" type="datetime-local" />
                </v-col>
                
                <!-- Input for from_name -->
                <v-col cols="12" sm="6">
                  <v-text-field v-model="mailchimpFrom" label="From Name" required />
                </v-col>
                <!-- Input for reply_to -->
                <v-col cols="12" sm="6">
                  <v-text-field v-model="mailchimpReply" label="Reply To" required />
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

    <v-dialog v-model="isTagDialogVisible" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Mailchimp Tag</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row>
                <!-- Dropdown for Categories -->
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="tagCategories"
                    :items="categoriesList"
                    label="Categories"
                    required
                  />
                </v-col>
                <!-- POC Field -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="tagPoc"
                    label="POC"
                    required
                  />
                </v-col>
                <!-- Project Name Field -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="tagProjectName"
                    label="Project Name"
                    required
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeTagForm">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="submitTagForm">Submit Tag</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

    <!-- Scheduled Campaigns Dialog -->
    <v-dialog v-model="isScheduledCampaignsDialogVisible" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Scheduled Campaigns</span>
        </v-card-title>
        <v-card-text>
          <!-- Dropdown for listing scheduled campaigns -->
          <v-select
            v-model="selectedCampaign"
            :items="campaignsList"
            label="Select a Scheduled Campaign"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="deleteCampaign">Delete Campaign</v-btn>
          <v-btn color="blue darken-1" text @click="unscheduleCampaign">Unschedule Campaign</v-btn>
          <v-btn color="blue darken-1" text @click="closeScheduledCampaignsDialog">Close</v-btn>
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

    <!-- Add Dialog Component -->
    <add-pop-out
        :visible="showAddForm"
        :title="'Add to Total Database'"
        :fields="fields"
        :formData="formData"
        :show-file-upload="true"
        :forTotalDatabase="true"
        @close="showAddForm = false"
        @saveToDB="submitAddToDB"
        @saveToBoth="submitAddToBoth"
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
      isTagDialogVisible: false, // Dialog starts hidden
      tagCategories: '',
      tagPoc: '',
      tagProjectName: '',
      categoriesList: [], // Assuming you fetch this dynamically
      selectedRows: [],  // For categories selection
      isMailchimpDialogVisible: false,
      mailchimpSubject: '',
      mailchimpFrom: '',
      mailchimpReply: '',
      selectedTemplateName: '',  // Store the selected template ID
      mailchimpTemplates: [],  // Store all template options 
      selectedTag: '',
      mailchimpTags: [],
      isSelectRandomDialogVisible: false,  // Initial value for dialog visibility
      selectRandomNumber: '',           // Holds the number of creators to select
      selectRandomProjectName: '',      // Holds the project name to exclude
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

      isLoading: false, // For loading indicator
      snackbar: { // For notifications
        show: false,
        message: '',
        color: 'success', // or 'error', etc.
      },

      isScheduledCampaignsDialogVisible: false,
      campaignsList: [], // To store list of campaigns with subject_line and id
      selectedCampaign: null, // Store the selected campaign's id
    
    };
  },
  created() {
    this.fetchCategories();
    this.fetchMailchimpTemplates();
    this.fetchTags();
  },
  // mounted() {
  //   this.fetchMailchimpTemplates();
  // },
  methods: {
    showSnackbar(message, color = 'success') {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
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

    async fetchTags() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/total/tags`);
        this.mailchimpTags = response.data;
      } catch(error) {
        console.error('Error fetching Mailchimp tags:', error)
      }
    },

    // Show Mailchimp email form dialog
    showMailchimpForm() {  
      this.isMailchimpDialogVisible = true;   
    },
    closeMailchimpForm() {
      this.isMailchimpDialogVisible = false;
    },

    // Submit the Mailchimp email form
    async submitMailchimpForm() {
      if (!this.scheduledTime || !this.selectedTag|| !this.mailchimpSubject || !this.selectedTemplateName || !this.mailchimpFrom || !this.mailchimpReply) {
        alert('Please fill in all the required fields.');
        return;
      }
      try {
        await axios.post(`${apiBaseUrl}/api/total/createCampaign`, {
          subject: this.mailchimpSubject,
          from_name :this.mailchimpFrom,
          reply_to: this.mailchimpReply,
          templateName: this.selectedTemplateName,
          tag: this.selectedTag,
          scheduledTime: this.scheduledTime
        });

        alert('Tag successfully scheduled.');
        this.closeMailchimpForm();
      } catch (error) {
        console.error('Error sending Mailchimp Campaign:', error);
        alert('Failed to send Campaign Info.');
      }
    },

    // Opens the form to add a tag
    showTagForm() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      if (selectedNodes.length > 0) {
        this.selectedRows = selectedNodes.map(node => node.data); // Store all selected rows
        this.isTagDialogVisible = true; // Show the dialog
      } else {
        alert('Please select at least one row to add a Mailchimp tag.');
      }
    },
    closeTagForm() {
      this.isTagDialogVisible = false;
    },
    async submitTagForm() {
      try {
        // Ensure the required fields are provided
        if (!this.tagCategories || !this.tagPoc || !this.tagProjectName) {
          alert('Please fill out all fields.');
          return;
        }

        // Prepare payload for backend
        const totalDatabaseIds = this.selectedRows.map(row => row.id); // Array of selected IDs
        const payload = {
          totalDatabaseIds, // Send multiple IDs as array
          categories: this.tagCategories,
          poc: this.tagPoc,
          projectName: this.tagProjectName,
        };

        console.log('Payload:', payload); // Log payload to confirm structure before sending

        // Send POST request to backend
        const response = await axios.post(`${apiBaseUrl}/api/total/tag`, payload);

        if (response.data) {
          alert('Tags added successfully.');
          this.closeTagForm();
          this.refreshGridData();
        } else {
          alert('Failed to add tags.');
        }
      } catch (error) {
        console.error('Error submitting Mailchimp tags:', error);
        alert('Failed to submit tags.');
      }
    },


    // Fetch the list of scheduled campaigns
    async fetchScheduledCampaigns() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/total/campaigns`);
        if (response.data) {
          this.campaignsList = response.data; // response.data is now a list of subject lines
          this.isScheduledCampaignsDialogVisible = true; // Open the dialog
        } else {
          alert('No scheduled campaigns found.');
        }
      } catch (error) {
        console.error('Error fetching scheduled campaigns:', error);
        alert('Failed to fetch scheduled campaigns.');
      }
    },

    async unscheduleCampaign() {
      if (!this.selectedCampaign) {
        alert('Please select a campaign to unschedule.');
        return;
      }
      try {
        await axios.post(`${apiBaseUrl}/api/total/campaigns/unschedule`, this.selectedCampaign);
        alert('Campaign unscheduled successfully.');
        this.closeScheduledCampaignsDialog();
      } catch (error) {
        console.error('Error unscheduling campaign:', error);
        alert('Failed to unschedule the campaign.');
      }
    },

    async deleteCampaign() {
      if (!this.selectedCampaign) {
        alert('Please select a campaign to delete.');
        return;
      }
      try {
        await axios.delete(`${apiBaseUrl}/api/total/campaigns/delete`, { data: this.selectedCampaign });
        alert('Campaign deleted successfully.');
        this.closeScheduledCampaignsDialog();
      } catch (error) {
        console.error('Error deleting campaign:', error);
        alert('Failed to delete the campaign.');
      }
    },

    closeScheduledCampaignsDialog() {
      this.isScheduledCampaignsDialogVisible = false;
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
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: [true, false] },
          valueFormatter: params => (params.value ? 'Yes' : 'No'),
          width: 100,
        },
        { headerName: 'Categories', field: 'categories', sortable: true, filter: true},
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

    // async submitFileAdd(formData) {
    //   try {
    //     await axios.post(`${apiBaseUrl}/api/total/addByFile`, formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     }).then(() => {
    //       this.refreshGridData();  // Refresh grid data after successful file upload
    //       this.showAddForm = false; // Close the form
    //       console.log('Data Added')
    //     }).catch(error => {
    //       console.error('Error uploading file:', error);
    //       alert('Failed to upload file.');
    //     });
    //   } catch (error) {
    //     console.error('Unexpected error:', error);
    //   }
    // },

    async submitAddToDB(formData) {
      try {
        await axios.post(`${apiBaseUrl}/api/total/addByFileToDB`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then(() => {
          this.refreshGridData();  // Refresh grid data after successful add
          this.showAddForm = false; // Close the form
          console.log('Data Added to DB');
        }).catch(error => {
          console.error('Error adding data:', error);
          alert('Failed to add entry.');
        });
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    },

    async submitAddToBoth(formData) {
      try {
        await axios.post(`${apiBaseUrl}/api/total/addByFile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then(() => {
          this.refreshGridData();  // Refresh grid data after successful add
          this.showAddForm = false; // Close the form
          console.log('Data Added to Both DB and Mailchimp');
        }).catch(error => {
          console.error('Error adding data:', error);
          alert('Failed to add entry.');
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

.ag-theme-alpine {
  width: 100%;
  height: 600px;
}

/* Optional: Adjust button spacing */
.button-spacing {
  margin-right: 8px;
}
</style>
