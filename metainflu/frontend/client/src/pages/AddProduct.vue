<template>
  <div class="p-4 sm:p-6 md:p-8">
    <div class="max-w-3xl mx-auto">
      <router-link to="/vendor-panel/products" class="text-gray-600 hover:text-blue-600 flex items-center mb-6">
        <i class="fas fa-arrow-left mr-2"></i>
        Back to Products
      </router-link>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Add New Product</h1>
      <div class="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div v-if="successMessage" class="bg-green-100 text-green-800 p-4 rounded-lg mb-6">{{ successMessage }}</div>
        <div v-if="errorMessage" class="bg-red-100 text-red-800 p-4 rounded-lg mb-6">Error: {{ errorMessage }}</div>

        <form @submit.prevent="saveProduct" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" id="name" required v-model="newProduct.name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">Price ($)</label>
              <input type="number" id="price" required v-model.number="newProduct.price" min="0" step="0.01" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label for="stock" class="block text-sm font-medium text-gray-700">Initial Stock</label>
              <input type="number" id="stock" required v-model.number="newProduct.stock" min="0" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
          </div>

          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" required v-model="newProduct.category" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
              <option value="new_category">Other (add a new category)</option>
            </select>
          </div>

          <div v-if="newProduct.category === 'new_category'">
            <label for="newCategoryName" class="block text-sm font-medium text-gray-700">New Category Name</label>
            <input type="text" id="newCategoryName" v-model="newCategoryName" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter new category name">
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" rows="4" required v-model="newProduct.description" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
          </div>

          <div>
            <label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
            <input type="text" id="imageUrl" required v-model="newProduct.imageUrl" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>

          <div class="flex justify-end">
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors" :disabled="isSaving">
              {{ isSaving ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import vendorService from '../services/vendorService';

const router = useRouter();

const newProduct = ref({
  name: '',
  price: 0,
  description: '',
  stock: 0,
  category: '',
  imageUrl: '',
});

const newCategoryName = ref('');
const categories = ref([]);
const isSaving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const fetchCategories = async () => {
  try {
    // Assuming vendorService.getCategories() exists and fetches approved categories
    const response = await fetch('http://localhost:5000/api/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    categories.value = await response.json();
  } catch (err) {
    console.error('Error fetching categories:', err);
    errorMessage.value = 'Could not load categories.';
  }
};

const saveProduct = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  let categoryPayload = {};
  if (newProduct.value.category === 'new_category') {
    if (!newCategoryName.value.trim()) {
      errorMessage.value = 'Please enter a name for the new category.';
      isSaving.value = false;
      return;
    }
    categoryPayload = { newCategoryName: newCategoryName.value.trim() };
  } else {
    categoryPayload = { category: newProduct.value.category };
  }

  const productPayload = {
    name: newProduct.value.name,
    price: newProduct.value.price,
    description: newProduct.value.description,
    imageUrl: newProduct.value.imageUrl,
    stock: newProduct.value.stock,
    ...categoryPayload,
  };

  try {
    const createdProduct = await vendorService.createProduct(productPayload);
    successMessage.value = `Product "${createdProduct.name}" created successfully!`;
    if (newProduct.value.category === 'new_category') {
      successMessage.value += ' The new category is pending admin approval.';
    }
    newProduct.value = { name: '', price: 0, description: '', stock: 0, category: '', imageUrl: '' };
    newCategoryName.value = '';
    setTimeout(() => {
      router.push('/vendor-panel/products');
    }, 2000);
  } catch (err) {
    console.error("Error saving product:", err);
    errorMessage.value = err.message || 'Failed to save product.';
  } finally {
    isSaving.value = false;
  }
};

onMounted(fetchCategories);
</script>

<style scoped>
/* Using Tailwind CSS classes directly in the template */
</style>