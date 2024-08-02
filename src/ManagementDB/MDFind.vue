<template>
  <div class="mdfind-container">
    <h1>Find Matching Emails</h1>
    <div class="search-form">
      <label for="emailEnding">Email Ending:</label>
      <input
          v-model="emailEnding"
          type="text"
          id="emailEnding"
          placeholder="Enter email ending (e.g., @gmail.com)"
      />
      <button @click="findMatchingEmails">Search</button>
    </div>

    <div class="results" v-if="results.length">
      <h2>Matching Emails</h2>
      <ul>
        <li v-for="(result, index) in results" :key="index">
          {{ result.full_name }} - {{ result.email }}
        </li>
      </ul>
    </div>

    <div v-if="results.length === 0 && searchPerformed">
      <p>No matching emails found.</p>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'MDfind',
  data() {
    return {
      emailEnding: '',
      results: [],
      searchPerformed: false,
    };
  },
  methods: {
    async findMatchingEmails() {
      this.searchPerformed = false;
      try {
        const response = await axios.get(`http://localhost:8081/api/management/findAllMatching/{emailEnding}`, {
          params: {
            emailEnding: this.emailEnding,
          },
        });
        this.results = response.data;
        this.searchPerformed = true;
      } catch (error) {
        console.error('Error finding matching emails:', error);
      }
    },
  },
};
</script>
<style scoped>
.mdfind-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.search-form input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.search-form button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-form button:hover {
  background-color: #0056b3;
}

.results h2 {
  margin-top: 20px;
}

.results ul {
  list-style-type: none;
  padding: 0;
}

.results li {
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
}
</style>
