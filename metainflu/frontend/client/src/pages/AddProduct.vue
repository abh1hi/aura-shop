<template>
  <div class="add-product-page">
    <!-- Back Button using router-link to ensure in-app navigation -->
    <router-link to="/vendor-panel/manage-products" class="back-button">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
         Back to Product List
    </router-link>
    
    <div class="table-card mt-4">
        <h2 class="section-subtitle">Add New Product Details</h2>
        
        <form @submit.prevent="saveProduct" class="add-form-layout">
            <div class="form-group">
                <label for="name">Product Name</label>
                <input type="text" id="name" required v-model="newProduct.name">
            </div>
            <div class="form-group">
                <label for="price">Price ($)</label>
                <input type="number" id="price" required v-model.number="newProduct.price">
            </div>
            <div class="form-group full-width">
                <label for="description">Description</label>
                <textarea id="description" rows="4" required v-model="newProduct.description"></textarea>
            </div>
            <div class="form-group">
                <label for="stock">Initial Stock</label>
                <input type="number" id="stock" required v-model.number="newProduct.stock">
            </div>
            <div class="form-group">
                <label for="category">Category</label>
                <select id="category" required v-model="newProduct.category">
                    <option value="">Select Category</option>
                    <option value="tops">Tops</option>
                    <option value="bottoms">Bottoms</option>
                    <option value="outerwear">Outerwear</option>
                </select>
            </div>
            <div class="form-group full-width">
                <label for="imageUrl">Image URL</label>
                <input type="text" id="imageUrl" required v-model="newProduct.imageUrl">
            </div>
            
            <div class="form-actions full-width">
                <button type="submit" class="cta-button save-button">Save Product</button>
            </div>
        </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const newProduct = ref({
    name: '',
    price: 0,
    description: '',
    stock: 0,
    category: '',
    imageUrl: '',
});

const saveProduct = () => {
    // In a real application, you would send this data to the backend API here.
    console.log("Saving new product:", newProduct.value);

    // After saving, navigate back to the product list (ManageProducts)
    router.push('/vendor-panel/manage-products');
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
