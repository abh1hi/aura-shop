<template>
  <div class="p-4 sm:p-6 md:p-8">
    <div class="max-w-3xl mx-auto">
      <router-link to="/products" class="text-gray-text hover:text-primary-blue flex items-center mb-6 text-sm font-medium">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        Back to Products
      </router-link>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-dark-text mb-6">Add New Product</h1>
      <div class="card p-6 sm:p-8">
        <div v-if="successMessage" class="bg-green-100 text-success-green p-4 rounded-lg mb-6">{{ successMessage }}</div>
        <div v-if="errorMessage" class="bg-red-100 text-danger-red p-4 rounded-lg mb-6">Error: {{ errorMessage }}</div>

        <!-- Minimal form: only required fields for quick creation -->
        <form @submit.prevent="saveProduct" class="space-y-4">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-dark-text">Product Name</label>
            <input type="text" id="name" required v-model="newProduct.name" class="mt-1 block w-full p-3 border border-gray-border rounded-lg shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue text-sm">
          </div>

          <!-- Price and Stock Availability -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="price" class="block text-sm font-medium text-gray-dark-text">Price ($)</label>
              <input type="number" id="price" required v-model.number="newProduct.price" min="0" step="0.01" class="mt-1 block w-full p-3 border border-gray-border rounded-lg shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue text-sm">
            </div>
            <div>
              <label for="stock" class="block text-sm font-medium text-gray-dark-text">Stock Availability</label>
              <input type="number" id="stock" required v-model.number="newProduct.stock" min="0" class="mt-1 block w-full p-3 border border-gray-border rounded-lg shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue text-sm">
            </div>
          </div>

          <!-- Category (select or create new) -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-dark-text">Category</label>
            <select id="category" required v-model="newProduct.category" class="mt-1 block w-full p-3 border border-gray-border bg-white rounded-lg shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue text-sm">
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
              <option value="new_category">Other (add a new category)</option>
            </select>
          </div>

          <!-- New Category Name (conditional) -->
          <div v-if="newProduct.category === 'new_category'">
            <label for="newCategoryName" class="block text-sm font-medium text-gray-dark-text">New Category Name</label>
            <input type="text" id="newCategoryName" v-model="newCategoryName" class="mt-1 block w-full p-3 border border-gray-border rounded-lg shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue text-sm" placeholder="Enter new category name">
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-dark-text">Description</label>
            <textarea id="description" rows="4" required v-model="newProduct.description" class="mt-1 block w-full p-3 border border-gray-border rounded-lg shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue text-sm" placeholder="Brief description (you can add details later)"></textarea>
          </div>

          <div class="flex justify-end pt-4">
            <button type="submit" class="bg-primary-blue text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors font-semibold" :disabled="isSaving">
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
import categoryService from '../services/categoryService';

const router = useRouter();

const newProduct = ref({
  name: '',
  price: 0,
  description: '',
  stock: 0,
  category: '', 
});

const newCategoryName = ref('');
const categories = ref([]);
const isSaving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Fetch categories from the public API
const fetchCategories = async () => {
  try {
    categories.value = await categoryService.getCategories();
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
    price: typeof newProduct.value.price === 'number' ? newProduct.value.price : 0,
    description: newProduct.value.description,
    stock: typeof newProduct.value.stock === 'number' ? newProduct.value.stock : 0,
    ...categoryPayload,
  };

  try {
    const createdProduct = await vendorService.createProduct(productPayload);
    successMessage.value = `Product "${createdProduct.name}" created successfully!`;
    if (newProduct.value.category === 'new_category') {
      successMessage.value += ' The new category is pending admin approval.';
    }

    newProduct.value = { name: '', price: 0, description: '', stock: 0, category: '' };
    newCategoryName.value = '';
    
    // Redirect after a short delay
    setTimeout(() => {
      router.push('/products');
    }, 1500);
  } catch (err) {
    console.error('Error saving product:', err);
    errorMessage.value = err.message || 'Failed to save product.';
  } finally {
    isSaving.value = false;
  }
};

onMounted(fetchCategories);
</script>

<style scoped>
/* Minimal scoping, relying on Tailwind classes */
</style>
