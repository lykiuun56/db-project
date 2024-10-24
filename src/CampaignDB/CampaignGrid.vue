<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="8">
        <v-row align="center" class="mb-4">
          <v-col cols="auto">
            <v-menu v-model="menu" :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="campaign-selector min-width-button"
                  variant="outlined"
                  :color="selectedCampaign ? 'primary' : 'grey-lighten-1'"
                  size="large"
                >
                  {{ selectedCampaign ? selectedCampaign.name : 'Select Campaign' }}
                </v-btn>
                <v-btn
                    icon
                    color="primary"
                    @click="showCreateCampaignDialog"
                    class="ml-2"
                ><v-icon>mdi-plus</v-icon>
                </v-btn>  
                <v-btn
                  icon
                  color="error"
                  @click="deleteCampaign"
                  class="ml-2"
                  :disabled="!selectedCampaign"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="campaign in campaigns"
                  :key="campaign.id"
                  @click="selectCampaign(campaign)"
                >
                  <v-list-item-title>{{ campaign.name }}</v-list-item-title>
                </v-list-item>
                
              </v-list>
            </v-menu>
          </v-col>
          
        </v-row>
        <v-spacer></v-spacer>
        
        <v-row>
          <v-col cols="auto">
            <v-btn-group>
              <v-btn color="primary" @click="openAddEntryDialog" :disabled="!selectedCampaign">
                Add Entry
              </v-btn>
              <v-btn color="primary" @click="openFileUploadDialog" :disabled="!selectedCampaign">
                <v-icon>mdi-file-upload</v-icon>
                Upload Excel
              </v-btn>
            </v-btn-group>
          </v-col>
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

        <v-progress-linear v-if="isLoading" indeterminate color="primary"></v-progress-linear>
        <persistent-alert
          :show="alert.show"
          :message="alert.message"
          :type="alert.type"
          :dismissible="alert.dismissible"
          @dismiss="dismissAlert"
        />

        <!-- Create Campaign Dialog -->
        <v-dialog v-model="createCampaignDialog" max-width="500px">
          <v-card>
            <v-card-title>Create New Campaign</v-card-title>
            <v-card-text>
              <v-text-field v-model="newCampaignName" label="Campaign Name"></v-text-field>
              <v-text-field v-model="Target" label="target"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="createCampaignDialog = false">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="createCampaign">Create</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      
      <!-- New completion areas -->
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title style="color: red; font-size: 3.0em;" align="center">
            TARGET {{ completionCount || 0 }}/{{ selectedCampaign?.target || 0 }}
          </v-card-title>
          <v-card-text>
            <v-progress-linear
              :model-value="getCompletionPercentage"
              color="red"
              height="50"
            >
              <strong>{{ getCompletionPercentage }}%</strong>
            </v-progress-linear>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>POC Completions</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="pocData in pocCompletions" :key="pocData.poc">
                <v-list-item-title>{{ pocData.poc }}</v-list-item-title>
                <v-list-item-subtitle>
                  Completions: {{ pocData.completionCount }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <add-entry-dialog
      v-model="showAddEntryDialog"
      @submit="handleAddEntry"
    ></add-entry-dialog>

    <!-- Add this dialog for category input -->
    <v-dialog v-model="categoryDialog.show" max-width="500px">
      <v-card>
        <v-card-title>Enter Category</v-card-title>
        <v-card-text>
          <v-select
            v-model="categoryDialog.selectedCategory"
            :items="categoryOptions"
            label="Select Category"
            required
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="cancelCompletionUpdate">Cancel</v-btn>
          <v-btn color="primary" @click="confirmCompletionUpdate">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <edit-pop-out
    v-model="showEditDialog"
    :row-data="editEntry"
    :non-editable-fields="['id', 'campaign_id']"
    @close="closeEditDialog"
    @save="handleEditEntry"
  />

    <!-- Add file upload dialog -->
    <v-dialog v-model="showFileUploadDialog" max-width="500px">
      <v-card>
        <v-card-title>Upload Entries from Excel</v-card-title>
        <v-card-text>
          <v-alert
            v-if="fileError"
            type="error"
            class="mb-4"
            dismissible
            @click="fileError = ''"
          >
            {{ fileError }}
          </v-alert>
          
          <v-file-input
            v-model="selectedFile"
            accept=".xlsx,.xls"
            label="Upload Excel File"
            prepend-icon="mdi-file-excel"
            :error-messages="fileError"
            @change="handleFileChange"
          ></v-file-input>

        
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeFileUploadDialog">Cancel</v-btn>
          <v-btn 
            color="primary" 
            @click="uploadFile"
            :loading="isUploading"
            :disabled="isUploading || !selectedFile"
          >
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { apiBaseUrl } from '@/config';
import axios from 'axios';
import { AgGridVue } from "ag-grid-vue3";
import PersistentAlert from "@/components/PersistentAlert.vue";
import AddEntryDialog from '@/components/AddEntryDialog.vue';

import EditPopOut from '@/components/EditPopOut.vue';
export default {
  name: 'CampaignGrid',
  components: {
    PersistentAlert,
    AgGridVue,
    AddEntryDialog,
    EditPopOut,
  },
  data() {
    return {
      columnDefs: [
        { 
          headerName: 'Handle Name', 
          field: 'handleName',  // Make sure this matches exactly with your API response
          // or use valueGetter if the field name is different
          valueGetter: (params) => {
            return params.data.handleName || params.data.handle_name || '';
          },
          sortable: true, 
          filter: true,
          checkboxSelection: true,
          headerCheckboxSelection: true
        },
        { headerName: 'Email', field: 'email', sortable: true, filter: true,},
        { headerName: 'Tiktok Url', field: 'tiktokUrl', sortable: true, filter: true},
        { headerName: 'Status', field: 'status', sortable: true, filter: true,},
        { headerName: 'Poc', field: 'poc', sortable: true, filter: true,},
        { headerName: 'NYC Schedule Date', field: 'nycScheduleDate', sortable: true, filter: true,},
        { headerName: 'Video Link', field: 'videoLink', sortable: true, filter: true,},
        { headerName: 'Attitude', field: 'attitude', sortable: true, filter: true,},
        { headerName: 'Price', field: 'price', sortable: true, filter: true,},
        { headerName: 'Note', field: 'note', sortable: true, filter: true,},
        { 
          headerName: 'Completion', 
          field: 'completion', 
          sortable: true, 
          filter: true,
          editable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ['true', 'false']
          },
          onCellValueChanged: params => this.handleCompletionChange(params)
        },
        { headerName: 'Type', field: 'type', sortable: true, filter: true},


      ],
      rowData: [],
      gridOptions: {
        pagination: true,
        paginationPageSize: 10,
        defaultColDef: {
          resizable: true,
        },
        autoHeight: true,

      },
      selectedRow: null,
      isLoading: false, // Loading state
      alert: {
        show: false,
        message: '',
        type: 'info',
      },
      campaigns: [],
      selectedCampaign: null,
      createCampaignDialog: false,
      newCampaignName: '',
      Target: 0,
      menu: false,
      completionCount: 0,
      pocCompletions: [],
      showAddEntryDialog: false,
      categoryDialog: {
        show: false,
        selectedCategory: null,
        pendingUpdate: null, // Will store the pending update data
      },
      categoryOptions: ['Electronics/3C',
                          'Apparel Clothing',
                          'Home & Living',
                          'Beauty & Personal Care',
                          'Toy & Games',
                          'Health & Wellness',
                          'Jewelry & Accessories',
                          'Outdoor & Gardening',
                          'Sports & Recreation',
                          'Arts & Crafts',
                          'Pets & Animal',
                          'Food & Beverage',
                          'Luggage & Baggs',
                          'Automative & Motorcycle',
                          'Mother & Baby',
                          'Family & Couple',
                          'Others',],
      showEditDialog: false,
      editEntry: {
        id: null,
        handleName: '',
        email: '',
        tiktokUrl: '',
        status: '',
        poc: '',
        price: null,
        note: '',
        completion: false,
        type: ''
      }, // Add your category options here
      showFileUploadDialog: false,
      selectedFile: null,
      fileError: '',
      isUploading: false,
    };
  },
  computed: {
    getCompletionPercentage() {
      if (!this.selectedCampaign?.target || !this.completionCount) return 0;
      return Math.round((this.completionCount / this.selectedCampaign.target) * 100);
    }
  },
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
    async onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      await this.fetchCampaigns();
      // Remove the automatic selection of the first campaign
    },

    async fetchCampaigns() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/campaigns/list`);
        this.campaigns = response.data.map(campaign => ({
          id: campaign.id,
          name: campaign.name,
          target: campaign.target
        }));
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        this.showAlert('Error fetching campaigns', 'error');
      }
    },

    async loadCampaignData(campaign) {
      if (!campaign) return;
      
      const campaignId = campaign.id;
      
      this.isLoading = true;
      try {
        const response = await axios.get(`${apiBaseUrl}/api/campaigns/${campaignId}`);
        console.log('Campaign data response:', response.data);
        // Add data transformation if needed
        this.rowData = response.data.entries.map(entry => ({
          ...entry,
          handleName: entry.handleName || entry.handle_name || ''  // Ensure handleName is properly mapped
        }));        await this.fetchCompletionData(campaignId);
      } catch (error) {
        console.error('Error loading campaign data:', error);
        this.rowData = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCompletionData(campaignId) {
      try {
        // Fetch both completion count and POC data
        const [totalCompletion, pocCompletions] = await Promise.all([
          axios.get(`${apiBaseUrl}/api/campaigns/${campaignId}/entries/getAllCompletion`),
          axios.get(`${apiBaseUrl}/api/campaigns/${campaignId}/entries/getAllPocs/${campaignId}`)
        ]);

        this.completionCount = totalCompletion.data;
        this.pocCompletions = pocCompletions.data;
        console.log('Completion data:', {
          total: this.completionCount,
          target: this.selectedCampaign?.target,
          percentage: this.getCompletionPercentage
        });
      } catch (error) {
        console.error('Error fetching completion data:', error);
        this.completionCount = 0;
        this.pocCompletions = [];
      }
    },

    showCreateCampaignDialog() {
      this.createCampaignDialog = true;
    },

    async createCampaign() {
      if (!this.newCampaignName.trim()) {
        this.showAlert('Please enter a campaign name', 'error');
        return;
      }

      if (!this.Target || this.Target <= 0) {
        this.showAlert('Please enter a valid target number', 'error');
        return;
      }

      try {
        await axios.post(`${apiBaseUrl}/api/campaigns/create`, null, {
          params: { 
            name: this.newCampaignName.trim(), 
            target: parseInt(this.Target) 
          }
        });
        this.showAlert('Campaign created successfully', 'success');
        this.createCampaignDialog = false;
        this.newCampaignName = '';
        this.Target = 0;
        await this.fetchCampaigns();
      } catch (error) {
        console.error('Error creating campaign:', error);
        this.showAlert('Error creating campaign', 'error');
      }
    },
    selectCampaign(campaign) {
      this.selectedCampaign = campaign;
      this.loadCampaignData(campaign);
      this.menu = false;
    },
    openAddEntryDialog() {
      if (!this.selectedCampaign) {
        // Show an error message or alert if no campaign is selected
        alert('Please select a campaign first');
        return;
      }
      this.showAddEntryDialog = true;},
    async handleAddEntry(entry) {
      if (!this.selectedCampaign) {
        console.error('No campaign selected');
        return;
      }
      const campaignId = this.selectedCampaign.id;

      try {
        console.log('Entry data before sending:', entry);
        const entryData = {
          handleName: entry.handleName,  // Make sure it's camelCase
          email: entry.email,
      tiktokUrl: entry.tiktokUrl,
      status: entry.status,
      poc: entry.poc,
      price: entry.price,
      note: entry.note,
      completion: entry.completion,
      type: entry.type
    };

    const response = await axios.post(
      `${apiBaseUrl}/api/campaigns/${campaignId}/entries/add`,
      entryData  // Send the transformed data
    );
        console.log('Entry added successfully:', response.data);
        
        // Refresh the campaign data
        await this.loadCampaignData(this.selectedCampaign);
        
        // Show a success message (you can use a toast notification library if you have one)
        alert('Entry added successfully!');
      } catch (error) {
        console.error('Error adding entry:', error);
        // Show an error message
        alert('Failed to add entry. Please try again.');
      }
    },
    async handleCompletionChange(params) {
      const { data, newValue } = params;
      if (!this.selectedCampaign) return;

      // Store the pending update and show category dialog
      this.categoryDialog.pendingUpdate = {
        params,
        data,
        newValue
      };
      this.categoryDialog.selectedCategory = null;
      this.categoryDialog.show = true;
    },

    cancelCompletionUpdate() {
      if (this.categoryDialog.pendingUpdate) {
        // Revert the cell value
        this.categoryDialog.pendingUpdate.params.api.undoCellEditing();
      }
      this.categoryDialog.show = false;
      this.categoryDialog.pendingUpdate = null;
      this.categoryDialog.selectedCategory = null;
    },

    async confirmCompletionUpdate() {
      if (!this.categoryDialog.selectedCategory || !this.categoryDialog.pendingUpdate) {
        this.showAlert('Please select a category', 'error');
        return;
      }

      const { data, newValue } = this.categoryDialog.pendingUpdate;

      try {
        this.isLoading = true;
        await axios.put(
          `${apiBaseUrl}/api/campaigns/${this.selectedCampaign.id}/entries/updateCompletion/${data.id}`,
          {
            ...data,
            completion: newValue
          },
          {
            params: {
              categories: this.categoryDialog.selectedCategory
            }
          }
        );

        // Refresh completion data after update
        await this.fetchCompletionData(this.selectedCampaign.id);
        
        this.showAlert('Completion status updated successfully', 'success');
        this.categoryDialog.show = false;
        this.categoryDialog.pendingUpdate = null;
        this.categoryDialog.selectedCategory = null;
      } catch (error) {
        console.error('Error updating completion status:', error);
        this.showAlert('Failed to update completion status', 'error');
        
        // Revert the cell value if the update failed
        this.categoryDialog.pendingUpdate.params.api.undoCellEditing();
      } finally {
        this.isLoading = false;
      }
    },

    // Update the bulk update method to handle categories as well
    async updateSelectedEntriesCompletion(completionValue) {
      if (!this.selectedCampaign || !this.gridApi) return;

      const selectedNodes = this.gridApi.getSelectedNodes();
      if (selectedNodes.length === 0) {
        this.showAlert('Please select entries to update', 'warning');
        return;
      }

      // Show category dialog for bulk update
      this.categoryDialog.pendingUpdate = {
        type: 'bulk',
        nodes: selectedNodes,
        completionValue
      };
      this.categoryDialog.selectedCategory = null;
      this.categoryDialog.show = true;
    },

    // Add method to handle bulk updates with category
    async processBulkCompletionUpdate() {
      if (!this.categoryDialog.pendingUpdate || !this.categoryDialog.selectedCategory) return;

      const { nodes, completionValue } = this.categoryDialog.pendingUpdate;

      try {
        this.isLoading = true;
        const updatePromises = nodes.map(node => 
          axios.put(
            `${apiBaseUrl}/api/campaigns/${this.selectedCampaign.id}/entries/updateCompletion/${node.data.id}`,
            {
              ...node.data,
              completion: completionValue
            },
            {
              params: {
                categories: this.categoryDialog.selectedCategory
              }
            }
          )
        );

        await Promise.all(updatePromises);
        
        // Refresh the grid and completion data
        await this.loadCampaignData(this.selectedCampaign);
        
        this.showAlert(`Updated completion status for ${nodes.length} entries`, 'success');
        this.categoryDialog.show = false;
        this.categoryDialog.pendingUpdate = null;
        this.categoryDialog.selectedCategory = null;
      } catch (error) {
        console.error('Error updating completion status:', error);
        this.showAlert('Failed to update completion status', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    onRowDoubleClicked(params) {
    const rowData = params.data;
    console.log('Original row data:', rowData);
    
    this.editEntry = { 
        ...rowData  // Copy all original data including campaign_id
    };
    
    console.log('Edit entry data:', this.editEntry);
    this.showEditDialog = true;
},
    // Close dialog and reset form
    closeEditDialog() {
    this.showEditDialog = false;
    this.editEntry = {
      id: null,
      handleName: '',
      email: '',
      tiktokUrl: '',
      status: '',
      poc: '',
      price: null,
      note: '',
      completion: false,
      type: ''
    };
  },

    // Handle edit submission
    async handleEditEntry(updatedData) {
    try {
      this.isLoading = true;
      
      console.log('Updating entry with data:', updatedData);

      await axios.put(
        `${apiBaseUrl}/api/campaigns/${this.selectedCampaign.id}/entries/update/${updatedData.id}`,
        updatedData
      );

      await this.loadCampaignData(this.selectedCampaign);
      this.showAlert('Entry updated successfully!', 'success');
      this.showEditDialog = false;
    } catch (error) {
      console.error('Error updating entry:', error);
      this.showAlert(
        `Failed to update entry: ${error.response?.data?.message || error.message}`,
        'error'
      );
    } finally {
      this.isLoading = false;
    }
  },

    openFileUploadDialog() {
      if (!this.selectedCampaign) {
        this.showAlert('Please select a campaign first', 'error');
        return;
      }
      this.showFileUploadDialog = true;
    },

    closeFileUploadDialog() {
      this.showFileUploadDialog = false;
      this.selectedFile = null;
      this.fileError = '';
    },

    // handleFileChange(file) {
    //   this.fileError = '';
    //   if (file) {
    //     const validTypes = [
    //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //       'application/vnd.ms-excel'
    //     ];
    //     if (!validTypes.includes(file.type)) {
    //       this.fileError = 'Please upload only Excel files (.xlsx or .xls)';
    //       this.selectedFile = null;
    //     }
    //   }
    // },

    async uploadFile() {
      if (!this.selectedFile || !this.selectedCampaign) return;

      this.isUploading = true;
      this.fileError = '';

      try {
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        await axios.post(
          `${apiBaseUrl}/api/campaigns/${this.selectedCampaign.id}/entries/addByFile`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        this.showAlert('File uploaded successfully', 'success');
        await this.loadCampaignData(this.selectedCampaign);
        this.closeFileUploadDialog();
      } catch (error) {
        console.error('Error uploading file:', error);
        this.fileError = error.response?.data || 'Error uploading file';
      } finally {
        this.isUploading = false;
      }
    },

    async deleteCampaign() {
      if (!this.selectedCampaign) {
        this.showAlert('Please select a campaign to delete', 'error');
        return;
      }

      const confirmed = confirm(`Are you sure you want to delete the campaign: ${this.selectedCampaign.name}?`);
      if (!confirmed) return;

      try {
        await axios.delete(`${apiBaseUrl}/api/campaigns/delete/${this.selectedCampaign.id}`);
        this.showAlert('Campaign deleted successfully', 'success');
        this.selectedCampaign = null;
        await this.fetchCampaigns(); // Refresh the campaign list
      } catch (error) {
        console.error('Error deleting campaign:', error);
        this.showAlert('Failed to delete campaign', 'error');
      }
    },

  }
}
</script>


<style scoped>
.campaign-selector {
  text-transform: none !important;
  letter-spacing: normal !important;
  font-weight: normal !important;
  font-size: 1.2rem !important;
}
.min-width-button {
  min-width: 200px;
}

.v-container {
  max-width: none !important;
  padding: 0 !important;
}

.v-col {
  padding: 12px;
}

.v-btn-group {
  display: flex;
  gap: 8px;
}

.v-file-input {
  margin-top: 20px;
}

/* ... other styles ... */
</style>





