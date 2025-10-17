// File: metainflu/adminpanel/frontend/vendor/src/main.js
import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';

// Simple global state for vendor app
export const globalState = reactive({
  isLoggedIn: false,
  user: null
});

// Initialize state from localStorage on boot
(function initAuthFromStorage() {
  try {
    const token = localStorage.getItem('vendorToken');
    const userStr = localStorage.getItem('vendorUser');
    if (token && userStr) {
      globalState.isLoggedIn = true;
      globalState.user = JSON.parse(userStr);
    }
  } catch (e) {
    // ignore parse errors
  }
})();

const app = createApp(App);
app.use(router);
app.mount('#app');

export default app;
