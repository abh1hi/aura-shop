<template>
  <div class="product-card">
    <div class="product-image-container">
      <img :src="product.imageUrl || 'https://placehold.co/400x600/f4f4f4/ccc?text=AURA'" :alt="product.name">
      <button 
        class="quick-add-btn" 
        @click="addToCart" 
        :disabled="isAdding"
      >
        <span v-if="isAdded">Added!</span>
        <span v-else-if="isAdding">...</span>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">${{ product.price.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import cartService from '../services/cartService';
import { globalState } from '../main.js'; // Import global state for login check
import { useRouter } from 'vue-router';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const isAdding = ref(false);
const isAdded = ref(false);

const addToCart = async () => {
  // Check if user is logged in
  if (!globalState.isLoggedIn) {
    // Redirect to login if not authenticated
    router.push('/login');
    return;
  }
  
  isAdding.value = true;
  isAdded.value = false;

  const itemData = {
    productId: props.product._id,
    quantity: 1,
    // Note: size and color are defaulted here. For real selection, 
    // a modal/details page is needed.
    size: 'M', 
    color: 'Default'
  };

  try {
    // Add item to cart using the newly created service
    await cartService.addItem(itemData);
    
    // Success state feedback
    isAdded.value = true;
    setTimeout(() => {
        isAdded.value = false;
    }, 2000); // Reset the "Added!" message after 2 seconds
  } catch (error) {
    console.error('Failed to add item to cart:', error.message);
    // Show user-friendly error feedback if possible
  } finally {
    isAdding.value = false;
  }
};
</script>

<style scoped>
.product-card {
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.product-image-container {
  position: relative;
}

.product-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.quick-add-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.2s, color 0.2s;
  font-size: 0.8rem;
  font-weight: 600;
  color: #000;
}

.product-card:hover .quick-add-btn {
  opacity: 1;
  transform: translateY(0);
}

.quick-add-btn svg {
  color: #000;
  width: 24px;
  height: 24px;
}

/* Style for when the item is added */
.quick-add-btn[disabled]:not(:empty) {
    opacity: 1;
    background-color: #10b981; /* Green color */
    color: white;
    width: auto;
    padding: 0 12px;
    height: 40px;
    border-radius: 20px;
}
.quick-add-btn[disabled]:not(:empty) svg {
    display: none;
}


.product-info {
  padding: 1rem;
}

.product-name {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}
</style>
