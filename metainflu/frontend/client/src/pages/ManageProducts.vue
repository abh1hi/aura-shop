<template>
  <div class="p-4 sm:p-6 md:p-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Manage Products</h1>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        <router-link to="/vendor-panel/products/add" class="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center">
          <i class="fas fa-plus mr-2"></i>
          Add New Product
        </router-link>
        <div class="relative w-full sm:w-64">
          <input type="text" placeholder="Search products..." class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center text-gray-500 py-8">Loading your products...</div>
    <div v-else-if="error" class="text-red-500 p-4 bg-red-100 rounded-lg">Error: {{ error }}</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="product in products" :key="product._id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <img :src="product.imageUrl || 'https://placehold.co/300x200/f0f0f0/333?text=N/A'" :alt="product.name" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800">{{ product.name }}</h3>
          <p class="text-gray-600">${{ product.price.toFixed(2) }}</p>
          <p class="text-sm text-gray-500" :class="{'text-red-500': product.stock < 10, 'text-green-600': product.stock >= 10}">
            {{ product.stock || 0 }} in stock
          </p>
          <!-- Optional: Show first category name if available -->
          <p v-if="product.categories && product.categories.length" class="text-xs text-gray-400 mt-1">
            Category: {{ (product.categories[0].name || product.categories[0]) }}
          </p>
          <div class="mt-4 flex justify-end gap-2">
            <button @click="startEdit(product)" class="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Edit</button>
            <button @click="confirmDelete(product)" class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600" :disabled="deletingId === product._id">
              {{ deletingId === product._id ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals will be implemented in subsequent steps -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import vendorService from '../services/vendorService';

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const deletingId = ref(null);

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await vendorService.getVendorProducts();
    products.value = response.map(p => ({ 
      ...p, 
      stock: p.stock || 0,
      // Normalize categories to array and drop legacy single-category mapping
      categories: Array.isArray(p.categories) ? p.categories : (p.category ? [p.category] : []),
    }));
  } catch (err) {
    console.error('Error fetching vendor products:', err);
    error.value = err.message || 'Could not load your product list.';
    products.value = []; 
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (product) => {
  // Placeholder for delete confirmation modal
  console.log('Confirm delete for:', product);
};

const startEdit = (product) => {
  // Placeholder for edit modal
  console.log('Start edit for:', product);
};

onMounted(fetchProducts);
</script>

<style scoped>
/* Using Tailwind CSS classes directly in the template */
</style>
