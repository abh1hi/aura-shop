<template>
  <div class="add-product-page">
    <PageHeader title="Add New Product" />
    <div class="container add-product-layout">
      <div class="add-product-form">
        <h2>Product Details</h2>
        <form @submit.prevent="addProduct">
          <div class="form-group">
            <label for="product-name">Product Name</label>
            <input type="text" id="product-name" v-model="product.name" required>
          </div>
          <div class="form-group">
            <label for="product-price">Price</label>
            <input type="number" id="product-price" v-model.number="product.price" required>
          </div>
          <div class="form-group">
            <label for="product-image-url">Image URL</label>
            <input type="text" id="product-image-url" v-model="product.imageUrl" required>
          </div>
          <button type="submit" class="auth-button">Add Product</button>
        </form>
      </div>
      <div class="product-preview">
        <h2>Product Preview</h2>
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PageHeader from '../components/PageHeader.vue';
import ProductCard from '../components/ProductCard.vue';

const product = ref({
  name: 'Sample Product',
  price: 99.99,
  imageUrl: 'https://placehold.co/400x600/f4f4f4/ccc?text=AURA'
});

const addProduct = () => {
  // Add product logic here
  console.log('Adding product:', product.value);
};
</script>

<style scoped>
.add-product-page {
  padding-bottom: 4rem;
}

.add-product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.add-product-form h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
}

.auth-button {
  width: 100%;
  padding: 1rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

.product-preview h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .add-product-layout {
    grid-template-columns: 1fr;
  }
}
</style>
