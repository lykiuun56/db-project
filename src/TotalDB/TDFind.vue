<template>
  <v-container fluid>
    <!-- Simple Search Row -->
    <v-row>
      <v-col cols="3">
        <v-text-field v-model="handleName" label="Handle Name" dense></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="email" label="Email" dense></v-text-field>
      </v-col>
      <v-col cols="3" class="text-center">
        <v-btn color="primary" @click="simpleSearch">Simple Search</v-btn>
      </v-col>
    </v-row>

    <!-- Advanced Search Row -->
    <v-row>
      <v-col cols="3">
        <h4>Followers:</h4>
        <v-text-field v-model="minFollowers" label="Min Followers" dense></v-text-field>
        <v-text-field v-model="maxFollowers" label="Max Followers" dense></v-text-field>
      </v-col>
      <v-col cols="3">
        <h4>Blocked:</h4>
        <v-select
            v-model="selectedIs_blocked"
            :items="Is_blockedOptions"
            item-text="text"
            item-value="value"
            label="Is Blocked"
            dense
        ></v-select>
      </v-col>
      <v-col cols="3" class="text-center">
        <v-btn color="primary" @click="advancedSearch">Advanced Search</v-btn>
      </v-col>
    </v-row>

    <!-- Search Results -->
    <v-row>
      <v-col cols="12">
        <h3 class="text-center">Search Results</h3>
        <v-data-table
            :headers="headers"
            :items="items"
            item-key="handle_name"
            class="elevation-1"
            show-select
            v-model:selected="selectedItems"
            hide-default-footer
            dense
        >
          <template v-slot:[`item.is_blocked`]="{ item }">
            <span>{{ item.is_blocked === 1 ? 'Yes' : 'No' }}</span>
          </template>
        </v-data-table>
        <v-btn color="primary" @click="exportSelectedRows">Export Selected Rows</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      handleName: '',
      email: '',
      minFollowers: '',
      maxFollowers: '',
      selectedIs_blocked: null,
      Is_blockedOptions: [
        {text: 'Yes', value: 1},
        {text: 'No', value: 0}
      ],
      items: [],
      selectedItems: [],  // This will hold the selected rows
      headers: [
        { text: 'Handle Name', value: 'handle_name', align: 'start' },
        { text: 'Email', value: 'email' },
        { text: 'Is Blocked', value: 'is_blocked' }
      ],
    };
  },
  methods: {
    async simpleSearch() {
      if (!this.handleName && !this.email) {
        alert('Please enter either Handle Name or Email for search.');
        return;
      }
      try {
        const params = {};
        if (this.handleName) params.handleName = this.handleName;
        if (this.email) params.email = this.email;

        const response = await axios.get('http://localhost:8081/api/total/singleSearch', {params});
        this.items = response.data;
      } catch (error) {
        console.error(error);
        alert('Search failed');
      }
    },
    async advancedSearch() {
      if ((!this.minFollowers || !this.maxFollowers) && this.selectedIs_blocked === null) {
        alert('Please enter at least one advanced search criteria.');
        return;
      }
      try {
        const searchCriteriaList = [];

        if (this.minFollowers && this.maxFollowers) {
          searchCriteriaList.push({
            key: 'followers',
            operation: 'BETWEEN',
            value: `${this.minFollowers}`,
            secondValue: `${this.maxFollowers}`,
          });
        }
        if (this.selectedIs_blocked !== null) {
          searchCriteriaList.push({key: 'is_blocked', operation: '=', value: this.selectedIs_blocked});
        }

        const response = await axios.post('http://localhost:8081/api/total/search', searchCriteriaList);
        this.items = response.data;
      } catch (error) {
        console.error(error);
        alert('Advanced search failed');
      }
    },
    exportSelectedRows() {
      // Convert selected items to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(this.selectedItems);

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Rows");

      // Generate Excel file and trigger a download
      XLSX.writeFile(workbook, "selected_rows.xlsx");
    }
  },
};
</script>

<style scoped>
.full-width {
  width: 100%;
}

.col-25 {
  width: 25%;
  text-align: center;
}
</style>
