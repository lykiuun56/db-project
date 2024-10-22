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
            <v-btn color="primary" @click="openAddEntryDialog" :disabled="!selectedCampaign">
              Add Entry
            </v-btn>
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
          <v-card-title style="color: red; font-size: 3.0em;" align="center">TARGET {{ completionCount }}/100</v-card-title>
          <v-card-text>
            <v-progress-linear
              :model-value="(completionCount / 100) * 100"
              color="red"
              height="50"
            >
              <strong>{{ completionCount }}%</strong>
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
  </v-container>
</template>

<script>
import { apiBaseUrl } from '@/config';
import axios from 'axios';
import { AgGridVue } from "ag-grid-vue3";
import PersistentAlert from "@/components/PersistentAlert.vue";
import AddEntryDialog from '@/components/AddEntryDialog.vue';

export default {
  name: 'CampaignGrid',
  components: {
    PersistentAlert,
    AgGridVue,
    AddEntryDialog,
  },
  data() {
    return {
      columnDefs: [
        { headerName: 'Handle Name', field: 'handle_Name', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
        { headerName: 'Email', field: 'email', sortable: true, filter: true,},
        { headerName: 'Tiktok Url', field: 'tiktokUrl', sortable: true, filter: true},
        { headerName: 'Status', field: 'status', sortable: true, filter: true,},
        { headerName: 'Poc', field: 'poc', sortable: true, filter: true,},
        { headerName: 'NYC Schedule Date', field: 'nycScheduleDate', sortable: true, filter: true,},
        { headerName: 'Video Link', field: 'videoLink', sortable: true, filter: true,},
        { headerName: 'Attitude', field: 'attitude', sortable: true, filter: true,},
        { headerName: 'Price', field: 'price', sortable: true, filter: true,},
        { headerName: 'Note', field: 'note', sortable: true, filter: true,},
        { headerName: 'Completion', field: 'completion', sortable: true, filter: true},
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
      menu: false,
      completionCount: 0,
      pocCompletions: [],
      showAddEntryDialog: false,
    };
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
          name: campaign.name
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
        this.rowData = response.data.entries || [];
        
        // Fetch completion data
        await this.fetchCompletionData(campaignId);
      } catch (error) {
        console.error('Error loading campaign data:', error);
        this.rowData = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCompletionData(campaignId) {
      try {
        const [totalCompletion, pocCompletions] = await Promise.all([
          axios.get(`${apiBaseUrl}/api/campaigns/${campaignId}/entries/getAllCompletion`),
          axios.get(`${apiBaseUrl}/api/campaigns/${campaignId}/entries/getAllPocs/${campaignId}`)
        ]);

        this.completionCount = totalCompletion.data;
        this.pocCompletions = pocCompletions.data;
      } catch (error) {
        console.error('Error fetching completion data:', error);
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

      try {
        await axios.post(`${apiBaseUrl}/api/campaigns/create`, null, {
          params: { name: this.newCampaignName.trim() }
        });
        this.showAlert('Campaign created successfully', 'success');
        this.createCampaignDialog = false;
        this.newCampaignName = '';
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
      this.showAddEntryDialog = true;    },
      async handleAddEntry(entry) {
      if (!this.selectedCampaign) {
        console.error('No campaign selected');
        return;
      }
      const campaignId = this.selectedCampaign.id;

      try {
        const response = await axios.post(
          `${apiBaseUrl}/api/campaigns/${campaignId}/entries/add`,
          entry
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

/* ... other styles ... */
</style>
