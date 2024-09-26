// store.js
import { createStore } from 'vuex';
import axios from '@/axios'; // Ensure axios is correctly configured
import { apiBaseUrl } from '@/config'; // Ensure apiBaseUrl is defined

export default createStore({
    state: {
        userId: localStorage.getItem('userId') || null,
        authToken: localStorage.getItem('authToken') || null,
        wishlists: [],
        // ... other state properties
    },
    mutations: {
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
            localStorage.removeItem('userId');
            localStorage.removeItem('authToken');
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
        async login({ commit, dispatch }, credentials) {
            try {
                const response = await axios.post(`${apiBaseUrl}/api/login`, credentials);
                const { userId, token } = response.data;

                commit('SET_USER_ID', userId);
                commit('SET_AUTH_TOKEN', token);

                // Fetch wishlists after successful login
                await dispatch('fetchWishlists', userId);
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },
        logout({ commit }) {
            commit('CLEAR_AUTH');
            commit('CLEAR_WISHLISTS');
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
                const response = await axios.get(`${apiBaseUrl}/api/wishlists/user/${userId}`);
                commit('SET_WISHLISTS', response.data);
            } catch (error) {
                console.error('Failed to fetch wishlists:', error);
                throw error;
            }
        },
        // ... other actions
    },
    getters: {
        getUserId: (state) => state.userId,
        getAuthToken: (state) => state.authToken,
        getWishlists: (state) => state.wishlists,
        // ... other getters
    },
});
