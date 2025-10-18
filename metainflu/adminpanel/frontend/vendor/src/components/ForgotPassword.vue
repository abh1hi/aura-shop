<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Reset your password</h2>
      <p class="text-sm text-gray-600 mb-6">Enter the email associated with your vendor account and we'll send you a reset link.</p>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model.trim="email" type="email" required autocomplete="email"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">
          {{ loading ? 'Sending...' : 'Send reset link' }}
        </button>
      </form>

      <div v-if="message" class="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
        {{ message }}
      </div>
      <div v-if="error" class="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <router-link :to="{ name: 'Login' }" class="block text-center text-sm text-blue-600 hover:text-blue-700 mt-6">Back to login</router-link>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService.js';

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      loading: false,
      message: '',
      error: ''
    };
  },
  methods: {
    async submit() {
      this.message = '';
      this.error = '';
      this.loading = true;
      try {
        await authService.requestPasswordReset(this.email);
        this.message = 'If an account exists for this email, a password reset link has been sent.';
      } catch (e) {
        this.error = e?.message || 'Failed to send reset email. Please try again later.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
