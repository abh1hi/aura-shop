<template>
    <div class="confirmation-page">
         <header>
            <div class="container">
                <router-link to="/" class="logo">AURA</router-link>
            </div>
        </header>
        <main>
            <section class="container confirmation-content">
                <div v-if="isLoading" class="py-10">
                    <h1 class="text-2xl font-semibold">Loading Order Details...</h1>
                </div>
                <div v-else-if="error" class="py-10">
                    <h1 class="text-3xl font-semibold text-red-600">Error Loading Order</h1>
                    <p class="text-red-500 mt-2">{{ error }}</p>
                    <router-link to="/" class="cta-button mt-4">Go to Home</router-link>
                </div>
                <div v-else>
                    <h1 class="text-green-600">Thank You for Your Order!</h1>
                    <p>Your order has been placed successfully. You will receive an email confirmation shortly.</p>
                    <p class="order-number">Order Number: #{{ order._id }}</p>
                    <div class="order-summary-box">
                        <p><strong>Order Total:</strong> ${{ order.total.toFixed(2) }}</p>
                        <p><strong>Shipping To:</strong> {{ order.shippingAddress.city }}, {{ order.shippingAddress.country }}</p>
                        <p><strong>Items:</strong> {{ order.orderItems.length }} unique item(s)</p>
                    </div>
                    <router-link to="/shop" class="cta-button">Continue Shopping</router-link>
                </div>
            </section>
        </main>
         <footer class="footer">
            <p>&copy; 2025 AURA. All rights reserved.</p>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import orderService from '../services/orderService';

const route = useRoute();
const order = ref(null);
const isLoading = ref(true);
const error = ref(null);

const fetchOrder = async () => {
    isLoading.value = true;
    error.value = null;
    const orderId = route.query.orderId;

    if (!orderId) {
        error.value = "Order ID is missing. Cannot display confirmation.";
        isLoading.value = false;
        return;
    }

    try {
        const data = await orderService.getOrderById(orderId);
        order.value = data;
    } catch (err) {
        error.value = err.message;
        console.error('Fetch Order Error:', err);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchOrder();
});
</script>

<style scoped>
.confirmation-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    text-align: center;
}
header {
    padding: 1.5rem 0;
}
.logo {
    font-weight: 700;
    font-size: 1.8rem;
    text-decoration: none;
    color: var(--c5);
}
main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.container {
    width: 90%;
    max-width: 800px;
    margin: 0 auto;
}
.confirmation-content h1 {
    font-size: 3rem;
    font-weight: 600;
    color: var(--c5);
    margin-bottom: 1rem;
}
.confirmation-content p {
    font-size: 1.2rem;
    line-height: 1.8;
    color: #555;
    margin-bottom: 2rem;
}
.order-number {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
}
.order-summary-box {
    background-color: var(--light-gray);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 3rem;
    display: inline-block;
    text-align: left;
}
.order-summary-box p {
    font-size: 1rem;
    line-height: 1.6;
    margin: 0.5rem 0;
}

.footer {
    padding: 2rem 0;
    text-align: center;
    color: #aaa;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .confirmation-content h1 {
        font-size: 2.5rem;
    }
    .confirmation-content p {
        font-size: 1rem;
    }
    .order-number {
        font-size: 1.2rem;
    }
}
</style>
