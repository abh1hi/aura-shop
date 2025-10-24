<template>
  <div class="product-detail-page mobile-first" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
    <!-- Mobile Header -->
    <header class="mobile-header">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="header-title">
          <h1>{{ product?.name || 'Product Details' }}</h1>
        </div>
        <div class="header-actions">
          <button class="share-btn" @click="shareProduct">
            <i class="fas fa-share"></i>
          </button>
          <button class="favorite-btn" @click="toggleFavorite" :class="{ active: isFavorite }">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading product...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <i class="fas fa-exclamation-triangle error-icon"></i>
        <h3>Oops! Something went wrong</h3>
        <p class="error-text">{{ error }}</p>
        <button @click="fetchProductData" class="retry-btn">Try Again</button>
      </div>

      <!-- Product Content -->
      <div v-else-if="product" class="product-content">
        <!-- Image Gallery -->
        <section class="image-gallery">
          <div class="main-image-container" @touchstart="handleImageTouchStart" @touchend="handleImageTouchEnd">
            <img 
              :src="selectedImage" 
              :alt="product.name" 
              class="main-image"
              @error="handleImageError"
            />
            <div class="image-indicators" v-if="productImages.length > 1">
              <span 
                v-for="(image, index) in productImages" 
                :key="index"
                :class="['indicator', { active: selectedImage === image }]"
                @click="selectImage(image)"
              ></span>
            </div>
            
            <!-- Zoom Button -->
            <button class="zoom-btn" @click="openImageModal">
              <i class="fas fa-expand"></i>
            </button>
          </div>

          <!-- Thumbnail Strip -->
          <div class="thumbnail-strip" v-if="productImages.length > 1">
            <div 
              v-for="(image, index) in productImages" 
              :key="index"
              :class="['thumbnail-item', { active: selectedImage === image }]"
              @click="selectImage(image)"
            >
              <img :src="image" :alt="`${product.name} ${index + 1}`" />
            </div>
          </div>
        </section>

        <!-- Product Info -->
        <section class="product-info">
          <div class="product-header">
            <h1 class="product-title">{{ product.name }}</h1>
            <div class="rating-section" v-if="product.ratings">
              <div class="stars">
                <i v-for="n in 5" :key="n" :class="[
                  'fas fa-star',
                  n <= Math.floor(product.ratings.average) ? 'text-yellow-400' : 'text-gray-300'
                ]"></i>
              </div>
              <span class="rating-text">{{ product.ratings.average }} ({{ product.ratings.count || 0 }} reviews)</span>
            </div>
          </div>

          <!-- Price Section -->
          <div class="price-section">
            <div class="current-price">${{ displayedPrice }}</div>
            <div v-if="originalPrice && originalPrice > displayedPrice" class="price-comparison">
              <span class="original-price">${{ originalPrice }}</span>
              <span class="discount-badge">{{ discountPercentage }}% OFF</span>
            </div>
          </div>

          <!-- Stock Status -->
          <div class="stock-status" v-if="selectedVariant">
            <span :class="[
              'stock-indicator',
              selectedVariant.stock > 10 ? 'in-stock' : 
              selectedVariant.stock > 0 ? 'low-stock' : 'out-of-stock'
            ]">
              {{ getStockText(selectedVariant.stock) }}
            </span>
          </div>

          <!-- Variant Selection -->
          <div v-for="(options, name) in variantOptions" :key="name" class="variant-section">
            <h3 class="variant-title">{{ formatVariantName(name) }}</h3>
            <div class="variant-options">
              <button
                v-for="value in options"
                :key="value"
                @click="selectVariant(name, value)"
                :class="[
                  'variant-option',
                  name.toLowerCase() === 'color' ? 'color-variant' : 'text-variant',
                  { active: selectedVariants[name] === value }
                ]"
                :style="name.toLowerCase() === 'color' ? { backgroundColor: getColorValue(value) } : {}"
              >
                <span v-if="name.toLowerCase() !== 'color'">{{ value }}</span>
                <span v-else class="color-name">{{ value }}</span>
              </button>
            </div>
          </div>

          <!-- Quantity Selector -->
          <div class="quantity-section">
            <h3 class="section-title">Quantity</h3>
            <div class="quantity-controls">
              <button 
                @click="decreaseQuantity" 
                :disabled="quantity <= 1"
                class="quantity-btn"
              >
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity-display">{{ quantity }}</span>
              <button 
                @click="increaseQuantity" 
                :disabled="quantity >= maxQuantity"
                class="quantity-btn"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button 
              @click="addToCart" 
              :disabled="!canAddToCart || addingToCart"
              class="add-to-cart-btn"
            >
              <i class="fas fa-shopping-bag"></i>
              <span v-if="!addingToCart">Add to Cart</span>
              <span v-else>Adding...</span>
            </button>
            <button 
              @click="buyNow" 
              :disabled="!canAddToCart"
              class="buy-now-btn"
            >
              <i class="fas fa-bolt"></i>
              <span>Buy Now</span>
            </button>
          </div>

          <!-- Product Details Accordion -->
          <div class="details-accordion">
            <div class="accordion-item">
              <button @click="toggleAccordion('description')" class="accordion-header">
                <span>Description</span>
                <i :class="['fas', accordion.description ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
              </button>
              <transition name="accordion">
                <div v-show="accordion.description" class="accordion-content">
                  <p>{{ product.description || 'No description available.' }}</p>
                </div>
              </transition>
            </div>

            <div class="accordion-item">
              <button @click="toggleAccordion('specifications')" class="accordion-header">
                <span>Specifications</span>
                <i :class="['fas', accordion.specifications ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
              </button>
              <transition name="accordion">
                <div v-show="accordion.specifications" class="accordion-content">
                  <div class="specs-grid">
                    <div class="spec-item">
                      <span class="spec-label">Material:</span>
                      <span class="spec-value">{{ material }}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">Care:</span>
                      <span class="spec-value">{{ product.careInstructions || 'N/A' }}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">Origin:</span>
                      <span class="spec-value">{{ product.regionOfOrigin || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
              </transition>
            </div>

            <div class="accordion-item">
              <button @click="toggleAccordion('shipping')" class="accordion-header">
                <span>Shipping & Returns</span>
                <i :class="['fas', accordion.shipping ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
              </button>
              <transition name="accordion">
                <div v-show="accordion.shipping" class="accordion-content">
                  <div class="shipping-info" v-if="shippingInfo">
                    <div class="shipping-item">
                      <i class="fas fa-truck"></i>
                      <div v-if="shippingInfo.freeShipping">
                        <strong>{{ shippingInfo.freeShipping.title }}</strong>
                        <p>{{ shippingInfo.freeShipping.description }}</p>
                      </div>
                    </div>
                    <div class="shipping-item">
                      <i class="fas fa-undo"></i>
                      <div v-if="shippingInfo.easyReturns">
                        <strong>{{ shippingInfo.easyReturns.title }}</strong>
                        <p>{{ shippingInfo.easyReturns.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </section>

        <!-- Related Products -->
        <section v-if="relatedProducts.length" class="related-products">
          <h2 class="section-title">You might also like</h2>
          <div class="related-grid">
            <ProductCard
              v-for="related in relatedProducts"
              :key="related._id"
              :product="related"
              :mobile="true"
              class="related-item"
            />
          </div>
        </section>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-navigation">
      <router-link to="/" class="nav-item">
        <i class="fas fa-home"></i>
        <span>Home</span>
      </router-link>
      <router-link to="/shop" class="nav-item">
        <i class="fas fa-search"></i>
        <span>Shop</span>
      </router-link>
      <router-link to="/cart" class="nav-item">
        <i class="fas fa-shopping-bag"></i>
        <span>Cart</span>
      </router-link>
      <router-link to="/account" class="nav-item">
        <i class="fas fa-user"></i>
        <span>Account</span>
      </router-link>
    </nav>

    <!-- Image Modal -->
    <transition name="modal">
      <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeImageModal">
            <i class="fas fa-times"></i>
          </button>
          <img :src="selectedImage" :alt="product.name" class="modal-image" />
        </div>
      </div>
    </transition>
  </div>
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

const route = useRoute()
const router = useRouter()
const { token } = useAuth()
const { addToCart: addToCartComposable } = useCart()

// Touch handling state
const touchStartX = ref(0)
const touchStartY = ref(0)
const imageTouchStartX = ref(0)
const imageTouchStartY = ref(0)

// Reactive data
const product = ref(null)
const relatedProducts = ref([])
const isLoading = ref(true)
const error = ref(null)
const selectedImage = ref('')
const selectedVariants = ref({})
const quantity = ref(1)
const isFavorite = ref(false)
const addingToCart = ref(false)
const showImageModal = ref(false)
const currentImageIndex = ref(0)
const shippingInfo = ref(null)

const accordion = ref({
  description: true,
  specifications: false,
  shipping: false
})

// Computed properties
const productImages = computed(() => {
  if (!product.value) return []
  const images = new Set()
  
  if (product.value.images) {
    product.value.images.forEach(img => images.add(img.url))
  }
  
  if (product.value.variants) {
    product.value.variants.forEach(v => {
      if (v.images) {
        v.images.forEach(img => images.add(img))
      }
    })
  }
  
  return Array.from(images)
})

const variantOptions = computed(() => {
  if (!product.value || !product.value.variants) return {}
  
  const options = {}
  product.value.variants.forEach(variant => {
    if (variant.attributes) {
      variant.attributes.forEach(attr => {
        if (!options[attr.name]) {
          options[attr.name] = new Set()
        }
        options[attr.name].add(attr.value)
      })
    }
  })
  
  Object.keys(options).forEach(key => {
    options[key] = Array.from(options[key])
  })
  
  return options
})

const selectedVariant = computed(() => {
  if (!product.value || !product.value.variants) return null
  
  return product.value.variants.find(variant => {
    if (!variant.attributes) return false
    return variant.attributes.every(attr => 
      selectedVariants.value[attr.name] === attr.value
    )
  })
})

// FIXED: Proper price calculation with number coercion
const displayedPrice = computed(() => {
  if (selectedVariant.value && selectedVariant.value.price != null) {
    return Number(selectedVariant.value.price).toFixed(2)
  }
  if (product.value && product.value.price != null) {
    return Number(product.value.price).toFixed(2)
  }
  return '0.00'
})

const originalPrice = computed(() => {
  if (selectedVariant.value && selectedVariant.value.originalPrice != null) {
    return Number(selectedVariant.value.originalPrice).toFixed(2)
  }
  if (product.value && product.value.originalPrice != null) {
    return Number(product.value.originalPrice).toFixed(2)
  }
  return null
})

const discountPercentage = computed(() => {
  if (originalPrice.value && displayedPrice.value) {
    const discount = ((Number(originalPrice.value) - Number(displayedPrice.value)) / Number(originalPrice.value)) * 100
    return Math.round(discount)
  }
  return 0
})

const maxQuantity = computed(() => {
  if (selectedVariant.value) {
    return Math.min(Number(selectedVariant.value.stock) || 0, 99)
  }
  if (product.value) {
    return Math.min(Number(product.value.stock) || 0, 99)
  }
  return 0
})

const canAddToCart = computed(() => {
  if (selectedVariant.value) {
    return selectedVariant.value.stock > 0 && quantity.value <= selectedVariant.value.stock
  }
  if (product.value) {
    return (product.value.stock || 0) > 0 && quantity.value <= (product.value.stock || 0)
  }
  return false
})

const material = computed(() => {
  if (!product.value || !product.value.attributes) return 'N/A'
  const materialAttribute = product.value.attributes.find(attr => attr.name.toLowerCase() === 'material')
  return materialAttribute ? materialAttribute.value : 'N/A'
})

// Touch event handlers
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

const handleTouchEnd = (e) => {
  if (!touchStartX.value || !touchStartY.value) return
  
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY
  const deltaX = touchEndX - touchStartX.value
  const deltaY = touchEndY - touchStartY.value
  
  // Only handle swipe if horizontal movement is significant
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    // This is a general page swipe, could be used for navigation
    // Currently not implementing any specific behavior
  }
  
  touchStartX.value = 0
  touchStartY.value = 0
}

const handleImageTouchStart = (e) => {
  imageTouchStartX.value = e.touches[0].clientX
  imageTouchStartY.value = e.touches[0].clientY
}

const handleImageTouchEnd = (e) => {
  if (!imageTouchStartX.value || !imageTouchStartY.value) return
  
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY
  const deltaX = touchEndX - imageTouchStartX.value
  const deltaY = touchEndY - imageTouchStartY.value
  
  // Only handle swipe if horizontal movement is significant and greater than vertical
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      prevImage() // Swipe right = previous image
    } else {
      nextImage() // Swipe left = next image
    }
  }
  
  imageTouchStartX.value = 0
  imageTouchStartY.value = 0
}

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
    relatedProducts.value = allProducts.slice(0, 4)
    
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

const fetchShippingInfo = async () => {
  try {
    shippingInfo.value = await homeService.getShippingInfo()
  } catch (error) {
    console.error('Failed to fetch shipping info:', error)
  }
}

const initializeDefaultVariant = () => {
  if (product.value.variants && product.value.variants.length > 0) {
    const defaultVariant = product.value.variants[0]
    if (defaultVariant.attributes) {
      defaultVariant.attributes.forEach(attr => {
        selectedVariants.value[attr.name] = attr.value
      })
    }
  }
  
  if (productImages.value.length > 0) {
    selectedImage.value = productImages.value[0]
  }
}

const selectVariant = (name, value) => {
  selectedVariants.value = { ...selectedVariants.value, [name]: value }
}

const selectImage = (image) => {
  selectedImage.value = image
  currentImageIndex.value = productImages.value.indexOf(image)
}

const nextImage = () => {
  if (productImages.value.length > 1) {
    currentImageIndex.value = (currentImageIndex.value + 1) % productImages.value.length
    selectedImage.value = productImages.value[currentImageIndex.value]
  }
}

const prevImage = () => {
  if (productImages.value.length > 1) {
    currentImageIndex.value = currentImageIndex.value === 0 
      ? productImages.value.length - 1 
      : currentImageIndex.value - 1
    selectedImage.value = productImages.value[currentImageIndex.value]
  }
}

const increaseQuantity = () => {
  if (quantity.value < maxQuantity.value) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = async () => {
  if (!canAddToCart.value) return

  if (!token.value) {
    router.push('/login')
    return
  }

  addingToCart.value = true

  try {
    const cartData = {
      productId: product.value._id,
      quantity: quantity.value
    }

    // Add variant information if available
    if (selectedVariant.value) {
      cartData.variantId = selectedVariant.value._id
      cartData.variant = {
        _id: selectedVariant.value._id,
        sku: selectedVariant.value.sku,
        price: selectedVariant.value.price,
        attributes: selectedVariant.value.attributes || [],
        images: selectedVariant.value.images || [],
        stock: selectedVariant.value.stock
      }
    }

    console.log('Adding to cart with data:', cartData)
    await addToCartComposable(cartData)

    // Success feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    // Success notification
    alert('Added to cart successfully!')
  } catch (error) {
    console.error('Failed to add to cart:', error)
    alert('Failed to add to cart. Please try again.')
  } finally {
    addingToCart.value = false
  }
}

const buyNow = () => {
  if (!canAddToCart.value) return
  
  router.push('/checkout')
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  
  if (navigator.vibrate) {
    navigator.vibrate(30)
  }
}

const shareProduct = () => {
  if (navigator.share) {
    navigator.share({
      title: product.value.name,
      text: `Check out ${product.value.name}`,
      url: window.location.href
    })
  } else {
    // Fallback copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    alert('Product link copied to clipboard!')
  }
}

const toggleAccordion = (section) => {
  accordion.value[section] = !accordion.value[section]
}

const openImageModal = () => {
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
}

const goBack = () => {
  router.go(-1)
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=No+Image'
}

const formatVariantName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const getColorValue = (colorName) => {
  return colorMap[colorName] || colorName.toLowerCase()
}

const getStockText = (stock) => {
  if (stock === 0) return 'Out of stock'
  if (stock <= 5) return `Only ${stock} left`
  if (stock <= 10) return 'Low stock'
  return 'In stock'
}

// Watchers
watch(selectedVariant, (newVariant) => {
  if (newVariant && newVariant.images && newVariant.images.length > 0) {
    selectedImage.value = newVariant.images[0]
  }
}, { immediate: true })

watch(() => route.params.id, () => {
  if (route.params.id) {
    fetchProductData()
  }
})

// Lifecycle
onMounted(() => {
  fetchProductData()
  fetchShippingInfo()
})
</script>

<style scoped>
/* Mobile-First Product Detail Styles */
.product-detail-page {
  min-height: 100vh;
  background-color: #ffffff;
  padding-bottom: 80px;
}

/* Mobile Header */
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 50;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.back-btn, .share-btn, .favorite-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.back-btn:hover, .share-btn:hover {
  background-color: #f1f5f9;
}

.favorite-btn {
  color: #64748b;
}

.favorite-btn.active {
  color: #ef4444;
}

.header-title h1 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

/* Main Content */
.main-content {
  margin-top: 70px;
}

/* Loading & Error States */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  min-height: 50vh;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #1a1a1a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text, .error-text {
  margin-top: 1rem;
  color: #64748b;
}

.error-icon {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

/* Image Gallery */
.image-gallery {
  position: relative;
}

.main-image-container {
  position: relative;
  width: 100%;
  height: 400px;
  background: #f8fafc;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

.zoom-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-strip {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.thumbnail-strip::-webkit-scrollbar {
  display: none;
}

.thumbnail-item {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.thumbnail-item.active {
  border-color: #1a1a1a;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Info */
.product-info {
  padding: 1.5rem;
}

.product-header {
  margin-bottom: 1rem;
}

.product-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
  margin-bottom: 0.5rem;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
  gap: 2px;
}

.rating-text {
  font-size: 0.9rem;
  color: #64748b;
}

/* Price Section */
.price-section {
  margin-bottom: 1.5rem;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.price-comparison {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.original-price {
  font-size: 1.1rem;
  color: #64748b;
  text-decoration: line-through;
}

.discount-badge {
  background: #ef4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Stock Status */
.stock-status {
  margin-bottom: 1.5rem;
}

.stock-indicator {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.stock-indicator.in-stock {
  background: #dcfce7;
  color: #166534;
}

.stock-indicator.low-stock {
  background: #fef3c7;
  color: #92400e;
}

.stock-indicator.out-of-stock {
  background: #fee2e2;
  color: #dc2626;
}

/* Variant Selection */
.variant-section {
  margin-bottom: 1.5rem;
}

.variant-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
}

.variant-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.variant-option {
  border: 2px solid #e2e8f0;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.text-variant {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
}

.color-variant {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-name {
  position: absolute;
  bottom: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: #64748b;
  white-space: nowrap;
}

.variant-option.active {
  border-color: #1a1a1a;
  transform: scale(1.05);
}

/* Quantity Section */
.quantity-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  padding: 0.5rem;
  width: fit-content;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.quantity-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 2rem;
  text-align: center;
}

/* Action Buttons */
.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.add-to-cart-btn, .buy-now-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart-btn {
  background: white;
  color: #1a1a1a;
  border: 2px solid #1a1a1a;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #1a1a1a;
  color: white;
}

.buy-now-btn {
  background: #1a1a1a;
  color: white;
  border: 2px solid #1a1a1a;
}

.buy-now-btn:hover:not(:disabled) {
  background: #374151;
  border-color: #374151;
}

.add-to-cart-btn:disabled, .buy-now-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Accordion */
.details-accordion {
  border-top: 1px solid #e2e8f0;
}

.accordion-item {
  border-bottom: 1px solid #e2e8f0;
}

.accordion-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.accordion-content {
  padding-bottom: 1.5rem;
  color: #64748b;
  line-height: 1.6;
}

.specs-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
}

.spec-label {
  font-weight: 500;
  color: #374151;
}

.spec-value {
  color: #64748b;
}

.shipping-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shipping-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.shipping-item i {
  font-size: 1.5rem;
  color: #64748b;
}

/* Related Products */
.related-products {
  padding: 2rem 1rem;
  background: #f8fafc;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

/* Bottom Navigation */
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  padding: 0.75rem 0;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 50;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #64748b;
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: #1a1a1a;
}

.nav-item i {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.nav-item span {
  font-size: 0.7rem;
  font-weight: 500;
}

/* Image Modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.modal-close {
  position: absolute;
  top: -3rem;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Animations */
.accordion-enter-active, .accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from, .accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

.accordion-enter-to, .accordion-leave-from {
  max-height: 200px;
  opacity: 1;
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive Design */
@media (min-width: 640px) {
  .related-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .action-buttons {
    max-width: 400px;
  }
}

@media (min-width: 1024px) {
  .related-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Touch-specific styles */
@media (hover: none) and (pointer: coarse) {
  .variant-option:hover {
    transform: none;
  }
  
  .variant-option:active {
    transform: scale(0.95);
  }
}
</style>