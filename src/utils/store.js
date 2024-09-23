import { createStore } from 'vuex';

export default createStore({
    state: {
        userId: null, // Store userId in the state
    },
    mutations: {
        setUserId(state, userId) {
            state.userId = userId; // Update userId in the state
        },
        clearUserId(state) {
            state.userId = null; // Clear userId on logout or error
        },
    },
    actions: {
        setUserId({ commit }, userId) {
            // Commit the userId to the state
            commit('setUserId', userId);
        },
        clearUserId({ commit }) {
            // Clear the userId on logout
            commit('clearUserId');
        },
    },
    getters: {
        getUserId: (state) => state.userId, // Getter to access userId
    },
});
