<template>
  <div class="product-card">
    <div class="product-image-container">
      <img :src="product.imageUrl || 'https://placehold.co/400x600/f4f4f4/ccc?text=AURA'" :alt="product.name">
      <button class="quick-add-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">${{ product.price.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.product-card {
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.product-image-container {
  position: relative;
}

.product-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.quick-add-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.product-card:hover .quick-add-btn {
  opacity: 1;
  transform: translateY(0);
}

.quick-add-btn svg {
  color: #000;
}

.product-info {
  padding: 1rem;
}

.product-name {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}
</style>