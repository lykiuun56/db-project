
import axios from 'axios';

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Base URL for your backend API
    withCredentials: true, // Send cookies with each request
    headers: {
        'Content-Type': 'application/json', // Default content type for requests
        // Add any other custom headers if needed
    }
});

// Add a request interceptor to include any additional configurations (if needed)
axiosInstance.interceptors.request.use(
    config => {
        // You can modify the request config here, like adding authorization tokens
        // For example, if you have a token in local storage:
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers['Authorization'] = `Bearer ${token}`;
        // }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for global error handling (if needed)
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // Handle error responses globally (optional)
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access, redirect to login if needed
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
delete axios.defaults.headers.common['Authorization'];


export default axiosInstance;

