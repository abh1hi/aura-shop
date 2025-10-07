<template>
  <div class="page-container">
    <h1 class="page-title">Inventory & Product Management</h1>

    <!-- View 1: Product List (Default) -->
    <div class="product-list-view">
        
      <div class="header-controls">
        <!-- Button uses router-link to navigate to the child route /vendor-panel/add-product -->
        <router-link to="/vendor-panel/add-product" class="cta-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New Product
        </router-link>
        <div class="search-bar">
          <input type="text" placeholder="Search products by name or SKU...">
          <button>Search</button>
        </div>
      </div>

      <!-- Product List Table -->
      <div class="table-card">
        <h2 class="section-subtitle">Active Listings ({{ products.length }})</h2>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td class="product-img-cell">
                  <img :src="product.imageUrl" :alt="product.name">
                </td>
                <td class="font-medium">{{ product.name }}</td>
                <td>${{ product.price.toFixed(2) }}</td>
                <td>
                  <span :class="{'text-red-500': product.stock < 10, 'text-green-600': product.stock >= 10}">
                    {{ product.stock }} in stock
                  </span>
                </td>
                <td>{{ product.category }}</td>
                <td>
                  <button class="action-btn edit-btn">Edit</button>
                  <button class="action-btn delete-btn">Delete</button>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                  <td colspan="6" class="text-center text-gray-500 py-4">No products found. Click "Add New Product" to start.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// Removed: currentView state

const products = ref([
  { id: 1, name: 'Minimalist Tee', price: 45.00, stock: 52, category: 'Tops', imageUrl: 'https://placehold.co/50x50/f0f0f0/333?text=Tee' },
  { id: 2, name: 'Slim Denim Jeans', price: 110.00, stock: 8, category: 'Bottoms', imageUrl: 'https://placehold.co/50x50/f0f0f0/333?text=Jeans' },
  { id: 3, name: 'Wool Coat', price: 299.00, stock: 35, category: 'Outerwear', imageUrl: 'https://placehold.co/50x50/f0f0f0/333?text=Coat' },
]);
</script>

<style scoped>
.page-container {
    background-color: #f4f4f9;
    min-height: 100%;
}
.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
}
.header-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}
.cta-button {
    background-color: var(--c5);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    cursor: pointer;
}
.search-bar {
    display: flex;
    gap: 0.5rem;
}
.search-bar input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 250px;
}
.search-bar button {
    background-color: #333;
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
}
.table-card {
    background-color: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.section-subtitle {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
}
.table-responsive {
    overflow-x: auto;
}
table {
    width: 100%;
    border-collapse: collapse;
}
th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
    white-space: nowrap;
}
th {
    background-color: #f8f8f8;
    font-weight: 600;
    color: #555;
}
.product-img-cell img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 8px;
}
.action-btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-right: 0.5rem;
    border: none;
    transition: opacity 0.2s;
}
.edit-btn {
    background-color: #f0f4ff;
    color: #5d78ff;
}
.delete-btn {
    background-color: #ffebeb;
    color: #ff5252;
}

@media (max-width: 768px) {
    .header-controls {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }
    .search-bar {
        width: 100%;
    }
    .search-bar input {
        width: 100%;
    }
}
</style>
