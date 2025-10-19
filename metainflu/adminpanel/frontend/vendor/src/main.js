// File: metainflu/adminpanel/frontend/vendor/src/main.js
import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';
import './style.css';
import Vue3TouchEvents from 'vue3-touch-events';

// Global state management for vendor app (Auth/User Info)
const savedUser = localStorage.getItem('user');
export const globalState = reactive({
  isLoggedIn: !!savedUser,
  user: savedUser ? JSON.parse(savedUser) : null,
});

const app = createApp(App);

app.use(router);
app.use(Vue3TouchEvents);
app.mount('#app');

export default app;