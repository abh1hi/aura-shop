<template>
  <div class="account-page">
    <PageHeader title="My Account" />

    <div class="container mx-auto px-4 py-8">
      <div v-if="isLoading" class="text-center py-16">
        <p class="text-lg text-gray-500">Loading account details...</p>
      </div>
      <div v-else-if="error" class="text-center py-16">
        <p class="text-lg text-red-500">Error: {{ error }}</p>
      </div>
      <div v-else class="account-container">
        <!-- Mobile Navigation -->
        <div class="lg:hidden mb-6">
          <select v-model="activeTab" class="account-nav-select">
            <option value="orders">Order History</option>
            <option value="profile">Profile Details</option>
            <option value="addresses">Addresses</option>
          </select>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Desktop Navigation -->
          <aside class="hidden lg:block">
            <ul class="account-nav">
              <li>
                <a href="#" @click.prevent="activeTab = 'orders'" :class="{ 'active': activeTab === 'orders' }">
                  <i class="fas fa-box mr-3"></i> Order History
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="activeTab = 'profile'" :class="{ 'active': activeTab === 'profile' }">
                  <i class="fas fa-user mr-3"></i> Profile Details
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="activeTab = 'addresses'" :class="{ 'active': activeTab === 'addresses' }">
                  <i class="fas fa-map-marker-alt mr-3"></i> Addresses
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="handleLogout">
                  <i class="fas fa-sign-out-alt mr-3"></i> Logout
                </a>
              </li>
            </ul>
          </aside>

          <!-- Content -->
          <main class="lg:col-span-3">
            <transition name="fade" mode="out-in">
              <div :key="activeTab">
                <!-- Order History -->
                <div v-if="activeTab === 'orders'">
                  <h2 class="section-title">Order History</h2>
                  <div v-if="orders.length === 0" class="empty-state">
                    <p>You haven't placed any orders yet.</p>
                  </div>
                  <div v-else class="order-list">
                    <div v-for="order in orders" :key="order._id" class="order-card">
                      <div class="flex justify-between items-start">
                        <div>
                          <p class="font-semibold">Order #{{ order._id.slice(-6) }}</p>
                          <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
                        </div>
                        <span :class="getStatusClass(order.status)">{{ order.status }}</span>
                      </div>
                      <div class="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                        <p class="font-semibold text-lg">${{ order.total.toFixed(2) }}</p>
                        <router-link :to="{ name: 'OrderPlaced', query: { orderId: order._id } }" class="view-order-link">
                          View Details
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Profile Details -->
                <div v-if="activeTab === 'profile'">
                  <h2 class="section-title">Profile Details</h2>
                  <div class="card">
                    <div class="mb-6">
                      <p class="text-gray-500">Name</p>
                      <p class="font-semibold text-lg">{{ profileData.name }}</p>
                    </div>
                    <div>
                      <p class="text-gray-500">Email</p>
                      <p class="font-semibold text-lg">{{ profileData.email }}</p>
                    </div>
                  </div>

                  <h3 class="section-title mt-8">Update Password</h3>
                  <div class="card">
                    <form @submit.prevent="updatePassword">
                      <div class="form-group">
                        <label for="new-password" class="sr-only">New Password</label>
                        <input type="password" id="new-password" v-model="newPassword" placeholder="New Password" class="auth-input">
                      </div>
                      <button type="submit" class="auth-button">Update Password</button>
                    </form>
                  </div>
                </div>

                <!-- Addresses -->
                <div v-if="activeTab === 'addresses'">
                  <h2 class="section-title">Manage Addresses</h2>
                  <div class="card">
                    <p class="text-gray-600">Your default shipping address can be updated here.</p>
                    <!-- Address management form placeholder -->
                  </div>
                </div>
              </div>
            </transition>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import orderService from '../services/orderService';
import authService from '../services/authService';
import { globalState } from '../main.js';
import { useRouter } from 'vue-router';
import PageHeader from '../components/PageHeader.vue';

const router = useRouter();
const activeTab = ref('orders');

const isLoading = ref(true);
const error = ref(null);
const orders = ref([]);
const newPassword = ref('');

const profileData = ref({
    name: globalState.user ? globalState.user.name : '',
    email: globalState.user ? globalState.user.email : '',
});

const fetchAccountData = async () => {
    isLoading.value = true;
    error.value = null;

    if (!globalState.isLoggedIn) {
        router.push({ name: 'Login' });
        return;
    }

    try {
        orders.value = await orderService.getMyOrders();
    } catch (err) {
        error.value = err.message || 'Failed to load user data.';
        
    } finally {
        isLoading.value = false;
    }
};

const handleLogout = () => {
    authService.logout();
    globalState.isLoggedIn = false;
    globalState.user = null;
    router.push({ name: 'Login' });
};

const updatePassword = () => {
    
    newPassword.value = '';
    alert('Password update logic placeholder executed.');
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusClass = (status) => {
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full';
    switch (status) {
        case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'shipped': return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'delivered': return `${baseClasses} bg-green-100 text-green-800`;
        case 'cancelled': return `${baseClasses} bg-red-100 text-red-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
};

onMounted(() => {
    fetchAccountData();
});
</script>

<style scoped>
.account-page {
  background-color: #f9fafb;
  min-height: 100vh;
}

.account-nav-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: #fff;
  font-size: 1rem;
  font-weight: 500;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

.account-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.account-nav li a {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  text-decoration: none;
  color: #4b5563;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  border-left: 4px solid transparent;
}

.account-nav li a:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.account-nav li a.active {
  background-color: #f3f4f6;
  color: #8b5cf6;
  border-left-color: #8b5cf6;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #111827;
}

.card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.order-list .order-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.view-order-link {
  font-weight: 600;
  color: #8b5cf6;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.view-order-link:hover {
  color: #7c3aed;
}

.auth-input {
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.auth-input:focus {
  outline: none;
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
}

.auth-button {
  width: auto;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #8b5cf6;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.auth-button:hover {
  background-color: #7c3aed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
