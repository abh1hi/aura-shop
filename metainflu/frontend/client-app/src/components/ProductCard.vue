<template>
  <div class="product-card relative group overflow-hidden rounded-lg" @click="viewDetails">
    <!-- Image Container -->
    <div class="relative w-full aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
      <img
        v-if="product.images && product.images.length > 0"
        :src="product.images[0].url"
        :alt="product.name"
        class="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity duration-300"
      />
    </div>

    <!-- Product Info -->
    <div class="mt-4 text-center">
      <h3 class="text-sm text-gray-700">{{ product.name }}</h3>
      <p class="mt-1 text-lg font-medium text-gray-900">${{ product.price ? product.price.toFixed(2) : 'N/A' }}</p>
    </div>

    <!-- Add to Cart Button -->
    <div class="absolute inset-x-0 bottom-0 h-16 bg-white bg-opacity-80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
      <button
        @click.stop="addToCart"
        class="w-full h-full text-sm font-semibold text-gray-800 hover:text-gold-500 transition-colors duration-300"
      >
        Add to Cart
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import cartService from '../services/cartService';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const isAdding = ref(false);

const addToCart = async () => {
  isAdding.value = true;
  try {
    await cartService.addItem({ productId: props.product._id, quantity: 1 });
    // Optionally, provide user feedback, e.g., show a toast notification
    console.log('Product added to cart');
  } catch (err) {
    console.error('Add to cart failed', err);
  } finally {
    isAdding.value = false;
  }
};

const viewDetails = () => {
  router.push({ name: 'ProductDetail', params: { id: props.product._id } });
};
</script>

<style scoped>
.product-card {
  cursor: pointer;
}
</style>