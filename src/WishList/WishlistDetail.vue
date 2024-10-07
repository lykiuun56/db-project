<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 style="color: white" >Wishlist Creators</h1>
      </v-col>
    </v-row>

    <v-row class="mb-4">

    <!-- Export Options Dropdown -->
    <v-col cols="auto">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn color="#33007D" v-bind="props">
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
    <v-spacer></v-spacer>
    <v-col cols="auto">
      <v-btn color="error" @click="deleteSelected" class="button-spacing">Delete Selected</v-btn>
    </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ag-grid-vue
            ref="agGrid"
            class="ag-theme-alpine-dark"
            style="width: 100%; height: 600px;"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :gridOptions="gridOptions"
            @grid-ready="onGridReady"
            :domLayout="'autoHeight'"
            @row-double-clicked="onRowDoubleClicked"
        ></ag-grid-vue>
      </v-col>
    </v-row>

    <!-- Edit Dialog -->
    <v-dialog v-model="isEditDialogVisible" max-width="600px">
      <v-card>
        <v-card-title>Edit Creator</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="updateCreator">
            <v-text-field v-model="selectedRow.handle_name" label="Handle Name"></v-text-field>
            <v-text-field v-model="selectedRow.tiktok_url" label="TikTok URL"></v-text-field>
            <v-text-field v-model="selectedRow.followers" label="Followers"></v-text-field>
            <v-text-field v-model="selectedRow.full_name" label="Full Name"></v-text-field>
            <v-text-field v-model="selectedRow.full_address" label="Full Address"></v-text-field>
            <v-text-field v-model="selectedRow.email" label="Email"></v-text-field>
            <v-text-field v-model="selectedRow.phone" label="Phone"></v-text-field>
            <v-text-field v-model="selectedRow.collaborated_times" label="Collaborated Times"></v-text-field>
            <v-textarea v-model="selectedRow.notes" label="Notes"></v-textarea>
            <v-text-field v-model="selectedRow.poc" label="POC"></v-text-field>
            <v-text-field v-model="selectedRow.state" label="State"></v-text-field>
            <v-text-field v-model="selectedRow.categories" label="Categories"></v-text-field>
            <v-checkbox v-model="selectedRow.is_Blocked" label="Is Blocked"></v-checkbox>
            <v-checkbox v-model="selectedRow.linked" label="Linked"></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="isEditDialogVisible = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="updateCreator">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import { apiBaseUrl } from '@/config';
import { exportToExcel } from '@/utils/exportUtils';

export default {
  name: 'WishlistCreators',
  components: {
    AgGridVue,
  },
  props: {
    wishlistId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columnDefs: this.getColumnDefs(),
      rowData: null,
      gridOptions: this.getGridOptions(),
      selectedRow: null,
      isEditDialogVisible: false,
      gridApi: null,
    };
  },
  async mounted() {
    await this.fetchWishlistCreators();
  },
  methods: {
    getColumnDefs() {
      return [
        // {
        //   headerName: 'ID',
        //   field: 'id',
        //   sortable: true,
        //   filter: true,
        //   checkboxSelection: true,
        //   headerCheckboxSelection: true
        // },
        {headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true,checkboxSelection: true,headerCheckboxSelection: true},
        {headerName: 'Tiktok URL', field: 'tiktok_url', sortable: true, filter: true, width: 300},
        {headerName: 'Followers', field: 'followers', sortable: true, filter: true},
        {headerName: 'Full Name', field: 'full_name', sortable: true, filter: true},
        {headerName: 'Full Address', field: 'full_address', sortable: true, filter: true},
        {headerName: 'Email', field: 'email', sortable: true, filter: true},
        {headerName: 'Phone', field: 'phone', sortable: true, filter: true},
        {headerName: 'Collaborated Time', field: 'collaborated_times', sortable: true, filter: true},
        {headerName: 'Notes', field: 'notes', sortable: true, filter: true},
        {headerName: 'POC', field: 'poc', sortable: true, filter: true},
        {headerName: 'State', field: 'state', sortable: true, filter: true},
        {headerName: '最后合作种类', field: 'categories', sortable: true, filter: true},
        {
          headerName: 'Is Blocked',
          field: 'is_Blocked',
          width: 150,
          filter: true,
          editable: false,
          valueFormatter: params => params.value === null ? 'N/A' : (params.value ? 'Yes' : 'No'),
          cellRenderer: params => {
            const isChecked = params.value === true;
            return `<input type="checkbox" ${isChecked ? 'checked' : ''} disabled />`;
          }
        },
        {
          headerName: 'Expired Date',
          field: 'expired_date',
          sortable: true,
          filter: true,
          valueFormatter: this.formatDateTime,
        },
        {
          headerName: 'Linked',
          field: 'linked',
          width: 150,
          filter: true,
          editable: false,
          valueFormatter: params => params.value === null ? 'N/A' : (params.value ? 'Yes' : 'No'),
          cellRenderer: params => {
            const isChecked = params.value === true;
            return `<input type="checkbox" ${isChecked ? 'checked' : ''} disabled />`;
          }
        },
      ];
    },
    getGridOptions() {
      return {
        pagination: true,
        paginationPageSize: 10,
        defaultColDef: {resizable: true},
        rowSelection: 'multiple'
      };
    },
    async fetchWishlistCreators() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/wishlists/${this.wishlistId}/creators`);
        this.rowData = response.data;
      } catch (error) {
        console.error('Error fetching wishlist creators:', error);
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
    },
    onRowDoubleClicked(event) {
      this.selectedRow = {...event.data};
      this.isEditDialogVisible = true;
    },
    exportAllToExcel() {
      exportToExcel(this.rowData, "wishlist_creators_all");
    },
    exportSelectedToExcel() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      exportToExcel(selectedData, "wishlist_creators_selected");
    },
    async deleteSelected() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);

      if (selectedData.length === 0) {
        alert("Please select at least one creator to delete.");
        return;
      }

      const confirmDelete = confirm(`Are you sure you want to delete ${selectedData.length} creator(s)?`);
      if (!confirmDelete) return;

      for (const data of selectedData) {
        try {
          await axios.delete(`${apiBaseUrl}/api/wishlists/${this.wishlistId}/removeCreator/${data.id}`);
        } catch (error) {
          console.error('Error deleting creator:', error);
        }
      }

      await this.fetchWishlistCreators();
    },
    async updateCreator() {
      try {
        await axios.put(`${apiBaseUrl}/api/wishlists/${this.wishlistId}/creators/${this.selectedRow.id}`, this.selectedRow);
        this.isEditDialogVisible = false;
        await this.fetchWishlistCreators();
      } catch (error) {
        console.error('Error updating creator:', error);
      }
    },
    formatDateTime(params) {
      if (!params.value) return '';
      const date = new Date(params.value);
      return date.toLocaleString();
    },
  }
};
</script>

<style scoped>
.button-spacing {
  margin-right: 8px;
}
</style>