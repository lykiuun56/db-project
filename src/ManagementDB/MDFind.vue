<template>
  <div class="mdfind-container">
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

    <div v-if="results.length" class="results">
      <h2>Matching Emails</h2>
      <div class="ag-theme-alpine" style="height: 400px; width: 100%;">
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
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';

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
      columnDefs: [
        { headerName: 'Email', field: 'email', sortable: true, filter: true,checkboxSelection: true },
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
      this.searchPerformed = false;
      try {
        const response = await axios.get(`http://localhost:8081/api/management/findAllMatching/{emailEnding}`, {
          params: {
            emailEnding: this.emailEnding,
          },
        });
        this.results = response.data;
        this.searchPerformed = true;
      } catch (error) {
        console.error('Error finding matching emails:', error);
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
  },
};
</script>

<style scoped>
.mdfind-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
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

.results {
  margin-top: 20px;
}
</style>
