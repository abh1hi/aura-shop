// File: frontend/client/src/pages/Login.vue
<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden">
      <div class="w-full md:w-1/2 p-10 flex flex-col justify-center">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-2">
          Sign in to your account
        </h2>
        <p class="mt-2 text-sm text-gray-600 mb-6">
          Or <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            register for a new one
          </router-link>
        </p>
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required
                   v-model="email"
                   class="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                   placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required
                   v-model="password"
                   class="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                   placeholder="Password">
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                     class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button type="submit"
                    class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </span>
              Sign in
            </button>
          </div>
        </form>
      </div>
      <div class="hidden md:block md:w-1/2 relative bg-gray-200">
        <img src="https://placehold.co/800x600/cccccc/ffffff?text=Your+Image+Here" alt="Marketing Team" class="w-full h-full object-cover">
      </div>
    </div>
  </div>
</template>
<script>
import authService from '../services/authService';
import { globalState } from '../main.js';

export default {
  name: 'Login',
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
        
        this.$router.push('/');
      } catch (error) {
        console.error('Login failed:', error.message);
      }
    },
  },
};
</script>
