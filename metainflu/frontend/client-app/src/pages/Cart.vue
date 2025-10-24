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

// Pricing helpers that prefer variant price
const unitPrice = (item) => {
  if (item?.variant && item.variant.price != null) return Number(item.variant.price) || 0
  if (item?.price != null) return Number(item.price) || 0
  if (item?.product && item.product.price != null) return Number(item.product.price) || 0
  return 0
}

// Computed properties
const totalItems = computed(() => cartItems.value.reduce((total, item) => total + (item.quantity || 0), 0))

const subtotal = computed(() => cartItems.value.reduce((total, item) => total + (unitPrice(item) * (item.quantity || 0)), 0))

const discountAmount = computed(() => {
  if (!appliedPromo.value) return 0
  return subtotal.value * (appliedPromo.value.discount / 100)
})

const shipping = computed(() => subtotal.value > 75 ? 0 : 9.99)

const tax = computed(() => (subtotal.value - discountAmount.value) * 0.08)

const total = computed(() => subtotal.value - discountAmount.value + shipping.value + tax.value)

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
  
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    if (deltaX < 0) {
      showItemActions(itemId)
    } else {
      hideItemActions(itemId)
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
      cartItems.value = (cart.items || []).filter(item => item.product).map(item => ({
        id: item._id,
        name: item.product.name,
        // Prefer variant price. Preserve full variant object when present
        price: Number(item.variant?.price ?? item.product.price ?? 0),
        originalPrice: item.product.originalPrice ? Number(item.product.originalPrice) : null,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        variant: item.variant ? {
          ...item.variant,
          price: Number(item.variant.price ?? item.product.price ?? 0)
        } : null,
        product: item.product,
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

const removePromo = () => { appliedPromo.value = null }

const clearCart = () => { showClearModal.value = true }

const closeClearModal = () => { showClearModal.value = false }

const confirmClearCart = async () => {
  try {
    if (token.value) {
      await cartService.clearCart(token.value)
      cartItems.value = []
      showClearModal.value = false

      if (navigator.vibrate) { navigator.vibrate([50, 30, 50]) }
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

const goBack = () => { router.go(-1) }

const onSwipe = (event) => { console.log('Swipe detected:', event) }

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
/* Keep existing styles unchanged */
</style>
