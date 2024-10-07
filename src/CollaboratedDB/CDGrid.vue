<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 style="color: white">Collaborated Database</h1>
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
            <v-list-item @click="selectRandomRows">
              <v-list-item-title>Select Random Creators</v-list-item-title>
            </v-list-item>
            <v-list-item @click="showTagForm">
              <v-list-item-title>Add Mailchimp Tag</v-list-item-title>
            </v-list-item>
            <v-list-item @click="showMailchimpForm">
              <v-list-item-title>Campaign</v-list-item-title>
            </v-list-item>
            <v-list-item @click="fetchScheduledCampaigns">
              <v-list-item-title>View Scheduled Campaigns</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-spacer></v-spacer>




      <v-col cols="auto">
        <v-btn color="#00b19e" @click="showWishlistDialog" class="elevation-2">
          <v-icon left>mdi-heart</v-icon>
          Wishlist
        </v-btn>
      </v-col>
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



    <!-- Data Grid -->
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
            @row-double-clicked="onRowDoubleClicked"
        ></ag-grid-vue>
      </v-col>
    </v-row>
    <!-- Snackbar for Notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <v-btn color="white" text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>

    <!-- Loading Indicator -->
    <v-progress-linear v-if="isLoading" indeterminate color="primary"></v-progress-linear>


    <!-- Edit Dialog -->
    <edit-pop-out
        v-model="isEditDialogVisible"
        :rowData="selectedRow"
        :nonEditableFields="['id', 'handle_name', 'email', 'collaborated_times', 'categories', 'expired_date', 'is_Blocked']"
        @save="onSaveEdit"
        @close="isEditDialogVisible = false"
    />

    <!-- Add Dialog -->
    <add-pop-out
        :visible="showAddForm"
        :title="'Add to Collaborated Database'"
        :fields="fields"
        :formData="formData"
        :forCollaboratedDatabase="true"
        @close="showAddForm = false"
        @save="submitAdd"
        @saveToBoth="submitSaveToBoth"
        @saveFile="submitFileAdd"
    >
      <!-- Categories Dropdown -->
      <v-select
          v-model="formData.categories"
          :items="categoriesList"
          label="Categories"
          required
      />
    </add-pop-out>

    <v-dialog v-model="isWishlistDialogVisible" max-width="500px">
      <v-card color ="#222222">
        <v-card-title>Select Wishlist</v-card-title>
        <v-card-text>
          <div>
            <v-btn
                v-for="wishlist in userWishlists"
                :key="wishlist.id"
                @click="selectedWishlistId = wishlist.id"
                :color="selectedWishlistId === wishlist.id ? '#4700cf' : 'secondary'"
                class="ma-2"
                :style="{ color: selectedWishlistId === wishlist.id ? '#4700cf' : '#4700cf' }"

            >
              {{ wishlist.name }}
            </v-btn>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="confirmAddToWishlist">Add</v-btn>
          <v-btn @click="isWishlistDialogVisible = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog components for tags, campaigns, and scheduled campaigns -->
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

    <!-- Mailchimp Campaign Form -->
    <v-dialog v-model="isMailchimpDialogVisible" max-width="600px">
      <v-card color="#222222">
        <v-card-title>
          <span class="headline">Send Email via Mailchimp</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="mailchimpForm">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="mailchimpSubject" label="Subject Line" required />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-if="mailchimpTemplates.length > 0"
                    v-model="selectedTemplateName"
                    :items="mailchimpTemplates"
                    label="Select Template"
                    required
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-if="mailchimpTags.length > 0"
                    v-model="selectedTag"
                    :items="mailchimpTags"
                    label="Select Tag"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="scheduledTime" label="Schedule Time" type="datetime-local" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="mailchimpFrom" label="From Name" required />
                </v-col>
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

    <!-- Scheduled Campaigns Dialog -->
    <v-dialog v-model="isScheduledCampaignsDialogVisible" max-width="600px">
      <v-card color="#222222">
        <v-card-title>
          <span class="headline">Scheduled Campaigns</span>
        </v-card-title>
        <v-card-text>
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
import { mapGetters} from "vuex";

export default {
  name: 'CollaboratedDatabaseGrid',
  components: {
    AgGridVue,
    EditPopOut,
    AddPopOut,

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
        { name: 'categories', label: 'Categories', type: 'select', options: this.categoriesList },
        { name: 'full_name', label: 'Full Name' },
        { name: 'state', label: 'State' },
        { name: 'full_address', label: 'Full Address' },
        { name: 'email', label: 'Email', required: true},
        { name: 'phone', label: 'Phone' },
        { name: 'notes', label: 'Notes' },
        { name: 'linked', label: 'Linked'}
      ],

      categoriesList: [],
      columnDefs: this.getColumnDefs(),
      rowData: null,
      gridOptions: this.getGridOptions(),
      selectedRow: null,
      isEditDialogVisible: false,
      selectedRows: [],
      selectedWishlistId: null, // Holds the selected wishlist ID
      userWishlists: [], // Holds the list of user's wishlists
      isWishlistDialogVisible: false, // Controls the visibility of the wishlist selection dialog
      isLoading: false, // For loading indicator
      snackbar: { // For notifications
        show: false,
        message: '',
        color: 'success', // or 'error', etc.
      },
      fullRowData: [],
      selectedCampaign: null, 
      isScheduledCampaignsDialogVisible: false,
      isMailchimpDialogVisible: false,
      mailchimpSubject: '',
      mailchimpFrom: '',
      mailchimpReply: '',
      selectedTemplateName: '',  // Store the selected template ID
      mailchimpTemplates: [],  // Store all template options
      selectedTag: '',
      mailchimpTags: [],
      scheduledTime: '',
      isTagDialogVisible: false, // Dialog starts hidden
      tagCategories: '',
      tagPoc: '',
      tagProjectName: '',

    };
  },
  created() {
    this.fetchCategories();
    this.fetchUserWishlists();
    this.fetchMailchimpTemplates();
    this.fetchTags();

  },
  computed: {
    ...mapGetters(['getUserId']), // Map the getter from Vuex to get the userId
  },

  methods: {

    showSnackbar(message, color = 'success') {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    // Fetch categories from the backend
    async fetchCategories() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/collaborated_projects/partitionsList`);
        this.categoriesList = response.data; // Populate the list of categories from the response
        this.fields.find(field => field.name === 'categories').options = this.categoriesList; // Set options in the form
        console.log('Categories fetched:', this.categoriesList); // Log for debugging
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    showWishlistDialog() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      if (selectedNodes.length === 0) {
        this.showSnackbar("Please select at least one row to add to the wishlist.");
        return;
      }
      this.isWishlistDialogVisible = true;
    },

    async confirmAddToWishlist() {
      if (!this.selectedWishlistId) {
        this.showSnackbar("Please select a wishlist.");
        return;
      }

      const selectedNodes = this.gridApi.getSelectedNodes();
      const creatorIds = selectedNodes.map(node => node.data.id);

      if (creatorIds.length === 0) {
        this.showSnackbar("No creators selected.");
        return;
      }

      try {
        await axios.post(`${apiBaseUrl}/api/wishlists/${this.selectedWishlistId}/addCreators`, creatorIds);
        this.showSnackbar(`Successfully added ${creatorIds.length} creators to the wishlist!`);
        this.refreshGridData();
      } catch (error) {
        console.error('Error adding selected creators to wishlist:', error);
        this.showSnackbar('Failed to add selected creators to the wishlist.');
      } finally {
        this.isWishlistDialogVisible = false;
        this.selectedWishlistId = null;
      }
    },

    async fetchUserWishlists() {
      if (!this.getUserId) {
        console.error('User ID is not available.');
        this.showSnackbar('User ID is not available. Please log in again.');
        return;
      }
      try {
        const response = await axios.get(`${apiBaseUrl}/api/wishlists/user/${this.getUserId}`);
        if (Array.isArray(response.data)) {
          this.userWishlists = response.data
              .map(wishlist => ({
                id: wishlist.id,
                name: wishlist.name,
              }))
              .filter(wishlist => wishlist.id !== undefined && wishlist.name !== undefined);
        } else {
          console.error('Invalid data format for userWishlists:', response.data);
          this.userWishlists = [];
        }
      } catch (error) {
        console.error('Error fetching user wishlists:', error);
      }
    },

    getColumnDefs() {
      return [
        // {
        //   headerName: 'ID',
        //   field: 'id',
        //   sortable: true,
        //   filter: true,
        //   checkboxSelection: true,
        //   headerCheckboxSelection: true
        // },
        {headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true, checkboxSelection: true,
          headerCheckboxSelection: true},
        {headerName: 'Tiktok URL', field: 'tiktok_url', sortable: true, filter: true, width: 300},
        {headerName: 'Followers', field: 'followers', sortable: true, filter: true},
        {headerName: 'Full Name', field: 'full_name', sortable: true, filter: true},
        {headerName: 'Full Address', field: 'full_address', sortable: true, filter: true},
        {headerName: 'Email', field: 'email', sortable: true, filter: true},
        {headerName: 'Phone', field: 'phone', sortable: true, filter: true},
        {headerName: 'Collaborated Time', field: 'collaborated_times', sortable: true, filter: true},
        {headerName: 'Notes', field: 'notes', sortable: true, filter: true},
        {headerName: 'POC', field: 'poc', sortable: true, filter: true},
        {headerName: 'State', field: 'state', sortable: true, filter: true},
        {headerName: '最后合作种类', field: 'categories', sortable: true, filter: true},
        {
          headerName: 'Is Blocked',
          field: 'is_Blocked',
          width: 150,
          filter: true,
          editable: false, // Make the checkbox non-editable
          valueFormatter: params => params.value === null ? 'N/A' : (params.value ? 'Yes' : 'No'), // Handle null, true, and false
          cellRenderer: params => {
            const isChecked = params.value === true; // Set checked only if true
            return `<input type="checkbox" ${isChecked ? 'checked' : ''} disabled />`; // Checkbox, but disabled
          }
        },
        {
          headerName: 'Expired Date',
          field: 'expired_date',
          sortable: true,
          filter: true,
          valueFormatter: this.formatDateTime,  // Call the custom formatter
        },
        {
          headerName: 'Linked',
          field: 'linked',
          width: 150,
          filter: true,
          editable: false, // Make the checkbox non-editable
          valueFormatter: params => params.value === null ? 'N/A' : (params.value ? 'Yes' : 'No'), // Handle null, true, and false
          cellRenderer: params => {
            const isChecked = params.value === true; // Set checked only if true
            return `<input type="checkbox" ${isChecked ? 'checked' : ''} disabled />`; // Checkbox, but disabled
          }
        },
      ];
    },
    formatDateTime(params) {
      const dateValue = params.value;
      if (!dateValue) return '';

      // Create a new Date object from the string (ISO format)
      const dateObj = new Date(dateValue);

      // Manually format the date to 'yyyy-MM-dd HH:mm:ss'
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getSeconds()).padStart(2, '0');

      // Return formatted date string
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    getGridOptions() {
      return {
        pagination: true,
        paginationPageSize: 10,
        defaultColDef: {resizable: true},
        autoHeight: true,
        rowSelection: 'multiple',
        context: {
          addToWishlist: this.addToWishlist,
        },
        rowMultiSelectWithClick: true, // Add this line
      };
    },

    // Method to add a single creator to the selected wishlist
    async addToWishlist(rowData) {
      if (!this.getUserId) {
        this.showSnackbar('User ID is not available.');
        return;
      }

      if (!this.selectedWishlistId) {
        this.showSnackbar('Please select a wishlist first.');
        return;
      }

      const creatorId = rowData.id;

      try {
        await axios.post(`${apiBaseUrl}/api/wishlists/${this.selectedWishlistId}/addCreators`, [creatorId]);
        this.showSnackbar('Successfully added to wishlist!');
      } catch (error) {
        console.error('Error adding to wishlist', error);
        this.showSnackbar('Failed to add to wishlist.');
      }
    },


    async onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;

      try {
        const response = await axios.get(`${apiBaseUrl}/api/collaborated/all`);
        this.rowData = response.data;
        this.fullRowData = response.data; // Update fullRowData as well

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
        this.fullRowData = response.data; // Update fullRowData as well

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
            this.showSnackbar(`Please fill out the required field: ${field.replace('_', ' ')}`);
            return;
          }
        }
        const projectName = data.project_name;
        // const poc = data.poc;
        const payload = {
          data: data,
          projectName: projectName,
          // poc: poc
        };

        // await axios.post(`${apiBaseUrl}/api/collaborated/add/${projectName}/${poc}`, data)
        await axios.post(`${apiBaseUrl}/api/collaborated/add`, payload)
            .then(() => {
              this.refreshGridData();  // Refresh grid data after successful add
              this.showAddForm = false; // Close the form
            })
            .catch(error => {
              console.error('Error adding data:', error);
              this.showSnackbar('Failed to add entry.'); // Notify the user in case of an error
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
          this.showSnackbar('Failed to upload file.');
        });
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    },

    async submitSaveToBoth(formData) {
      try {
        await axios.post(`${apiBaseUrl}/api/collaborated/addByFileMailchimp`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then(() => {
          this.refreshGridData(); // Refresh grid data after successful file upload
          this.showAddForm = false; // Close the form
          this.showSnackbar('File uploaded and data added successfully to Mailchimp and Database.', 'success');
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
      link.setAttribute('download', 'CollaboratedDatabaseTemplate.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    selectRandomRows() {
      const numberOfRows = parseInt(prompt('Enter the number of rows to select:', '2000'));
      if (isNaN(numberOfRows) || numberOfRows <= 0) {
        this.showSnackbar('Please enter a valid positive integer.');
        return;
      }

      const allRows = this.rowData.slice(); // Copy the array to avoid mutating the original data

      // Shuffle the array using the Fisher-Yates algorithm
      for (let i = allRows.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allRows[i], allRows[j]] = [allRows[j], allRows[i]];
      }

      // Select the first N rows
      const selectedRowsData = allRows.slice(0, numberOfRows);

      // Map data to nodes and select them in the grid
      const selectedIds = new Set(selectedRowsData.map(row => row.id));
      this.gridApi.forEachNode((node) => {
        if (selectedIds.has(node.data.id)) {
          node.setSelected(true);
        }
      });
    },
    async addSelectedToWishlist() {
      if (!this.selectedWishlistId) {
        this.showSnackbar('Please select a wishlist to add creators.');
        return;
      }

      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      const creatorIds = selectedData.map(data => data.id);

      if (creatorIds.length === 0) {
        this.showSnackbar('Please select at least one creator to add.');
        return;
      }

      if (!confirm(`Are you sure you want to add ${creatorIds.length} creators to the selected wishlist?`)) {
        return;
      }

      try {
        await axios.post(`${apiBaseUrl}/api/wishlists/${this.selectedWishlistId}/addCreators`, creatorIds);
        this.showSnackbar('Successfully added selected creators to the wishlist!');
        this.refreshGridData(); // Optionally refresh data
      } catch (error) {
        console.error('Error adding selected creators to wishlist:', error);
        this.showSnackbar('Failed to add selected creators to the wishlist.');
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
        this.showSnackbar('Please fill in all the required fields.');
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

        this.showSnackbar('Tag successfully scheduled.');
        this.closeMailchimpForm();
      } catch (error) {
        console.error('Error sending Mailchimp Campaign:', error);
        this.showSnackbar('Failed to send Campaign Info.');
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
        this.showSnackbar('Please select at least one row to add a Mailchimp tag.');
      }
    },
    closeTagForm() {
      this.isTagDialogVisible = false;
    },
    async submitTagForm() {
      try {
        // Ensure the required fields are provided
        if (!this.tagCategories || !this.tagPoc || !this.tagProjectName) {
          this.showSnackbar('Please fill out all fields.');
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
          this.showSnackbar('Tags added successfully.');
          this.closeTagForm();
          this.refreshGridData();
        } else {
          this.showSnackbar('Failed to add tags.');
        }
      } catch (error) {
        console.error('Error submitting Mailchimp tags:', error);
        this.showSnackbar('Failed to submit tags.');
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
          this.showSnackbar('No scheduled campaigns found.');
        }
      } catch (error) {
        console.error('Error fetching scheduled campaigns:', error);
        this.showSnackbar('Failed to fetch scheduled campaigns.');
      }
    },

    async unscheduleCampaign() {
      if (!this.selectedCampaign) {
        this.showSnackbar('Please select a campaign to unschedule.');
        return;
      }
      try {
        await axios.post(`${apiBaseUrl}/api/total/campaigns/unschedule`, this.selectedCampaign);
        this.showSnackbar('Campaign unscheduled successfully.');
        this.closeScheduledCampaignsDialog();
      } catch (error) {
        console.error('Error unscheduling campaign:', error);
        this.showSnackbar('Failed to unschedule the campaign.');
      }
    },

    async deleteCampaign() {
      if (!this.selectedCampaign) {
        this.showSnackbar('Please select a campaign to delete.');
        return;
      }
      try {
        await axios.delete(`${apiBaseUrl}/api/total/campaigns/delete`, { data: this.selectedCampaign });
        this.showSnackbar('Campaign deleted successfully.');
        this.closeScheduledCampaignsDialog();
      } catch (error) {
        console.error('Error deleting campaign:', error);
        this.showSnackbar('Failed to delete the campaign.');
      }
    },

    closeScheduledCampaignsDialog() {
      this.isScheduledCampaignsDialogVisible = false;
    },

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

    resetView() {
      this.rowData = this.fullRowData;
      this.gridApi.applyTransaction({ update: this.rowData });
      // Optionally, clear filters and selections
      this.gridApi.setFilterModel(null);
      this.gridApi.deselectAll();
      this.showSnackbar('View has been reset.', 'info');
    }
  },
  mounted() {
    this.columnDefs = this.getColumnDefs();
    this.gridOptions = this.getGridOptions();
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







