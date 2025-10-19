<template>
  <section class="tab-section">
    <div class="section-header">
      <h3>Trendy</h3>
      <router-link to="/shop?sort=trending" class="see-all">See all</router-link>
    </div>

    <div class="trending-grid">
      <ProductCard
        v-for="product in products"
        :key="product.key || product.id"
        :product="product"
        :mobile="true"
        class="trending-card"
      />
    </div>
  </section>
</template>

<script setup>
import ProductCard from './ProductCard.vue'
const props = defineProps({ products: { type: Array, default: () => [] } })
</script>

<style scoped>
.tab-section { margin-bottom: 1.5rem; }
.section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; }
.section-header h3 { font-size:1.1rem; font-weight:600; }
.see-all { font-size:0.9rem; color:#64748b; text-decoration:none; }
.trending-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
.trending-card { width: 100%; }
</style>