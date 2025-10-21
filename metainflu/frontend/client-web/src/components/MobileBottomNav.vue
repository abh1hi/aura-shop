<template>
  <nav class="mobile-bottom-nav bg-white border-t border-gray-200 safe-bottom">
    <div class="nav-container grid grid-cols-4 h-16">
      <!-- Home -->
      <router-link
        to="/"
        class="nav-item"
        :class="{ 'active': isActive('/') }"
      >
        <div class="nav-content">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span class="nav-label">Home</span>
        </div>
      </router-link>
      
      <!-- Shop -->
      <router-link
        to="/shop"
        class="nav-item"
        :class="{ 'active': isActive('/shop') }"
      >
        <div class="nav-content">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span class="nav-label">Shop</span>
        </div>
      </router-link>
      
      <!-- Cart -->
      <router-link
        to="/cart"
        class="nav-item relative"
        :class="{ 'active': isActive('/cart') }"
      >
        <div class="nav-content">
          <div class="relative">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <!-- Cart Badge -->
            <transition name="badge-pop">
              <span 
                v-if="cartItemsCount > 0" 
                class="cart-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1"
              >
                {{ cartItemsCount > 99 ? '99+' : cartItemsCount }}
              </span>
            </transition>
          </div>
          <span class="nav-label">Cart</span>
        </div>
      </router-link>
      
      <!-- Account -->
      <router-link
        to="/account"
        class="nav-item"
        :class="{ 'active': isActive('/account') }"
      >
        <div class="nav-content">
          <div class="relative">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <!-- New notification indicator -->
            <transition name="badge-pop">
              <span 
                v-if="hasNotifications" 
                class="notification-dot absolute -top-0.5 -right-0.5 bg-accent-500 rounded-full w-2.5 h-2.5"
              >
              </span>
            </transition>
          </div>
          <span class="nav-label">Account</span>
        </div>
      </router-link>
    </div>
    
    <!-- Floating Action Button (Optional) -->
    <transition name="fab-bounce">
      <button
        v-if="showFab && !isOnCartOrCheckout"
        @click="navigateToQuickAction"
        class="fab bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation"
        :class="{
          'animate-bounce': fabAnimation
        }"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Props (if needed)
const props = defineProps({
  cartItems: {
    type: Number,
    default: 0
  },
  notifications: {
    type: Boolean,
    default: false
  }
})

// Reactive state
const cartItemsCount = ref(3) // Replace with actual cart state
const hasNotifications = ref(true) // Replace with actual notification state
const showFab = ref(true)
const fabAnimation = ref(false)

// Computed properties
const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const isOnCartOrCheckout = computed(() => {
  return route.path === '/cart' || route.path === '/checkout'
})

// Methods
const navigateToQuickAction = () => {
  // Quick action - could be add product, create list, etc.
  // For now, let's navigate to add product or shop
  if (route.path === '/shop') {
    // Scroll to top or open filter
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push('/shop')
  }
}

// Handle scroll to show/hide FAB
let scrollTimeout
const handleScroll = () => {
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  // Hide FAB when near bottom of page
  if (scrollY + windowHeight > documentHeight - 100) {
    showFab.value = false
  } else {
    showFab.value = true
  }
  
  // Clear existing timeout
  clearTimeout(scrollTimeout)
  
  // Set timeout to show FAB again after scroll stops
  scrollTimeout = setTimeout(() => {
    showFab.value = true
  }, 150)
}

// Animate FAB on certain actions
const triggerFabAnimation = () => {
  fabAnimation.value = true
  setTimeout(() => {
    fabAnimation.value = false
  }, 600)
}

// Listen for cart updates to animate
const previousCartCount = ref(cartItemsCount.value)

// Watch for cart count changes
const updateCartCount = (newCount) => {
  if (newCount > previousCartCount.value) {
    triggerFabAnimation()
  }
  previousCartCount.value = newCount
  cartItemsCount.value = newCount
}

// Lifecycle
onMounted(() => {
  // Add scroll listener for FAB behavior
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // Listen for cart updates (replace with actual cart state management)
  // Example: cartStore.subscribe((state) => updateCartCount(state.items.length))
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  clearTimeout(scrollTimeout)
})

// Expose methods for parent components
defineExpose({
  updateCartCount,
  triggerFabAnimation
})
</script>

<style scoped>
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 100%;
  margin: 0 auto;
}

.nav-item {
  @apply flex items-center justify-center text-gray-500 transition-all duration-200 touch-manipulation;
  text-decoration: none;
  position: relative;
  padding: 0.5rem;
}

.nav-item:hover,
.nav-item:focus {
  @apply text-primary-500;
}

.nav-item.active {
  @apply text-primary-500;
}

.nav-item.active .nav-content {
  transform: scale(1.05);
}

.nav-content {
  @apply flex flex-col items-center justify-center transition-transform duration-200;
  min-height: 44px; /* Touch-friendly minimum */
}

.nav-icon {
  @apply w-6 h-6 mb-1;
  transition: all 0.2s ease;
}

.nav-item.active .nav-icon {
  transform: translateY(-1px);
}

.nav-label {
  @apply text-xs font-medium leading-none;
  font-size: 10px;
}

.cart-badge {
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.notification-dot {
  border: 1px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.fab {
  position: absolute;
  bottom: 80px; /* Above bottom nav */
  right: 1rem;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  z-index: 60;
}

/* Animations */
.badge-pop-enter-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.badge-pop-leave-active {
  transition: all 0.2s ease-in;
}

.badge-pop-enter-from {
  transform: scale(0);
  opacity: 0;
}

.badge-pop-leave-to {
  transform: scale(0);
  opacity: 0;
}

.fab-bounce-enter-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.fab-bounce-leave-active {
  transition: all 0.3s ease-in;
}

.fab-bounce-enter-from {
  transform: scale(0) rotate(180deg);
  opacity: 0;
}

.fab-bounce-leave-to {
  transform: scale(0) rotate(-180deg);
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 374px) {
  .nav-label {
    font-size: 9px;
  }
  
  .nav-icon {
    @apply w-5 h-5;
  }
}

@media (min-width: 375px) and (max-width: 414px) {
  .fab {
    bottom: 90px;
  }
}

/* Large phones */
@media (min-width: 415px) {
  .nav-content {
    min-height: 48px;
  }
  
  .fab {
    width: 60px;
    height: 60px;
    bottom: 90px;
  }
}

/* Landscape orientation */
@media (orientation: landscape) and (max-height: 500px) {
  .mobile-bottom-nav {
    height: 48px;
  }
  
  .nav-container {
    height: 48px;
  }
  
  .nav-content {
    min-height: 36px;
  }
  
  .nav-icon {
    @apply w-5 h-5 mb-0.5;
  }
  
  .nav-label {
    font-size: 9px;
  }
  
  .fab {
    width: 48px;
    height: 48px;
    bottom: 60px;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .nav-item {
    border: 1px solid transparent;
  }
  
  .nav-item.active {
    border-color: currentColor;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .nav-item,
  .nav-content,
  .nav-icon,
  .fab {
    transition: none;
  }
  
  .nav-item.active .nav-content {
    transform: none;
  }
  
  .fab {
    animation: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .mobile-bottom-nav {
    @apply bg-gray-900 border-gray-700;
  }
  
  .nav-item {
    @apply text-gray-400;
  }
  
  .nav-item:hover,
  .nav-item:focus,
  .nav-item.active {
    @apply text-white;
  }
}
</style>