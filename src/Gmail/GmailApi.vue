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
        <v-btn color="primary" @click="getEmailDetails">Get Email Details</v-btn>
        <v-btn color="primary" @click="markEmailAsRead">Mark Email as Read</v-btn>
        <v-btn color="primary" @click="addLabelToEmail">Add Label to Email</v-btn>
        <v-btn color="primary" @click="replyToEmail">Reply to Email</v-btn>
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
      userId: '',
      emails: []
    };
  },
  methods: {
    async getInboxEmails() {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/gmail/inbox`, { params: { userId: this.userId } });
        this.emails = this.formatEmails(res.data);
      } catch (error) {
        console.error('Error fetching inbox emails:', error);
      }
    },
    async getEmailDetails(emailId) {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/gmail/email/${emailId}`, { params: { userId: this.userId } });
        console.log('Email details:', res.data);
        // Handle the email details as needed
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

        let snippet = 'No snippet available';
        if (email.snippet) {
          snippet = email.snippet;
        }

        return {
          id: email.id,
          from: headers.From,
          to: headers.To,
          subject: headers.Subject,
          date: headers.Date,
          snippet
        };
      });
    }
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
