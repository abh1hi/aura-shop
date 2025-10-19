<template>
  <div class="auth-page bg-gray-50">
    <div class="auth-container">
      <div class="text-center">
        <h1 class="auth-title text-gray-900">Welcome Back</h1>
        <p class="auth-subtitle text-gray-600">Sign in to your account to continue.</p>
      </div>
      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email" class="sr-only">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required v-model="email" placeholder="Email" class="auth-input">
        </div>
        <div class="form-group">
          <label for="password" class="sr-only">Password</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password" placeholder="Password" class="auth-input">
        </div>
        <div class="form-options">
          <router-link to="/forgot-password" class="forgot-password-link">Forgot password?</router-link>
        </div>
        <button type="submit" class="auth-button">Sign In</button>
      </form>
      <p class="switch-auth-text">
        Don't have an account? <router-link to="/register" class="switch-auth-link">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';
import { globalState } from '../main.js';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { setToken } = useAuth();
    return { router, route, setToken };
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
        
        this.setToken(response.token);
        
        globalState.isLoggedIn = true;
        globalState.user = {
            _id: response._id,
            name: response.name,
            email: response.email,
            role: response.role,
        };
        
        const redirect = this.route.query.redirect || '/';
        this.router.push(redirect);
      } catch (error) {
        
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
  min-height: 100vh;
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

.auth-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.auth-subtitle {
  margin-top: 0.5rem;
  font-size: 1rem;
}

.auth-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.auth-input {
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.auth-input:focus {
  outline: none;
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
}

.form-options {
  text-align: right;
  margin-bottom: 1.5rem;
}

.forgot-password-link {
  color: #a78bfa;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.forgot-password-link:hover {
  color: #8b5cf6;
}

.auth-button {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #8b5cf6;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.auth-button:hover {
  background-color: #7c3aed;
}

.switch-auth-text {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.switch-auth-link {
  font-weight: 600;
  color: #8b5cf6;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.switch-auth-link:hover {
  color: #7c3aed;
}
</style>