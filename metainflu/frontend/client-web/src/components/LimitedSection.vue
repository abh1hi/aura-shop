<template>
  <section class="tab-section">
    <div class="section-header">
      <h3>Limited</h3>
      <router-link to="/shop?tag=limited" class="see-all">See all</router-link>
    </div>

    <div class="products-carousel" ref="carousel" v-touch:swipe.left="scrollRight" v-touch:swipe.right="scrollLeft">
      <ProductCard
        v-for="product in products"
        :key="product.key || product.id"
        :product="product"
        :mobile="true"
        class="product-card-mobile"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  products: { type: Array, default: () => [] }
})

const carousel = ref(null)

const scrollLeft = () => {
  carousel.value?.scrollBy({ left: -240, behavior: 'smooth' })
}
const scrollRight = () => {
  carousel.value?.scrollBy({ left: 240, behavior: 'smooth' })
}
</script>

<style scoped>
.tab-section { margin-bottom: 1.5rem; }
.section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; }
.section-header h3 { font-size:1.1rem; font-weight:600; }
.see-all { font-size:0.9rem; color:#64748b; text-decoration:none; }
.products-carousel { display:flex; gap:1rem; overflow-x:auto; scroll-snap-type:x mandatory; padding-bottom:0.5rem; }
.product-card-mobile { width:160px; scroll-snap-align:start; flex-shrink:0; }
</style>