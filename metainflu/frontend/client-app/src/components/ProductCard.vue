<template>
  <div
    v-long-press="longPressOptions"
    :class="[
      'product-card',
      { 'mobile-card': mobile },
      'relative group overflow-hidden rounded-lg bg-white transition-shadow duration-300 hover:shadow-lg'
    ]"
    @click="handleCardClick"
  >
    <!-- Product Image Container -->
    <div class="image-container relative overflow-hidden rounded-t-lg">
      <img
        v-if="displayImages && displayImages.length > 0"
        :src="displayImages[0].url"
        :alt="product.name"
        class="product-image w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        @error="handleImageError"
      />
      <div v-else class="placeholder-image w-full h-full bg-gray-100 flex items-center justify-center">
        <i class="fas fa-image text-gray-300 text-3xl"></i>
      </div>

      <!-- Favorite Button -->
      <button
        class="favorite-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-white"
        @click.stop="toggleFavorite"
      >
        <i :class="['fas fa-heart text-base', isFavorite ? 'text-red-500' : 'text-gray-500']"></i>
      </button>

      <!-- Quick Add Button for Mobile -->
      <button
        v-if="mobile && !needsVariantSelection"
        class="quick-add-btn absolute bottom-3 right-3 w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-gray-700"
        @click.stop="handleAddToCart"
        :disabled="isAdding || !isInStock"
      >
        <i v-if="!isAdding" class="fas fa-plus"></i>
        <div v-else class="loading-spinner"></div>
      </button>

      <!-- Variant Selection Required Notice for Mobile -->
      <button
        v-if="mobile && needsVariantSelection"
        class="quick-add-btn absolute bottom-3 right-3 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-blue-700"
        @click.stop="viewDetails"
      >
        <i class="fas fa-eye"></i>
      </button>

      <!-- Stock Badge -->
      <div v-if="!isInStock" class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
        Out of Stock
      </div>
      <div v-else-if="displayStock && displayStock <= 5" class="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
        {{ displayStock }} left
      </div>
    </div>

    <!-- Product Info -->
    <div class="product-info p-4">
      <div class="product-name mb-2">
        <h3 class="text-base font-semibold text-gray-800 line-clamp-2 leading-snug">
          {{ product.name }}
        </h3>
      </div>

      <!-- Variant Attributes if available -->
      <div v-if="product.variantAttributes && product.variantAttributes.length > 0" class="variant-info text-xs text-gray-500 mb-2">
        <span v-for="(attr, index) in product.variantAttributes" :key="index">
          {{ attr.name }}: {{ attr.value }}<span v-if="index < product.variantAttributes.length - 1">, </span>
        </span>
      </div>

      <!-- Price and Rating -->
      <div class="price-rating flex items-baseline justify-between">
        <div class="price">
          <span class="current-price font-bold text-lg text-gray-900">
            ${{ displayPrice }}
          </span>
          <span v-if="product.originalPrice && product.originalPrice > parseFloat(displayPrice)"
                class="original-price ml-2 text-sm text-gray-400 line-through">
            ${{ formatPriceValue(product.originalPrice) }}
          </span>
        </div>

        <!-- Rating Stars -->
        <div v-if="showRating && (product.rating || product.reviews)" class="rating flex items-center">
          <div class="stars flex text-sm text-yellow-400 mr-1.5">
            <i v-for="n in 5" :key="n" :class="['fas fa-star', n <= Math.floor(product.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300']"></i>
          </div>
          <span class="review-count text-sm text-gray-500">({{ product.reviews || 0 }})</span>
        </div>
      </div>
    </div>

    <!-- Add to Cart Overlay for Desktop -->
    <div
      v-if="!mobile"
      class="cart-overlay absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
    >
      <button
        v-if="!needsVariantSelection"
        @click.stop="handleAddToCart"
        :disabled="isAdding || !isInStock"
        class="add-to-cart-btn text-white text-base font-bold px-6 py-3 rounded-full bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-colors duration-300 disabled:opacity-50"
      >
        {{ isAdding ? 'Adding...' : isInStock ? 'Add to Cart' : 'Out of Stock' }}
      </button>
      <button
        v-else
        @click.stop="viewDetails"
        class="add-to-cart-btn text-white text-base font-bold px-6 py-3 rounded-full bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-colors duration-300"
      >
        Select Options
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  mobile: {
    type: Boolean,
    default: false
  },
  showRating: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['favoriteToggled', 'addedToCart', 'showPeek', 'hidePeek'])

const router = useRouter()
const isAdding = ref(false)
const isFavorite = ref(false)
const wasLongPress = ref(false)

// Use cart composable for better state management
const { addToCart } = useCart()

// Helper function to format prices
const formatPriceValue = (price) => {
  if (!price || price === 0) return '0.00'
  return parseFloat(price).toFixed(2)
}

// Computed properties for display values that prefer currentVariant data
const displayPrice = computed(() => {
  // Prefer currentVariant price first, then product price
  const price = props.product.currentVariant?.price ?? props.product.price ?? 0
  return formatPriceValue(price)
})

const displayImages = computed(() => {
  // Prefer currentVariant images first, then product images
  if (props.product.currentVariant?.images && props.product.currentVariant.images.length > 0) {
    return props.product.currentVariant.images.map(img => ({ url: img }))
  }
  return props.product.images || [{ url: 'https://via.placeholder.com/300' }]
})

const displayStock = computed(() => {
  return props.product.currentVariant?.stock ?? props.product.stock ?? 0
})

// Variant handling - updated for the new data structure
const hasVariants = computed(() => {
  // Since Shop.vue now flattens variants, check if this is a variant product
  return !!props.product.currentVariant
})

const needsVariantSelection = computed(() => {
  // For the flattened structure, we don't need variant selection in ProductCard
  // Each card represents a single variant already
  return false
})

const isInStock = computed(() => {
  const stock = displayStock.value
  return stock > 0
})

const handleLongPress = () => {
  wasLongPress.value = true
  emit('showPeek', props.product)
}

const handleRelease = () => {
  emit('hidePeek')
}

const handleCardClick = () => {
  if (!wasLongPress.value) {
    viewDetails()
  }
  wasLongPress.value = false
}

const longPressOptions = {
  onLongPress: handleLongPress,
  onRelease: handleRelease,
  delay: 500
}

const viewDetails = () => {
  router.push({
    name: 'ProductDetail',
    params: { id: props.product._id }
  })
}

const handleAddToCart = async () => {
  if (isAdding.value || !isInStock.value) return

  isAdding.value = true
  try {
    // Build cart data with variant information if available
    const cartData = {
      productId: props.product._id,
      quantity: 1
    }
    
    // Include variant information for products with variants
    if (props.product.currentVariant) {
      cartData.variantId = props.product.currentVariant._id
      cartData.variant = props.product.currentVariant
    }
    
    console.log('ProductCard - Adding to cart:', cartData)
    const result = await addToCart(cartData)

    console.log('ProductCard - Successfully added to cart:', result)
    
    // Emit success event for parent components
    emit('addedToCart', { product: props.product, variant: props.product.currentVariant })

    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    // Show success feedback
    showSuccessMessage('Added to cart!')

  } catch (error) {
    console.error('ProductCard - Failed to add to cart:', error)
    
    // Show error feedback to user
    showErrorMessage('Failed to add item to cart. Please try again.')
  } finally {
    isAdding.value = false
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('favoriteToggled', { product: props.product, isFavorite: isFavorite.value })

  if (navigator.vibrate) {
    navigator.vibrate(30)
  }
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image'
}

// Simple toast notification functions
const showSuccessMessage = (message) => {
  const toast = document.createElement('div')
  toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in'
  toast.textContent = message
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.classList.add('animate-fade-out')
    setTimeout(() => document.body.removeChild(toast), 300)
  }, 2000)
}

const showErrorMessage = (message) => {
  const toast = document.createElement('div')
  toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in'
  toast.textContent = message
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.classList.add('animate-fade-out')
    setTimeout(() => document.body.removeChild(toast), 300)
  }, 3000)
}
</script>

<style scoped>
.product-card {
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Mobile-specific styles */
.mobile-card {
  width: 100%;
  max-width: 180px; /* Example max-width */
  flex-shrink: 0;
}

.mobile-card .image-container {
  height: 200px;
}

/* Desktop styles */
.product-card:not(.mobile-card) .image-container {
  height: 300px;
}

.product-card:not(.mobile-card) {
  min-height: 400px;
}

/* Image styles */
.placeholder-image {
  background: #f7f7f7;
}

/* Button styles */
.favorite-btn:hover i {
  transform: scale(1.1);
}

.quick-add-btn:active {
  transform: scale(0.95);
}

/* Loading spinner */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Touch-specific styles */
@media (hover: none) and (pointer: coarse) {
  .favorite-btn,
  .quick-add-btn {
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .mobile-card {
    max-width: 200px;
  }
  .mobile-card .image-container {
    height: 240px;
  }
}

@media (min-width: 768px) {
  .mobile-card {
    max-width: 220px;
  }
  .mobile-card .image-container {
    height: 280px;
  }
}

/* Toast animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-fade-out {
  animation: fade-out 0.3s ease-out;
}
</style>