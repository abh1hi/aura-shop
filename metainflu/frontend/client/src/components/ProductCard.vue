<template>
  <div class="product-card">
    <div class="product-image-container">
      <img :src="product.imageUrl || 'https://placehold.co/400x600/f4f4f4/ccc?text=AURA'" :alt="product.name">
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">${{ product.price.toFixed(2) }}</p>
    </div>
    <button class="add-to-cart-btn">Add to Cart</button>
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
  border-radius: 12px;
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
  padding: 1.5rem;
  text-align: center;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.product-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--c5);
}

.add-to-cart-btn {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translate(-50%, 10px);
  opacity: 0;
  background-color: var(--c5);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  white-space: nowrap;
}

.product-card:hover .add-to-cart-btn {
  transform: translate(-50%, 0);
  opacity: 1;
}

.add-to-cart-btn:hover {
  background-color: var(--c6);
}
</style>
