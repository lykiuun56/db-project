<template>
  <v-container fluid class="wishlist-manager pa-0">

    <!-- Top row with Create New Wishlist and Wishlist Selection -->
    <v-row class="px-6 py-4">
      <v-col cols="4">
        <v-text-field
          v-model="newWishlistName"
          label="Create New Wishlist"
          dark
          dense
          filled
          background-color="#2A2A2A"
          hide-details
          >
          <template v-slot:append>
            <v-btn
              small
              icon
              color="primary"
              @click="createNewWishlist"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>

        </v-text-field>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="selectedWishlist"
          :items="wishlists"
          item-title="name"
          item-value="id"
          label="Select Wishlist"
          @update:model-value="handleWishlistSelection"
          @click:clear="clearSelection"
        >
        <template v-slot:item="{ item ,props}">
            <v-list-item v-bind ="props" :title="item.name">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>
    
    <v-row class="px-6 py-2">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn icon color="#4700CF" dark class="mx-1" @click="exportAllToExcel">
          <v-icon>mdi-export</v-icon>
        </v-btn>
        <v-btn icon color="#4700CF" dark class="mx-1" @click="exportSelectedToExcel">
          <v-icon>mdi-export-variant</v-icon>
        </v-btn>
        <v-btn icon color="#E57373" dark class="mx-1" @click="deleteSelected">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Debug info -->
    <v-row v-if="debug" class="px-6">
      <v-col>
        <pre>Selected Wishlist: {{ selectedWishlist }}</pre>
        <pre>Wishlists: {{ wishlists }}</pre>
      </v-col>
    </v-row>

    <!-- Wishlist Grid -->
    <v-row v-if="selectedWishlist" class="fill-height ma-0">
      <v-col cols="12" class="pa-0">
        <ag-grid-vue
          class="ag-theme-alpine-dark wishlist-grid"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :gridOptions="gridOptions"
          @grid-ready="onGridReady"
        ></ag-grid-vue>
      </v-col>
    </v-row>
    <v-row v-else class="fill-height ma-0">
      <v-col cols="12" class="d-flex justify-center align-center">
        <p>Please select a wishlist to view its contents.</p>
      </v-col>
    </v-row>

    <!-- Error and Success Messages -->
    <v-snackbar v-model="showError" color="error" :timeout="3000">
      {{ error }}
    </v-snackbar>
    <v-snackbar v-model="showSuccess" color="success" :timeout="3000">
      {{ successMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import { apiBaseUrl } from '@/config';
import { exportToExcel } from '@/utils/exportUtils';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'WishlistManager',
  components: {
    AgGridVue,
  },
  data() {
    return {
      newWishlistName: '',
      selectedWishlist: null,
      rowData: [],
      columnDefs: [
        {headerName: '', field: 'checkbox', checkboxSelection: true, headerCheckboxSelection: true, width: 40},
        {headerName: 'Handle Name', field: 'handle_name', sortable: true, filter: true},
        {headerName: 'Tiktok URL', field: 'tiktok_url', sortable: true, filter: true},
        {headerName: 'Followers', field: 'followers', sortable: true, filter: true},
        {headerName: 'Full Name', field: 'full_name', sortable: true, filter: true},
        {headerName: 'Email', field: 'email', sortable: true, filter: true},
      ],
      gridOptions: {
        rowSelection: 'multiple',
        suppressCellSelection: true,
        pagination: true,
        paginationPageSize: 10,
      },
      gridApi: null,
      error: '',
      successMessage: '',
      showError: false,
      showSuccess: false,
      menu: false,
      debug: false, // Set to false in production
      selectedWishlistId: null,
      wishlistDetails: null,
    };
  },
  computed: {
    ...mapState(['userId', 'wishlists']),
    selectedWishlistName() {
      const selectedWishlist = this.wishlists.find(w => w.id === this.selectedWishlist);
      return selectedWishlist ? selectedWishlist.name : '';
    },
  },
  methods: {
    ...mapActions(['fetchWishlists', 'createWishlist']),
    async createNewWishlist() {
      if (!this.newWishlistName.trim()) {
        this.showError = true;
        this.error = 'Please enter a wishlist name';
        return;
      }

      try {
        await this.createWishlist({ name: this.newWishlistName.trim() });
        this.showSuccess = true;
        this.successMessage = 'Wishlist created successfully!';
        this.newWishlistName = '';
        await this.fetchWishlists(this.userId);
      } catch (error) {
        this.showError = true;
        this.error = error.response?.data?.message || 'Failed to create wishlist. Please try again.';
      }
    },
    async fetchWishlistCreators(wishlistId) {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/wishlists/${wishlistId}/creators`);
        this.rowData = response.data;
   
      } catch (error) {
        console.error('Error fetching wishlist creators:', error);
        }
    },
    onGridReady(params) {
      this.gridApi = params.api;
    },
    exportAllToExcel() {
      if (this.rowData.length > 0) {
        exportToExcel(this.rowData, "wishlist_creators_all");
      } else {
        this.showError = true;
        this.error = "No data to export.";
      }
    },
    exportSelectedToExcel() {
      const selectedData = this.gridApi.getSelectedRows();
      if (selectedData.length > 0) {
        exportToExcel(selectedData, "wishlist_creators_selected");
      } else {
        this.showError = true;
        this.error = "No rows selected. Please select rows to export.";
      }
    },
    async deleteSelected() {
      const selectedData = this.gridApi.getSelectedRows();
      if (selectedData.length === 0) {
        this.showError = true;
        this.error = "Please select at least one creator to delete.";
        return;
      }

      const confirmDelete = confirm(`Are you sure you want to delete ${selectedData.length} creator(s)?`);
      if (!confirmDelete) return;

      try {
        for (const data of selectedData) {
          await axios.delete(`${apiBaseUrl}/api/wishlists/${this.selectedWishlist.id}/removeCreator/${data.id}`);
        }
        await this.fetchWishlistCreators(this.selectedWishlist.id);
        this.showSuccess = true;
        this.successMessage = `Successfully deleted ${selectedData.length} creator(s).`;
      } catch (error) {
        this.showError = true;
        this.error = 'Failed to delete some creators. Please try again.';
      }
    },
    handleWishlistSelection(wishlistId) {
      console.log('Wishlist selected:', wishlistId);
      this.selectedWishlist = wishlistId;
      this.wishlistDetails = null; // Reset details before fetching new ones
      if (wishlistId) {
        this.fetchWishlistCreators(wishlistId);
      }
    },
    clearSelection() {
      this.selectedWishlist = null;
      this.rowData = [];
      if (this.gridApi) {
        this.gridApi.setRowData([]);
      }
    },
  },
  watch: {
    selectedWishlist: {
      handler(newValue) {
        if (newValue) {
          this.fetchWishlistCreators(newValue);
        }
      },
      immediate: true
    },
    wishlists: {
      handler(newValue) {
        if (newValue.length && !this.selectedWishlist) {
          this.selectedWishlist = newValue[0];
        }
      },
      immediate: true
    }
  },
  async created() {
    if (this.userId) {
      await this.fetchWishlists(this.userId);
      // Remove automatic selection of the first wishlist
      // this.selectedWishlist = this.wishlists.length ? this.wishlists[0].id : null;
    }
  },
};
</script>

<style scoped>
.wishlist-manager {
  background-color: #1E1E1E;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.wishlist-grid {
  height: calc(100vh - 80px); /* Adjust this value based on the height of your top row */
  width: 100%;
}
:deep(.v-text-field__details) {
  display: none;
}
:deep(.v-input__slot) {
  min-height: 40px !important;
}
.v-btn.v-btn--outlined {
  border-color: #4700CF;
}
.wishlist-toggle {
  display: flex;
  flex-wrap: wrap;
}
.wishlist-toggle .v-btn {
  flex-grow: 0;
}
.v-menu__content {
  background-color: #2A2A2A;
}
.v-list {
  background-color: #2A2A2A;
}
.v-list-item {
  color: white;
}
.v-list-item:hover {
  background-color: #4700CF;
}
.wishlist-select-btn {
  width: 100%;
  justify-content: space-between;
}
.wishlist-select-wrapper {
  position: relative;
  width: 100%;
}
.wishlist-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #2A2A2A;
  margin-top: 5px;
}
.v-list {
  background-color: #2A2A2A;
  padding: 0;
}
.v-list-item {
  color: white;
}
.v-list-item:hover {
  background-color: #4700CF;
}
.wishlist-btn {
  background-color: #2A2A2A;
  color: white;
  margin-right: 8px;
  margin-bottom: 8px;
}
.wishlist-btn.selected {
  background-color: #4700CF;
}
</style>
