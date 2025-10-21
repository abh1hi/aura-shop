<template>
  <div 
    :class="[
      'product-card',
      { 'mobile-card': mobile },
      'relative group overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100'
    ]" 
    @click="viewDetails"
    v-touch:tap="handleTap"
    v-touch:press="handlePress"
  >
    <!-- Product Image Container -->
    <div class="image-container relative overflow-hidden">
      <img
        v-if="product.images && product.images.length > 0"
        :src="product.images[0].url"
        :alt="product.name"
        class="product-image w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        @error="handleImageError"
      />
      <div v-else class="placeholder-image w-full h-full bg-gray-200 flex items-center justify-center">
        <i class="fas fa-image text-gray-400 text-2xl"></i>
      </div>
      
      <!-- Favorite Button -->
      <button 
        class="favorite-btn absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
        @click.stop="toggleFavorite"
      >
        <i :class="['fas fa-heart text-sm', isFavorite ? 'text-red-500' : 'text-gray-400']"></i>
      </button>
      
      <!-- Quick Add Button for Mobile -->
      <button 
        v-if="mobile"
        class="quick-add-btn absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
        @click.stop="addToCart"
        :disabled="isAdding"
      >
        <i v-if="!isAdding" class="fas fa-plus text-xs"></i>
        <div v-else class="loading-spinner"></div>
      </button>
    </div>

    <!-- Product Info -->
    <div class="product-info p-3">
      <div class="product-name">
        <h3 class="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
          {{ product.name }}
        </h3>
      </div>
      
      <!-- Price and Rating -->
      <div class="price-rating flex items-center justify-between mt-2">
        <div class="price">
          <span class="current-price font-semibold text-gray-900">
            ${{ formatPrice(product.price) }}
          </span>
          <span v-if="product.originalPrice && product.originalPrice > product.price" 
                class="original-price ml-1 text-xs text-gray-500 line-through">
            ${{ formatPrice(product.originalPrice) }}
          </span>
        </div>
        
        <!-- Rating Stars -->
        <div v-if="showRating && (product.rating || product.reviews)" class="rating flex items-center">
          <div class="stars flex text-xs text-yellow-400 mr-1">
            <i v-for="n in 5" :key="n" :class="[
              'fas fa-star',
              n <= Math.floor(product.rating || 4.5) ? 'text-yellow-400' : 'text-gray-200'
            ]"></i>
          </div>
          <span class="review-count text-xs text-gray-500">{{ product.reviews || 0 }}</span>
        </div>
      </div>
      
      <!-- Size Options for Mobile -->
      <div v-if="mobile && product.sizes" class="sizes flex gap-1 mt-2">
        <span 
          v-for="size in product.sizes.slice(0, 4)" 
          :key="size" 
          class="size-chip text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
        >
          {{ size }}
        </span>
        <span v-if="product.sizes.length > 4" class="text-xs text-gray-400">+{{ product.sizes.length - 4 }}</span>
      </div>
    </div>

    <!-- Add to Cart Overlay for Desktop -->
    <div 
      v-if="!mobile"
      class="cart-overlay absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2"
    >
      <button
        @click.stop="addToCart"
        :disabled="isAdding"
        class="add-to-cart-btn text-white text-sm font-medium px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-300 disabled:opacity-50"
      >
        {{ isAdding ? 'Adding...' : 'Add to Cart' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import cartService from '../services/cartService'

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

const emit = defineEmits(['favoriteToggled', 'addedToCart'])

const router = useRouter()
const isAdding = ref(false)
const isFavorite = ref(false)

// Computed
const formatPrice = computed(() => {
  return (price) => {
    if (!price || price === 0) return '0.00'
    return parseFloat(price).toFixed(2)
  }
})

// Methods
const addToCart = async () => {
  if (isAdding.value) return
  
  isAdding.value = true
  try {
    await cartService.addItem({ 
      productId: props.product._id, 
      quantity: 1,
      variant: props.product.sku || null
    })
    
    emit('addedToCart', props.product)
    
    // Show success feedback
    if (navigator.vibrate) {
      navigator.vibrate(50) // Haptic feedback on mobile
    }
    
    
  } catch (error) {
    
    // Could emit error event or show toast notification
  } finally {
    isAdding.value = false
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('favoriteToggled', { product: props.product, isFavorite: isFavorite.value })
  
  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(30)
  }
}

const viewDetails = () => {
  router.push({ 
    name: 'ProductDetail', 
    params: { id: props.product._id }
  })
}

const handleTap = () => {
  // Handle single tap - could add analytics or other logic
  
}

const handlePress = () => {
  // Handle long press - could show quick preview
  
  
  // Haptic feedback for long press
  if (navigator.vibrate) {
    navigator.vibrate([50, 30, 50])
  }
}

const handleImageError = (event) => {
  // Fallback image or placeholder
  event.target.src = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image'
}
</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.product-card:active {
  transform: translateY(0);
}

/* Mobile-specific styles */
.mobile-card {
  width: 160px;
  flex-shrink: 0;
}

.mobile-card .image-container {
  height: 140px;
  border-radius: 12px;
}

.mobile-card .product-info {
  padding: 8px 4px 12px;
}

.mobile-card .product-name h3 {
  font-size: 0.8rem;
  line-height: 1.2;
}

.mobile-card .current-price {
  font-size: 0.9rem;
}

.mobile-card .rating {
  font-size: 0.7rem;
}

/* Desktop styles */
.product-card:not(.mobile-card) .image-container {
  height: 240px;
  border-radius: 12px 12px 0 0;
}

.product-card:not(.mobile-card) {
  min-height: 320px;
}

/* Image styles */
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

/* Button styles */
.favorite-btn:hover {
  transform: scale(1.1);
  background: white;
}

.quick-add-btn:hover {
  transform: scale(1.1);
  background: #374151;
}

.quick-add-btn:active {
  transform: scale(0.95);
}

/* Loading spinner */
.loading-spinner {
  width: 12px;
  height: 12px;
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

/* Size chips */
.size-chip {
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.size-chip:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

/* Touch-specific styles */
@media (hover: none) and (pointer: coarse) {
  .product-card:hover {
    transform: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .favorite-btn,
  .quick-add-btn {
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .mobile-card {
    width: 180px;
  }
  
  .mobile-card .image-container {
    height: 160px;
  }
}

@media (min-width: 768px) {
  .mobile-card {
    width: 200px;
  }
  
  .mobile-card .image-container {
    height: 180px;
  }
}

/* Animation for cart overlay */
.cart-overlay {
  backdrop-filter: blur(4px);
}

.add-to-cart-btn {
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover {
  transform: translateY(-1px);
}

.add-to-cart-btn:active {
  transform: translateY(0);
}
</style>