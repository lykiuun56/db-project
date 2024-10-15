<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 style="color: white">Live Status</h1>
      </v-col>

      <!-- Export Options Button -->
      <v-col cols="auto">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="#4700cf" v-bind="props">
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

      <!-- Simple Search Button -->
      <v-col cols="auto">
        <v-btn color="#00b19e" @click="showSimpleSearchDialog" class="elevation-2">
          <v-icon left>mdi-magnify</v-icon>
          Simple Search
        </v-btn>
      </v-col>

      <!-- Add LiveStatus Button -->
      <v-col cols="auto">
        <v-btn color="primary" @click="showAddDialog" class="elevation-2">
          <v-icon left>mdi-plus</v-icon>
          Add LiveStatus
        </v-btn>
      </v-col>

      <!-- Delete Selected Button -->
      <v-col cols="auto">
        <v-btn color="red" @click="deleteSelectedRows" class="elevation-2" :disabled="!hasSelection">
          <v-icon left>mdi-delete</v-icon>
          Delete Selected
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ag-grid-vue
            class="ag-theme-alpine-dark"
            style="width: 100%; height: 600px;"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :gridOptions="gridOptions"
            @grid-ready="onGridReady"
            @cell-value-changed="onCellValueChanged"
            @selection-changed="onSelectionChanged"
            :domLayout="'autoHeight'"
        ></ag-grid-vue>
      </v-col>
    </v-row>

    <!-- Simple Search Dialog -->
    <v-dialog v-model="searchDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Simple Search</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Live Name" v-model="searchLiveName"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Category" v-model="searchCategory"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="performSearch">Search</v-btn>
          <v-btn color="grey" @click="closeSearchDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add LiveStatus Dialog -->
    <v-dialog v-model="addDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add New LiveStatus</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="addForm" v-model="isValid">
            <v-container>
              <v-row>
                <!-- Input fields for newLiveStatus -->
                <v-col cols="12" sm="6">
                  <v-text-field
                      label="Live Name"
                      v-model="newLiveStatus.live_name"
                      :rules="[rules.required]"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                      label="Category"
                      v-model="newLiveStatus.category"
                      :rules="[rules.required]"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Live Account" v-model="newLiveStatus.live_account"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                      label="Live Time"
                      v-model="newLiveStatus.live_time"
                      type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="GMV" v-model="newLiveStatus.gmv" type="number"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                      label="Total View"
                      v-model="newLiveStatus.total_view"
                      type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Live Holder" v-model="newLiveStatus.live_holder"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="newLiveStatus.live_date" label="Live Date" type="datetime-local" />
                </v-col>
<!--                <v-col cols="12" sm="6">-->
<!--                  <v-text-field-->
<!--                      label="View Change"-->
<!--                      v-model="newLiveStatus.view_change"-->
<!--                      type="number"-->
<!--                  ></v-text-field>-->
<!--                </v-col>-->
<!--                <v-col cols="12" sm="6">-->
<!--                  <v-text-field-->
<!--                      label="GMV Change"-->
<!--                      v-model="newLiveStatus.gmv_change"-->
<!--                      type="number"-->
<!--                  ></v-text-field>-->
<!--                </v-col>-->
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addLiveStatus">Add</v-btn>
          <v-btn color="grey" @click="closeAddDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { apiBaseUrl } from '@/config';
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import { exportToExcel } from '@/utils/exportUtils';

export default {
  name: 'LiveStatusGrid',
  components: {
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [
        {
          headerName: 'Live Date',
          field: 'live_date',
          sortable: true,
          filter: true,
          editable: true,
          valueFormatter: this.dateFormatter,
        },
        { headerName: 'Live Host', field: 'live_holder', sortable: true, filter: true, editable: true },
        { headerName: 'Live Name', field: 'live_name', sortable: true, filter: true, editable: true, checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: 'Category', field: 'category', sortable: true, filter: true, editable: true },
        { headerName: 'Live Account', field: 'live_account', sortable: true, filter: true, editable: true },
        { headerName: 'Live Time', field: 'live_time', sortable: true, filter: true, editable: true },
        { headerName: 'GMV', field: 'gmv', sortable: true, filter: true, editable: true },
        { headerName: 'Total View', field: 'total_view', sortable: true, filter: true, editable: true },
        { headerName: 'View Change', field: 'view_change', sortable: true, filter: true, editable: true, valueFormatter: this.percentageFormatter},
        { headerName: 'GMV Change', field: 'gmv_change', sortable: true, filter: true, editable: true,valueFormatter: this.percentageFormatter},
      ],
      rowData: null,
      gridOptions: {
        pagination: true,
        paginationPageSize: 10,
        defaultColDef: {
          resizable: true,
        },
        autoHeight: true,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
      },
      searchDialog: false,
      searchLiveName: '',
      searchCategory: '',
      addDialog: false,
      newLiveStatus: {
        live_name: '',
        category: '',
        live_account: '',
        live_time: null,
        gmv: null,
        total_view: null,
        live_holder: '',
        live_date: null,
        view_change: null,
        gmv_change: null,
      },
      dateMenu: false,
      isValid: false,
      rules: {
        required: (value) => !!value || 'Required.',
      },
      hasSelection: false, // Tracks if any rows are selected
      formattedLiveDate: '',
    };
  },
  watch: {
    'newLiveStatus.live_date'(val) {
      if (val) {
        this.updateFormattedLiveDate();
      }
    }
  },
  methods: {
    async onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      try {
        await this.fetchData();
        params.api.sizeColumnsToFit(); // Ensure columns fit the grid width
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    dateFormatter(params) {
      const value = params.value;
      if (value == null || value === '') {
        return ''; // Return an empty string if the value is null or undefined
      }
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        // Customize the date format as needed
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      } else {
        return ''; // Return an empty string for invalid dates
      }
    },

    percentageFormatter(params) {
      const value = params.value;
      if (value == null || value === '') {
        return '0%';
      }
      if (value > 0) {
        return '+' + (value).toFixed(2) + '%';
      }else {
        return (value).toFixed(2) + '%';
      }
    },
    exportAllToExcel() {
      const allDisplayedData = [];
      this.gridApi.forEachNodeAfterFilterAndSort((node) => {
        allDisplayedData.push(node.data);
      });
      exportToExcel(allDisplayedData, 'LiveStatus_All');
    },
    exportSelectedToExcel() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map((node) => node.data);
      exportToExcel(selectedData, 'LiveStatus_Selected');
    },

    updateFormattedLiveDate() {
      if (this.newLiveStatus.live_date) {
        this.formattedLiveDate = new Date(this.newLiveStatus.live_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        this.dateMenu = false;  // Close the date picker after selection
      }
    },

    showAddDialog() {
      this.newLiveStatus = {
        live_name: '',
        category: '',
        live_account: '',
        live_time: null,
        gmv: null,
        total_view: null,
        live_holder: '',
        live_date: null,
        view_change: null,
        gmv_change: null,
      };
      this.addDialog = true;
    },
    closeAddDialog() {
      this.addDialog = false;
    },
    async addLiveStatus() {
      const isValid = await this.$refs.addForm.validate();
      if (isValid) {
        try {
          if (this.newLiveStatus.live_date instanceof Date) {
            this.newLiveStatus.live_date = this.newLiveStatus.live_date.toISOString();
          }
          const response = await axios.post(`${apiBaseUrl}/api/live_status/add`, this.newLiveStatus);
          if (response.status === 200 || response.status === 201) {
            await this.fetchData();
            this.closeAddDialog();
            alert('LiveStatus added successfully!');
          }
        } catch (error) {
          console.error('Error adding LiveStatus:', error);
          alert('Failed to add LiveStatus.');
        }
      } else {
        console.log('Form is invalid');
      }
    },
    async updateLiveStatus(data) {
      try {
        await axios.put(`${apiBaseUrl}/api/live_status/update/${data.id}`, data);
        alert('LiveStatus updated successfully!');
      } catch (error) {
        console.error('Error updating LiveStatus:', error);
        alert('Failed to update LiveStatus.');
      }
    },
    async deleteSelectedRows() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      if (selectedNodes.length === 0) {
        alert('Please select at least one row to delete.');
        return;
      }

      if (confirm('Are you sure you want to delete the selected entries?')) {
        const deletePromises = selectedNodes.map(async (node) => {
          try {
            await axios.delete(`${apiBaseUrl}/api/live_status/delete/${node.data.id}`);
          } catch (error) {
            console.error(`Error deleting LiveStatus with ID ${node.data.id}:`, error);
          }
        });

        try {
          await Promise.all(deletePromises);
          alert('Selected LiveStatus entries deleted successfully!');
          await this.fetchData();
        } catch (error) {
          console.error('Error deleting selected LiveStatus entries:', error);
          alert('Failed to delete some LiveStatus entries.');
        }
      }
    },
    async fetchData() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/live_status/all`);
        this.rowData = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    onSelectionChanged() {
      const selectedRows = this.gridApi.getSelectedRows();
      this.hasSelection = selectedRows.length > 0;
    },
    async onCellValueChanged(event) {
      const data = event.data;
      try {
        await this.updateLiveStatus(data);
      } catch (error) {
        console.error('Error updating cell value:', error);
      }
    },
  },
};
</script>

<style>
@import '~ag-grid-community/styles/ag-grid.css';
@import '~ag-grid-community/styles/ag-theme-alpine.css';

.ag-theme-alpine-dark {
  width: 100%;
  height: 400px;
}
</style>
