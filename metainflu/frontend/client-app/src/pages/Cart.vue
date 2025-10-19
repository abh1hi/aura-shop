<template>
  <div class="cart-page">
    <PageHeader title="Shopping Bag" subtitle="Review your selections before checkout." />

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="isLoading" class="text-center py-20">
        <p class="text-lg text-gray-400">Loading your bag...</p>
      </div>
      <div v-else-if="error" class="text-center py-20 text-red-400">
        <p><strong>An error occurred:</strong> {{ error }}</p>
      </div>
      <div v-else-if="cartItems.length === 0" class="text-center py-20">
        <h2 class="text-2xl font-semibold text-gray-700">Your bag is empty.</h2>
        <p class="text-gray-500 mt-2">Discover your next favorite piece.</p>
        <router-link to="/shop" class="empty-cart-btn">Start Shopping</router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-6">
          <div v-for="item in cartItems" :key="item.product._id" class="cart-item-card">
            <div class="flex items-center gap-6">
              <img :src="item.product.imageUrl || 'https://placehold.co/100x100/f1f1f1/ccc?text=AURA'" :alt="item.product.name" class="w-28 h-28 object-cover rounded-lg">
              <div class="flex-grow">
                <h3 class="font-semibold text-gray-800">{{ item.product.name }}</h3>
                <p class="text-sm text-gray-500">
                  <span v-if="item.size">Size: {{ item.size }}</span>
                  <span v-if="item.color">, Color: {{ item.color }}</span>
                </p>
                <p class="text-lg font-semibold text-gray-900 mt-2">${{ item.product.price.toFixed(2) }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between mt-4">
              <div class="quantity-control">
                <button @click="updateItemQuantity(item.product._id, item.quantity - 1)">-</button>
                <input type="text" :value="item.quantity" readonly>
                <button @click="updateItemQuantity(item.product._id, item.quantity + 1)">+</button>
              </div>
              <button @click="removeItem(item.product._id)" class="remove-item-btn">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <aside class="order-summary">
          <h2 class="text-xl font-bold mb-6">Order Summary</h2>
          <div class="space-y-4">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${{ cartTotal.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>${{ cartTotal.shipping.toFixed(2) }}</span>
            </div>
            <div class="border-t border-gray-200 my-4"></div>
            <div class="flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>${{ cartTotal.total.toFixed(2) }}</span>
            </div>
          </div>
          <router-link to="/checkout" class="checkout-btn">Proceed to Checkout</router-link>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import cartService from '../services/cartService';
import PageHeader from '../components/PageHeader.vue';
import { globalState } from '../main.js';

const router = useRouter();
const cartItems = ref([]);
const isLoading = ref(true);
const error = ref(null);

const fetchCart = async () => {
  isLoading.value = true;
  error.value = null;
  if (!globalState.isLoggedIn) {
    router.push('/login?redirect=/cart');
    return;
  }
  try {
    const data = await cartService.getCart();
    cartItems.value = data.items || [];
  } catch (err) {
    error.value = err.message;
    console.error('Fetch Cart Error:', err);
  } finally {
    isLoading.value = false;
  }
};

const removeItem = async (productId) => {
  try {
    await cartService.removeItem(productId);
    await fetchCart(); // Refresh cart
  } catch (err) {
    alert('Failed to remove item: ' + err.message);
  }
};

const updateItemQuantity = async (productId, quantity) => {
  if (quantity < 1) {
    removeItem(productId);
    return;
  }
  try {
    // This should be debounced in a real app
    await cartService.updateItem(productId, quantity);
    const item = cartItems.value.find(i => i.product._id === productId);
    if (item) item.quantity = quantity;
  } catch (err) {
    alert('Failed to update quantity: ' + err.message);
  }
};

const cartTotal = computed(() => {
  const subtotal = cartItems.value.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 15.00; // Free shipping over $150
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
});

onMounted(fetchCart);
</script>

<style scoped>
.cart-page { background-color: #f9fafb; min-height: 100vh; }

.empty-cart-btn {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.8rem 2.5rem;
  border-radius: 30px;
  background-color: #1a1a1a;
  color: white;
  font-weight: 600;
  transition: background-color 0.3s;
}
.empty-cart-btn:hover { background-color: #333; }

.cart-item-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.remove-item-btn {
  background: none; border: none; padding: 0.5rem;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s;
}
.remove-item-btn:hover { color: #ef4444; }

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 20px;
}
.quantity-control button {
  background: none;
  border: none;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
  font-weight: bold;
  color: #4b5563;
}
.quantity-control input {
  width: 40px;
  text-align: center;
  border: none;
  background: none;
  font-weight: 500;
  color: #111827;
}

.order-summary {
  background-color: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  position: sticky;
  top: 120px;
}

.checkout-btn {
  display: block;
  width: 100%;
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 30px;
  background-color: #8b5cf6;
  color: white;
  font-weight: 700;
  text-align: center;
  transition: background-color 0.3s, transform 0.2s;
}
.checkout-btn:hover { background-color: #7c3aed; transform: translateY(-2px); }
</style>
