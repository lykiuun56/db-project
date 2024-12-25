// store.js
import { createStore } from 'vuex';
import axios from '@/axios'; // Ensure axios is correctly configured
import { apiBaseUrl } from '@/config'; // Ensure apiBaseUrl is defined

export default createStore({
    state: {
        userId: localStorage.getItem('userId') || null,
        authToken: localStorage.getItem('authToken') || null,
        userRole: localStorage.getItem('userRole') || null,  // Add user role
        userPoc:localStorage.getItem('userPoc') || null,
        wishlists: [],
        mailchimpTags: [],
        mailchimpTemplates:[],
        isLoadingTemplates:false
        // ... other state properties
    },
    mutations: {
        SET_USER_ROLE(state, payload) {
            state.userRole = payload;
            localStorage.setItem('userRole', payload);  // Store role in localStorage
        },
        SET_USER_POC(state, payload) {
            state.userPoc = payload;
            localStorage.setItem('userPoc',payload)
        },
        SET_USER_ID(state, payload) {
            state.userId = payload;
            localStorage.setItem('userId', payload);
        },
        SET_AUTH_TOKEN(state, payload) {
            state.authToken = payload;
            localStorage.setItem('authToken', payload);
        },
        SET_MAILCHIMP_TAGS(state, tags) {
            state.mailchimpTags =tags;
        },
        SET_MAILCHIMP_TEMPLATES(state, templates) {
            // Only update if the value is different
            if (JSON.stringify(state.mailchimpTemplates) !== JSON.stringify(templates)) {
                state.mailchimpTemplates = templates;
            }
        },
        SET_LOADING_TEMPLATES(state, loading) {
            state.isLoadingTemplates = loading;
        },
        CLEAR_AUTH(state) {
            state.userId = null;
            state.authToken = null;
            state.userRole = null;  // Clear role on logout
            state.userPoc = null;
            localStorage.removeItem('userId');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userPoc')
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
                    const { userId, token, role, poc } = response.data;
                    console.log('Role from backend:', role);  // Debugging the role value
                    commit('SET_USER_ID', userId);
                    commit('SET_AUTH_TOKEN', token);
                    commit('SET_USER_ROLE', role);  // Store the user role
                    commit('SET_USER_POC',poc)

                    // Store token and userId in localStorage
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('userId', userId);
                    localStorage.setItem('userRole', role);  // Save role to localStorage
                    localStorage.setItem('userPoc',poc);
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
            localStorage.removeItem('userRole');
            localStorage.removeItem('userPoc');

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
        },
        async fetchMailchimpTags({ state, commit }) {
            try {
                console.log('Fetching tags with POC:', state.userPoc); // Add logging

                const response = await axios.get(`${apiBaseUrl}/api/total/tags`, {
                    params: {
                        pocName: state.userPoc
                    },
                    headers: {
                        Authorization: `Bearer ${state.authToken}`
                    },
                });

                console.log('Received tags:', response.data); // Add logging

                if (Array.isArray(response.data)) {
                    if (state.userPoc) {
                        const filteredTags = response.data.filter(tag =>
                            tag && typeof tag === 'string' && tag.includes(state.userPoc)
                        );
                        console.log('Filtered tags:', filteredTags); // Add logging
                        commit('SET_MAILCHIMP_TAGS', filteredTags);
                    } else {
                        commit('SET_MAILCHIMP_TAGS', response.data);
                    }
                } else {
                    console.error('Unexpected response format:', response.data);
                    commit('SET_MAILCHIMP_TAGS', []);
                }
            } catch (error) {
                console.error('Error fetching Mailchimp tags:', error.response || error);
                commit('SET_MAILCHIMP_TAGS', []);
            }
        },
        async fetchTemplates({ state, commit }) {
            commit('SET_LOADING_TEMPLATES', true);
        
            try {
                console.log('Attempting to fetch templates with POC Name:', state.userPoc);
                
        
                const response = await axios.get(`${apiBaseUrl}/api/total/templates`, {
                    params: {
                        pocName: state.userPoc, // Pass the POC name
                    },
                    headers: {
                        Authorization: `Bearer ${state.authToken}`, // Include the token in the headers
                    },
                });
        
                // Check the response and handle it
                console.log('Response received:', response); // Log the raw response
        
                if (response.data && Array.isArray(response.data)) {
                    console.log('Templates fetched successfully:', response.data); // Log the template names
                    commit('SET_MAILCHIMP_TEMPLATES', response.data);
                } else {
                    console.error('Unexpected data format in response:', response.data);
                    commit('SET_MAILCHIMP_TEMPLATES', []); // Set an empty array to prevent errors
                }
            } catch (error) {
                console.error('Error fetching Mailchimp templates:', error);
                commit('SET_MAILCHIMP_TEMPLATES', []); // Reset templates on error
            } finally {
                commit('SET_LOADING_TEMPLATES', false);
            }
        },
        
        
        // async fetchMailchimpTemplates({ state, commit }) {
        //     // Prevent duplicate fetches
        //     if (state.isLoadingTemplates || state.mailchimpTemplates !== null) {
        //         return;
        //     }
        //
        //     commit('SET_LOADING_TEMPLATES', true);
        //
        //     try {
        //         const response = await axios.get(`${apiBaseUrl}/api/total/templates`);
        //         if (response.data && Array.isArray(response.data)) {
        //             commit('SET_MAILCHIMP_TEMPLATES', response.data);
        //         } else {
        //             console.error('Invalid template data received:', response.data);
        //             commit('SET_MAILCHIMP_TEMPLATES', []);
        //         }
        //     } catch (error) {
        //         console.error('Failed to fetch templates:', error);
        //         commit('SET_MAILCHIMP_TEMPLATES', []);
        //     } finally {
        //         commit('SET_LOADING_TEMPLATES', false);
        //     }
        // },
        // ... other actions
    },
    getters: {
        getUserId: (state) => state.userId,
        getAuthToken: (state) => state.authToken,
        getWishlists: (state) => state.wishlists,
        getUserRole: (state) => state.userRole,  // Add getter for user role
        getUserPoc: (state) => state.userPoc,
        getMailchimpTags: (state) => state.mailchimpTags,
        getMailchimpTemplates:(state) => state.mailchimpTemplates,
        // ... other getters
    },
});
