<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Collaborated Project</h1>
        <v-btn color="primary" @click="exportToExcel">Export to Excel</v-btn> <!-- Button to trigger export -->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ag-grid-vue
            class="ag-theme-alpine"
            style="width: 100%; height: 600px;"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :gridOptions="gridOptions"
            @grid-ready="onGridReady"
            :domLayout="'autoHeight'"
        ></ag-grid-vue>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';

export default {
  name: 'CollaboratedProjectGrid',
  components: {
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [
        {headerName: 'Handle Name', field: 'handleName', sortable: true, filter: true},
        { headerName: 'Email', field: 'email', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'Anker', field: 'anker', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'TXYZ', field: 'txyz', sortable: true, filter: true, flex: 1.5 },
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
    };
  },
  methods: {
    async onGridReady(params) {
      try {
        const response = await axios.get('http://localhost:8081/api/collaborated_projects/all');
        this.rowData = response.data;
        console.log(response.data);
        params.api.sizeColumnsToFit();  // Ensure columns fit the grid width
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    // dateFormatter(params) {
    //   const date = new Date(params.value);
    //   if (!isNaN(date.getTime())) {
    //     // Customize the date format as needed
    //     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    //   } else {
    //     return ''; // or some other placeholder
    //   }
    // },
    async exportToExcel() {
      try {
        const selectedNodes = this.$refs.agGrid.gridApi.getSelectedNodes();
        const selectedIds = selectedNodes.map(node => node.data.id); // Assuming 'id' is your unique identifier
        if (selectedIds.length === 0) {
          alert('Please select at least one row to export.');
          return;
        }

        const projectName = 'YourProjectName'; // Replace with actual project name or make it dynamic

        const response = await axios.get('http://localhost:8081/api/export', {
          params: {
            projectName: projectName,
            userIds: selectedIds
          },
          responseType: 'blob' // Important: so that the browser can interpret the response as a file
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'exported_users.xlsx'); // or any file name you prefer
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } catch (error) {
        console.error('Error exporting data:', error);
        alert('Failed to export data.');
      }
    }
  }
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
