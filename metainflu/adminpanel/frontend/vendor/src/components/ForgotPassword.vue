<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-text-primary">Reset Password</h1>
        <p class="text-text-secondary">Enter your email to get a reset link</p>
      </div>

      <form @submit.prevent="submit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-text-secondary">Email</label>
          <input type="email" id="email" v-model="email" required
                 class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary">
        </div>

        <div>
          <button type="submit" :disabled="loading"
                  class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            {{ loading ? 'Sending link...' : 'Send Reset Link' }}
          </button>
        </div>
      </form>

      <div v-if="message" class="mt-4 text-center text-sm text-green-600">{{ message }}</div>
      <div v-if="error" class="mt-4 text-center text-sm text-danger">{{ error }}</div>

      <div class="mt-6 text-center text-sm text-text-secondary">
        <router-link :to="{ name: 'Login' }" class="font-medium text-primary hover:underline">Back to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import authService from '../services/authService.js';

const email = ref('');
const loading = ref(false);
const message = ref('');
const error = ref('');

const submit = async () => {
  message.value = '';
  error.value = '';
  loading.value = true;
  try {
    await authService.requestPasswordReset(email.value);
    message.value = 'If an account exists for this email, a password reset link has been sent.';
  } catch (e) {
    error.value = e?.message || 'Failed to send reset email. Please try again later.';
  } finally {
    loading.value = false;
  }
};
</script>
