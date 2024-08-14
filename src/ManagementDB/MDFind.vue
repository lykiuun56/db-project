<template>
  <div class="mdfind-container">
    <div class="sidebar">
      <h1>Find Matching Emails</h1>
      <div class="search-form">
        <label for="emailEnding">Email Ending:</label>
        <input
            v-model="emailEnding"
            type="text"
            id="emailEnding"
            placeholder="Enter email ending (e.g., @gmail.com)"
        />
        <button @click="findMatchingEmails">Search</button>
      </div>

      <div v-if="searchPerformed && results.length === 0">
        <p>No matching emails found.</p>
      </div>

      <div v-if="results.length" class="export-buttons">
        <v-btn color="primary" @click="exportAllToExcel">Export All to Excel</v-btn>
        <v-btn color="secondary" @click="exportSelectedToExcel">Export Selected to Excel</v-btn>
      </div>
    </div>

    <div class="main-content">
      <div v-if="results.length" class="grid-container ag-theme-alpine">
        <ag-grid-vue
            :columnDefs="columnDefs"
            :rowData="results"
            :defaultColDef="defaultColDef"
            :rowSelection="'multiple'"
            :pagination="true"
            :paginationPageSize="10"
            :animateRows="true"
            class="ag-theme-alpine"
            @grid-ready="onGridReady"
            ref="grid"
        ></ag-grid-vue>
      </div>

      <div v-if="searchPerformed && error" class="error">
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { apiBaseUrl } from '@/config';
import { exportToExcel } from '@/utils/exportUtils';

export default {
  name: 'MDfind',
  components: {
    AgGridVue,
  },
  data() {
    return {
      emailEnding: '',
      results: [],
      searchPerformed: false,
      error: null,
      columnDefs: [
        { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true },
        { headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
        { headerName: 'Followers', field: 'followers', sortable: true, filter: true },
        { headerName: 'Is Blocked',
          field: 'is_Blocked',
          sortable: true,
          filter: true,
          cellRenderer: (params) => params.value ? 'Yes' : 'No'},
      ],
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
      },
    };
  },
  methods: {
    async findMatchingEmails() {
      this.searchPerformed = true;
      this.error = null;  // Reset error state
      try {
        const response = await axios.get(`${apiBaseUrl}/api/management/findAllMatching/{emailEnding}`, {
          params: {
            emailEnding: this.emailEnding,
          },
        });
        this.results = response.data;
      } catch (error) {
        this.error = 'Error finding matching emails. Please try again later.';
        console.error('Error finding matching emails:', error);
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
    exportAllToExcel() {
      const allDisplayedData = [];
      this.gridApi.forEachNodeAfterFilterAndSort((node) => {
        allDisplayedData.push(node.data);
      });

      exportToExcel(allDisplayedData, "management_email_filtered");
    },
    exportSelectedToExcel() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      exportToExcel(selectedData, "management_email_selected");
    },
  },
};
</script>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
}

.mdfind-container {
  display: flex;
  height: 100vh;
  background-color: #f7f7f7;
  box-sizing: border-box;
}

.sidebar {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #ffffff;
  width: 300px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: hidden;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.search-form input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.search-form button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-form button:hover {
  background-color: #0056b3;
}

.export-buttons {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.grid-container {
  flex: 1;
  overflow: auto;
}

.error {
  color: red;
  text-align: center;
  margin-top: 20px;
}
</style>
