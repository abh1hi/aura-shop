<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="auth-title">Welcome Back</h1>
      <p class="auth-subtitle">Sign in to your account to continue.</p>
      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required v-model="email">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password">
        </div>
        <div class="form-options">
          <router-link to="/forgot-password" class="forgot-password">Forgot password?</router-link>
        </div>
        <button type="submit" class="auth-button">Sign In</button>
      </form>
      <p class="switch-auth">
        Don't have an account? <router-link to="/register">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';
import { globalState } from '../main.js';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const userData = {
          email: this.email,
          password: this.password,
        };
        const response = await authService.login(userData);
        console.log('Login successful:', response);
        
        globalState.isLoggedIn = true;
        globalState.user = response;
        
        this.router.push('/');
      } catch (error) {
        console.error('Login failed:', error.message);
        // Here you could add logic to show an error message to the user
      }
    },
  },
};
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f4f4f9;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: #fff;
  border-radius: 16px;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  text-align: center;
  color: #555;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
}

.form-options {
  text-align: right;
  margin-bottom: 1.5rem;
}

.forgot-password {
  color: #555;
  text-decoration: none;
  font-size: 0.9rem;
}

.auth-button {
  width: 100%;
  padding: 1rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.switch-auth {
  text-align: center;
  margin-top: 1.5rem;
}

.switch-auth a {
  color: #000;
  font-weight: 600;
  text-decoration: none;
}
</style>