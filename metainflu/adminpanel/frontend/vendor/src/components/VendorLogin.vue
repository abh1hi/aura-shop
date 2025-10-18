<!-- Example: src/components/VendorLogin.vue --><template>
  <div class="min-h-screen flex items-center justify-center bg-gray-bg p-4">
    <div class="w-full max-w-md bg-gray-surface rounded-2xl shadow-lg p-6 sm:p-8">
      <h2 class="text-2xl font-bold text-center text-gray-dark-text mb-6">Vendor Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-text mb-1">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full p-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            placeholder="john.doe@example.com"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-text mb-1">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full p-3 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-primary-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 transition-colors duration-200"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <p v-if="error" class="text-danger-red text-sm mt-4 text-center">{{ error }}</p>
      </form>
      <div class="mt-6 text-center">
        <router-link to="/forgot-password" class="text-primary-blue hover:underline text-sm">Forgot Password?</router-link>
        <p class="text-gray-text mt-3 text-sm">Don't have an account? <router-link to="/register" class="text-primary-blue hover:underline">Register</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';

const email = ref('');
const password = ref('');
const error = ref(null);
const loading = ref(false);
const router = useRouter();
const store = inject('store');

const handleLogin = async () => {
  error.value = null;
  loading.value = true;
  try {
    const data = await authService.login(email.value, password.value);
    localStorage.setItem('vendorAuthToken', data.token);
    localStorage.setItem('vendorUser', JSON.stringify(data.user)); // Assuming data.user contains user info
    store.isLoggedIn = true;
    store.user = data.user;
    router.push({ name: 'Dashboard' });
  } catch (err) {
    error.value = err.message || 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
};
</script>