<template>
  <v-container fluid>
    <!-- Search Section -->
    <v-row>
      <v-col cols="4">
        <v-text-field v-model="handleName" label="Handle Name" dense></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field v-model="email" label="Email" dense></v-text-field>
      </v-col>
      <v-col cols="4" class="text-center">
        <v-btn color="primary" @click="search">Search</v-btn>
      </v-col>
    </v-row>

    <!-- AG Grid Section -->
    <v-row v-if="rowData.length">
      <v-col cols="12">
        <ag-grid-vue
            class="ag-theme-alpine"
            style="width: 100%; height: 400px;"
            :rowData="rowData"
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"
            @cellValueChanged="onCellValueChanged"
            :frameworkComponents="frameworkComponents"
        ></ag-grid-vue>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';

export default {
  components: {
    AgGridVue
  },
  data() {
    return {
      handleName: '',  // Search input for handle name
      email: '',
      rowData: [], // Data to be displayed in the grid
      columnDefs: [
        { headerName: "ID", field: "id", editable: false }, // Non-editable
        { headerName: "Handle Name", field: "handle_name", editable: true }, // Editable
        { headerName: "Followers", field: "followers", editable: true },
        { headerName: "Email", field: "email", editable: true },
        {
          headerName: 'Is Blocked',
          field: 'is_Blocked',
          editable: false, // No direct editing
          cellRenderer: (params) => {
            return `<span class="toggle-cell">${params.value ? 'Yes' : 'No'}</span>`;
          },
          cellStyle: { cursor: 'pointer', textAlign: 'center' },
          onCellClicked: (params) => {
            // Toggle the value when the cell is clicked
            const newValue = !params.value;
            params.node.setDataValue(params.colDef.field, newValue);

            // Force cell refresh to ensure the new value is correctly displayed
            params.api.refreshCells({ rowNodes: [params.node], force: true });

            // Manually trigger the onCellValueChanged event to handle the backend update
            params.api.dispatchEvent({
              type: 'cellValueChanged',
              node: params.node,
              data: params.node.data,
              column: params.column,
              colDef: params.colDef,
              newValue: newValue,
              oldValue: params.value
            });
          }
        }
      ],
      defaultColDef: {
        editable: true, // Make all columns editable by default
        sortable: true,
        filter: true,
        resizable: true,
      },
      frameworkComponents: {}
    };
  },
  methods: {
    async search() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:8081/api/total/singleSearch', {
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
    async onCellValueChanged(event) {
      const updatedData = event.data;
      try {
        await axios.put(`http://localhost:8081/api/total/update/${updatedData.id}`, updatedData);
        alert('Update successful');
      } catch (error) {
        console.error('Error updating data:', error);
        alert('Update failed');
      }
    }
  }
};
</script>

<style scoped>
.ag-theme-alpine {
  height: 100%;
  width: 100%;
}

.toggle-cell {
  cursor: pointer;
  padding: 5px;
  user-select: none;
  background-color: #e0f7fa;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.toggle-cell:hover {
  background-color: #b2ebf2;
}
</style>
