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
import { deleteRecord, removeRecordFromGrid } from '@/utils/deleteUtils';
import AddPopOut from "@/components/AddPopOut.vue";
import PersistentAlert from "@/components/PersistentAlert.vue";
import {mapState} from "vuex";


export default {
  name : 'EmailStatusGrid',
  components: {
    EditPopOut,
    AgGridVue,
    AddPopOut,
    PersistentAlert,
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
}
</script>