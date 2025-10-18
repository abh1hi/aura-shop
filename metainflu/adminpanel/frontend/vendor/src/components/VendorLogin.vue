<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-text-primary">Welcome Back</h1>
        <p class="text-text-secondary">Login to your vendor account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-text-secondary">Email</label>
          <input type="email" id="email" v-model="email" required
                 class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary">
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-text-secondary">Password</label>
          <input type="password" id="password" v-model="password" required
                 class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary">
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <router-link to="/forgot-password" class="font-medium text-primary hover:underline">Forgot password?</router-link>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading"
                  class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>

      <p v-if="error" class="mt-4 text-center text-sm text-danger">{{ error }}</p>

      <div class="mt-6 text-center text-sm text-text-secondary">
        Don't have an account? <router-link to="/register" class="font-medium text-primary hover:underline">Register</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';
import { globalState } from '../main.js';

const email = ref('');
const password = ref('');
const error = ref(null);
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  error.value = null;
  loading.value = true;
  try {
    const data = await authService.login({ email: email.value, password: password.value });
    globalState.isLoggedIn = true;
    globalState.user = data;
    router.push({ name: 'Dashboard' });
  } catch (err) {
    error.value = err.message || 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
};
</script>