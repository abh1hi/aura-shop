
// File: frontend/client/src/components/Navbar.vue
<template>
  <nav class="flex items-center justify-between p-6">
    <div class="flex items-center">
      <div class="text-2xl font-bold text-[#4a90e2]">MBInfluence</div>
    </div>
    <div class="hidden md:flex items-center space-x-8">
      <router-link to="/" class="text-gray-600 hover:text-gray-800 transition-colors">Home</router-link>
      <a href="#" class="text-gray-600 hover:text-gray-800 transition-colors">About us</a>
      <a href="#" class="text-gray-600 hover:text-gray-800 transition-colors">Testimonials</a>
      <template v-if="globalState.isLoggedIn">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405C18.216 14.86 18 13.9 18 13v-3a6 6 0 10-12 0v3c0 .9-.216 1.86-.595 2.595L4 17h5m6 0a2 2 0 11-4 0m4 0h-4" />
            </svg>
            <span v-if="notificationCount > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {{ notificationCount }}
            </span>
            <span v-else class="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-gray-500 transform translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded-full">
              0
            </span>
          </div>
          <router-link :to="profileRoute" class="bg-gray-100 text-gray-800 font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition-colors">
            My Profile
          </router-link>
          <button @click="logout" class="bg-transparent border border-gray-400 text-gray-600 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
            Log Out
          </button>
        </div>
      </template>
      <template v-else>
        <router-link to="/login" class="bg-transparent border border-gray-400 text-gray-600 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
          Log In
        </router-link>
        <router-link to="/register" class="bg-transparent border border-gray-400 text-gray-600 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
          Register
        </router-link>
      </template>
    </div>
    <div class="md:hidden">
      <button class="text-gray-600 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
  </nav>
</template>
<script>
import { globalState } from '../main.js';
import { useRouter } from 'vue-router';
export default {
  name: 'Navbar',
  setup() {
    const router = useRouter();
    const logout = () => {
      localStorage.removeItem('user');
      globalState.isLoggedIn = false;
      globalState.user = null;
      router.push('/login');
    };
    return {
      globalState,
      logout,
    };
  },
  data() {
    return {
      notificationCount: 0, // Placeholder for notifications
    };
  },
  computed: {
    profileRoute() {
      if (this.globalState.user && this.globalState.user.role === 'client') {
        return this.globalState.user.accountType === 'b2b' ? '/b2b-profile' : '/c2c-profile';
      } else if (this.globalState.user && this.globalState.user.role === 'influencer') {
        return '/influencer-profile';
      }
      return '/';
    },
  },
};
</script>
