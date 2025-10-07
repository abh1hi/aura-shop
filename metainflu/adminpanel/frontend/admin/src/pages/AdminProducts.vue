<!--
  File: metainflu/adminpanel/frontend/admin/src/pages/AdminProducts.vue
  Purpose: This Vue component creates a page for managing products in the admin panel.
  It allows admins to view all existing products, and add new products via a form.
-->
<template>
  <div>
    <h2 class="text-2xl font-semibold mb-6">Manage Products</h2>

    <!-- Add New Product Form -->
    <div class="bg-white p-6 rounded-xl shadow-md mb-8">
      <h3 class="text-xl font-semibold mb-4">Add New Product</h3>
      <form @submit.prevent="addProduct" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" v-model="newProduct.name" id="name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="newProduct.description" id="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
        </div>
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" v-model="newProduct.price" id="price" required min="0" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
          <label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="text" v-model="newProduct.imageUrl" id="imageUrl" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Add Product
        </button>
      </form>
    </div>

    <!-- Existing Products List -->
    <div class="bg-white p-6 rounded-xl shadow-md">
       <h3 class="text-xl font-semibold mb-4">Existing Products</h3>
      <ul class="divide-y divide-gray-200">
        <li v-for="product in products" :key="product._id" class="py-4 flex items-center justify-between">
          <div class="flex items-center">
            <img :src="product.imageUrl || 'https://placehold.co/40x40/cccccc/ffffff?text=Img'" :alt="product.name" class="h-10 w-10 rounded-full mr-4 object-cover">
            <div>
              <h3 class="text-lg font-medium text-gray-800">{{ product.name }}</h3>
              <p class="text-sm text-gray-500">${{ product.price.toFixed(2) }}</p>
            </div>
          </div>
          <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Edit
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// This script handles the logic for fetching and adding products.
import adminService from '../services/adminService';

export default {
  name: 'AdminProducts',
  data() {
    return {
      products: [],
      newProduct: {
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
      }
    };
  },
  async created() {
    // Fetch products when the component is created.
    await this.fetchProducts();
  },
  methods: {
    // Fetches all products from the backend.
    async fetchProducts() {
        try {
            this.products = await adminService.getProducts();
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    },
    // Submits the new product form to the backend.
    async addProduct() {
      try {
        // Retrieves the admin token from local storage for authentication.
        const token = localStorage.getItem('adminToken'); 
        if (!token) {
            alert('Admin not authenticated');
            return;
        }
        await adminService.createProduct(this.newProduct, token);
        this.newProduct = { name: '', description: '', price: 0, imageUrl: '' }; // Reset form
        await this.fetchProducts(); // Refresh the product list
      } catch (error) {
        console.error("Failed to add product:", error);
      }
    }
  }
};
</script>

