<template>
  <!-- ... existing template unchanged ... -->
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import productService from '../services/productService'
import homeService from '../services/homeService'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'
import { colorMap } from '../utils/colors'

// ... existing script state and computed remain unchanged above ...

// Methods
const fetchProductData = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const productId = route.params.id
    const [productData, allProducts] = await Promise.all([
      productService.getProductById(productId),
      productService.getProducts()
    ])
    
    product.value = productData

    // FIXED: Build relatedProducts as variant-aware cards, reusing Shop.vue mapping
    const expanded = []
    allProducts.forEach(p => {
      if (p._id === productId) return // exclude current product from related
      if (Array.isArray(p.variants) && p.variants.length > 0) {
        p.variants.forEach(v => {
          expanded.push({
            _id: p._id,
            key: `${p._id}-${v._id || v.sku || ''}`,
            name: p.name,
            description: p.description,
            categories: p.categories || [],
            createdAt: p.createdAt,
            price: Number(v.price ?? p.price ?? 0),
            stock: Number(v.stock ?? 0),
            images: Array.isArray(v.images) && v.images.length > 0
              ? v.images.map(img => ({ url: img }))
              : (Array.isArray(p.images) && p.images.length > 0
                ? p.images.map(img => ({ url: img.url || img }))
                : [{ url: 'https://via.placeholder.com/300' }]),
            sku: v.sku,
            variantAttributes: Array.isArray(v.attributes) ? v.attributes : [],
            currentVariant: {
              _id: v._id,
              sku: v.sku,
              price: v.price,
              stock: v.stock,
              images: v.images || [],
              attributes: Array.isArray(v.attributes) ? v.attributes : []
            },
            rating: p.ratings?.average || 4.5,
            reviews: p.ratings?.count || 0
          })
        })
      } else {
        expanded.push({
          ...p,
          key: p._id,
          price: Number(p.price || 0),
          stock: Number(p.stock || 0),
          images: Array.isArray(p.images) && p.images.length > 0
            ? p.images.map(img => ({ url: img.url || img }))
            : [{ url: 'https://via.placeholder.com/300' }],
          currentVariant: null,
          variantAttributes: [],
          rating: p.ratings?.average || 4.5,
          reviews: p.ratings?.count || 0
        })
      }
    })
    
    // Take first 8 related items
    relatedProducts.value = expanded.slice(0, 8)
    
    if (product.value) {
      initializeDefaultVariant()
    }
  } catch (err) {
    console.error('Failed to fetch product data:', err)
    error.value = 'Failed to load product. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// ... rest of the original script remains unchanged ...
</script>

<style scoped>
/* existing styles unchanged */
</style>