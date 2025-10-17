<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Create your vendor account</h2>
      <p class="text-sm text-gray-600 mb-6">Join Aura Shop and start selling in minutes.</p>

      <form @submit.prevent="submit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First name</label>
            <input v-model.trim="form.firstName" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <input v-model.trim="form.lastName" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Business name</label>
          <input v-model.trim="form.businessName" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model.trim="form.email" type="email" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model.trim="form.password" type="password" minlength="6" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input v-model.trim="form.phone" type="tel" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">{{ loading ? 'Creating account...' : 'Create account' }}</button>
      </form>

      <div v-if="message" class="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{{ message }}</div>
      <div v-if="error" class="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{{ error }}</div>

      <p class="text-sm text-gray-600 mt-6 text-center">
        Already have an account?
        <router-link :to="{ name: 'Login' }" class="text-blue-600 hover:text-blue-700 font-medium">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { register } from '../services/authService.js';

export default {
  name: 'VendorRegister',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        businessName: '',
        email: '',
        password: '',
        phone: ''
      },
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
        await register({
          ...this.form,
          role: 'vendor'
        });
        this.message = 'Account created! Please check your email to verify, then sign in.';
        setTimeout(() => this.$router.push({ name: 'Login' }), 1500);
      } catch (e) {
        this.error = e?.message || 'Registration failed. Please review your details and try again.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
