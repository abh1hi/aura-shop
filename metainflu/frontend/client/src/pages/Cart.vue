<template>
    <div>
        <section class="page-header">
            <div class="container">
                <h1>Shopping Cart</h1>
            </div>
        </section>

        <section class="section container">
            <div v-if="isLoading" class="text-center py-10">
                <p class="text-xl text-gray-500">Loading your cart...</p>
            </div>
            <div v-else-if="error" class="text-center py-10">
                <p class="text-xl text-red-500">Error loading cart: {{ error }}</p>
                <button @click="fetchCart" class="cta-button mt-4">Try Again</button>
            </div>
            <div v-else-if="cartItems.length === 0" class="text-center py-10">
                <h2 class="text-2xl font-semibold">Your cart is empty.</h2>
                <p class="text-gray-600 mt-2">Time to find your next great piece!</p>
                <router-link to="/shop" class="cta-button mt-4">Start Shopping</router-link>
            </div>
            <div v-else class="cart-layout">
                <div class="cart-items">
                    <div v-for="item in cartItems" :key="item.product._id" class="cart-item">
                        <!-- Product Image -->
                        <img :src="item.product.imageUrl || 'https://placehold.co/100x100/f4f4f4/ccc?text=AURA'" :alt="item.product.name">
                        
                        <!-- Item Details & Remove Button -->
                        <div class="item-details">
                            <h3 class="text-xl font-medium">{{ item.product.name }}</h3>
                            <p class="text-gray-500">
                                <span v-if="item.size">Size: {{ item.size }}</span>
                                <span v-if="item.size && item.color">,</span>
                                <span v-if="item.color"> Color: {{ item.color }}</span>
                            </p>
                            <button @click="removeItem(item.product._id)" class="remove-btn">Remove</button>
                        </div>
                        
                        <!-- Item Quantity -->
                        <div class="item-quantity">
                            <label :for="'quantity-' + item.product._id" class="mobile-label">Qty:</label>
                            <!-- Note: Quantity updating logic is omitted for simplicity but would call an API -->
                            <input 
                                :id="'quantity-' + item.product._id" 
                                type="number" 
                                :value="item.quantity" 
                                min="1"
                                @change="updateItemQuantity(item.product._id, $event.target.value)"
                            >
                        </div>
                        
                        <!-- Item Total -->
                        <div class="item-total">
                            <span class="mobile-label">Price:</span>
                            ${{ (item.product.price * item.quantity).toFixed(2) }}
                        </div>
                    </div>
                </div>
                
                <!-- Order Summary -->
                <aside class="order-summary">
                    <h2>Order Summary</h2>
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
                    <router-link to="/checkout" class="checkout-btn">Proceed to Checkout</router-link>
                </aside>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import cartService from '../services/cartService';
import PageHeader from '../components/PageHeader.vue';
import { globalState } from '../main.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const cartItems = ref([]);
const isLoading = ref(true);
const error = ref(null);

const fetchCart = async () => {
    isLoading.value = true;
    error.value = null;

    if (!globalState.isLoggedIn) {
        // If not logged in, redirect to login page
        router.push('/login');
        return;
    }

    try {
        const data = await cartService.getCart();
        // Assuming the response structure has an 'items' array
        cartItems.value = data.items || []; 
    } catch (err) {
        error.value = err.message;
        cartItems.value = [];
        console.error('Fetch Cart Error:', err);
    } finally {
        isLoading.value = false;
    }
};

const removeItem = async (productId) => {
    if (!confirm('Are you sure you want to remove this item?')) return;

    const itemIndex = cartItems.value.findIndex(item => item.product._id === productId);
    if (itemIndex === -1) return;

    const removedItem = cartItems.value[itemIndex];
    cartItems.value.splice(itemIndex, 1);

    try {
        await cartService.removeItem(productId);
    } catch (err) {
        // If the API call fails, revert the change and show an error
        cartItems.value.splice(itemIndex, 0, removedItem);
        error.value = 'Failed to remove item: ' + err.message;
        console.error('Remove Item Error:', err);
    }
};

const updateItemQuantity = (productId, quantity) => {
    const newQuantity = parseFloat(quantity);
    if (isNaN(newQuantity) || newQuantity < 1) {
        return; // Or set to a default of 1, depending on desired behavior
    }

    const itemIndex = cartItems.value.findIndex(item => item.product._id === productId);
    if (itemIndex > -1) {
        cartItems.value[itemIndex].quantity = newQuantity;
    }
    // A full implementation would also debounce this and call cartService.updateItem(productId, newQuantity)
};

const cartTotal = computed(() => {
    const subtotal = cartItems.value.reduce((acc, item) => {
        const price = parseFloat(item.product.price) || 0;
        const quantity = parseFloat(item.quantity) || 0;
        return acc + (price * quantity);
    }, 0);
    
    const shipping = subtotal > 100 ? 0 : 10.00;
    const total = subtotal + shipping;
    
    return { subtotal, shipping, total };
});

onMounted(() => {
    fetchCart();
});
</script>

<style scoped>
.cart-layout {
    display: grid;
    grid-template-columns: 2fr 1fr; /* Desktop default */
    gap: 4rem;
    align-items: flex-start;
}

/* Mobile label hidden by default */
.mobile-label {
    display: none;
    font-weight: 500;
    color: var(--text-color);
}

.cart-items .cart-item {
    display: grid;
    grid-template-columns: 100px 1fr 100px auto; /* Desktop grid: image, details, qty, total */
    gap: 2rem;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--light-gray);
}
.cart-item:last-child {
    border-bottom: none;
}
.cart-item img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
}
.item-details h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
}
.item-details p {
    margin: 0;
    color: #555;
}
.remove-btn {
    background: none;
    border: none;
    color: #ff5252;
    text-decoration: underline;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0;
    margin-top: 0.5rem;
}
.item-quantity {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.item-quantity input {
    width: 60px;
    text-align: center;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
}
.item-total {
    font-weight: 600;
    font-size: 1.2rem;
    text-align: right;
}
.order-summary {
    background-color: #fff;
    padding: 2rem;
    border-radius: 12px;
    border: 1px solid var(--light-gray);
    position: sticky;
    top: 120px; /* Adjust based on header height */
}
.order-summary h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
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
.checkout-btn {
    width: 100%;
    padding: 1rem;
    background-color: var(--c5);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.2rem;
    cursor: pointer;
    margin-top: 1rem;
    display: block; /* Make sure router-link acts like a block element */
    text-align: center;
    text-decoration: none;
}

@media (max-width: 992px) {
    .cart-layout {
        grid-template-columns: 1fr;
    }
    .order-summary {
        position: static;
        margin-top: 3rem;
    }
}

@media (max-width: 600px) {
    .cart-items .cart-item {
        /* Mobile Grid: image, details in column 1; qty, total stacked in column 2 */
        grid-template-columns: 80px 1fr; 
        grid-template-areas:
            "img details"
            "qty total"; 
        column-gap: 1rem;
        row-gap: 0.5rem;
        padding-bottom: 1.5rem;
    }

    .cart-item img {
        grid-area: img;
        height: 80px;
        width: 80px;
    }
    
    .item-details {
        grid-area: details;
    }
    
    .item-quantity {
        grid-area: qty;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 0.5rem;
    }
    
    .item-total {
        grid-area: total;
        display: flex;
        justify-content: flex-end; /* Align total price to the right */
        align-items: center;
        font-size: 1.1rem;
    }
    
    .mobile-label {
        display: inline-block;
    }
    
    .item-quantity input {
        width: 50px;
        padding: 0.4rem;
        font-size: 0.9rem;
    }
    
    .item-details .remove-btn {
        margin-top: 0.25rem;
        font-size: 0.85rem;
    }
}
</style>
