<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-text-primary">Create your Vendor Account</h1>
        <p class="text-text-secondary">Join us and start selling</p>
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary">First name</label>
            <input v-model.trim="form.firstName" required class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary">Last name</label>
            <input v-model.trim="form.lastName" required class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary">Business name</label>
          <input v-model.trim="form.businessName" required class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary">Email</label>
          <input v-model.trim="form.email" type="email" required class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary">Password</label>
          <input v-model.trim="form.password" type="password" minlength="6" required class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary" />
        </div>

        <button type="submit" :disabled="loading" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          {{ loading ? 'Creating account...' : 'Create account' }}
        </button>
      </form>

      <div v-if="message" class="mt-4 text-center text-sm text-green-600">{{ message }}</div>
      <div v-if="error" class="mt-4 text-center text-sm text-danger">{{ error }}</div>

      <div class="mt-6 text-center text-sm text-text-secondary">
        Already have an account? <router-link :to="{ name: 'Login' }" class="font-medium text-primary hover:underline">Sign in</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService.js';

const router = useRouter();

const form = ref({
  firstName: '',
  lastName: '',
  businessName: '',
  email: '',
  password: '',
  phone: ''
});

const loading = ref(false);
const message = ref('');
const error = ref('');

const submit = async () => {
  message.value = '';
  error.value = '';
  loading.value = true;
  try {
    await authService.register({
      ...form.value,
      role: 'vendor'
    });
    message.value = 'Account created! Please check your email to verify, then sign in.';
    setTimeout(() => router.push({ name: 'Login' }), 1500);
  } catch (e) {
    error.value = e?.message || 'Registration failed. Please review your details and try again.';
  } finally {
    loading.value = false;
  }
};
</script>
