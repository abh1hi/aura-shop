<template>
  <div class="p-4 sm:p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-text-primary">Manage Products</h1>
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <router-link to="/products/add" class="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-primary text-white rounded-lg shadow-sm hover:bg-opacity-90 active:bg-opacity-80 cursor-pointer">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Add Product
        </router-link>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="relative">
      <input type="text" placeholder="Search products..." class="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary">
      <svg class="w-5 h-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </div>

    <div v-if="loading" class="text-center text-text-secondary py-8">Loading products...</div>
    <div v-else-if="error" class="p-4 bg-red-100 text-danger rounded-lg">Error: {{ error }}</div>

    <!-- Product List -->
    <div v-else class="bg-surface rounded-lg shadow-sm">
      <ul>
        <li v-for="product in products" :key="product._id" class="flex items-center p-4 border-b border-border last:border-b-0">
          <img :src="product.imageUrl || 'https://placehold.co/100x100/F2F2F7/6C757D?text=Product'" :alt="product.name" class="w-16 h-16 object-cover rounded-lg mr-4">
          <div class="flex-1">
            <h3 class="font-semibold text-text-primary">{{ product.name }}</h3>
            <p class="text-sm text-text-secondary">Price: $ {{ product.variants && product.variants.length > 0 ? product.variants[0].price.toFixed(2) : 'N/A' }}</p>
            <p class="text-sm" :class="{'text-danger': product.stock < 10, 'text-green-600': product.stock >= 10}">
              Stock: {{ product.variants && product.variants.length > 0 ? product.variants[0].stock : 0 }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="startEdit(product)" class="p-3 text-text-secondary rounded-full hover:bg-gray-100 active:bg-gray-200 cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
            </button>
            <button @click="confirmDelete(product)" class="p-3 text-danger rounded-full hover:bg-red-50 active:bg-red-100 cursor-pointer" :disabled="deletingId === product._id">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import vendorService from '../services/vendorService';

const router = useRouter();

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const deletingId = ref(null);

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    products.value = await vendorService.getVendorProducts();
    products.value = products.value.map((p, index) => ({
      ...p,
      imageUrl: p.images && p.images.length > 0 ? p.images[0].url : `https://placehold.co/100x100/F2F2F7/6C757D?text=P${index + 1}`
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

const startEdit = (product) => {
  router.push({ name: 'EditProduct', params: { id: product._id } });
};

onMounted(fetchProducts);
</script>
