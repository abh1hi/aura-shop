<!-- File: frontend/client/src/pages/Register.vue -->
<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden">
      <div class="w-full md:w-1/2 p-10 flex flex-col justify-center">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-2">
          Create an account
        </h2>
        <p class="text-gray-600 mb-6">Sing up and get 30 day free trial</p>
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div>
            <label for="full-name" class="sr-only">Full-name</label>
            <input id="full-name" name="name" type="text" autocomplete="name" required
                   v-model="name"
                   class="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                   placeholder="Full-name">
          </div>
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required
                   v-model="email"
                   class="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                   placeholder="Email">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="new-password" required
                   v-model="password"
                   class="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                   placeholder="Password">
          </div>
          <div class="mt-4">
            <p class="text-sm font-medium text-gray-700">I am a...</p>
            <div class="mt-2 flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" name="role" value="client" v-model="role" class="form-radio text-blue-600">
                <span class="ml-2 text-gray-700">Client</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="role" value="influencer" v-model="role" class="form-radio text-blue-600">
                <span class="ml-2 text-gray-700">Influencer</span>
              </label>
            </div>
          </div>
          <div v-if="role === 'client'" class="mt-4">
            <p class="text-sm font-medium text-gray-700">My account is...</p>
            <div class="mt-2 flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" name="accountType" value="b2b" v-model="accountType" class="form-radio text-blue-600">
                <span class="ml-2 text-gray-700">Business</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="accountType" value="c2c" v-model="accountType" class="form-radio text-blue-600">
                <span class="ml-2 text-gray-700">Personal</span>
              </label>
            </div>
          </div>
          <div>
            <button type="submit"
                    class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#ffc107] hover:bg-[#e0ad00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffc107]">
              Submit
            </button>
          </div>
        </form>
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">Have an account? <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </router-link></p>
        </div>
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
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      role: 'client',
      accountType: 'b2b',
    };
  },
  methods: {
    async handleRegister() {
      try {
        const userData = {
          name: this.name,
          email: this.email,
          password: this.password,
        };

        if (this.role === 'client') {
          userData.role = 'client';
          userData.accountType = this.accountType;
        } else {
          userData.role = this.role;
        }

        const response = await authService.register(userData);
        console.log('Registration successful:', response);
        globalState.isLoggedIn = true;
        globalState.user = response;
        
        if (response.role === 'influencer') {
          this.$router.push('/onboarding');
        } else if (response.accountType === 'b2b') {
          this.$router.push('/b2b-onboarding');
        } else {
          this.$router.push('/c2c-onboarding');
        }
      } catch (error) {
        console.error('Registration failed:', error.message);
      }
    },
  },
};
</script>
