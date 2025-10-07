<template>
  <div class="product-card">
    <div class="product-image-container">
      <img :src="product.imageUrl || 'https://placehold.co/400x600/f4f4f4/ccc?text=AURA'" :alt="product.name">
      <!-- Moved button inside product-image-container to ensure it's always visible on top -->
      <button class="add-to-cart-btn">Quick Add</button>
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
  border-radius: 16px; /* Increased radius for modern look */
  overflow: hidden;
  transition: box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  border: 1px solid var(--light-gray);
}

.product-card:hover {
  box-shadow: 0 14px 28px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.08);
  transform: translateY(-8px);
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-card img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.product-card:hover img {
  transform: scale(1.05);
}

.product-info {
  padding: 1.25rem 1rem;
  text-align: left;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.product-price {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--c5);
}

/* Quick Add Button now positioned absolutely on the image and shows on hover/mobile interaction */
.add-to-cart-btn {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background-color: var(--c5);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.3s ease;
    white-space: nowrap;
}

.product-card:hover .add-to-cart-btn {
    opacity: 1;
    transform: scale(1);
}

/* Ensure button is visible on touch devices/mobile */
@media (max-width: 992px) {
    .add-to-cart-btn {
        opacity: 1;
        transform: scale(1);
        padding: 0.4rem 0.8rem;
        font-size: 0.85rem;
    }
}

.add-to-cart-btn:hover {
  background-color: var(--c6);
}
</style>
