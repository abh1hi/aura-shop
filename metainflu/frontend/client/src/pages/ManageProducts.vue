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
        
        <div v-if="loading" class="text-center text-gray-500 py-8">
            <p>Loading your products...</p>
        </div>
        <div v-else-if="error" class="text-red-500 p-4 bg-red-100 rounded-lg">
            <p>Error: {{ error }}</p>
        </div>
        <div v-else class="table-responsive">
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
              <tr v-for="product in products" :key="product._id">
                <td class="product-img-cell">
                  <img :src="product.imageUrl || 'https://placehold.co/50x50/f0f0f0/333?text=N/A'" :alt="product.name">
                </td>
                <td class="font-medium">{{ product.name }}</td>
                <td>${{ product.price.toFixed(2) }}</td>
                <td>
                  <span :class="{'text-red-500': product.stock < 10, 'text-green-600': product.stock >= 10}">
                    {{ product.stock || 0 }} in stock
                  </span>
                </td>
                <!-- Display category name. Assumes category is a simple string or an object with a name field -->
                <td>{{ product.category ? (product.category.name || product.category) : 'Uncategorized' }}</td>
                <td>
                  <button class="action-btn edit-btn" @click="startEdit(product)">Edit</button>
                  <button 
                    class="action-btn delete-btn" 
                    @click="confirmDelete(product)"
                    :disabled="deletingId === product._id"
                  >
                    {{ deletingId === product._id ? 'Deleting...' : 'Delete' }}
                  </button>
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

    <!-- Custom Confirmation Modal (Used instead of alert/confirm for deletion) -->
    <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-content">
            <h3 class="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p class="mb-6">Are you sure you want to delete product: <strong>{{ productToDelete.name }}</strong>?</p>
            <div class="flex justify-end space-x-3">
                <button type="button" @click="showDeleteModal = false" class="py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="button" @click="deleteProduct" class="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700">Confirm Delete</button>
            </div>
        </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
        <div class="modal-content max-w-lg">
            <h3 class="text-xl font-bold mb-4">Edit Product: {{ productToEdit.name }}</h3>
            
            <div v-if="editError" class="text-red-500 text-sm mb-4">{{ editError }}</div>

            <form @submit.prevent="saveEdit">
                <div class="modal-form-group">
                    <label for="edit-name">Product Name</label>
                    <input id="edit-name" type="text" required v-model="productToEdit.name">
                </div>
                <div class="modal-form-group">
                    <label for="edit-price">Price ($)</label>
                    <input id="edit-price" type="number" required v-model.number="productToEdit.price">
                </div>
                <div class="modal-form-group">
                    <label for="edit-stock">Current Stock</label>
                    <input id="edit-stock" type="number" required v-model.number="productToEdit.stock">
                </div>
                 <!-- START Category Field Addition -->
                <div class="modal-form-group">
                    <label for="edit-category">Category</label>
                    <select id="edit-category" required v-model="productToEdit.category">
                        <option value="">Select Category</option>
                        <!-- Iterate over fetched categories -->
                        <option v-for="category in categories" :key="category._id" :value="category._id">
                            {{ category.name }}
                        </option>
                    </select>
                </div>
                 <!-- END Category Field Addition -->
                <div class="modal-form-group">
                    <label for="edit-imageUrl">Image URL</label>
                    <input id="edit-imageUrl" type="text" v-model="productToEdit.imageUrl">
                </div>
                <div class="modal-form-group">
                    <label for="edit-description">Description</label>
                    <textarea id="edit-description" rows="4" v-model="productToEdit.description"></textarea>
                </div>

                <div class="flex justify-end space-x-3 mt-6">
                    <button type="button" @click="showEditModal = false" class="py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" class="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700" :disabled="isEditing">
                        {{ isEditing ? 'Saving...' : 'Save Changes' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import vendorService from '../services/vendorService';

const products = ref([]);
const categories = ref([]); // New state for categories
const loading = ref(true);
const error = ref(null);
const deletingId = ref(null);

// --- State for Deletion ---
const showDeleteModal = ref(false);
const productToDelete = ref({});

// --- State for Editing ---
const showEditModal = ref(false);
const productToEdit = ref({});
const isEditing = ref(false);
const editError = ref(null);

/**
 * Fetches the list of all available categories.
 */
const fetchCategories = async () => {
    try {
        categories.value = await vendorService.getCategories();
    } catch (err) {
        console.error('Error fetching categories:', err);
        // Optionally display an error, but don't halt the whole page
    }
}

/**
 * Fetches products owned by the current vendor from the backend.
 */
const fetchProducts = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await vendorService.getVendorProducts();
        products.value = response.map(p => ({ 
            ...p, 
            stock: p.stock || 0, // Ensure stock is set
            // If category is an object with an ID, we only need the ID for editing
            category: p.category ? (p.category._id || p.category) : '',
        }));
    } catch (err) {
        console.error('Error fetching vendor products:', err);
        error.value = err.message || 'Could not load your product list.';
        products.value = []; 
    } finally {
        loading.value = false;
    }
};

/**
 * Sets the product for deletion and shows the confirmation modal.
 * @param {object} product - The product object to be deleted.
 */
const confirmDelete = (product) => {
    productToDelete.value = product;
    showDeleteModal.value = true;
};

/**
 * Calls the API to delete the selected product and updates the list.
 */
const deleteProduct = async () => {
    const id = productToDelete.value._id;
    deletingId.value = id;
    showDeleteModal.value = false;
    error.value = null;

    try {
        await vendorService.deleteProduct(id);
        
        // Remove the product from the local list instantly
        products.value = products.value.filter(p => p._id !== id);

    } catch (err) {
        console.error('Error deleting product:', err);
        error.value = err.message || `Failed to delete product ID: ${id}.`;
    } finally {
        deletingId.value = null;
        productToDelete.value = {};
    }
};

/**
 * Prepares the form for editing.
 * @param {object} product - The product object to be edited.
 */
const startEdit = (product) => {
    editError.value = null;
    
    // Determine the current category ID for the select binding
    const categoryId = product.category ? (product.category._id || product.category) : '';
    
    // Create a deep copy and set the category ID
    productToEdit.value = { 
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        category: categoryId, // Bind the category ID/value
    };
    showEditModal.value = true;
};

/**
 * Calls the API to update the product with the edited data.
 */
const saveEdit = async () => {
    isEditing.value = true;
    editError.value = null;

    // Construct the data payload for the API
    const updatedData = {
        name: productToEdit.value.name,
        price: Number(productToEdit.value.price),
        description: productToEdit.value.description,
        imageUrl: productToEdit.value.imageUrl,
        stock: Number(productToEdit.value.stock),
        category: productToEdit.value.category, // Include the selected category ID
    };

    try {
        const updatedProduct = await vendorService.updateProduct(productToEdit.value._id, updatedData);

        // Find the index of the updated product in the local array
        const index = products.value.findIndex(p => p._id === updatedProduct._id);
        
        if (index !== -1) {
             // Find the corresponding category object to update the local display name
            const categoryObject = categories.value.find(c => c._id === updatedProduct.category);
            
            products.value[index] = { 
                ...products.value[index], 
                ...updatedProduct,
                // The backend sends back the category ID, so we use the local list to get the name
                category: categoryObject ? { name: categoryObject.name, _id: categoryObject._id } : updatedProduct.category,
                stock: updatedData.stock, // Preserve local stock field
            }; 
        }

        showEditModal.value = false;
    } catch (err) {
        console.error('Error saving product edits:', err);
        editError.value = err.message || 'Failed to save product changes.';
    } finally {
        isEditing.value = false;
    }
};

onMounted(() => {
    fetchProducts();
    fetchCategories();
});
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
.delete-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* --- Modal Styles --- */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 400px;
}
.modal-content.max-w-lg {
    max-width: 600px; /* Wider modal for editing form */
}

/* Form Styles inside the modal for consistency */
.modal-form-group {
    margin-bottom: 1rem;
}
.modal-form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.3rem;
    color: #333;
}
.modal-form-group input,
.modal-form-group textarea,
.modal-form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
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
