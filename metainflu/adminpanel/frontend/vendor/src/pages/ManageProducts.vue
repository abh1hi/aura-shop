<template>
  <div class="p-4 sm:p-6 md:p-8 space-y-5">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-dark-text mb-4 sm:mb-0">Manage Products</h1>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
        <router-link to="/products/add" class="w-full sm:w-auto bg-primary-blue text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center font-semibold">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Add Product
        </router-link>
        <div class="relative w-full sm:w-64">
          <input type="text" placeholder="Search products..." class="w-full px-4 py-2 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm">
          <svg class="w-4 h-4 text-gray-text absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center text-gray-text py-8">Loading your products...</div>
    <div v-else-if="error" class="text-danger-red p-4 bg-red-100 rounded-lg">Error: {{ error }}</div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="product in products" :key="product._id" class="card overflow-hidden">
        <div class="p-2 flex justify-end">
          <input type="checkbox" :value="product._id" v-model="selectedProducts" class="h-4 w-4 text-primary-blue border-gray-border rounded focus:ring-primary-blue">
        </div>
        <img :src="product.imageUrl || 'https://placehold.co/300x200/F8F9FA/6C757D?text=Product'" :alt="product.name" class="w-full h-32 object-cover rounded-lg">
        <div class="p-3">
          <h3 class="text-base font-semibold text-gray-dark-text truncate">{{ product.name }}</h3>
          <p class="text-sm text-gray-text mt-1">$ {{ product.variants && product.variants.length > 0 ? product.variants[0].price.toFixed(2) : 'N/A' }}</p>
          <p class="text-xs mt-1" :class="{'text-danger-red': product.stock < 10, 'text-success-green': product.stock >= 10}">
            Stock: {{ product.variants && product.variants.length > 0 ? product.variants[0].stock : 0 }}
          </p>
          <div class="mt-3 flex justify-end gap-2">
            <button @click="startEdit(product)" class="text-xs px-3 py-1 bg-secondary-blue text-primary-blue rounded-md hover:bg-blue-100 transition-colors">Edit</button>
            <button @click="confirmDelete(product)" class="text-xs px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors" :disabled="deletingId === product._id">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5 flex items-center justify-between p-4 bg-gray-surface rounded-lg shadow-soft">
        <div class="flex items-center">
            <input type="checkbox" @change="selectAll" :checked="allSelected" class="h-4 w-4 text-primary-blue border-gray-border rounded focus:ring-primary-blue">
            <label for="selectAll" class="ml-2 block text-sm text-gray-dark-text">Select All ({{ selectedProducts.length }} selected)</label>
        </div>
        <button @click="deleteSelectedProducts" :disabled="selectedProducts.length === 0" class="px-4 py-2 bg-danger-red text-white rounded-lg font-semibold text-sm hover:bg-red-600 disabled:opacity-50 transition-colors">
            Bulk Delete
        </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import vendorService from '../services/vendorService';

const router = useRouter();

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const deletingId = ref(null);
const selectedProducts = ref([]);

const allSelected = computed({
  get: () => products.value.length > 0 && selectedProducts.value.length === products.value.length,
  set: (value) => {
    if (value) {
      selectedProducts.value = products.value.map(p => p._id);
    } else {
      selectedProducts.value = [];
    }
  }
});

const selectAll = (event) => {
  allSelected.value = event.target.checked;
};

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    products.value = await vendorService.getVendorProducts();
    // Simple way to ensure products have an imageUrl for the UI mock
    products.value = products.value.map((p, index) => ({
      ...p,
      imageUrl: p.images && p.images.length > 0 ? p.images[0].url : `https://placehold.co/300x200/F8F9FA/6C757D?text=P${index + 1}`
    }));
  } catch (err) {
    console.error('Error fetching vendor products:', err);
    error.value = err.message || 'Could not load your product list.';
    products.value = []; 
  } finally {
    loading.value = false;
  }
};

const confirmDelete = async (product) => {
  if (confirm(`Are you sure you want to delete ${product.name}?`)) {
    deletingId.value = product._id;
    try {
      await vendorService.deleteProduct(product._id);
      products.value = products.value.filter(p => p._id !== product._id);
    } catch (err) {
      console.error('Error deleting product:', err);
      error.value = err.message || 'Failed to delete product.';
    } finally {
      deletingId.value = null;
    }
  }
};

const deleteSelectedProducts = async () => {
  if (confirm(`Are you sure you want to delete ${selectedProducts.value.length} products?`)) {
    const promises = selectedProducts.value.map(id => vendorService.deleteProduct(id));
    try {
      await Promise.all(promises);
      products.value = products.value.filter(p => !selectedProducts.value.includes(p._id));
      selectedProducts.value = [];
    } catch (err) {
      console.error('Error deleting selected products:', err);
      error.value = err.message || 'Failed to delete selected products.';
    }
  }
};

const startEdit = (product) => {
  router.push({ name: 'EditProduct', params: { id: product._id } });
};

onMounted(fetchProducts);
</script>

<style scoped>
/* Scoped styles kept minimal, relying on Tailwind classes */
</style>
