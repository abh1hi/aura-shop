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

    <div class="mb-4 flex items-center">
      <input type="checkbox" @change="selectAll" :checked="allSelected" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
      <label for="selectAll" class="ml-2 block text-sm text-gray-900">Select All</label>
      <button @click="deleteSelectedProducts" :disabled="selectedProducts.length === 0" class="ml-4 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400">Delete Selected</button>
    </div>

    <div v-if="loading" class="text-center text-gray-500 py-8">Loading your products...</div>
    <div v-else-if="error" class="text-red-500 p-4 bg-red-100 rounded-lg">Error: {{ error }}</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="product in products" :key="product._id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4">
          <input type="checkbox" :value="product._id" v-model="selectedProducts" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
        </div>
        <img :src="product.imageUrl || 'https://placehold.co/300x200/f0f0f0/333?text=N/A'" :alt="product.name" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800">{{ product.name }}</h3>
          <p class="text-gray-600">${{ product.variants && product.variants.length > 0 ? product.variants[0].price.toFixed(2) : 'N/A' }}</p>
          <p class="text-sm text-gray-500" :class="{'text-red-500': product.stock < 10, 'text-green-600': product.stock >= 10}">
            {{ product.variants && product.variants.length > 0 ? product.variants[0].stock : 0 }} in stock
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
  } catch (err) {
    console.error('Error fetching vendor products:', err);
    error.value = err.message || 'Could not load your product list.';
    products.value = []; 
  } finally {
    loading.value = false;
  }
};

const confirmDelete = async (product) => {
  if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
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
  if (window.confirm(`Are you sure you want to delete ${selectedProducts.value.length} products?`)) {
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
/* Using Tailwind CSS classes directly in the template */
</style>