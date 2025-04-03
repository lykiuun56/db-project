<template>
  <v-container fluid class = "pa-0">
    <v-row>
      <v-col cols = "12">
        <h1 style = "color : white"> Email Open Status</h1>
      </v-col>
    </v-row>

    <v-row class = "mb-4">
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

      <v-col cols="auto">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="#4f1787" v-bind="props">
              Actions
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="fetchScheduledCampaigns">
              <v-list-item-title>View Scheduled Campaigns</v-list-item-title>
            </v-list-item>
            <v-list-item @click="showTagForm">
              <v-list-item-title>Add Mailchimp Tag</v-list-item-title>
            </v-list-item>
            <v-list-item @click="showMailchimpForm">
              <v-list-item-title>Campaign</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openSelectRandomDialog">
              <v-list-item-title>Random Select</v-list-item-title>
            </v-list-item>
            <v-list-item @click="showArchiveTagDialog">
              <v-list-item-title>Archive & Delete Tag</v-list-item-title>
            </v-list-item>
          </v-list>
          </v-menu>
        </v-col>
    </v-row>



    <!-- AG Grid component -->
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
            rowSelection="multiple"
            @row-double-clicked="onRowDoubleClicked">
        </ag-grid-vue>
      </v-col>
    </v-row>


    <!-- Snackbar for Notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <v-btn color="white" text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>

    <!-- Mailchimp Email Form Dialog -->
    <v-dialog v-model="isMailchimpDialogVisible" max-width="600px">
      <v-card  color ="#222222">
        <v-card-title>
          <span class="headline">Send Email via Mailchimp</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="mailchimpForm">
            <v-container>
              <v-row>
                <!-- Input for Subject Line -->
                <v-col cols="12" sm="6">
                  <v-text-field v-model="mailchimpSubject" label="Subject Line" required />
                </v-col>
                <!-- Template Dropdown -->
                <v-col cols="12" sm="6">
                  <v-select
                      v-model="selectedTemplateName"
                      :items="mailchimpTemplates"
                      label="Select Template"
                      required
                  >
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-title>
                          {{ isLoadingTemplates ? 'Loading templates...' : 'No templates available' }}
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <!-- Tag Selection -->
                <v-col cols="12" sm="6">
                  <v-select
                      v-model="selectedTag"
                      :items="mailchimpTags"
                      label="Select Tag"
                      required
                      :loading="isLoadingTags"
                      :disabled="isLoadingTags || !mailchimpTags.length"
                  >
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-title>
                          {{ isLoadingTags ? 'Loading tags...' : 'No tags available for your POC' }}
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <!-- Schedule time -->
                <v-col cols="12">
                  <v-text-field v-model="scheduledTime" label="Schedule Time" type="datetime-local" />
                </v-col>

                <!-- Input for from_name -->
                <v-col cols="12" sm="6">
                  <v-text-field v-model="mailchimpFrom" label="From Name" required />
                </v-col>
                <!-- Input for reply_to -->
                <v-col cols="12" sm="6">
                  <v-text-field v-model="mailchimpReply" label="Reply To" required />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="mailchimpProjectName" label="Project Name" required />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeMailchimpForm">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="submitMailchimpForm">Send Email</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isTagDialogVisible" max-width="600px">
      <v-card color="#222222">
        <v-card-title>
          <span class="headline">Add Mailchimp Tag</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row>
                <!-- Dropdown for Categories -->
                <v-col cols="12" sm="6">
                  <v-select
                      v-model="tagCategories"
                      :items="categoriesList"
                      label="Categories"
                      required
                  />
                </v-col>
                <!-- POC Field -->
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="tagPoc"
                      label="POC"
                      required
                  />
                </v-col>
                <!-- Project Name Field -->
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="tagProjectName"
                      label="Project Name"
                      required
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeTagForm">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="submitTagForm">Submit Tag</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isScheduledCampaignsDialogVisible" max-width="600px">
      <v-card color ="#222222">
        <v-card-title>
          <span class="headline">Scheduled Campaigns</span>
        </v-card-title>
        <v-card-text>
          <!-- Dropdown for listing scheduled campaigns -->
          <v-select
              v-model="selectedCampaign"
              :items="campaignsList"
              label="Select a Scheduled Campaign"
              required
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="deleteCampaign">Delete Campaign</v-btn>
          <v-btn color="blue darken-1" text @click="unscheduleCampaign">Unschedule Campaign</v-btn>
          <v-btn color="blue darken-1" text @click="closeScheduledCampaignsDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Archive & Delete Tag Dialog -->
    <v-dialog v-model="isArchiveTagDialogVisible" max-width="600px">
      <v-card color="#222222">
        <v-card-title>
          <span class="headline">Archive & Delete Tag</span>
        </v-card-title>
        <v-card-text>
          <v-form ref = "archiveTagForm">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                      v-model="tagToArchive"
                      :items="mailchimpTags"
                      label="Select Tag to Archive & Delete"
                      required
                  /></v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeArchiveTagDialog">Cancel</v-btn>
          <v-btn
              color="red darken-1"
              text
              @click="archiveAndDeleteTag"
              :disabled="!tagToArchive"
          >
            Archive & Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <edit-pop-out
        v-model="isEditDialogVisible"
        :rowData="selectedRow"
        :nonEditableFields="['id', 'handle_name', 'email', 'is_Blocked']"
        :isTDGrid="true"
        @save="onSaveEdit"
        @close="isEditDialogVisible = false" />



  </v-container>




</template>
<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from '@/axios';
import EditPopOut from '@/components/EditPopOut.vue';
import { apiBaseUrl } from '@/config';
import { exportToExcel } from '@/utils/exportUtils';

import {mapState} from "vuex";


export default {
  name : 'EmailStatusGrid',
  components: {
    EditPopOut,
    AgGridVue,
  },
  data() {
    return {
      // Grid related
      columnDefs: [
        { field: 'id', headerName: 'ID', checkboxSelection: true },
        { field: 'handleName', headerName: 'Handle Name' },
        { field: 'email', headerName: 'Email' },
        { field: 'location', headerName: 'Location' },
        { field: 'country', headerName: 'Country' },
        { field: 'sentTimes', headerName: 'Sent Times' },
        { field: 'openTimes', headerName: 'Open Times' },
        { field: 'openRate', headerName: 'Open Rate' }
      ],
      rowData: [],
      gridOptions: {
        pagination: true,
        paginationPageSize: 10,
        defaultColDef: {
          sortable: true,
          filter: true,
          resizable: true
        }
      },
      
      // Dialog controls
      isEditDialogVisible: false,
      isMailchimpDialogVisible: false,
      isTagDialogVisible: false,
      isScheduledCampaignsDialogVisible: false,
      isArchiveTagDialogVisible: false,
      
      // Form data
      selectedRow: null,
      mailchimpSubject: '',
      selectedTemplateName: null,
      selectedTag: null,
      scheduledTime: '',
      mailchimpFrom: '',
      mailchimpReply: '',
      mailchimpProjectName: '',
      
      // Tag form data
      tagCategories: '',
      categoriesList: ['Category 1', 'Category 2', 'Category 3'], // Update with your categories
      tagPoc: '',
      tagProjectName: '',
      tagToArchive: null,
      
      // Campaign data
      selectedCampaign: null,
      campaignsList: [],
      
      // Notifications
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      isLoadingTags: false
    }
  },
  computed: {
    ...mapState({
      authToken: state => state.authToken, // Get token from Vuex state
      userPoc: state => state.userPoc,
      mailchimpTags: state => state.mailchimpTags,
      mailchimpTemplates : state => state.mailchimpTemplates,
      isLoadingTemplates: state => state.isLoadingTemplates,
    }),
  },
  methods: {
    async onGridReady( ) {
      try {
        const response = await axios.get(`${apiBaseUrl}/open-status/all`);
        this.rowData = response.data;
      } catch (error) {
        this.showSnackbar('Error loading data', 'error');
      }
    },
    
    onRowDoubleClicked(event) {
      this.selectedRow = event.data;
      this.isEditDialogVisible = true;
    },
    
    async onSaveEdit(updatedData) {
      try {
        await axios.put(`${apiBaseUrl}/api/email-open-stats/${updatedData.id}`, updatedData);
        this.showSnackbar('Record updated successfully', 'success');
        await this.onGridReady();
      } catch (error) {
        this.showSnackbar('Error updating record', 'error');
      }
      this.isEditDialogVisible = false;
    },
    
    showSnackbar(message, color = 'success') {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    
    // Export methods
    async exportAllToExcel() {
      await exportToExcel(this.rowData, 'email_open_stats');
    },
    
    async exportSelectedToExcel() {
      const selectedNodes = this.$refs.agGrid.api.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      await exportToExcel(selectedData, 'selected_email_open_stats');
    },
    
    // Dialog control methods
    showMailchimpForm() {
      this.isMailchimpDialogVisible = true;
    },
    
    closeMailchimpForm() {
      this.isMailchimpDialogVisible = false;
    },
    
    showTagForm() {
      this.isTagDialogVisible = true;
    },
    
    closeTagForm() {
      this.isTagDialogVisible = false;
    },
    
    showArchiveTagDialog() {
      this.isArchiveTagDialogVisible = true;
    },
    
    closeArchiveTagDialog() {
      this.isArchiveTagDialogVisible = false;
    },
    
    async submitMailchimpForm() {
      if (!this.scheduledTime || !this.selectedTag || !this.mailchimpSubject ||
          !this.selectedTemplateName || !this.mailchimpFrom || !this.mailchimpReply) {
        this.showSnackbar('Please fill in all the required fields', 'error');
        return;
      }

      try {
        await axios.post(`${apiBaseUrl}/open-status/createCampaign`, {
          subject: this.mailchimpSubject,
          from_name: this.mailchimpFrom,
          reply_to: this.mailchimpReply,
          templateName: this.selectedTemplateName,
          tag: this.selectedTag,
          scheduledTime: this.scheduledTime,
          poc: this.userPoc,
          projectName: this.mailchimpProjectName,
        });
        this.showSnackbar('Campaign successfully scheduled', 'success');
        this.closeMailchimpForm();
      } catch (error) {
        console.error('Error sending Mailchimp Campaign:', error);
        this.showSnackbar('Failed to send Campaign Info', 'error');
      }
    },
    
    async fetchScheduledCampaigns() {
      try {
        const response = await axios.get(`${apiBaseUrl}/open-status/campaigns`);
        if (response.data) {
          this.campaignsList = response.data; // response.data is now a list of subject lines
          this.isScheduledCampaignsDialogVisible = true; // Open the dialog
        } else {
          this.showSnackbar('No scheduled campaigns found.', 'warning');
        }
      } catch (error) {
        console.error('Error fetching scheduled campaigns:', error);
        this.showSnackbar('Failed to fetch scheduled campaigns.', 'error');
      }
    },

    closeScheduledCampaignsDialog() {
      this.isScheduledCampaignsDialogVisible = false;
      this.selectedCampaign = null;
    },

    async unscheduleCampaign() {
      if (!this.selectedCampaign) {
        this.showSnackbar('Please select a campaign to unschedule.', 'warning');
        return;
      }
      try {
        await axios.post(`${apiBaseUrl}/open-status/campaigns/unschedule`, this.selectedCampaign);
        this.showSnackbar('Campaign unscheduled successfully.', 'success');
        this.closeScheduledCampaignsDialog();
      } catch (error) {
        console.error('Error unscheduling campaign:', error);
        this.showSnackbar('Failed to unschedule campaign.', 'error');
      }
    },

    async deleteCampaign() {
      if (!this.selectedCampaign) {
        this.showSnackbar('Please select a campaign to delete.', 'warning');
        return;
      }
      try {
        await axios.delete(`${apiBaseUrl}/open-status/campaigns/delete`, {
          data: this.selectedCampaign
        });
        this.showSnackbar('Campaign deleted successfully.', 'success');
        this.closeScheduledCampaignsDialog();
      } catch (error) {
        console.error('Error deleting campaign:', error);
        this.showSnackbar('Failed to delete campaign.', 'error');
      }
    },
  }
}
</script>