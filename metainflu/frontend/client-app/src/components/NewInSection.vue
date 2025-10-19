<template>
  <section class="tab-section">
    <div class="section-header">
      <h3>New In</h3>
      <router-link to="/shop?sort=new" class="see-all">See all</router-link>
    </div>

    <div class="masonry">
      <ProductCard
        v-for="product in products"
        :key="product.key || product.id"
        :product="product"
        :mobile="true"
        class="masonry-item"
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
.masonry { column-count: 2; column-gap: 0.75rem; }
.masonry-item { break-inside: avoid; margin-bottom: 0.75rem; display:block; width:100%; }
</style>