import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import './assets/global.css';
import store from './utils/store';

import 'vuetify/styles'; // Import Vuetify styles



const app = createApp(App);


app.use(store); // Use the Vuex store
app.use(router);
app.use(vuetify);

app.mount('#app');
