<template>
  <div class="add-product-page">
    <!-- Back Button using router-link to ensure in-app navigation -->
    <router-link to="/vendor-panel/manage-products" class="back-button">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
         Back to Product List
    </router-link>
    
    <div class="table-card mt-4">
        <h2 class="section-subtitle">Add New Product Details</h2>
        
        <div v-if="successMessage" class="bg-green-100 text-green-800 p-3 rounded-lg mb-4">{{ successMessage }}</div>
        <div v-if="errorMessage" class="bg-red-100 text-red-800 p-3 rounded-lg mb-4">Error: {{ errorMessage }}</div>

        <form @submit.prevent="saveProduct" class="add-form-layout">
            <div class="form-group">
                <label for="name">Product Name</label>
                <input type="text" id="name" required v-model="newProduct.name">
            </div>
            <div class="form-group">
                <label for="price">Price ($)</label>
                <input type="number" id="price" required v-model.number="newProduct.price" min="0" step="0.01">
            </div>
            <div class="form-group full-width">
                <label for="description">Description</label>
                <textarea id="description" rows="4" required v-model="newProduct.description"></textarea>
            </div>
            <!-- NOTE: Stock field is present in UI but excluded from payload as backend manages actual stock/inventory separate from product creation. -->
            <div class="form-group">
                <label for="stock">Initial Stock (Local Mock)</label>
                <input type="number" id="stock" required v-model.number="newProduct.stock" min="0">
            </div>
            <div class="form-group">
                <label for="category">Category (Using mock IDs as no category endpoint is created yet)</label>
                <select id="category" required v-model="newProduct.category">
                    <option value="">Select Category</option>
                    <!-- Mock category IDs for demonstration, assuming valid MongoDB ObjectIDs -->
                    <option value="60d0fe4f5311236168a109ca">Tops (ID: 60...ca)</option>
                    <option value="60d0fe4f5311236168a109cb">Bottoms (ID: 60...cb)</option>
                    <option value="60d0fe4f5311236168a109cc">Outerwear (ID: 60...cc)</option>
                </select>
            </div>
            <div class="form-group full-width">
                <label for="imageUrl">Image URL</label>
                <input type="text" id="imageUrl" required v-model="newProduct.imageUrl">
            </div>
            
            <div class="form-actions full-width">
                <button type="submit" class="cta-button save-button" :disabled="isSaving">
                    {{ isSaving ? 'Saving...' : 'Save Product' }}
                </button>
            </div>
        </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import vendorService from '../services/vendorService';

const router = useRouter();

const newProduct = ref({
    name: '',
    price: 0,
    description: '',
    stock: 0, // This is local UI state/mock and won't be sent to product creation API
    category: '', // This should be a valid MongoDB ObjectId when sent to API
    imageUrl: '',
});

const isSaving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

/**
 * Handles product creation by calling the vendor service.
 */
const saveProduct = async () => {
    isSaving.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    // Data structure to send to the backend. Note: We rely on the backend 
    // (productController.js) to automatically associate the product with the vendor (user)
    const productPayload = {
        name: newProduct.value.name,
        price: newProduct.value.price,
        description: newProduct.value.description,
        category: newProduct.value.category,
        imageUrl: newProduct.value.imageUrl,
        // The 'stock' field is currently added manually to the backend model, but 
        // managing initial stock requires dedicated logic not currently in the POST /api/products route.
        // For now, we only send fields directly relevant to the Product model definition.
    };

    try {
        const createdProduct = await vendorService.createProduct(productPayload);
        
        successMessage.value = `Product "${createdProduct.name}" created successfully!`;
        console.log("Product saved successfully:", createdProduct);

        // Optionally, reset the form for another entry
        newProduct.value = {
            name: '', price: 0, description: '', stock: 0, category: '', imageUrl: '',
        };

        // Navigate back to the product list after a short delay
        setTimeout(() => {
             router.push('/vendor-panel/manage-products');
        }, 1500);

    } catch (err) {
        console.error("Error saving product:", err);
        errorMessage.value = err.message || 'Failed to save product. Check the console for details.';
    } finally {
        isSaving.value = false;
    }
}
</script>

<style scoped>
.page-container {
  padding-bottom: 4rem;
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

/* --- Form Styles --- */
.back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #555;
    font-weight: 500;
    margin-bottom: 1.5rem;
    cursor: pointer;
    padding: 0;
}
.back-button:hover {
    color: var(--c5);
}

.add-form-layout {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #333;
}
.form-group input,
.form-group textarea,
.form-group select {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
}
.full-width {
    grid-column: span 2;
}
.form-actions {
    margin-top: 1rem;
    text-align: right;
}
.cta-button {
    background-color: var(--c5);
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s;
    border: none;
    cursor: pointer;
}
.cta-button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .add-form-layout {
        grid-template-columns: 1fr;
    }
    .full-width {
        grid-column: span 1;
    }
    .form-actions {
        text-align: center;
    }
}
</style>
