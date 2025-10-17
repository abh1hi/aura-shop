<template>
  <div class="min-h-screen flex">
    <!-- Left: Brand/Illustration -->
    <div class="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white items-center justify-center p-12">
      <div class="max-w-md">
        <img src="/images/aura-vendor-logo.svg" alt="Aura Vendor" class="h-12 mb-8" />
        <h1 class="text-4xl font-bold mb-4">Welcome to Aura Vendor</h1>
        <p class="text-blue-100 text-lg">Sell smarter, manage faster, and grow your business with our vendor tools and insights.</p>
        <ul class="mt-8 space-y-3 text-blue-100">
          <li class="flex items-center"><span class="h-2 w-2 bg-white rounded-full mr-3"></span> Real-time order tracking</li>
          <li class="flex items-center"><span class="h-2 w-2 bg-white rounded-full mr-3"></span> Inventory and catalog tools</li>
          <li class="flex items-center"><span class="h-2 w-2 bg-white rounded-full mr-3"></span> Sales analytics and payouts</li>
        </ul>
      </div>
    </div>

    <!-- Right: Login Form -->
    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Vendor Login</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model.trim="form.email" type="email" required autocomplete="email"
                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <router-link :to="{ name: 'ForgotPassword' }" class="text-sm text-blue-600 hover:text-blue-700">Forgot?</router-link>
            </div>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'" v-model.trim="form.password" required autocomplete="current-password"
                     class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 px-3 text-gray-500">{{ showPassword ? 'Hide' : 'Show' }}</button>
            </div>
          </div>

          <div class="flex items-center">
            <input id="remember" type="checkbox" v-model="remember" class="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
          </div>

          <button type="submit" :disabled="loading"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="text-sm text-gray-600 mt-6">
          New to Aura? 
          <router-link :to="{ name: 'VendorRegister' }" class="text-blue-600 hover:text-blue-700 font-medium">Create a vendor account</router-link>
        </p>

        <!-- Error Alert -->
        <div v-if="error" class="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService, { login as loginVendor } from '../services/authService.js';

export default {
  name: 'VendorLogin',
  setup(_, { emit }) {
    return {};
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      remember: false,
      loading: false,
      showPassword: false,
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      this.error = '';
      this.loading = true;
      try {
        const res = await loginVendor({ email: this.form.email, password: this.form.password });
        // Optional: persist email for convenience
        if (this.remember) localStorage.setItem('vendorLastEmail', this.form.email);
        // Navigate to dashboard or redirect param
        const redirect = this.$route.query.redirect || { name: 'Dashboard' };
        this.$router.push(redirect);
      } catch (e) {
        this.error = e?.message || 'Login failed. Please check your credentials and try again.';
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    const last = localStorage.getItem('vendorLastEmail');
    if (last) this.form.email = last;
  }
};
</script>
