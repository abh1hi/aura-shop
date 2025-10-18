// File: metainflu/adminpanel/frontend/vendor/src/main.js
import { createApp, reactive, inject } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';

// Global state management for vendor app (Auth/User Info)
const savedUser = localStorage.getItem('vendorUser');
export const globalStore = reactive({
  isLoggedIn: !!savedUser,
  user: savedUser ? JSON.parse(savedUser) : { name: 'Jane Doe', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Jane%20D' }, // Mock default user for UI
});

// Initialize Chart.js globally (needed if components don't import it)
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


const app = createApp(App);

// Provide global store (using 'store' key for simplicity in components)
app.provide('store', globalStore);
// Expose a reference on window so router guards (which run outside setup) can access it without importing app
if (typeof window !== 'undefined') window.__globalStore = globalStore;
app.use(router);
app.mount('#app');

export default app;
