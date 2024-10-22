<template>
    <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="12"  >
        <h1 style="color: white">Total Database</h1>
      </v-col>
    </v-row>

    <!-- Dropdown Menus -->
    <v-row class="mb-4">
      <!-- Data Management Dropdown -->
      <v-col cols="auto">
        <v-menu >
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
<!--            <v-list-item @click="showMailchimpForm">-->
<!--              <v-list-item-title>Send Mailchimp Email</v-list-item-title>-->
<!--            </v-list-item>-->
            <v-list-item @click="fetchScheduledCampaigns">
              <v-list-item-title>View Scheduled Campaigns</v-list-item-title>
            </v-list-item>
            <v-list-item @click="showTagForm">
              <v-list-item-title>Add Mailchimp Tag</v-list-item-title>
            </v-list-item>
            <v-list-item @click="showMailchimpForm">
              <v-list-item-title>Campaign</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openSelectRandomDialog">
              <v-list-item-title>Random Select</v-list-item-title>
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
            class="ag-theme-alpine-dark"
            style="width: 100%; height: 600px;"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :gridOptions="gridOptions"
            @grid-ready="onGridReady"
            :domLayout="'autoHeight'"
            rowSelection="multiple"
            @row-double-clicked="onRowDoubleClicked">
        </ag-grid-vue>
      </v-col>
    </v-row>

    <!-- Select Random Creators Dialog -->
    <v-dialog v-model="isSelectRandomDialogVisible" max-width="500px">
      <v-card color = "#222222">
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
      <v-card  color ="#222222">
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
                <v-col cols="12" sm="6">
                  <v-text-field v-model="mailchimpProjectName" label="Project Name" required />
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
      <v-card color="#222222">
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
      <v-card color ="#222222">
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
      <v-card color ="#222222">
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
        @save ="submitAdd"
        @saveToDB="submitAddToDB"
        @saveToBoth="submitAddToBoth"
        @saveFile="submitFileAdd"
        >
        <v-select
          v-model="formData.categories"
          :items="categoriesList"
          label="Categories"
          required
        />
    </add-pop-out>
      <persistent-alert
          :show="alert.show"
          :message="alert.message"
          :type="alert.type"
          :dismissible="alert.dismissible"
          @dismiss="dismissAlert"
      />

      <!-- Add this progress bar component -->
      <v-dialog v-model="showProgressBar" persistent max-width="300">
        <v-card>
          <v-card-text>
            Uploading file...
            <v-progress-linear
              :value="uploadProgress"
              color="primary"
              height="25"
            >
              <strong>{{ Math.ceil(uploadProgress) }}%</strong>
            </v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
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
import {mapState} from "vuex";
import PersistentAlert from "@/components/PersistentAlert.vue";

export default {
  name: 'TotalDatabaseGrid',
  components: {
    EditPopOut,
    AgGridVue,
    AddPopOut,
    PersistentAlert,
  },
  computed: {
    ...mapState({
      authToken: state => state.authToken, // Get token from Vuex state
      userPoc: state => state.userPoc,
    }),
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
      mailchimpPoc: '',
      mailchimpProjectName: '',
      selectedTemplateName: '',  // Store the selected template ID
      mailchimpTemplates: [],  // Store all template options
      selectedTag: '',
      mailchimpTags: [],
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
        { name: 'state', label: 'State'},

      ],
      columnDefs: this.getColumnDefs(),
      rowData: null,
      gridOptions: this.getGridOptions(),
      selectedRow: null,
      isEditDialogVisible: false,
      fullRowData: [],
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

      isScheduledCampaignsDialogVisible: false,
      campaignsList: [], // To store list of campaigns with subject_line and id
      selectedCampaign: null, // Store the selected campaign's id
      alert: {
        show: false,
        message: '',
        type: 'info',
      },
      showProgressBar: false,
      uploadProgress: 0,
      uploadedCount: 0,
      totalUploadCount: 0,
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
    showAlert(message, type = 'info') {
      this.alert = {
        show: true,
        message,
        type,
      };
    },
    dismissAlert() {
      this.alert.show = false;
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
        this.showAlert('Please fill in all the required fields.');
        return;
      }
      try {
        await axios.post(`${apiBaseUrl}/api/total/createCampaign`, {
          subject: this.mailchimpSubject,
          from_name :this.mailchimpFrom,
          reply_to: this.mailchimpReply,
          templateName: this.selectedTemplateName,
          tag: this.selectedTag,
          scheduledTime: this.scheduledTime,
          poc: this.userPoc,
          projectName : this.mailchimpProjectName,
        });
        this.showAlert('Tag successfully scheduled.');
        this.closeMailchimpForm();
      } catch (error) {
        console.error('Error sending Mailchimp Campaign:', error);
        this.showAlert('Failed to send Campaign Info.');
      }
    },

    // Opens the form to add a tag
    showTagForm() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      if (selectedNodes.length > 0) {
        this.selectedRows = selectedNodes.map(node => node.data); // Store all selected rows
        this.tagCategories = '';
        this.tagPoc = '';
        this.tagProjectName = '';
        this.isTagDialogVisible = true; // Show the dialog
      } else {
        this.showAlert('Please select at least one row to add a Mailchimp tag.');
      }
    },
    closeTagForm() {
      this.isTagDialogVisible = false;
    },
    async submitTagForm() {
      try {
        // Ensure the required fields are provided
        if (!this.tagCategories || !this.tagPoc || !this.tagProjectName) {
          this.showAlert('Please fill out all fields.');
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
          this.showAlert('Tags added successfully.');
          this.closeTagForm();
          this.refreshGridData();
        } else {
          this.showAlert('Failed to add tags.');
        }
      } catch (error) {
        console.error('Error submitting Mailchimp tags:', error);
        this.showAlert('Failed to submit tags.');
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
          this.showAlert('No scheduled campaigns found.');
        }
      } catch (error) {
        console.error('Error fetching scheduled campaigns:', error);
        this.showAlert('Failed to fetch scheduled campaigns.');
      }
    },

    async unscheduleCampaign() {
      if (!this.selectedCampaign) {
        this.showAlert('Please select a campaign to unschedule.');
        return;
      }
      try {
        await axios.post(`${apiBaseUrl}/api/total/campaigns/unschedule`, this.selectedCampaign);
        this.showAlert('Campaign unscheduled successfully.');
        this.closeScheduledCampaignsDialog();
      } catch (error) {
        console.error('Error unscheduling campaign:', error);
        this.showAlert('Failed to unschedule the campaign.');
      }
    },

    async deleteCampaign() {
      if (!this.selectedCampaign) {
        this.showAlert('Please select a campaign to delete.');
        return;
      }
      try {
        await axios.delete(`${apiBaseUrl}/api/total/campaigns/delete`, { data: this.selectedCampaign });
        this.showAlert('Campaign deleted successfully.');
        this.closeScheduledCampaignsDialog();
      } catch (error) {
        console.error('Error deleting campaign:', error);
        this.showAlert('Failed to delete the campaign.');
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
        // {
        //   headerName: 'ID',
        //   field: 'id',
        //   sortable: true,
        //   filter: 'agNumberColumnFilter', // Number filter for ID
        //   checkboxSelection: true,
        //   headerCheckboxSelection: true,
        //   width: 100,
        // },
        {
          headerName: 'Handle Name',
          field: 'handle_name',
          sortable: true,
          filter: 'agTextColumnFilter', // Text filter
          checkboxSelection: true,
          headerCheckboxSelection: true,
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
        { headerName: 'State', field: 'state', sortable: true, filter: true},
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
        suppressHorizontalScroll: true,

        onFirstDataRendered: params => {
          params.api.sizeColumnsToFit(); // Auto-fit columns to available width
        }
      };
    },

    async onGridReady(params) {
      // Ensure APIs are set properly
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi || this.gridApi; // Fallback to gridApi if gridColumnApi is undefined

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
        this.showAlert('Failed to fetch data from the server.', 'error');
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
        this.showAlert('Record updated successfully.', 'success');
      } catch (error) {
        console.error('Error updating data:', error);
        this.showAlert('Failed to update the record.', 'error');
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
        this.showAlert('Failed to refresh the data.', 'error');
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
        this.showAlert('No rows selected for deletion.', 'warning');
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
          this.showAlert(`Failed to delete ID ${data.id}.`, 'error');
        }
      }

      await this.refreshGridData();
      this.showAlert('Selected records have been deleted.', 'success');
    },

    async submitAdd(data) {
      // Handle the form submission
      try {
        const requiredFields = ['handle_name', 'email'];
        for (const field of requiredFields) {
          if (!data[field] || data[field].trim() === '') {
            this.showAlert(`Please fill out the required field: ${field.replace('_', ' ')}`, 'error');
            return;
          }
        }
        await axios.post(`${apiBaseUrl}/api/total/add`, data)
            .then(() => {
              this.refreshGridData();  // Refresh grid data after successful add
              this.showAddForm = false; // Close the form
              this.showAlert('Entry added successfully.', 'success');
            })
            .catch(error => {
              console.error('Error adding data:', error);
              this.showAlert('Failed to add entry.', 'error'); // Notify the user in case of an error
            });
      } catch (error) {
        console.error('Unexpected error:', error);
        this.showAlert('An unexpected error occurred.', 'error');
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
          this.showAlert('File added successfully.', 'success');
        }).catch(error => {
          console.error('Error uploading file:', error);
          this.showAlert('Failed to upload file.', 'error'); // Notify the user in case of an error
        });
      } catch (error) {
        console.error('Unexpected error:', error);
        this.showAlert('An unexpected error occurred.', 'error');
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

    // async submitAddToDB(dataOrFile, isFile = false) {
    //   try {
    //     if (isFile) {
    //       // If it's a file, handle the file submission
    //       const formData = new FormData();
    //       formData.append('file', dataOrFile); // Assuming `dataOrFile` is a file object

    //       await axios.post(`${apiBaseUrl}/api/total/addByFileToDB`, formData, {
    //         headers: {
    //           'Content-Type': 'multipart/form-data',
    //         },
    //       }).then(() => {
    //         this.refreshGridData();  // Refresh grid data after successful add
    //         this.showAddForm = false; // Close the form
    //         this.showSnackbar('File added to DB successfully.', 'success');
    //       }).catch(error => {
    //         console.error('Error adding file:', error);
    //         this.showSnackbar('Failed to add file.', 'error'); // Notify the user in case of an error
    //       });
    //     } else {
    //       // Handle the form submission for normal data
    //       const requiredFields = ['handle_name', 'email'];
    //       for (const field of requiredFields) {
    //         if (!dataOrFile[field] || dataOrFile[field].trim() === '') {
    //           this.showSnackbar(`Please fill out the required field: ${field.replace('_', ' ')}`, 'error');
    //           return;
    //         }
    //       }

    //       await axios.post(`${apiBaseUrl}/api/total/add`, dataOrFile)
    //           .then(() => {
    //             this.refreshGridData();  // Refresh grid data after successful add
    //             this.showAddForm = false; // Close the form
    //             this.showSnackbar('Entry added successfully.', 'success');
    //           }).catch(error => {
    //             console.error('Error adding data:', error);
    //             this.showSnackbar('Failed to add entry.', 'error'); // Notify the user in case of an error
    //           });
    //     }
    //   } catch (error) {
    //     console.error('Unexpected error:', error);
    //     this.showSnackbar('An unexpected error occurred.', 'error');
    //   }
    // },

    async submitAddToDB(dataOrFile, isFile = false) {
      try {
        if (isFile) {
          // Handle file submission
          const formData = dataOrFile;

          await axios.post(`${apiBaseUrl}/api/total/addByFileToDB`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then(() => {
            this.refreshGridData();  // Refresh grid data after successful add
            this.showAddForm = false; // Close the form
            this.showAlert('File added to DB successfully.', 'success');
          }).catch(error => {
            console.error('Error adding file:', error);
            this.showAlert('Failed to add file.', 'error');
          });
        } else {
          // Handle normal form submission
          const requiredFields = ['handle_name', 'email'];
          for (const field of requiredFields) {
            if (!dataOrFile[field] || dataOrFile[field].trim() === '') {
              this.showAlert(`Please fill out the required field: ${field.replace('_', ' ')}`, 'error');
              return;
            }
          }

          await axios.post(`${apiBaseUrl}/api/total/add`, dataOrFile)
            .then(() => {
              this.refreshGridData();  // Refresh grid data after successful add
              this.showAddForm = false; // Close the form
              this.showAlert('Entry added successfully.', 'success');
            }).catch(error => {
              console.error('Error adding data:', error);
              this.showAlert('Failed to add entry.', 'error');
            });
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        this.showAlert('An unexpected error occurred.', 'error');
      }
    },

    async submitAddToBoth(formData) {
      this.showProgressBar = true;
      this.uploadProgress = 0;
      this.uploadedCount = 0;
      this.totalUploadCount = 0;

      // Simulate gradual progress for fast uploads
      let simulatedProgress = 0;
      const progressInterval = setInterval(() => {
        simulatedProgress += 5;
        this.uploadProgress = Math.min(simulatedProgress, 90);
        if (simulatedProgress >= 90) clearInterval(progressInterval);
      }, 100);

      try {
        const response = await axios.post(`${apiBaseUrl}/api/total/addByFile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const actualProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              this.uploadProgress = Math.max(this.uploadProgress, Math.min(actualProgress, 90));
            }
          },
        });
        
        clearInterval(progressInterval);
        this.uploadProgress = 95; // Show processing state
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.uploadProgress = 100;
        
        this.totalUploadCount = response.data.totalCount || 0;
        this.uploadedCount = response.data.uploadedCount || 0;
        
        this.refreshGridData();
        this.showAddForm = false;
        
        const duplicates = response.data.duplicates;
        const blacklisted = response.data.blacklisted;
        let message = `File processed successfully. ${this.uploadedCount} entries were added.`;
        if (duplicates > 0) {
          message += ` ${duplicates} duplicate entries were found and skipped.`;
        }
        if (blacklisted > 0) {
          message += ` ${blacklisted} blacklisted emails were skipped.`;
        }
        this.showAlert(message, 'success');
      } catch (error) {
        console.error('Error uploading file:', error);
        this.showAlert('Failed to upload file.', 'error');
      } finally {
        clearInterval(progressInterval);
        setTimeout(() => {
          this.showProgressBar = false;
          this.uploadProgress = 0; // Reset progress
        }, 1000);
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
          this.showAlert(`Failed to process ID ${data.id}.`, 'error');
        }
      }
      // Optionally refresh the grid or indicate success to the user
      await this.refreshGridData();
      this.showAlert('Selected users have been processed.', 'success');
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
        this.showAlert('Please select only one row to write to CBD.', 'warning');
      } else {
        this.showAlert('Please select a row first.', 'warning');
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
        this.showAlert('Successfully written to CollaboratedDB.', 'success');
      } catch (error) {
        console.error('Error writing to CollaboratedDB:', error);
        this.showAlert('Failed to write to CollaboratedDB.', 'error');
      } finally {
        this.closeCBDForm();
      }
    },

    // Select Random Creators: Updated with Project Name Exclusion
    async submitSelectRandomForm() {
      const numRows = parseInt(this.selectRandomNumber);
      const projectName = this.selectRandomProjectName.trim();

      // Input Validation
      if (isNaN(numRows) || numRows <= 0) {
        this.showAlert('Please enter a valid positive integer for the number of creators.', 'error');
        return;
      }

      if (projectName === '') {
        this.showAlert('Please enter a valid project name.', 'error');
        return;
      }

      try {
        this.isLoading = true; // Show loading indicator

        // Fetch random eligible rows from the backend
        const response = await axios.post(`${apiBaseUrl}/api/total_projects/eligible-random`, {
          projectName,
          numRows,
        });

        const selectedRows = response.data; // Assuming it's an array of selected rows
        console.log('Selected Rows:', selectedRows);

        if (selectedRows.length === 0) {
          this.showAlert('No eligible users available for selection after excluding.', 'error');
          this.closeSelectRandomDialog();
          return;
        }

        // Deselect all previously selected nodes
        this.gridApi.deselectAll();

        // Update rowData and refresh grid with selected rows
        this.rowData = selectedRows;
        this.gridApi.applyTransaction({ update: this.rowData });

        this.showAlert(`Selected ${selectedRows.length} random creators excluding those already assigned to "${projectName}".`, 'success');

        // Close the dialog
        this.closeSelectRandomDialog();
      } catch (error) {
        console.error('Error during random selection:', error);
        this.showAlert('Failed to perform random selection. Please try again.', 'error');
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
      this.gridApi.applyTransaction({ update: this.rowData });
      // Optionally, clear filters and selections
      this.gridApi.setFilterModel(null);
      this.gridApi.deselectAll();
      this.showAlert('View has been reset.', 'info');
    }
  },
};
</script>

<style>
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";

/* AG Grid Custom Theme Adjustments */
.ag-theme-alpine-dark {
  --ag-background-color: transparent;
  --ag-odd-row-background-color: rgba(255, 255, 255, 0.05);
  --ag-header-background-color: rgba(0, 0, 0, 0.3);
  --ag-row-hover-color: rgba(255, 255, 255, 0.1);
  --ag-selected-row-background-color: rgba(0, 0, 0, 0.3);
  --ag-row-border-color: rgba(255, 255, 255, 0.1);
  --ag-cell-horizontal-border: none;

  width: 100%;
  height: 600px;
  color: #e0e0e0;
}

.ag-theme-alpine-dark .ag-root-wrapper {
  border: none;
}

.ag-theme-alpine-dark .ag-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.ag-theme-alpine-dark .ag-row {
  border-bottom: 1px solid var(--ag-row-border-color);
}

.ag-theme-alpine-dark .ag-row-selected {
  background-color: var(--ag-selected-row-background-color) !important;
}

.ag-theme-alpine-dark .ag-row:hover {
  background-color: var(--ag-row-hover-color) !important;
}

/* Customize scrollbar */
.ag-theme-alpine-dark ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.ag-theme-alpine-dark ::-webkit-scrollbar-track {
  background: transparent;
}

.ag-theme-alpine-dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.ag-theme-alpine-dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* Optional: Adjust button spacing */
.button-spacing {
  margin-right: 8px;
}
html, body {
  background-color: #121212; /* Dark background color */
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
.total-database-wrapper {
   background-color: #121212; /* Match the body background color */
   min-height: 100vh;
   width: 100%;
 }

/* Ensure Vuetify container doesn't add unwanted padding */
.v-container.pa-0 {
  padding: 0 !important;
}

/* Optional: If you want to add some padding inside the wrapper */
.total-database-wrapper .v-container {
  padding: 16px;
}

</style>


