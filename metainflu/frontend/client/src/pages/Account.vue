<template>
    <div>
        <section class="page-header">
            <div class="container">
                <h1>My Account</h1>
            </div>
        </section>

        <section class="section container">
            <div v-if="isLoading" class="text-center py-10">
                <p class="text-xl text-gray-500">Loading account details...</p>
            </div>
            <div v-else-if="error" class="text-center py-10">
                <p class="text-xl text-red-500">Error: {{ error }}</p>
            </div>
            <div v-else class="account-layout">
                <aside class="account-nav">
                    <!-- Desktop/Tablet Navigation -->
                    <ul class="desktop-nav">
                        <li><a href="#orders" :class="{ active: activeTab === 'orders' }" @click.prevent="activeTab = 'orders'">Order History</a></li>
                        <li><a href="#profile" :class="{ active: activeTab === 'profile' }" @click.prevent="activeTab = 'profile'">Profile Details</a></li>
                        <li><a href="#addresses" :class="{ active: activeTab === 'addresses' }" @click.prevent="activeTab = 'addresses'">Addresses</a></li>
                        <li><a href="#" @click.prevent="handleLogout">Logout</a></li>
                    </ul>
                    
                    <!-- Mobile/Small Tablet Navigation -->
                    <div class="mobile-tabs">
                        <button 
                            :class="{ active: activeTab === 'orders' }" 
                            @click="activeTab = 'orders'"
                        >Orders</button>
                         <button 
                            :class="{ active: activeTab === 'profile' }" 
                            @click="activeTab = 'profile'"
                        >Profile</button>
                         <button 
                            :class="{ active: activeTab === 'addresses' }" 
                            @click="activeTab = 'addresses'"
                        >Addresses</button>
                        <button @click.prevent="handleLogout">Logout</button>
                    </div>
                </aside>
                <div class="account-content">
                    
                    <!-- ORDER HISTORY TAB -->
                    <div id="orders" v-show="activeTab === 'orders'">
                        <h2 class="text-2xl font-semibold mb-4">Order History ({{ orders.length }})</h2>
                        <div v-if="orders.length === 0" class="text-gray-500 py-4">
                            You have not placed any orders yet.
                        </div>
                        <div v-else class="order-history">
                            <div class="table-scroll">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Order #</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Total</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="order in orders" :key="order._id">
                                            <td>#{{ order._id.slice(-6) }}</td>
                                            <td>{{ formatDate(order.createdAt) }}</td>
                                            <td>
                                                <span :class="getStatusClass(order.status)">{{ order.status }}</span>
                                            </td>
                                            <td>${{ order.total.toFixed(2) }}</td>
                                            <td>
                                                <!-- Link to view order details - assuming a dynamic detail page later -->
                                                <router-link :to="{ name: 'OrderPlaced', query: { orderId: order._id } }" class="text-blue-600 hover:underline">View</router-link>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- PROFILE TAB -->
                    <div id="profile" v-show="activeTab === 'profile'">
                        <h2 class="text-2xl font-semibold mb-4">Profile Details</h2>
                        <div class="profile-details-card">
                            <p><strong>Name:</strong> {{ profileData.name }}</p>
                            <p><strong>Email:</strong> {{ profileData.email }}</p>
                        </div>
                        
                        <h3 class="text-xl font-semibold mt-8 mb-4">Update Password</h3>
                        <form @submit.prevent="updatePassword">
                            <div class="form-group">
                                <label for="new-password">New Password</label>
                                <input type="password" id="new-password" v-model="newPassword">
                            </div>
                            <button type="submit" class="submit-btn">Update Password</button>
                        </form>
                    </div>
                    
                    <!-- ADDRESSES TAB -->
                    <div id="addresses" v-show="activeTab === 'addresses'">
                        <h2 class="text-2xl font-semibold mb-4">Manage Addresses</h2>
                        <p class="text-gray-600">Your default shipping address can be updated here.</p>
                        <!-- Address management form placeholder -->
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import orderService from '../services/orderService';
import authService from '../services/authService';
import { globalState } from '../main.js';
import { useRouter } from 'vue-router';

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
        // 1. Fetch Orders
        orders.value = await orderService.getMyOrders();

        // 2. Profile data is fetched from globalState (set during login/register)
        
    } catch (err) {
        error.value = err.message || 'Failed to load user data.';
        console.error('Fetch Account Data Error:', err);
    } finally {
        isLoading.value = false;
    }
};

const handleLogout = () => {
    authService.logout(); // Clears localStorage
    globalState.isLoggedIn = false;
    globalState.user = null;
    router.push({ name: 'Login' });
};

const updatePassword = () => {
    // In a full implementation, you would call an authService.updatePassword(newPassword.value) API endpoint
    console.log('Attempting to update password:', newPassword.value);
    newPassword.value = '';
    alert('Password update logic placeholder executed.'); 
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusClass = (status) => {
    switch (status) {
        case 'pending': return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800';
        case 'shipped': return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800';
        case 'delivered': return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
        case 'cancelled': return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800';
        default: return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
    }
};


onMounted(() => {
    fetchAccountData();
});
</script>

<style scoped>
/* Standard styles remain */
.account-layout {
    display: grid;
    grid-template-columns: 280px 1fr; /* Desktop default */
    gap: 4rem;
}

.profile-details-card {
    background-color: #fff;
    padding: 1.5rem;
    border: 1px solid var(--light-gray);
    border-radius: 12px;
}
.profile-details-card p {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
}

.table-scroll {
    overflow-x: auto;
}

.order-history table {
    width: 100%;
    min-width: 700px;
    border-collapse: collapse;
}

.order-history th,
.order-history td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--light-gray);
}

.order-history th {
    font-weight: 600;
    background-color: #f8f8f8;
    white-space: nowrap;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.form-group input {
    width: 100%;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
    box-sizing: border-box;
}

.submit-btn {
    background-color: var(--c5);
    color: white;
    padding: 1rem 2.5rem;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.submit-btn:hover {
    background-color: var(--c6);
}

/* --- Navigation Styles --- */
.desktop-nav {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid var(--light-gray);
    border-radius: 12px;
    overflow: hidden;
}

.desktop-nav li a {
    display: block;
    padding: 1.5rem;
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: background-color 0.3s;
    border-bottom: 1px solid var(--light-gray);
    cursor: pointer;
}

.desktop-nav li:last-child a {
    border-bottom: none;
}

.desktop-nav li a.active,
.desktop-nav li a:hover {
    background-color: var(--light-gray);
    color: var(--c5);
}

/* Mobile Tabs (Hidden by default) */
.mobile-tabs {
    display: none;
}
.mobile-tabs button {
    flex-grow: 1;
    padding: 0.75rem 0.5rem;
    background-color: transparent;
    color: var(--text-color);
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    white-space: nowrap;
}

.mobile-tabs button.active {
    background-color: white;
    color: var(--c5);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

@media (max-width: 992px) {
    .account-layout {
        grid-template-columns: 1fr; /* Stack layout on tablet/mobile */
        gap: 2rem;
    }

    /* Hide desktop navigation */
    .desktop-nav {
        display: none;
    }

    /* Show mobile tabs */
    .mobile-tabs {
        display: flex;
        justify-content: space-around;
        background-color: var(--light-gray);
        border-radius: 12px;
        padding: 0.5rem;
        gap: 0.5rem;
    }
}
</style>
