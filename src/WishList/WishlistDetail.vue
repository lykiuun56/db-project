<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Wishlist Creators</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="auto">
        <v-btn color="primary" @click="exportAllToExcel" class="button-spacing">Export All</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="secondary" @click="exportSelectedToExcel" class="button-spacing">Export Selected</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="showAddForm = true" class="button-spacing">Add Creator</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="error" @click="deleteSelected" class="button-spacing">Delete Selected</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ag-grid-vue
            ref="agGrid"
            class="ag-theme-alpine"
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

    <!-- Add or Edit Creator Dialogs -->
    <edit-pop-out
        v-model="isEditDialogVisible"
        :rowData="selectedRow"
        :nonEditableFields="['id', 'email']"
        @save="onSaveEdit"
        @close="isEditDialogVisible = false"
    />

    <add-pop-out
        :visible="showAddForm"
        :title="'Add Creator'"
        :fields="fields"
        :formData="formData"
        @close="showAddForm = false"
        @save="submitAdd"
    />
  </v-container>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import EditPopOut from '@/components/EditPopOut.vue';
import AddPopOut from '@/components/AddPopOut.vue';
import { apiBaseUrl } from '@/config';
import { exportToExcel } from '@/utils/exportUtils';

export default {
  name: 'WishlistCreators',
  components: {
    AgGridVue,
    EditPopOut,
    AddPopOut
  },
  props: {
    wishlistId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      showAddForm: false,
      formData: {
        handle_name: '',
        followers: '',
        email: '',
        tiktok_url: '',
        categories: '',
        full_name: '',
        state: '',
        full_address: '',
        phone: '',
        collaborated_times: '',
        poc: '',
        notes: '',
        is_Blocked: false
      },
      fields: [
        { name: 'project_name', label: 'Project Name', required: true},
        { name: 'poc', label: 'POC', required: true},
        { name: 'handle_name', label: 'Handle Name', required: true },
        { name: 'tiktok_url', label: 'TikTok URL' },
        { name: 'followers', label: 'Followers' },
        { name: 'categories', label: 'Categories', type: 'select', options: this.categoriesList },
        { name: 'full_name', label: 'Full Name' },
        { name: 'state', label: 'State' },
        { name: 'full_address', label: 'Full Address' },
        { name: 'email', label: 'Email', required: true},
        { name: 'phone', label: 'Phone' },
        { name: 'notes', label: 'Notes' },
        { name: 'linked', label: 'Linked'}
      ],
      columnDefs: this.getColumnDefs(),
      rowData: null, // This will hold the creator data
      gridOptions: this.getGridOptions(),
      selectedRow: null,
      isEditDialogVisible: false,
    };
  },
  async mounted() {
    await this.fetchWishlistCreators(this.wishlistId);
  },
  methods: {
    getColumnDefs() {
      return [
        { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true, headerCheckboxSelection: true},
        { headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true },
        { headerName: 'Tiktok URL', field: 'tiktok_url', sortable: true, filter: true, width: 300 },
        { headerName: 'Followers', field: 'followers', sortable: true, filter: true },
        { headerName: 'Full Name', field: 'full_name', sortable: true, filter: true },
        { headerName: 'Full Address', field: 'full_address', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
        { headerName: 'Collaborated Time', field: 'collaborated_times', sortable: true, filter: true},
        { headerName: 'Notes', field: 'notes', sortable: true, filter: true },
        { headerName: 'POC', field: 'poc', sortable: true, filter: true },
        { headerName: 'State', field: 'state', sortable: true, filter: true },
        { headerName: '最后合作种类', field: 'categories', sortable: true, filter: true },
        {
          headerName: 'Is Blocked',
          field: 'is_Blocked',
          width: 150,
          filter: true,
          editable: false, // Make the checkbox non-editable
          valueFormatter: params => params.value === null ? 'N/A' : (params.value ? 'Yes' : 'No'), // Handle null, true, and false
          cellRenderer: params => {
            const isChecked = params.value === true; // Set checked only if true
            return `<input type="checkbox" ${isChecked ? 'checked' : ''} disabled />`; // Checkbox, but disabled
          }
        },
        {
          headerName: 'Expired Date',
          field: 'expired_date',
          sortable: true,
          filter: true,
          valueFormatter: this.formatDateTime,  // Call the custom formatter
        },
        { headerName: 'Linked',
          field: 'linked',
          width: 150,
          filter: true,
          editable: false, // Make the checkbox non-editable
          valueFormatter: params => params.value === null ? 'N/A' : (params.value ? 'Yes' : 'No'), // Handle null, true, and false
          cellRenderer: params => {
            const isChecked = params.value === true; // Set checked only if true
            return `<input type="checkbox" ${isChecked ? 'checked' : ''} disabled />`; // Checkbox, but disabled
          }
        },
      ];
    },
    getGridOptions() {
      return {
        pagination: true,
        paginationPageSize: 10,
        defaultColDef: { resizable: true },
        rowSelection: 'multiple'
      };
    },
    async fetchWishlistCreators(wishlistId) {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/wishlists/${wishlistId}/creators`);
        this.rowData = response.data; // Assuming the API returns an array of creators
      } catch (error) {
        console.error('Error fetching wishlist creators:', error);
      }
    },
    onRowDoubleClicked(event) {
      this.selectedRow = event.data;
      this.isEditDialogVisible = true;
    },
    async onSaveEdit(updatedData) {
      try {
        await axios.put(`${apiBaseUrl}/api/creators/${updatedData.id}`, updatedData);
        await this.fetchWishlistCreators(this.wishlistId); // Refresh the grid data
      } catch (error) {
        console.error('Error updating creator data:', error);
      } finally {
        this.isEditDialogVisible = false;
      }
    },
    async submitAdd(newCreatorData) {
      try {
        await axios.post(`${apiBaseUrl}/api/creators`, { ...newCreatorData, wishlistId: this.wishlistId });
        await this.fetchWishlistCreators(this.wishlistId); // Refresh the grid data after adding
      } catch (error) {
        console.error('Error adding new creator:', error);
      } finally {
        this.showAddForm = false;
      }
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

      for (const data of selectedData) {
        try {
          await axios.delete(`${apiBaseUrl}/api/creators/${data.id}`);
        } catch (error) {
          console.error('Error deleting creator:', error);
        }
      }

      await this.fetchWishlistCreators(this.wishlistId); // Refresh the grid data after deleting
    },
  }
};
</script>


<style scoped>
/* Add custom styles if needed */
.my-4 {
  margin: 16px 0;
}
</style>
