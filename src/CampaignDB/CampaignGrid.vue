<template>
  <v-container fluid>
    <v-row>
      <v-col cols = "12">
        <h1 style="color: white">Status</h1>
      </v-col>
    </v-row>


    <v-row>
      <v-col cols = "12">
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


  </v-container>
</template>

<script>
import { apiBaseUrl } from '@/config';
import axios from 'axios';
import {AgGridVue} from "ag-grid-vue3";
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
      { headerName: 'Email', field: 'email', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
      { headerName: 'Tiktok Url', field: 'tiktokUrl', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
      { headerName: 'Status', field: 'status', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
      { headerName: 'Poc', field: 'poc', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
      { headerName: 'NYC Schedule Date', field: 'nycScheduleDate', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
      { headerName: 'Video Link', field: 'videoLink', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
      { headerName: 'Attitude', field: 'attitude', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
      { headerName: 'Price', field: 'price', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
      { headerName: 'Price', field: 'price', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
      { headerName: 'Note', field: 'note', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
      { headerName: 'Completion', field: 'completion', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},

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
      this.isLoading = true;
      try {
        const response = await axios.get(`${apiBaseUrl}/api/campaigns/list`);

        this.rowData = response.data;
        params.api.sizeColumnsToFit();

        // Automatically update rates for each campaign
        for (const campaign of this.rowData) {
          await this.updateCampaignRates(campaign.campaign_id);
        }

      } catch (error) {
        console.error('Error fetching data: ', error);
        this.showAlert('Error fetching data', 'error');
      } finally {
        this.isLoading = false;
      }
    },
  }
}
</script>