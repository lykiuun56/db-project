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
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <v-btn color="white" text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>

    <!-- Loading Indicator -->
    <v-progress-linear v-if="isLoading" indeterminate color="primary"></v-progress-linear>



  </v-container>
</template>





<script>
import { apiBaseUrl } from '@/config';
import axios from 'axios';
import {AgGridVue} from "ag-grid-vue3";
import { mapState } from 'vuex';


export default {
  name: 'EmailStatusGrid',
  components: {
    AgGridVue,
  },
  computed: {
    ...mapState({
      authToken: state => state.authToken, // Get token from Vuex state
      userRole: state => state.userRole,   // Get role from Vuex state
    }),
  },
  data() {
    return {
      columnDefs: [
        { headerName: 'Campaign Id', field: 'campaign_id', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
        { headerName: 'Poc Id', field: 'poc_id', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'Open Rate', field: 'open_rate', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'Click Rate', field: 'click-rate', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'Poc', field:'poc', sortable: true, filter: true, flex:1.5 }
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
      snackbar: { // For notifications
        show: false,
        message: '',
        color: 'success', // or 'error', etc.
      },
      isLoading: false, // Loading state
    };
    },
  methods: {
    showSnackbar(message, color = 'success') {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    async onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.isLoading = true;
      console.log('userRole',this.userRole)
      try {
        const url = this.userRole === 'ROLE_ADMIN' ? `${apiBaseUrl}/api/status/admin` : `${apiBaseUrl}/api/status/user`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        });

        this.rowData = response.data;
        params.api.sizeColumnsToFit();
      } catch (error) {
        console.error('Error fetching data: ', error);
        this.showSnackbar('Error fetching data', 'error');
      } finally {
        this.isLoading = false;
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