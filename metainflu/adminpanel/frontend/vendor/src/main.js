// File: metainflu/adminpanel/frontend/vendor/src/main.js
import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';

// Global state management for vendor app (Auth/User Info)
const savedUser = localStorage.getItem('user');
export const globalState = reactive({
  isLoggedIn: !!savedUser,
  user: savedUser ? JSON.parse(savedUser) : null,
});

const app = createApp(App);

app.use(router);
app.mount('#app');

export default app;