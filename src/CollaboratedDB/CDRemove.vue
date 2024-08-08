<template>
  <v-app>
    <v-container>
      <!-- Search Inputs -->
      <v-row class="mb-5" justify="center">
        <v-col cols="12" md="5">
          <v-text-field v-model="handleName" label="Handle Name" outlined></v-text-field>
        </v-col>
        <v-col cols="12" md="5">
          <v-text-field v-model="email" label="Email" outlined></v-text-field>
        </v-col>
      </v-row>

      <!-- Search and Reset Buttons -->
      <v-row class="mb-5" justify="center">
        <v-col cols="8" class="text-center">
          <v-btn color="primary" @click="search" :loading="loading">Search</v-btn>
          <v-btn color="secondary" @click="reset" class="ml-3">Reset</v-btn>
        </v-col>
      </v-row>

      <!-- ag-Grid for displaying search results -->
      <v-row class="mb-5" justify="center">
        <v-col cols="8" md="10">
          <h2 v-if="rowData.length">Search Result</h2>
          <p v-else>No results found</p>
          <div v-if="rowData.length" class="ag-theme-alpine" style="height: 400px;">
            <ag-grid-vue
              class="ag-theme-alpine"
              :columnDefs="columnDefs"
              :rowData="rowData"
              rowSelection="single"
              @selectionChanged="onSelectionChanged"
              @firstDataRendered="onFirstDataRendered"
              :defaultColDef="defaultColDef"
            ></ag-grid-vue>
          </div>
        </v-col>
      </v-row>

      <!-- Remove Button -->
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <v-btn color="primary" @click="confirmRemove" :disabled="!selectedItem">Remove</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirmationDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Confirm</v-card-title>
        <v-card-text>Are you sure you want to remove this record?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmationDialog = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="remove">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';

export default {
  name: 'RemoveFromDatabaseWithAgGrid',
  components: {
    AgGridVue,
  },
  data() {
    return {
      handleName: '',
      email: '',
      columnDefs: [
        { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true, width: 150 },
        { headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true, minWidth: 150 },
        { headerName: 'Tiktok URL', field: 'tiktok_url', sortable: true, filter: true, minWidth: 200 },
        { headerName: 'Followers', field: 'followers', sortable: true, filter: true, minWidth: 150 },
        { headerName: 'Full Name', field: 'full_name', sortable: true, filter: true, minWidth: 150 },
        { headerName: 'Full Address', field: 'full_address', sortable: true, filter: true, minWidth: 200 },
        { headerName: 'Email', field: 'email', sortable: true, filter: true, minWidth: 200 },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true, width: 150 },
        { headerName: 'Collaborated Time', field: 'collaborated_times', sortable: true, filter: true, width: 150 },
        { headerName: 'Notes', field: 'notes', sortable: true, filter: true, minWidth: 150 },
        { headerName: 'POC', field: 'poc', sortable: true, filter: true, minWidth: 150 },
        { headerName: 'State', field: 'state', sortable: true, filter: true, width: 100 },
        { headerName: 'Categories', field: 'categories', sortable: true, filter: true, minWidth: 150 },
        {
          headerName: 'Is Blocked',
          field: 'is_blocked',
          editable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: [true, false],
          },
          valueFormatter: params => (params.value ? 'Yes' : 'No'),
          width: 100,
        }
      ],
      rowData: [],
      selectedItem: null,
      loading: false,
      confirmationDialog: false,
      gridApi: null,
      gridColumnApi: null,
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
      },
    };
  },
  methods: {
    async search() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:8081/api/collaborated/singleSearch', {
          params: {
            handleName: this.handleName || null,
            email: this.email || null,
          },
        });
        this.rowData = response.data;
      } catch (error) {
        console.error(error);
        alert('Search failed');
      } finally {
        this.loading = false;
      }
    },
    onSelectionChanged(event) {
      // Get selected row data
      const selectedRows = event.api.getSelectedRows();
      this.selectedItem = selectedRows.length > 0 ? selectedRows[0] : null;
      console.log('Selected Item:', this.selectedItem); 
    },
    confirmRemove() {
      if (!this.selectedItem) {
        alert('Please select an item to remove.');
        return;
      }
      this.confirmationDialog = true;
    },
    async remove() {
      this.confirmationDialog = false;
      if (!this.selectedItem) {
        alert('Please select an item to remove.');
        return;
      }

      try {
        const id = this.selectedItem.id;
        await axios.delete(`http://localhost:8081/api/collaborated/delete/${id}`);
        alert('Record removed successfully');
        this.selectedItem = null; // Reset selection after removal
        this.search(); // Re-run the search to refresh the results after deletion
      } catch (error) {
        console.error(error);
        alert('Remove failed');
      }
    },
    reset() {
      this.handleName = '';
      this.email = '';
      this.rowData = [];
      this.selectedItem = null;
    },
    onFirstDataRendered(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
  },
};
</script>

<style>
.text-center {
  text-align: center;
}
.mb-5 {
  margin-bottom: 10px;
}
.ag-theme-alpine {
  width: 100%;
}
</style>
