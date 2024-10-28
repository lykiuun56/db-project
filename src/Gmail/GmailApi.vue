<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>Gmail API Interaction</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-text-field v-model="userId" label="User ID" outlined></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="getInboxEmails">Get Inbox Emails</v-btn>
        <v-btn color="primary" @click="showSendEmailDialog">Send Email</v-btn>
        <v-btn color="primary" @click="showSendEmailDialog">Send Email</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <email-item 
          v-for="email in emails" 
          :key="email.id" 
          :email="email" 
          @email-clicked="getEmailDetails"
        />
      </v-col>
    </v-row>

    <!-- Email Details Dialog -->
    <v-dialog v-model="emailDetailsDialog" max-width="800px" @click:outside="closeEmailDetails">
      <v-card class="email-details">
        <!-- Subject Header -->
        <v-card-title class="subject-header pa-4">
          {{ selectedEmail.subject }}
        </v-card-title>

        <!-- Email Metadata -->
        <v-card-text class="pa-4">
          <div class="email-metadata">
            <div class="metadata-row">
              <div class="metadata-label">From:</div>
              <div class="metadata-content">
                {{ selectedEmail.from }}
              </div>
            </div>
            
            <div class="metadata-row">
              <div class="metadata-label">To:</div>
              <div class="metadata-content">
                {{ selectedEmail.to }}
              </div>
            </div>
            
            <div class="metadata-row">
              <div class="metadata-label">Date:</div>
              <div class="metadata-content">
                {{ formatDate(selectedEmail.date) }}
              </div>
            </div>
          </div>

          <v-divider class="my-3"></v-divider>

          <!-- Email Body -->
          <div 
            class="email-body" 
            :class="{ 'image-content': selectedEmail.hasImages }"
            v-html="selectedEmail.body"
          ></div>

          <!-- Labels -->
          <div v-if="selectedEmail.labels && selectedEmail.labels.length" class="mt-4">
            <v-chip
              v-for="label in selectedEmail.labels"
              :key="label"
              small
              class="mr-2"
              color="grey lighten-3"
            >
              {{ label }}
            </v-chip>
          </div>
        </v-card-text>

        <!-- Action Buttons -->
        <v-card-actions class="pa-4">
          <v-btn text color="primary" @click="showAddLabelDialog">ADD LABEL</v-btn>
          <v-btn text color="primary" @click="showReplyDialog">REPLY</v-btn>
          <v-btn text color="success" @click="showAddToCampaignDialog">ADD TO CAMPAIGN</v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="closeEmailDetails">CLOSE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Label Dialog -->
    <v-dialog v-model="addLabelDialog" max-width="400px">
      <v-card>
        <v-card-title>Add Label</v-card-title>
        <v-card-text>
          <v-text-field v-model="labelId" label="Label ID"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="addLabelDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="addLabel">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Reply Dialog -->
    <v-dialog v-model="replyDialog" max-width="600px">
      <v-card>
        <v-card-title>Reply to Email</v-card-title>
        <v-card-text>
          <v-textarea v-model="replyBody" label="Reply"></v-textarea>
          <v-file-input v-model="replyAttachment" label="Attachment"></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="replyDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="sendReply">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Send Email Dialog -->
    <v-dialog v-model="sendEmailDialog" max-width="600px">
      <v-card>
        <v-card-title>Send Email</v-card-title>
        <v-card-text>
          <v-text-field v-model="newEmail.to" label="To"></v-text-field>
          <v-text-field v-model="newEmail.cc" label="CC"></v-text-field>
          <v-text-field v-model="newEmail.bcc" label="BCC"></v-text-field>
          <v-text-field v-model="newEmail.subject" label="Subject"></v-text-field>
          <v-textarea v-model="newEmail.body" label="Body"></v-textarea>
          <v-file-input v-model="newEmail.attachment" label="Attachment"></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="sendEmailDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="sendEmail">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add to Campaign Dialog -->
    <v-dialog v-model="addToCampaignDialog" max-width="800px">
      <v-card>
        <v-card-title>Add to Campaign</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitAddToCampaign">
            <v-row>
              <!-- Campaign Selector -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectedCampaignForEntry"
                  :items="campaigns"
                  item-title="name"
                  item-value="id"
                  label="Select Campaign"
                  required
                ></v-select>
              </v-col>
              
              <!-- Auto-filled Email -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="campaignEntry.email"
                  label="Email"
                  disabled
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field v-model="campaignEntry.handle_name" label="Handle Name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="campaignEntry.tiktokUrl" label="Tiktok Url"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="campaignEntry.status" :items="statusOptions" label="Status"></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="campaignEntry.poc" :items="pocOptions" label="POC"></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="campaignEntry.nycScheduleDate" label="NYC Schedule Date" type="date"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="campaignEntry.videoLink" label="Video Link"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="campaignEntry.attitude" label="Attitude"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="campaignEntry.price" label="Price" type="number"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="campaignEntry.note" label="Note"></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="campaignEntry.completion" label="Completion" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="campaignEntry.type" :items="typeOptions" label="Type"></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="addToCampaignDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="submitAddToCampaign">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import { apiBaseUrl } from '@/config';
import EmailItem from './EmailItem.vue';

export default {
  components: {
    EmailItem
  },
  data() {
    return {
      userId: 'me', // Use 'me' to refer to the authenticated user
      emails: [],
      emailDetailsDialog: false,
      selectedEmail: {},
      addLabelDialog: false,
      labelId: '',
      replyDialog: false,
      replyBody: '',
      replyAttachment: null,
      sendEmailDialog: false,
      newEmail: {
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
        attachment: null
      },
      loading: false,
      addToCampaignDialog: false,
      selectedCampaignForEntry: null,
      campaigns: [], // Will be populated with available campaigns
      campaignEntry: {
        handle_name: '',
        email: '',
        tiktokUrl: '',
        status: '',
        poc: '',
        nycScheduleDate: '',
        videoLink: '',
        attitude: '',
        price: null,
        note: '',
        completion: null,
        type: '',
      },
      statusOptions: ['Pending', 'In Progress', 'Completed'],
      pocOptions: ['A', 'B'],
      typeOptions: ['Type A', 'Type B'],
    };
  },
  methods: {
    async getInboxEmails() {
      this.loading = true;
      this.loading = true;
      try {
        const res = await axios.get(`${apiBaseUrl}/api/gmail/inbox/received`, { params: { userId: this.userId } });
        this.emails = this.formatEmails(res.data);
      } catch (error) {
        console.error('Error fetching inbox emails:', error);
      } finally {
        this.loading = false;
      }
    },
    async getEmailDetails(emailId) {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/gmail/email/${emailId}`, { params: { userId: this.userId } });
        this.selectedEmail = this.parseEmailDetails(res.data);
        this.emailDetailsDialog = true;
        
        // Check if the email is unread
        if (this.selectedEmail.isUnread) {
          // Mark the email as read
          await this.markAsRead(emailId);
        }
      } catch (error) {
        console.error('Error fetching email details:', error);
      }
    },
    formatEmails(emails) {
      return emails.map(email => {
        const headers = email.payload.headers.reduce((acc, header) => {
          acc[header.name] = header.value;
          return acc;
        }, {});

        return {
          id: email.id,
          from: headers.From,
          to: headers.To,
          subject: headers.Subject,
          date: headers.Date,
          snippet: email.snippet || 'No snippet available',
          isUnread: email.labelIds.includes('UNREAD'),
          labels: email.labelIds.filter(label => !['INBOX', 'UNREAD', 'SENT', 'IMPORTANT'].includes(label))
        };
      });
    },
    parseEmailDetails(emailData) {
      const headers = emailData.payload.headers.reduce((acc, header) => {
        acc[header.name.toLowerCase()] = header.value;
        return acc;
      }, {});

      let body = '';
      let attachments = [];
      let hasImages = false;

      // Helper function to decode base64
      const decodeBase64 = (data) => {
        try {
          return atob(data.replace(/-/g, '+').replace(/_/g, '/'));
        } catch (e) {
          console.error('Error decoding base64:', e);
          return '';
        }
      };

      // Helper function to check if content contains images
      const containsImages = (content) => {
        return /<img[^>]+>/i.test(content);
      };

      // Helper function to clean marketing email content
      const cleanMarketingEmail = (content) => {
        if (!content) return '';
        
        if (containsImages(content)) {
          hasImages = true;
          // Remove tracking URLs and unnecessary text
          content = content.replace(/https?:\/\/[^\s<>"]+?(?:jpg|jpeg|gif|png)[^\s<>"']*/gi, ''); // Keep image URLs
          content = content.replace(/https?:\/\/[a-zA-Z0-9./-]+\.[a-zA-Z]{2,}(?:[/?][^\s<>"']*)?/g, '');
          content = content.replace(/If you('re| are) having trouble viewing this email[^<]*/gi, '');
          content = content.replace(/If you('d| would) rather not receive future emails[^<]*/gi, '');
          content = content.replace(/To unsubscribe[^<]*/gi, '');
          content = content.replace(/<(p|div)[^>]*>(\s|&nbsp;)*<\/\1>/gi, '');
        }
        
        return content;
      };

      // Process message parts recursively
      const processContent = (parts) => {
        let htmlContent = '';
        let plainContent = '';

        const processPartContent = (part) => {
          if (part.mimeType === 'text/html' && part.body.data) {
            const decodedContent = decodeBase64(part.body.data);
            htmlContent = cleanMarketingEmail(decodedContent);
          } else if (part.mimeType === 'text/plain' && part.body.data && !hasImages) {
            plainContent = decodeBase64(part.body.data);
          } else if (part.filename && part.filename.length > 0) {
            attachments.push({
              filename: part.filename,
              mimeType: part.mimeType,
              size: part.body.size,
              attachmentId: part.body.attachmentId
            });
          }
          
          if (part.parts) {
            part.parts.forEach(processPartContent);
          }
        };

        if (Array.isArray(parts)) {
          parts.forEach(processPartContent);
        } else if (parts) {
          processPartContent(parts);
        }

        return htmlContent || plainContent;
      };

      // Get email content
      if (emailData.payload.parts) {
        body = processContent(emailData.payload.parts);
      } else if (emailData.payload.body.data) {
        const decodedContent = decodeBase64(emailData.payload.body.data);
        body = cleanMarketingEmail(decodedContent);
      }

      // Only wrap in pre tags if it's plain text and has no images
      if (!body.includes('<html') && !body.includes('<body') && !hasImages) {
        body = `<div style="white-space: pre-wrap; font-family: inherit;">${body}</div>`;
      }

      return {
        id: emailData.id,
        threadId: emailData.threadId,
        subject: headers.subject || 'No Subject',
        from: headers.from || '',
        to: headers.to || '',
        date: headers.date || '',
        body: body,
        attachments: attachments,
        isUnread: emailData.labelIds?.includes('UNREAD'),
        labels: emailData.labelIds?.filter(label => !['INBOX', 'UNREAD', 'SENT', 'IMPORTANT'].includes(label)) || [],
        hasImages: hasImages
      };
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    async markAsRead(emailId) {
      try {
        await axios.post(`${apiBaseUrl}/api/gmail/email/${emailId}/read`, null, {
          params: { userId: this.userId }
        });
        
        // Update the selectedEmail
        if (this.selectedEmail.id === emailId) {
          this.selectedEmail = { ...this.selectedEmail, isUnread: false };
        }
      } catch (error) {
        console.error('Error marking email as read:', error);
      }
    },
    showAddLabelDialog() {
      this.addLabelDialog = true;
    },
    async addLabel() {
      try {
        await axios.post(`${apiBaseUrl}/api/gmail/email/${this.selectedEmail.id}/label`, null, {
          params: { userId: this.userId, labelId: this.labelId }
        });
        
        // Update the selectedEmail
        this.selectedEmail.labels = [...this.selectedEmail.labels, this.labelId];
        
        // Update the email in the list
        const index = this.emails.findIndex(email => email.id === this.selectedEmail.id);
        if (index !== -1) {
          this.$set(this.emails, index, {
            ...this.emails[index],
            labels: [...this.emails[index].labels, this.labelId]
          });
        }
        
        this.addLabelDialog = false;
        this.labelId = '';
      } catch (error) {
        console.error('Error adding label to email:', error);
      }
    },
    showReplyDialog() {
      this.replyDialog = true;
    },
    async sendReply() {
      try {
        const formData = new FormData();
        formData.append('userId', this.userId);
        formData.append('replyBody', this.replyBody);
        if (this.replyAttachment) {
          formData.append('attachmentFile', this.replyAttachment);
        }

        await axios.post(`${apiBaseUrl}/api/gmail/email/${this.selectedEmail.id}/reply`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        this.replyDialog = false;
        this.replyBody = '';
        this.replyAttachment = null;
      } catch (error) {
        console.error('Error sending reply:', error);
      }
    },
    showSendEmailDialog() {
      this.sendEmailDialog = true;
    },
    async sendEmail() {
      try {
        const formData = new FormData();
        formData.append('userId', this.userId);
        formData.append('recipientEmails', this.newEmail.to);
        formData.append('subject', this.newEmail.subject);
        formData.append('body', this.newEmail.body);
        if (this.newEmail.cc) formData.append('ccEmails', this.newEmail.cc);
        if (this.newEmail.bcc) formData.append('bccEmails', this.newEmail.bcc);
        if (this.newEmail.attachment) {
          formData.append('attachmentFile', this.newEmail.attachment);
        }

        await axios.post(`${apiBaseUrl}/api/gmail/send`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        this.sendEmailDialog = false;
        this.newEmail = {
          to: '',
          cc: '',
          bcc: '',
          subject: '',
          body: '',
          attachment: null
        };
      } catch (error) {
        console.error('Error sending email:', error);
      }
    },
    downloadAttachment(attachment) {
      if (!attachment.data) {
        console.error('Attachment data not available');
        // You might want to show an error message to the user here
        return;
      }

      const binaryString = atob(attachment.data.replace(/-/g, '+').replace(/_/g, '/'));
      const byteArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: attachment.mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', attachment.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    closeEmailDetails() {
      this.emailDetailsDialog = false;
      this.getInboxEmails(); // Refresh the inbox when closing email details
    },
    async fetchCampaigns() {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/campaigns/list`);
        this.campaigns = response.data.map(campaign => ({
          id: campaign.id,
          name: campaign.name
        }));
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        // Handle error appropriately
      }
    },
    showAddToCampaignDialog() {
      // Reset the form and pre-fill the email
      this.campaignEntry = {
        handle_name: '',
        email: this.getSenderEmail(this.selectedEmail.from), // Extract email from the sender
        tiktokUrl: '',
        status: '',
        poc: '',
        nycScheduleDate: '',
        videoLink: '',
        attitude: '',
        price: null,
        note: '',
        completion: null,
        type: '',
      };
      this.selectedCampaignForEntry = null;
      this.addToCampaignDialog = true;
      this.fetchCampaigns(); // Load available campaigns
    },
    getSenderEmail(from) {
      const match = from.match(/<(.+)>/);
      return match ? match[1] : from;
    },
    async submitAddToCampaign() {
      if (!this.selectedCampaignForEntry) {
        // Show error message
        return;
      }

      try {
         await axios.post(
          `${apiBaseUrl}/api/gmail/addToCampaignEntry`,
          this.campaignEntry,
          {
            params: {
              projectName: this.selectedCampaignForEntry
            }
          }
        );
        
        // Show success message
        this.addToCampaignDialog = false;
        
        // Reset form
        this.campaignEntry = {
          handle_name: '',
          email: '',
          tiktokUrl: '',
          status: '',
          poc: '',
          nycScheduleDate: '',
          videoLink: '',
          attitude: '',
          price: null,
          note: '',
          completion: null,
          type: '',
        };
        this.selectedCampaignForEntry = null;
      } catch (error) {
        console.error('Error adding to campaign:', error);
        // Show error message
      }
    },
  },
  mounted() {
    this.getInboxEmails();
  }
};
</script>

<style>
.text-center {
  text-align: center;
}
.v-list-item {
  transition: background-color 0.2s;
}
.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
.email-body {
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;
  background-color: rgb(0, 0, 0);
  border-radius: 4px;
}

.email-body.image-content {
  /* Additional styling for image-based emails */
  padding: 0;
  background-color: transparent;
}

.email-body.image-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

/* Remove margins around images in marketing emails */
.email-body.image-content p,
.email-body.image-content div {
  margin: 0;
  padding: 0;
}

/* Hide tracking pixels */
.email-body img[width="1"],
.email-body img[height="1"] {
  display: none !important;
}

/* Preserve email formatting */
.email-body table {
  max-width: 100%;
}

.email-body img {
  max-width: 100%;
  height: auto;
}

.email-body a {
  color: #1976d2;
  text-decoration: none;
}

.email-body a:hover {
  text-decoration: underline;
}

/* Fix common email styling issues */
.email-body div {
  max-width: 100%;
}

.email-body * {
  word-wrap: break-word;
}

/* Handle plain text emails */
.email-body pre {
  white-space: pre-wrap;
  font-family: inherit;
  margin: 0;
}

/* Ensure proper spacing */
.email-body p {
  margin: 1em 0;
}

/* Fix alignment issues */
.email-body center {
  display: block;
  text-align: center;
}

/* Handle responsive tables */
.email-body table {
  table-layout: auto;
  width: 100% !important;
}

/* Fix mobile responsiveness */
@media (max-width: 600px) {
  .email-body {
    padding: 8px;
  }
  
  .email-body table {
    display: block;
    width: 100% !important;
  }
  
  .email-body td {
    display: block;
    width: auto !important;
  }
}

.email-header {
  background-color: #f8f9fa;
}

.attachment-item {
  border-radius: 4px;
  transition: background-color 0.2s;
}

.attachment-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  cursor: pointer;
}

.email-body {
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;
  line-height: 1.5;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
}

.email-body.image-content {
  background-color: white;
  padding: 16px;
}

/* Improve email content readability */
.email-body p {
  margin: 0 0 1em 0;
}

.email-body blockquote {
  margin: 1em 0;
  padding-left: 1em;
  border-left: 2px solid #e0e0e0;
  color: rgba(0, 0, 0, 0.6);
}

.email-body pre {
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}

.email-details {
  background-color: #1e1e1e;
  color: #ffffff;
}

.subject-header {
  font-size: 1.1rem;
  font-weight: normal;
}

.email-metadata {
  margin-bottom: 20px;
}

.metadata-row {
  display: flex;
  margin-bottom: 8px;
}

.metadata-label {
  color: #ffffff;
  width: 60px;
  font-weight: normal;
}

.metadata-content {
  color: #ffffff;
  flex: 1;
}

.email-body {
  color: #000000; /* Change text color to black for white background */
  background-color: #ffffff; /* White background */
  padding: 16px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 4px;
  margin: 16px 0;
}

.email-body.image-content {
  background-color: #ffffff;
}

/* Style for links within email body */
.email-body a {
  color: #1a73e8; /* Gmail-style link color */
  text-decoration: none;
}

.email-body a:hover {
  text-decoration: underline;
}

/* Ensure proper contrast for different content types */
.email-body pre,
.email-body code {
  background-color: #f8f9fa;
  color: #000000;
  padding: 8px;
  border-radius: 4px;
}

.email-body blockquote {
  border-left: 2px solid #dadce0;
  margin: 0;
  padding-left: 12px;
  color: #5f6368;
}

/* Keep the dark theme for the card but white background for content */
.email-details {
  background-color: #1e1e1e;
}

.metadata-row {
  color: #ffffff; /* Keep metadata text white */
}

/* Ensure images don't overflow */
.email-body img {
  max-width: 100%;
  height: auto;
}

.v-btn {
  letter-spacing: 1px;
}

/* Override Vuetify's default dark theme colors if needed */
:deep(.v-card) {
  background-color: #1e1e1e !important;
}

:deep(.v-divider) {
  border-color: rgba(255, 255, 255, 0.12) !important;
}

:deep(.v-chip) {
  background-color: #333333 !important;
  color: #ffffff !important;
}
</style>

