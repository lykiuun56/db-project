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
      <v-card>
        <v-card-title class="headline">{{ selectedEmail.subject }}</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>From:</v-list-item-title>
                <v-list-item-subtitle>{{ selectedEmail.from }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="selectedEmail.to">
              <v-list-item-content>
                <v-list-item-title>To:</v-list-item-title>
                <v-list-item-subtitle>{{ selectedEmail.to }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Date:</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(selectedEmail.date) }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider class="my-3"></v-divider>
          <div v-html="selectedEmail.body"></div>
          <v-divider class="my-3"></v-divider>
          <div v-if="selectedEmail.attachments && selectedEmail.attachments.length > 0">
            <h3>Attachments:</h3>
            <v-list>
              <v-list-item 
                v-for="attachment in selectedEmail.attachments" 
                :key="attachment.filename"
                @click="downloadAttachment(attachment)"
                style="cursor: pointer;"
              >
                <v-list-item-icon>
                  <v-icon>mdi-file-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ attachment.filename }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatFileSize(attachment.size) }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
          <v-chip-group v-if="selectedEmail.labels && selectedEmail.labels.length">
            <v-chip
              v-for="label in selectedEmail.labels"
              :key="label"
              small
              class="mr-1"
            >
              {{ label }}
            </v-chip>
          </v-chip-group>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="showAddLabelDialog">Add Label</v-btn>
          <v-btn color="primary" @click="showReplyDialog">Reply</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEmailDetails">Close</v-btn>
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
    };
  },
  methods: {
    async getInboxEmails() {
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

      if (emailData.payload.parts) {
        emailData.payload.parts.forEach(part => {
          if (part.mimeType === 'text/plain' && part.body.data) {
            body = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          } else if (part.filename) {
            attachments.push({
              filename: part.filename,
              mimeType: part.mimeType,
              size: part.body.size,
              attachmentId: part.body.attachmentId
            });
          }
        });
      } else if (emailData.payload.body.data) {
        body = atob(emailData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }

      return {
        id: emailData.id,
        threadId: emailData.threadId,
        subject: headers.subject,
        from: headers.from,
        to: headers.to,
        date: headers.date,
        body: body,
        attachments: attachments,
        isUnread: emailData.labelIds.includes('UNREAD'),
        labels: emailData.labelIds.filter(label => !['INBOX', 'UNREAD', 'SENT', 'IMPORTANT'].includes(label))
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
  },
  mounted() {
    this.getInboxEmails();
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.v-list-item {
  transition: background-color 0.2s;
}
.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>