<template>
  <header class="mobile-header bg-white shadow-sm safe-top">
    <div class="header-content px-4 py-3 flex items-center justify-between">
      <!-- Menu Button -->
      <button 
        @click="toggleMenu" 
        class="menu-button p-2 -ml-2 touch-manipulation"
        :class="{ 'active': isMenuOpen }"
        aria-label="Toggle menu"
      >
        <div class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      
      <!-- Logo -->
      <router-link 
        to="/" 
        class="logo flex-shrink-0"
        @click="closeMenu"
      >
        <h1 class="text-xl font-bold text-primary-500">AURA</h1>
      </router-link>
      
      <!-- Header Actions -->
      <div class="header-actions flex items-center space-x-2">
        <!-- Search Button -->
        <button 
          @click="toggleSearch"
          class="action-button p-2 touch-manipulation"
          :class="{ 'active': isSearchOpen }"
          aria-label="Search products"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        <!-- Cart Button -->
        <router-link 
          to="/cart"
          class="action-button p-2 relative touch-manipulation"
          @click="closeMenu"
          aria-label="Shopping cart"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span 
            v-if="cartItemsCount > 0" 
            class="cart-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ cartItemsCount > 99 ? '99+' : cartItemsCount }}
          </span>
        </router-link>
      </div>
    </div>
    
    <!-- Search Bar (Expandable) -->
    <transition name="slide-down">
      <div v-if="isSearchOpen" class="search-bar px-4 pb-3">
        <div class="relative">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Search products, brands..."
            class="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @keyup.enter="performSearch"
            @input="onSearchInput"
          >
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button 
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Quick Search Suggestions -->
        <div v-if="searchSuggestions.length > 0 && searchQuery" class="mt-2 bg-white rounded-lg border border-gray-200 shadow-lg">
          <div class="p-2 text-xs text-gray-500 border-b">Quick suggestions</div>
          <div class="max-h-60 overflow-y-auto">
            <button
              v-for="(suggestion, index) in searchSuggestions.slice(0, 5)"
              :key="index"
              @click="selectSuggestion(suggestion)"
              class="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </header>
  
  <!-- Mobile Menu Overlay -->
  <transition name="menu-overlay">
    <div 
      v-if="isMenuOpen" 
      class="mobile-menu-overlay fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="closeMenu"
    >
      <transition name="menu-slide">
        <nav 
          v-if="isMenuOpen"
          class="mobile-menu bg-white h-full w-80 max-w-sm shadow-xl safe-top safe-bottom"
          @click.stop
        >
          <div class="menu-header p-4 border-b">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-primary-500">Menu</h3>
              <button 
                @click="closeMenu"
                class="p-2 -mr-2 text-gray-500 hover:text-gray-700"
                aria-label="Close menu"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="menu-content flex-1 overflow-y-auto">
            <!-- User Profile Section -->
            <div class="p-4 border-b bg-gray-50" v-if="isLoggedIn">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium text-sm">{{ userInitials }}</span>
                </div>
                <div>
                  <p class="font-medium text-primary-500">{{ userName }}</p>
                  <p class="text-sm text-gray-600">{{ userEmail }}</p>
                </div>
              </div>
            </div>
            
            <!-- Navigation Links -->
            <div class="py-2">
              <router-link
                v-for="(link, index) in navigationLinks"
                :key="index"
                :to="link.path"
                @click="closeMenu"
                class="nav-link flex items-center px-4 py-3 text-primary-500 hover:bg-gray-50 transition-colors"
                :class="{ 'bg-primary-50 border-r-2 border-primary-500': $route.path === link.path }"
              >
                <component :is="link.icon" class="w-5 h-5 mr-3 text-gray-600" />
                <span>{{ link.label }}</span>
              </router-link>
            </div>
            
            <!-- Authentication Section -->
            <div class="border-t mt-4 pt-2" v-if="!isLoggedIn">
              <router-link
                to="/login"
                @click="closeMenu"
                class="nav-link flex items-center px-4 py-3 text-primary-500 hover:bg-gray-50"
              >
                <svg class="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign In</span>
              </router-link>
              <router-link
                to="/register"
                @click="closeMenu"
                class="nav-link flex items-center px-4 py-3 text-primary-500 hover:bg-gray-50"
              >
                <svg class="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Sign Up</span>
              </router-link>
            </div>
            
            <!-- Logout Section -->
            <div class="border-t mt-4 pt-2" v-else>
              <button
                @click="logout"
                class="nav-link w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </nav>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Reactive state
const isMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const cartItemsCount = ref(3) // Replace with actual cart state
const searchSuggestions = ref(['Dresses', 'Shoes', 'Accessories', 'Handbags', 'Jewelry'])

// User state (replace with actual auth state)
const isLoggedIn = ref(false)
const userName = ref('John Doe')
const userEmail = ref('john@example.com')

// Computed
const userInitials = computed(() => {
  if (!userName.value) return 'U'
  return userName.value.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

// Navigation links
const navigationLinks = [
  {
    path: '/',
    label: 'Home',
    icon: 'HomeIcon'
  },
  {
    path: '/shop',
    label: 'Shop',
    icon: 'ShopIcon'
  },
  {
    path: '/about',
    label: 'About Us',
    icon: 'InfoIcon'
  },
  {
    path: '/contact',
    label: 'Contact',
    icon: 'ContactIcon'
  },
  {
    path: '/account',
    label: 'My Account',
    icon: 'UserIcon'
  }
]

// Methods
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleSearch = async () => {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchInput.value?.focus()
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/shop', query: { q: searchQuery.value } })
    isSearchOpen.value = false
  }
}

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion
  performSearch()
}

const onSearchInput = () => {
  // Implement search suggestions logic here
  // This could involve API calls to get real-time suggestions
}

const logout = () => {
  // Implement logout logic
  isLoggedIn.value = false
  closeMenu()
  router.push('/')
}

// Watch for route changes to close menu
watch(() => route.path, () => {
  closeMenu()
})

// Close menu on escape key
onMounted(() => {
  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      if (isMenuOpen.value) closeMenu()
      if (isSearchOpen.value) isSearchOpen.value = false
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  return () => {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.mobile-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid #f1f5f9;
}

.menu-button {
  transition: all 0.3s ease;
}

.hamburger {
  width: 20px;
  height: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: #1a1a1a;
  transition: all 0.3s ease;
  transform-origin: center;
}

.menu-button.active .hamburger span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.menu-button.active .hamburger span:nth-child(2) {
  opacity: 0;
}

.menu-button.active .hamburger span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.action-button {
  @apply text-gray-600 hover:text-primary-500 transition-colors rounded-lg;
}

.action-button.active {
  @apply text-primary-500 bg-primary-50;
}

.cart-badge {
  font-size: 10px;
  line-height: 1;
  min-width: 20px;
}

.mobile-menu {
  display: flex;
  flex-direction: column;
}

.nav-link {
  font-weight: 500;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  height: 0;
  opacity: 0;
}

.menu-overlay-enter-active,
.menu-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.menu-overlay-enter-from,
.menu-overlay-leave-to {
  opacity: 0;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: transform 0.3s ease;
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  transform: translateX(-100%);
}

/* Icons as inline SVG components */
.home-icon, .shop-icon, .info-icon, .contact-icon, .user-icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>