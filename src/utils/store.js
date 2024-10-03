// store.js
import { createStore } from 'vuex';
import axios from '@/axios'; // Ensure axios is correctly configured
import { apiBaseUrl } from '@/config'; // Ensure apiBaseUrl is defined

export default createStore({
    state: {
        userId: localStorage.getItem('userId') || null,
        authToken: localStorage.getItem('authToken') || null,
        userRole: localStorage.getItem('userRole') || null,  // Add user role
        wishlists: [],
        // ... other state properties
    },
    mutations: {
        SET_USER_ROLE(state, payload) {
            state.userRole = payload;
            localStorage.setItem('userRole', payload);  // Store role in localStorage
        },
        SET_USER_ID(state, payload) {
            state.userId = payload;
            localStorage.setItem('userId', payload);
        },
        SET_AUTH_TOKEN(state, payload) {
            state.authToken = payload;
            localStorage.setItem('authToken', payload);
        },
        CLEAR_AUTH(state) {
            state.userId = null;
            state.authToken = null;
            state.userRole = null;  // Clear role on logout
            localStorage.removeItem('userId');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');  // Clear role from localStorage
        },
        SET_WISHLISTS(state, wishlists) {
            state.wishlists = wishlists;
        },
        ADD_WISHLIST(state, wishlist) {
            state.wishlists.push(wishlist);
        },
        CLEAR_WISHLISTS(state) {
            state.wishlists = [];
        },
        // ... other mutations
    },
    actions: {
        async login({ commit, dispatch }, { username, password, token }) {
            try {
                // If token is passed, assume the user is already authenticated
                if (token) {
                    commit('SET_AUTH_TOKEN', token);
                    // Optionally fetch wishlists and other data
                    const userId = localStorage.getItem('userId');
                    await dispatch('fetchWishlists', userId);
                } else {
                    // For regular login
                    const response = await axios.post(`${apiBaseUrl}/api/login`, { username, password });
                    const { userId, token, role } = response.data;
                    console.log('Role from backend:', role);  // Debugging the role value
                    commit('SET_USER_ID', userId);
                    commit('SET_AUTH_TOKEN', token);
                    commit('SET_USER_ROLE', role);  // Store the user role

                    // Store token and userId in localStorage
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('userId', userId);
                    localStorage.setItem('userRole', role);  // Save role to localStorage

                    await dispatch('fetchWishlists', userId);
                }
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },
        logout({ commit }) {
            commit('CLEAR_AUTH');
            commit('CLEAR_WISHLISTS');
            // Clear the token and userId from localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
        },
        async createWishlist({ commit, state }, { name }) {
            try {
                const userId = state.userId;
                const response = await axios.post(`${apiBaseUrl}/api/wishlists/create`,null, {
                   params:{
                       name,
                       userId,
                   }
                });
                commit('ADD_WISHLIST', response.data);
                return response.data;
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Failed to create wishlist.';
                console.error('Error creating wishlist:', errorMessage);
                throw new Error(errorMessage);
            }
        },
        async fetchWishlists({ commit }, userId) {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`${apiBaseUrl}/api/wishlists/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                commit('SET_WISHLISTS', response.data);
            } catch (error) {
                console.error('Failed to fetch wishlists:', error);
                throw error;
            }
        }

        // ... other actions
    },
    getters: {
        getUserId: (state) => state.userId,
        getAuthToken: (state) => state.authToken,
        getWishlists: (state) => state.wishlists,
        getUserRole: (state) => state.userRole,  // Add getter for user role
        // ... other getters
    },
});
