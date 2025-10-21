<template>
    <div>
        <section class="page-header">
            <div class="container">
                <h1>Checkout</h1>
            </div>
        </section>

        <section class="section container">
            <div v-if="isLoading" class="text-center py-10">
                <p class="text-xl text-gray-500">Preparing checkout...</p>
            </div>
            <div v-else-if="error" class="text-center py-10">
                <p class="text-xl text-red-500">Error: {{ error }}</p>
                <router-link to="/cart" class="cta-button mt-4">Return to Cart</router-link>
            </div>
            <div v-else class="checkout-layout">
                <div class="checkout-form">
                    <section>
                        <h2>Shipping Information</h2>
                        <form @submit.prevent>
                            <div class="form-group">
                                <label for="name">Full Name</label>
                                <input type="text" id="name" required v-model="formData.shippingAddress.fullName">
                            </div>
                            <div class="form-group">
                                <label for="address">Address</label>
                                <input type="text" id="address" required v-model="formData.shippingAddress.address">
                            </div>
                            <div class="form-group grid grid-cols-2 gap-4">
                                <div>
                                    <label for="city">City</label>
                                    <input type="text" id="city" required v-model="formData.shippingAddress.city">
                                </div>
                                <div>
                                    <label for="postalCode">Postal Code</label>
                                    <input type="text" id="postalCode" required v-model="formData.shippingAddress.postalCode">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="country">Country</label>
                                <input type="text" id="country" required v-model="formData.shippingAddress.country">
                            </div>
                        </form>
                    </section>
                    <section class="mt-8">
                        <h2>Payment Details</h2>
                        <form @submit.prevent>
                            <div class="form-group">
                                <label for="card-number">Card Number</label>
                                <input type="text" id="card-number" required v-model="formData.paymentDetails.cardNumber">
                            </div>
                            <div class="form-group">
                                <label for="paymentMethod">Payment Method</label>
                                <select id="paymentMethod" required v-model="formData.paymentDetails.paymentMethod">
                                    <option value="">Select Method</option>
                                    <option value="Card">Credit Card</option>
                                    <option value="PayPal">PayPal</option>
                                </select>
                            </div>
                            <!-- More payment fields (omitted for brevity) -->
                        </form>
                    </section>
                    <div v-if="orderError" class="mt-4 text-red-500 font-semibold">{{ orderError }}</div>
                </div>
                
                <!-- Order Summary (Now using cart data) -->
                <aside class="order-summary">
                    <h2>Order Summary</h2>
                    <div class="item-list">
                        <div v-for="item in cartItems" :key="item.product._id" class="item-summary-row">
                            <img :src="item.product.images[0] || 'https://via.placeholder.com/50'" alt="Product Image" class="w-12 h-12 object-cover rounded-md">
                            <span>{{ item.product.name }} (x{{ item.quantity }})</span>
                            <span>${{ (item.product.price * item.quantity).toFixed(2) }}</span>
                            <button @click="removeItem(item._id)" class="text-red-500 hover:text-red-700">Remove</button>
                        </div>
                    </div>
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>${{ cartTotal.subtotal.toFixed(2) }}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span>${{ cartTotal.shipping.toFixed(2) }}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span>${{ cartTotal.total.toFixed(2) }}</span>
                    </div>
                    <button @click="placeOrder" :disabled="isPlacingOrder" class="place-order-btn">
                        {{ isPlacingOrder ? 'Processing...' : 'Place Order' }}
                    </button>
                </aside>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import cartService from '../services/cartService';
import orderService from '../services/orderService';
import { useRouter } from 'vue-router';

const router = useRouter();

const cartItems = ref([]);
const isLoading = ref(true);
const error = ref(null);

const isPlacingOrder = ref(false);
const orderError = ref(null);

const formData = ref({
    shippingAddress: {
        fullName: 'Jane Doe',
        address: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        country: 'USA',
    },
    paymentDetails: {
        paymentMethod: 'Card',
        cardNumber: '**** **** **** 1234'
    }
});


// --- Data Fetching ---
const fetchCart = async () => {
    isLoading.value = true;
    try {
        const data = await cartService.getCart();
        cartItems.value = data.items || [];
        if (cartItems.value.length === 0) {
            error.value = "Your cart is empty. Please add items to proceed.";
        }
    } catch (err) {
        error.value = 'Failed to load cart: ' + err.message;
        console.error('Fetch Cart Error:', err);
    } finally {
        isLoading.value = false;
    }
};

// --- Calculations ---
const cartTotal = computed(() => {
    const subtotal = cartItems.value.reduce((acc, item) => {
        const price = item.product?.price || 0;
        const quantity = item.quantity || 0;
        return acc + (price * quantity);
    }, 0);
    
    const shipping = subtotal > 100 ? 0 : 10.00;
    const total = subtotal + shipping;
    
    return { subtotal, shipping, total };
});

// --- Actions ---
const placeOrder = async () => {
    if (cartItems.value.length === 0) {
        orderError.value = "Cannot place order: Cart is empty.";
        return;
    }
    
    orderError.value = null;
    isPlacingOrder.value = true;
    
    try {
        const orderSummary = {
            orderItems: cartItems.value,
            subtotal: cartTotal.value.subtotal,
            shippingCost: cartTotal.value.shipping,
            total: cartTotal.value.total,
        };
        
        const payload = {
            shippingAddress: formData.value.shippingAddress,
            paymentMethod: formData.value.paymentDetails.paymentMethod,
            // These totals are passed to the backend, but the backend recalculates them.
            // Sending them here helps ensure data consistency.
            subtotal: orderSummary.subtotal,
            shippingCost: orderSummary.shippingCost,
            total: orderSummary.total,
        };

        const newOrder = await orderService.createOrder(payload);
        
        // Success: Navigate to confirmation page
        router.push({ name: 'OrderPlaced', query: { orderId: newOrder._id } });
        
    } catch (err) {
        orderError.value = 'Failed to place order: ' + (err.message || 'Unknown error');
        console.error('Place Order Error:', err);
    } finally {
        isPlacingOrder.value = false;
    }
};

const removeItem = async (itemId) => {
    try {
        await cartService.removeItem(itemId);
        fetchCart();
    } catch (err) {
        error.value = 'Failed to remove item: ' + err.message;
        console.error('Remove Item Error:', err);
    }
};

onMounted(() => {
    fetchCart();
});
</script>

<style scoped>
.checkout-layout {
    display: grid;
    grid-template-columns: 2fr 1fr; /* Desktop default */
    gap: 4rem;
    align-items: flex-start;
}

.checkout-form h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--light-gray);
    padding-bottom: 1rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.form-group input, .form-group select {
    width: 100%;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

.order-summary {
    background-color: #fff;
    padding: 2rem;
    border-radius: 12px;
    border: 1px solid var(--light-gray);
    position: sticky; /* Sticky on desktop/tablet */
    top: 40px;
}

.order-summary h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
}

.item-list {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px dashed var(--light-gray);
}

.item-summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
    color: #555;
    margin-bottom: 0.5rem;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.summary-row.total {
    font-weight: 600;
    font-size: 1.2rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--light-gray);
}

.place-order-btn {
    width: 100%;
    padding: 1rem;
    background-color: var(--c5);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.2rem;
    cursor: pointer;
    margin-top: 1rem;
}
.place-order-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

@media (max-width: 992px) {
    /* Tablet/Mobile Layout: Stack form and summary */
    .checkout-layout {
        grid-template-columns: 1fr;
    }
    
    /* Remove sticky position on mobile to prevent scroll issues */
    .order-summary {
        position: static;
        order: -1; /* Place summary above the form on mobile for better flow */
        margin-bottom: 3rem;
    }
}
</style>
