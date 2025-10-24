<template>
  <div 
    class="shop-page" 
    :class="{ 'mobile-view': isMobile, 'desktop-view': !isMobile }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >    <!-- Mobile UI -->
    <div v-if="isMobile">
      <main class="main-content">
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading cart...</p>
        </div>

        <div v-else-if="cartItems.length === 0" class="empty-cart">
          <div class="empty-content">
            <i class="fas fa-shopping-bag empty-icon"></i>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet</p>
            <router-link to="/shop" class="shop-now-btn">
              <i class="fas fa-plus"></i>
              <span>Start Shopping</span>
            </router-link>
          </div>
        </div>

        <div v-else class="cart-content">
          <section class="cart-items-section">
            <transition-group name="cart-item" tag="div" class="cart-items-list">
              <div 
                v-for="item in cartItems" 
                :key="item.id"
                class="cart-item"
                @touchstart="(e) => handleItemTouchStart(e, item.id)"
                @touchend="(e) => handleItemTouchEnd(e, item.id)"
              >
                <div class="item-content">
                  <div class="item-image">
                    <img :src="item.image" :alt="item.name" @error="handleImageError"/>
                  </div>
                  <div class="item-info">
                    <h3 class="item-name">{{ item.name }}</h3>
                    <div class="item-details">
                      <!-- Show variant attributes if provided -->
                      <template v-if="item.variant && item.variant.attributes && item.variant.attributes.length">
                        <span v-for="(attr, idx) in item.variant.attributes" :key="idx" class="item-attribute">
                          {{ attr.name }}: {{ attr.value }}
                        </span>
                      </template>
                      <span v-else-if="item.size" class="item-attribute">Size: {{ item.size }}</span>
                      <span v-if="item.color" class="item-attribute">Color: {{ item.color }}</span>
                    </div>
                    <div class="item-pricing">
                      <span class="item-price">${{ unitPrice(item).toFixed(2) }}</span>
                      <span v-if="item.originalPrice && item.originalPrice > unitPrice(item)" class="original-price">
                        ${{ Number(item.originalPrice).toFixed(2) }}
                      </span>
                    </div>
                  </div>
                  <div class="quantity-section">
                    <div class="quantity-controls">
                      <button @click="decreaseQuantity(item.id)" :disabled="item.quantity <= 1 || updatingItem === item.id" class="quantity-btn">
                        <i class="fas fa-minus"></i>
                      </button>
                      <span class="quantity-display">{{ item.quantity }}</span>
                      <button @click="increaseQuantity(item.id)" :disabled="updatingItem === item.id" class="quantity-btn">
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                    <div class="item-total">
                      ${{ (unitPrice(item) * item.quantity).toFixed(2) }}
                    </div>
                  </div>
                </div>
                <div :class="['item-actions', { visible: showActions[item.id] }]">
                  <button @click="removeItem(item.id)" class="remove-btn">
                    <i class="fas fa-trash"></i>
                    <span>Remove</span>
                  </button>
                  <button @click="saveForLater(item.id)" class="save-btn">
                    <i class="fas fa-heart"></i>
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </transition-group>
          </section>

          <section class="promo-section">
            <div class="promo-input-container">
              <input v-model="promoCode" type="text" placeholder="Promo code" class="promo-input"/>
              <button @click="applyPromoCode" :disabled="!promoCode || applyingPromo" class="apply-promo-btn">
                {{ applyingPromo ? 'Applying...' : 'Apply' }}
              </button>
            </div>
            <div v-if="appliedPromo" class="applied-promo">
              <span class="promo-text">{{ appliedPromo.code }} applied</span>
              <button @click="removePromo" class="remove-promo-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </section>

          <section class="order-summary">
            <h3 class="summary-title">Order Summary</h3>
            <div class="summary-breakdown">
              <div class="summary-line">
                <span>Subtotal ({{ totalItems }} items)</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div v-if="appliedPromo" class="summary-line discount">
                <span>Discount ({{ appliedPromo.code }})</span>
                <span>-${{ discountAmount.toFixed(2) }}</span>
              </div>
              <div class="summary-line">
                <span>Shipping</span>
                <span>{{ shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}` }}</span>
              </div>
              <div class="summary-line">
                <span>Tax</span>
                <span>${{ tax.toFixed(2) }}</span>
              </div>
              <div class="summary-line total">
                <span>Total</span>
                <span>${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div v-if="cartItems.length" class="checkout-section">
        <div class="checkout-container">
          <div class="checkout-info">
            <div class="total-amount">${{ total.toFixed(2) }}</div>
            <div class="total-items">{{ totalItems }} items</div>
          </div>
          <button @click="proceedToCheckout" :disabled="processingCheckout" class="checkout-btn">
            <span v-if="!processingCheckout">Checkout</span>
            <div v-else class="loading-spinner small"></div>
          </button>
        </div>
      </div>

      <nav class="bottom-navigation">
        <router-link to="/" class="nav-item">
          <i class="fas fa-home"></i>
          <span>Home</span>
        </router-link>
        <router-link to="/shop" class="nav-item">
          <i class="fas fa-search"></i>
          <span>Shop</span>
        </router-link>
        <router-link to="/cart" class="nav-item active">
          <i class="fas fa-shopping-bag"></i>
          <span>Cart</span>
        </router-link>
        <router-link to="/account" class="nav-item">
          <i class="fas fa-user"></i>
          <span>Account</span>
        </router-link>
      </nav>

      <transition name="modal">
        <div v-if="showClearModal" class="modal-overlay" @click="closeClearModal">
          <div class="modal-content" @click.stop>
            <h3>Clear Cart?</h3>
            <p>Are you sure you want to remove all items from your cart?</p>
            <div class="modal-actions">
              <button @click="closeClearModal" class="cancel-btn">Cancel</button>
              <button @click="confirmClearCart" class="confirm-btn">Clear Cart</button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Desktop UI -->
    <div v-else class="desktop-cart-page">
      <div class="desktop-container">
        <div class="cart-main-content">
          <header class="desktop-header">
            <h1>Shopping Cart</h1>
            <button v-if="cartItems.length" class="clear-cart-btn" @click="clearCart">
              <i class="fas fa-trash"></i> Clear Cart
            </button>
          </header>

          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading cart...</p>
          </div>

          <div v-else-if="cartItems.length === 0" class="empty-cart">
            <div class="empty-content">
              <i class="fas fa-shopping-bag empty-icon"></i>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your cart yet</p>
              <router-link to="/shop" class="shop-now-btn">
                <i class="fas fa-plus"></i>
                <span>Start Shopping</span>
              </router-link>
            </div>
          </div>

          <div v-else>
            <div class="cart-items-list-desktop">
              <div v-for="item in cartItems" :key="item.id" class="cart-item-desktop">
                <div class="item-image-desktop">
                  <img :src="item.image" :alt="item.name" @error="handleImageError"/>
                </div>
                <div class="item-info-desktop">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <div class="item-details">
                    <template v-if="item.variant && item.variant.attributes && item.variant.attributes.length">
                      <span v-for="(attr, idx) in item.variant.attributes" :key="idx" class="item-attribute">
                        {{ attr.name }}: {{ attr.value }}
                      </span>
                    </template>
                    <span v-else-if="item.size" class="item-attribute">Size: {{ item.size }}</span>
                    <span v-if="item.color" class="item-attribute">Color: {{ item.color }}</span>
                  </div>
                  <div class="item-actions-desktop">
                    <button @click="removeItem(item.id)" class="remove-btn-desktop">Remove</button>
                    <button @click="saveForLater(item.id)" class="save-btn-desktop">Save for later</button>
                  </div>
                </div>
                <div class="quantity-section-desktop">
                  <div class="quantity-controls">
                    <button @click="decreaseQuantity(item.id)" :disabled="item.quantity <= 1 || updatingItem === item.id" class="quantity-btn">
                      <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item.id)" :disabled="updatingItem === item.id" class="quantity-btn">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <div class="item-price-desktop">
                  <span>${{ (unitPrice(item) * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside v-if="cartItems.length > 0" class="order-summary-desktop">
          <h3>Order Summary</h3>
          <div class="summary-breakdown">
            <div class="summary-line">
              <span>Subtotal ({{ totalItems }} items)</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="appliedPromo" class="summary-line discount">
              <span>Discount ({{ appliedPromo.code }})</span>
              <span>-${{ discountAmount.toFixed(2) }}</span>
            </div>
            <div class="summary-line">
              <span>Shipping</span>
              <span>{{ shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}` }}</span>
            </div>
            <div class="summary-line">
              <span>Tax</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="summary-line total">
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
          </div>
          <div class="promo-section">
            <div class="promo-input-container">
              <input v-model="promoCode" type="text" placeholder="Promo code" class="promo-input"/>
              <button @click="applyPromoCode" :disabled="!promoCode || applyingPromo" class="apply-promo-btn">
                {{ applyingPromo ? 'Applying...' : 'Apply' }}
              </button>
            </div>
            <div v-if="appliedPromo" class="applied-promo">
              <span class="promo-text">{{ appliedPromo.code }} applied</span>
              <button @click="removePromo" class="remove-promo-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <button @click="proceedToCheckout" :disabled="processingCheckout" class="checkout-btn-desktop">
            <span v-if="!processingCheckout">Proceed to Checkout</span>
            <div v-else class="loading-spinner small"></div>
          </button>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import cartService from '../services/cartService'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { token } = useAuth()

const isMobile = ref(window.innerWidth < 768)

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// Touch handling state
const itemTouchStartX = ref({})
const itemTouchStartY = ref({})
const touchStartX = ref(0)
const touchEndX = ref(0)
const swipeThreshold = 50

// Reactive data
const isLoading = ref(true)
const cartItems = ref([])
const promoCode = ref('')
const appliedPromo = ref(null)
const applyingPromo = ref(false)
const updatingItem = ref(null)
const processingCheckout = ref(false)
const showActions = ref({})
const showClearModal = ref(false)

// FIXED: Pricing helpers that prefer variant price
const unitPrice = (item) => {
  if (item?.variant && item.variant.price != null) return Number(item.variant.price) || 0
  if (item?.price != null) return Number(item.price) || 0
  if (item?.product && item.product.price != null) return Number(item.product.price) || 0
  return 0
}

// Computed properties
const totalItems = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.quantity || 0), 0)
})

// FIXED: Use unitPrice helper for subtotal calculation
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (unitPrice(item) * (item.quantity || 0)), 0)
})

const discountAmount = computed(() => {
  if (!appliedPromo.value) return 0
  return subtotal.value * (appliedPromo.value.discount / 100)
})

const shipping = computed(() => {
  return subtotal.value > 75 ? 0 : 9.99
})

const tax = computed(() => {
  return (subtotal.value - discountAmount.value) * 0.08
})

const total = computed(() => {
  return subtotal.value - discountAmount.value + shipping.value + tax.value
})

// Touch event handlers
const onTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX
}

const onTouchMove = (event) => {
  touchEndX.value = event.touches[0].clientX
}

const onTouchEnd = () => {
  if (touchStartX.value === 0 || touchEndX.value === 0) return
  const swipeDistance = touchEndX.value - touchStartX.value
  
  if (swipeDistance > swipeThreshold) {
    router.push('/shop')
  } else if (swipeDistance < -swipeThreshold) {
    router.push('/account')
  }

  touchStartX.value = 0
  touchEndX.value = 0
}

const handleItemTouchStart = (event, itemId) => {
  itemTouchStartX.value[itemId] = event.touches[0].clientX
  itemTouchStartY.value[itemId] = event.touches[0].clientY
}

const handleItemTouchEnd = (event, itemId) => {
  if (!itemTouchStartX.value[itemId] || !itemTouchStartY.value[itemId]) return
  
  const touchEndX = event.changedTouches[0].clientX
  const touchEndY = event.changedTouches[0].clientY
  const deltaX = touchEndX - itemTouchStartX.value[itemId]
  const deltaY = touchEndY - itemTouchStartY.value[itemId]
  
  // Only handle swipe if horizontal movement is significant
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    if (deltaX < 0) {
      showItemActions(itemId) // Swipe left = show actions
    } else {
      hideItemActions(itemId) // Swipe right = hide actions
    }
  }
  
  itemTouchStartX.value[itemId] = 0
  itemTouchStartY.value[itemId] = 0
}

// Methods
const loadCart = async () => {
  isLoading.value = true
  try {
    if (token.value) {
      const cart = await cartService.getCart(token.value)
      // FIXED: Preserve variant object and ensure proper price handling
      cartItems.value = (cart.items || [])
        .filter(item => item.product)
        .map(item => ({
          id: item._id,
          name: item.product.name,
          // Keep the original price field for fallback but use unitPrice for display
          price: Number(item.variant?.price ?? item.product.price ?? 0),
          originalPrice: item.product.originalPrice ? Number(item.product.originalPrice) : null,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          // FIXED: Preserve full variant object for proper pricing
          variant: item.variant ? {
            ...item.variant,
            price: Number(item.variant.price ?? item.product.price ?? 0)
          } : null,
          product: item.product,
          // FIXED: Prefer variant image when available
          image: (item.variant?.images && item.variant.images.length > 0)
            ? item.variant.images[0]
            : (item.product.images?.[0]?.url || 'https://via.placeholder.com/150x150/f3f4f6/9ca3af?text=No+Image')
      }))
    }
  } catch (error) {
    console.error('Failed to load cart:', error)
  } finally {
    isLoading.value = false
  }
}

const updateQuantity = async (itemId, quantity) => {
  updatingItem.value = itemId
  try {
    if (token.value) {
      await cartService.updateCartItem(itemId, quantity, token.value)
      const item = cartItems.value.find(item => item.id === itemId)
      if (item) {
        item.quantity = quantity
      }
    }
  } catch (error) {
    console.error('Failed to update quantity:', error)
  } finally {
    updatingItem.value = null
  }
}

const increaseQuantity = (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    updateQuantity(itemId, item.quantity + 1)
  }
}

const decreaseQuantity = (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item && item.quantity > 1) {
    updateQuantity(itemId, item.quantity - 1)
  }
}

const removeItem = async (itemId) => {
  try {
    if (token.value) {
      await cartService.removeFromCart(itemId, token.value)
      cartItems.value = cartItems.value.filter(item => item.id !== itemId)
      hideItemActions(itemId)

      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }
  } catch (error) {
    console.error('Failed to remove item:', error)
  }
}

const saveForLater = (itemId) => {
  hideItemActions(itemId)
}

const showItemActions = (itemId) => {
  showActions.value = { ...showActions.value, [itemId]: true }
}

const hideItemActions = (itemId) => {
  showActions.value = { ...showActions.value, [itemId]: false }
}

const applyPromoCode = async () => {
  if (!promoCode.value) return
  
  applyingPromo.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const promoCodes = {
      'SAVE10': { code: 'SAVE10', discount: 10 },
      'WELCOME15': { code: 'WELCOME15', discount: 15 },
      'SUMMER20': { code: 'SUMMER20', discount: 20 }
    }
    
    const promo = promoCodes[promoCode.value.toUpperCase()]
    if (promo) {
      appliedPromo.value = promo
      promoCode.value = ''
      
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    } else {
      alert('Invalid promo code')
    }
  } catch (error) {
    alert('Failed to apply promo code')
  } finally {
    applyingPromo.value = false
  }
}

const removePromo = () => {
  appliedPromo.value = null
}

const clearCart = () => {
  showClearModal.value = true
}

const closeClearModal = () => {
  showClearModal.value = false
}

const confirmClearCart = async () => {
  try {
    if (token.value) {
      await cartService.clearCart(token.value)
      cartItems.value = []
      showClearModal.value = false

      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50])
      }
    }
  } catch (error) {
    console.error('Failed to clear cart:', error)
  }
}

const proceedToCheckout = async () => {
  processingCheckout.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/checkout')
  } catch (error) {
    alert('Failed to proceed to checkout')
  } finally {
    processingCheckout.value = false
  }
}

const goBack = () => {
  router.go(-1)
}

const onSwipe = (event) => {
  console.log('Swipe detected:', event)
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/150x150/f3f4f6/9ca3af?text=No+Image'
}

// Lifecycle
onMounted(() => {
  if (!token.value) {
    router.push({ path: '/login', query: { redirect: '/cart' } })
  } else {
    loadCart()
  }
})
</script>

<style scoped>
/* Base Styles */
.cart-page {
  min-height: 100vh;
  background-color: #f8fafc;
    touch-action: pan-y;

}

/* Mobile-First Cart Styles */
.mobile-first {
  padding-bottom: 140px;
}

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

.back-btn, .clear-cart-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.back-btn:hover, .clear-cart-btn:hover {
  background-color: #f1f5f9;
}

.clear-cart-btn {
  color: #ef4444;
}

.header-title {
  text-align: center;
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.cart-count {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
  display: block;
}

.main-content {
  margin-top: 70px;
  padding: 1rem;
}

.loading-container {
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

.loading-spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 1rem;
  color: #64748b;
}

.empty-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.empty-content {
  text-align: center;
  max-width: 300px;
}

.empty-icon {
  font-size: 4rem;
  color: #cbd5e1;
  margin-bottom: 1.5rem;
}

.empty-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.empty-content p {
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.shop-now-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #1a1a1a;
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.shop-now-btn:hover {
  background: #374151;
  transform: translateY(-2px);
}

.cart-items-section {
  margin-bottom: 2rem;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: relative;
}

.item-content {
  display: flex;
  padding: 1rem;
  gap: 1rem;
}

.item-image {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #f1f5f9;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.item-attribute {
  font-size: 0.8rem;
  color: #64748b;
}

.item-pricing {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-price {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.original-price {
  font-size: 0.9rem;
  color: #64748b;
  text-decoration: line-through;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border-radius: 20px;
  padding: 4px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.8rem;
}

.quantity-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  min-width: 2rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.item-total {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.item-actions {
  position: absolute;
  right: -120px;
  top: 0;
  bottom: 0;
  width: 120px;
  background: #ef4444;
  display: flex;
  transition: right 0.3s ease;
}

.item-actions.visible {
  right: 0;
}

.remove-btn, .save-btn {
  flex: 1;
  border: none;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-btn {
  background: #ef4444;
}

.remove-btn:hover {
  background: #dc2626;
}

.save-btn {
  background: #8b5cf6;
}

.save-btn:hover {
  background: #7c3aed;
}

.promo-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.promo-input-container {
  display: flex;
  gap: 0.5rem;
}

.promo-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.promo-input:focus {
  outline: none;
  border-color: #1a1a1a;
}

.apply-promo-btn {
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.apply-promo-btn:hover:not(:disabled) {
  background: #374151;
}

.apply-promo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.applied-promo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #dcfce7;
  border-radius: 8px;
}

.promo-text {
  color: #166534;
  font-weight: 600;
}

.remove-promo-btn {
  background: none;
  border: none;
  color: #166534;
  cursor: pointer;
  padding: 0.25rem;
}

.order-summary {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.summary-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.summary-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-line.discount {
  color: #16a34a;
}

.summary-line.total {
  font-size: 1.1rem;
  font-weight: 700;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  color: #1a1a1a;
}

.checkout-section {
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e2e8f0;
  z-index: 40;
}

.checkout-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.checkout-info {
  display: flex;
  flex-direction: column;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.total-items {
  font-size: 0.8rem;
  color: #64748b;
}

.checkout-btn {
  background: #1a1a1a;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.checkout-btn:hover:not(:disabled) {
  background: #374151;
  transform: translateY(-2px);
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

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

.nav-item.active,
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.modal-content h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.modal-content p {
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn {
  background: #f1f5f9;
  color: #64748b;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.confirm-btn {
  background: #ef4444;
  color: white;
}

.confirm-btn:hover {
  background: #dc2626;
}

/* Desktop Styles */
.desktop-cart-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.desktop-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

.cart-main-content {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.desktop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.desktop-header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.cart-items-list-desktop {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item-desktop {
  display: grid;
  grid-template-columns: 100px 1fr auto auto;
  gap: 1.5rem;
  align-items: center;
}

.item-image-desktop img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info-desktop .item-name {
  font-size: 1.1rem;
  font-weight: 600;
}

.item-actions-desktop {
  margin-top: 0.5rem;
}

.remove-btn-desktop, .save-btn-desktop {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 1rem;
}

.item-price-desktop {
  font-size: 1.1rem;
  font-weight: 600;
}

.order-summary-desktop {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  position: sticky;
  top: 2rem;
}

.order-summary-desktop h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.checkout-btn-desktop {
  width: 100%;
  background: #1a1a1a;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.checkout-btn-desktop:hover {
  background: #374151;
}

/* Animations */
.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.3s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 767px) {
  .desktop-view {
    display: none;
  }
}

@media (min-width: 768px) {
  .mobile-first {
    display: none;
  }
}
</style>