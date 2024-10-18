<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 style="color: white">Campaigns</h1>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col cols="auto">
        <v-btn color="primary" @click="showCreateCampaignDialog">
          Create New Campaign
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="selectedCampaign"
          :items="campaigns"
          item-title="name"
          item-value="id"
          label="Select Campaign"
          @update:model-value="loadCampaignData"
          return-object
        >
          <template v-slot:item="{ item, props }">
            <v-list-item v-bind="props" :value="item.raw">
              <v-list-item-title v-text="item.raw.name"></v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>

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
  </v-container>
</template>

<script>
import { apiBaseUrl } from '@/config';
import axios from 'axios';
import { AgGridVue } from "ag-grid-vue3";
import PersistentAlert from "@/components/PersistentAlert.vue";

export default {
  name: 'CampaignGrid',
  components: {
    PersistentAlert,
    AgGridVue,
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
      if (this.campaigns.length > 0) {
        this.selectedCampaign = this.campaigns[0].id;
        await this.loadCampaignData();
      }
    },

    async fetchCampaigns() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/campaigns/list`);
        console.log('API response:', response.data);
        const campaignsData = Array.isArray(response.data) ? response.data : JSON.parse(response.data);
        
        // Remove duplicates and sort by name
        this.campaigns = [...new Map(campaignsData.map(item => [item.id, item])).values()]
          .sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        this.showAlert('Error fetching campaigns', 'error');
      }
    },

    async loadCampaignData() {
      if (!this.selectedCampaign) return;
      
      const campaignId = this.selectedCampaign.id;
    

      this.isLoading = true;
      try {
        const response = await axios.get(`${apiBaseUrl}/api/campaigns/${campaignId}`);
        console.log('Campaign data response:', response.data);

        this.rowData = response.data.entries || [];



      } catch (error) {
        console.error('Error loading campaign data:', error);
        this.rowData = [];
      } finally {
        this.isLoading = false;
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
  }
}
</script>

