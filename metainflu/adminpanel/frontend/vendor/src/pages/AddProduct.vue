<template>
  <div class="p-4 sm:p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <router-link to="/products" class="p-2 rounded-full hover:bg-gray-100">
        <svg class="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </router-link>
      <h1 class="text-2xl font-bold text-text-primary">Add New Product</h1>
    </div>

    <div class="max-w-3xl mx-auto">
      <div class="card p-6 sm:p-8">
        <div v-if="successMessage" class="bg-green-100 text-green-600 p-4 rounded-lg mb-6">{{ successMessage }}</div>
        <div v-if="errorMessage" class="bg-red-100 text-danger p-4 rounded-lg mb-6">Error: {{ errorMessage }}</div>

        <form @submit.prevent="saveProduct" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-text-secondary">Product Name</label>
            <input type="text" id="name" required v-model="newProduct.name" class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="price" class="block text-sm font-medium text-text-secondary">Price ($)</label>
              <input type="number" id="price" required v-model.number="newProduct.price" min="0" step="0.01" class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary">
            </div>
            <div>
              <label for="stock" class="block text-sm font-medium text-text-secondary">Stock</label>
              <input type="number" id="stock" required v-model.number="newProduct.stock" min="0" class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary">
            </div>
          </div>

          <div>
            <label for="category" class="block text-sm font-medium text-text-secondary">Category</label>
            <select id="category" required v-model="newProduct.category" class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary">
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
              <option value="new_category">Other (add a new category)</option>
            </select>
          </div>

          <div v-if="newProduct.category === 'new_category'">
            <label for="newCategoryName" class="block text-sm font-medium text-text-secondary">New Category Name</label>
            <input type="text" id="newCategoryName" v-model="newCategoryName" class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary" placeholder="Enter new category name">
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-text-secondary">Description</label>
            <textarea id="description" rows="4" required v-model="newProduct.description" class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary" placeholder="Brief description..."></textarea>
          </div>

          <div class="flex justify-end pt-4">
            <button type="submit" class="px-6 py-3 bg-primary text-white rounded-lg shadow-sm hover:bg-opacity-90 font-semibold" :disabled="isSaving">
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
