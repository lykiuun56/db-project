<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="projectName" label="Project Name" dense></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="userCount" label="Number of Users" type="number" dense></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="fetchUsers">Select Users</v-btn>
      </v-col>
    </v-row>

    <!-- Search Results -->
    <v-row v-if="rowData.length" class="mt-4">
      <v-col cols="12">
        <h3 class="text-center">Selected Users</h3>
        <v-btn color="secondary" @click="exportSelectedRows">Export Selected</v-btn>
        <div class="ag-theme-alpine" style="height: 500px; width: 100%;">
          <ag-grid-vue
              :columnDefs="columnDefs"
              :rowData="rowData"
              :rowSelection="'multiple'"
              :animateRows="true"
              @grid-ready="onGridReady"
              :domLayout="'autoHeight'"
              :defaultColDef="defaultColDef"
              :pagination="true"
              :paginationPageSize="10"
              ref="grid"
          ></ag-grid-vue>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import * as FileSaver from 'file-saver';

export default {
  name: 'ManagementEmail',
  components: {
    AgGridVue
  },
  data() {
    return {
      projectName: '',
      userCount: 0,
      rowData: [],
      columnDefs: [
        { headerName: 'ID', field: 'id', checkboxSelection: true },
        { headerName: 'HandleName', field: 'handle_name' },
        { headerName: 'Email', field: 'email' },
        { headerName: 'Followers', field: 'followers' },
        { headerName: 'Notes', field: 'notes' },
        {
          headerName: 'Is Blocked',
          field: 'is_Blocked',
          sortable: true,
          filter: true,
          flex: 2,
          cellRenderer: (params) => params.value ? 'Yes' : 'No' // Correctly handling boolean values
        },
        // Add more fields as needed
      ],
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
      },
    };
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
    },
    fetchUsers() {
      if (!this.projectName || this.userCount <= 0) {
        alert('Please provide a valid project name and user count.');
        return;
      }

      axios.get('http://localhost:8081/api/total/select', {
        params: {
          projectName: this.projectName,
          userCount: this.userCount,
        }
      })
          .then(response => {
            this.rowData = response.data; // Populate rowData directly
          })
          .catch(error => {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users');
          });
    },
    exportSelectedRows() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedIds = selectedNodes.map(node => node.data.id);

      if (selectedIds.length === 0) {
        alert('Please select at least one user to export.');
        return;
      }

      axios({
        method: 'GET',
        url: 'http://localhost:8081/export',
        responseType: 'blob', // Ensure the response is treated as a file
        params: {
          projectName: this.projectName,
          userIds: selectedIds,
        }
      })
          .then(response => {
            const fileName = `${this.projectName}_selected_users_export.xlsx`;
            FileSaver.saveAs(new Blob([response.data]), fileName);
          })
          .catch(error => {
            console.error('Error exporting users:', error);
            alert('Failed to export selected users');
          });
    }
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
