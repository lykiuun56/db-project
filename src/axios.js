// src/plugins/axios.js
import axios from 'axios';
import store from '@/utils/store'; // Import the Vuex store

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000', // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token if available
axiosInstance.interceptors.request.use(
    (config) => {
        const token = store.state.authToken; // Access token from Vuex store
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Optionally, add response interceptors for global error handling

export default axiosInstance;
