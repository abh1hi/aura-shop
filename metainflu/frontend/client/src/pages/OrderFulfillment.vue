<template>
  <div class="page-container">
    <h1 class="page-title">Order Fulfillment Center</h1>

    <div v-if="loadingOrders" class="text-center text-gray-500 py-8">
        <p>Loading orders for your products...</p>
    </div>
    <div v-else-if="error" class="text-red-500 p-4 bg-red-100 rounded-lg">
        <p>Error fetching orders: {{ error }}</p>
    </div>
    <div v-else>
        <!-- Status Grid based on fetched orders -->
        <div class="status-grid">
            <div class="status-card" :style="{ '--card-color': '#f59e0b' }">
                <div class="status-label">Pending Fulfillment</div>
                <div class="status-count">{{ pendingOrders.length }}</div>
            </div>
            <div class="status-card" :style="{ '--card-color': '#3b82f6' }">
                <div class="status-label">Shipped</div>
                <div class="status-count">{{ shippedOrders.length }}</div>
            </div>
            <div class="status-card" :style="{ '--card-color': '#10b981' }">
                <div class="status-label">Delivered</div>
                <div class="status-count">{{ deliveredOrders.length }}</div>
            </div>
            <div class="status-card" :style="{ '--card-color': '#ef4444' }">
                <div class="status-label">Cancelled</div>
                <div class="status-count">{{ cancelledOrders.length }}</div>
            </div>
        </div>

        <div class="table-card mt-8">
            <h2 class="section-subtitle">Orders Awaiting Shipment ({{ pendingOrders.length }})</h2>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in pendingOrders" :key="order._id">
                            <td>#{{ order._id.substring(0, 8) }}...</td>
                            <!-- Assuming user info is populated on the order object from the backend -->
                            <td>{{ order.user ? order.user.name : 'N/A' }}</td>
                            <td>{{ formatDate(order.createdAt) }}</td>
                            <td>${{ order.total.toFixed(2) }}</td>
                            <td><span :class="getStatusClass(order.status)">{{ order.status }}</span></td>
                            <td>
                                <button 
                                    class="action-btn view-btn"
                                    @click="viewDetails(order)"
                                >
                                    View Details
                                </button>
                                <button 
                                    class="action-btn ship-btn"
                                    @click="markShipped(order._id)"
                                    :disabled="shippingId === order._id"
                                >
                                    {{ shippingId === order._id ? 'Updating...' : 'Mark Shipped' }}
                                </button>
                            </td>
                        </tr>
                        <tr v-if="pendingOrders.length === 0">
                            <td colspan="6" class="text-center text-gray-500 py-4">No pending orders at this time.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Shipped Orders List -->
        <div class="table-card mt-8">
            <h2 class="section-subtitle">Shipped Orders ({{ shippedOrders.length }})</h2>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in shippedOrders" :key="order._id">
                            <td>#{{ order._id.substring(0, 8) }}...</td>
                            <td>{{ order.user ? order.user.name : 'N/A' }}</td>
                            <td>{{ formatDate(order.createdAt) }}</td>
                            <td><span :class="getStatusClass(order.status)">{{ order.status }}</span></td>
                        </tr>
                         <tr v-if="shippedOrders.length === 0">
                            <td colspan="4" class="text-center text-gray-500 py-4">No shipped orders yet.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import vendorService from '../services/vendorService';

const orders = ref([]);
const loadingOrders = ref(true);
const shippingId = ref(null);
const error = ref(null);

// Computed properties to filter orders by status
const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'));
const shippedOrders = computed(() => orders.value.filter(o => o.status === 'shipped'));
const deliveredOrders = computed(() => orders.value.filter(o => o.status === 'delivered'));
const cancelledOrders = computed(() => orders.value.filter(o => o.status === 'cancelled'));

/**
 * Fetches vendor-specific orders from the backend.
 */
const fetchOrders = async () => {
    loadingOrders.value = true;
    error.value = null;
    try {
        const response = await vendorService.getVendorOrders();
        orders.value = response;
    } catch (err) {
        console.error("Failed to fetch vendor orders:", err);
        error.value = err.message || 'Could not load order fulfillment data.';
        orders.value = [];
    } finally {
        loadingOrders.value = false;
    }
};

/**
 * Marks a specific order as 'shipped' and refreshes the list.
 * @param {string} orderId - The ID of the order to update.
 */
const markShipped = async (orderId) => {
    shippingId.value = orderId;
    error.value = null;
    try {
        // Call the service function to update the status
        await vendorService.markOrderShipped(orderId);
        
        // Optimistically update the local list
        const index = orders.value.findIndex(o => o._id === orderId);
        if (index !== -1) {
            orders.value[index].status = 'shipped';
        }
        
    } catch (err) {
        console.error('Error marking order as shipped:', err);
        error.value = err.message || `Failed to ship order #${orderId}.`;
    } finally {
        shippingId.value = null;
    }
};

/**
 * Provides CSS classes based on order status for visual styling.
 */
const getStatusClass = (status) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'shipped': return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'delivered': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
        case 'cancelled': return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
        default: return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
    }
};

/**
 * Formats the date string for display.
 */
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Placeholder for viewing detailed information (can be implemented with a modal later)
const viewDetails = (order) => {
    console.log('Viewing order details:', order);
    // In a real app, this would open a modal with full order/item details
};

onMounted(() => {
    fetchOrders();
});
</script>

<style scoped>
.page-container {
    background-color: #f4f4f9;
    min-height: 100%;
}
.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
}
.status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}
.status-card {
    background-color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    border-left: 5px solid var(--card-color);
}
.status-label {
    font-size: 1rem;
    color: #555;
    margin-bottom: 0.5rem;
}
.status-count {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
}
.table-card {
    background-color: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.section-subtitle {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
}
.table-responsive {
    overflow-x: auto;
}
table {
    width: 100%;
    min-width: 600px;
    border-collapse: collapse;
}
th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
    white-space: nowrap;
}
th {
    background-color: #f8f8f8;
    font-weight: 600;
    color: #555;
}
.action-btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-right: 0.5rem;
    border: none;
    transition: opacity 0.2s;
}
.view-btn {
    background-color: #f0f4ff;
    color: #3b82f6;
}
.ship-btn {
    background-color: #d1fae5;
    color: #059669;
}
.ship-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .status-count {
        font-size: 2rem;
    }
}
</style>
