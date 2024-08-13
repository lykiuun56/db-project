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
import qs from 'qs'; // Import qs for parameter serialization

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
        {headerName: 'ID', field: 'id', checkboxSelection: true},
        {headerName: 'HandleName', field: 'handle_name'},
        {headerName: 'Email', field: 'email'},
        {headerName: 'Followers', field: 'followers'},
        {headerName: 'Notes', field: 'notes'},
        {
          headerName: 'Is Blocked',
          field: 'is_Blocked',
          sortable: true,
          filter: true,
          flex: 2,
          cellRenderer: (params) => params.value ? 'Yes' : 'No' // Correctly handling boolean values
        },
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
      const selectedData = selectedNodes.map(node => node.data);

      if (selectedData.length === 0) {
        alert('No rows selected.');
        return;
      }

      const userIds = selectedData.map(user => user.id); // Extract the IDs of selected rows

      axios.get('http://localhost:8081/api/total/export', {
        params: {
          projectName: this.projectName,
          userIds: userIds, // Send user IDs as an array
        },
        paramsSerializer: params => {
          return qs.stringify(params, {arrayFormat: 'repeat'}); // Serialize array parameters correctly
        },
        responseType: 'blob', // Important: Set the response type to blob for file download
      })
          .then(response => {
            // Create a blob from the response and download it
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `selected_users_${this.projectName}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove(); // Cleanup
          })
          .catch(error => {
            console.error('Error exporting selected users:', error);
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
