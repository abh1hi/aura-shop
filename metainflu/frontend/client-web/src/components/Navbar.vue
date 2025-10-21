<template>
  <header :class="['navbar-glass', { 'scrolled': isScrolled }]">
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <div class="flex-shrink-0 z-20">
          <router-link 
            to="/" 
            class="text-2xl md:text-3xl font-bold text-white hover:text-accent-500 transition-colors"
          >
            AURA
          </router-link>
        </div>

        <!-- Desktop Navigation - Hidden on mobile -->
        <div class="hidden lg:flex lg:items-center lg:space-x-8 xl:space-x-12">
          <router-link 
            v-for="link in mainNavLinks"
            :key="link.path"
            :to="link.path"
            class="nav-link relative group"
            :class="{ 'active': isActiveRoute(link.path) }"
          >
            {{ link.label }}
            <span class="nav-underline absolute bottom-0 left-0 w-0 h-0.5 bg-accent-500 transition-all duration-300 group-hover:w-full"></span>
          </router-link>
          
          <!-- Mega Menu Trigger (for categories) -->
          <div class="relative group">
            <button class="nav-link flex items-center space-x-1">
              <span>Categories</span>
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Mega Menu Dropdown -->
            <div class="mega-menu absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div class="bg-white rounded-lg shadow-xl border p-6">
                <div class="grid grid-cols-2 gap-6">
                  <div v-for="category in categories" :key="category.name" class="space-y-2">
                    <h3 class="font-semibold text-primary-500">{{ category.name }}</h3>
                    <ul class="space-y-1">
                      <li v-for="subcategory in category.subcategories" :key="subcategory">
                        <router-link 
                          :to="`/shop?category=${subcategory.toLowerCase()}`"
                          class="text-sm text-gray-600 hover:text-primary-500 transition-colors"
                        >
                          {{ subcategory }}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tablet Navigation - Visible on md to lg -->
        <div class="hidden md:flex lg:hidden items-center space-x-6">
          <router-link to="/shop" class="nav-link">Shop</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-3 md:space-x-4 lg:space-x-5">
          <!-- Search - Desktop/Tablet -->
          <div class="hidden sm:block relative">
            <button 
              @click="toggleSearch"
              class="nav-action-btn"
              :class="{ 'active': isSearchOpen }"
              aria-label="Search"
            >
              <svg class="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <!-- Search Dropdown -->
            <transition name="search-dropdown">
              <div v-if="isSearchOpen" class="search-dropdown absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border p-4 z-50">
                <div class="relative">
                  <input
                    ref="searchInput"
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search products, brands..."
                    class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    @keyup.enter="performSearch"
                  >
                  <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <div v-if="searchSuggestions.length > 0 && searchQuery" class="mt-3">
                  <p class="text-xs text-gray-500 mb-2">Popular searches</p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="suggestion in searchSuggestions.slice(0, 4)"
                      :key="suggestion"
                      @click="selectSuggestion(suggestion)"
                      class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                    >
                      {{ suggestion }}
                    </button>
                  </div>
                </div>
              </div>
            </transition>
          </div>
          
          <!-- Cart -->
          <router-link to="/cart" class="nav-action-btn relative" aria-label="Shopping Cart">
            <svg class="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartCount > 0" class="cart-badge absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {{ cartCount > 99 ? '99+' : cartCount }}
            </span>
          </router-link>
          
          <!-- User Account Dropdown -->
          <div class="relative group">
            <button class="nav-action-btn" aria-label="Account Menu">
              <svg class="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            <!-- User Dropdown -->
            <div class="user-dropdown absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div class="py-2">
                <template v-if="isLoggedIn">
                  <div class="px-4 py-2 border-b">
                    <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                    <p class="text-xs text-gray-600">{{ userEmail }}</p>
                  </div>
                  <router-link to="/account" class="dropdown-link">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Account
                  </router-link>
                  <router-link to="/orders" class="dropdown-link">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    My Orders
                  </router-link>
                  <button @click="logout" class="dropdown-link w-full text-left text-red-600 hover:bg-red-50">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </template>
                <template v-else>
                  <router-link to="/login" class="dropdown-link">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </router-link>
                  <router-link to="/register" class="dropdown-link">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Sign Up
                  </router-link>
                </template>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Button - Only visible on mobile -->
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen" 
            class="md:hidden nav-action-btn"
            aria-label="Toggle mobile menu"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu - Only visible on small screens -->
      <transition name="mobile-menu">
        <div v-if="isMobileMenuOpen" class="md:hidden mobile-menu bg-white/95 backdrop-blur-md border-t">
          <div class="px-4 py-6 space-y-4">
            <router-link
              v-for="link in [...mainNavLinks, ...mobileOnlyLinks]"
              :key="link.path"
              :to="link.path"
              class="mobile-nav-link block py-2 text-lg font-medium text-primary-500 hover:text-accent-500 transition-colors"
              @click="isMobileMenuOpen = false"
            >
              {{ link.label }}
            </router-link>
            
            <div class="border-t pt-4 mt-4">
              <template v-if="!isLoggedIn">
                <router-link to="/login" class="mobile-nav-link block py-2 text-lg font-medium text-primary-500" @click="isMobileMenuOpen = false">
                  Sign In
                </router-link>
                <router-link to="/register" class="mobile-nav-link block py-2 text-lg font-medium bg-primary-500 text-white rounded-lg px-4 mt-2" @click="isMobileMenuOpen = false">
                  Sign Up
                </router-link>
              </template>
              <template v-else>
                <router-link to="/account" class="mobile-nav-link block py-2 text-lg font-medium text-primary-500" @click="isMobileMenuOpen = false">
                  My Account
                </router-link>
                <button @click="logout; isMobileMenuOpen = false" class="mobile-nav-link block py-2 text-lg font-medium text-red-600">
                  Sign Out
                </button>
              </template>
            </div>
          </div>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Reactive state
const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const isScrolled = ref(false)
const cartCount = ref(3) // Replace with actual cart state
const searchSuggestions = ref(['Dresses', 'Shoes', 'Accessories', 'Jewelry', 'Handbags'])

// User state (replace with actual auth state)
const isLoggedIn = ref(false)
const userName = ref('John Doe')
const userEmail = ref('john@example.com')

// Navigation data
const mainNavLinks = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' }
]

const mobileOnlyLinks = [
  { path: '/orders', label: 'My Orders' },
  { path: '/wishlist', label: 'Wishlist' }
]

const categories = [
  {
    name: 'Women',
    subcategories: ['Dresses', 'Tops', 'Bottoms', 'Shoes', 'Accessories']
  },
  {
    name: 'Men',
    subcategories: ['Shirts', 'Pants', 'Shoes', 'Accessories', 'Watches']
  }
]

// Methods
const isActiveRoute = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleSearch = async () => {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    await nextTick()
    searchInput.value?.focus()
  }
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

const logout = () => {
  // Implement logout logic
  isLoggedIn.value = false
  router.push('/')
}

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  isSearchOpen.value = false
  isMobileMenuOpen.value = false
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      closeDropdowns()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Watch for route changes to close mobile menu
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})
</script>

<style scoped>
.navbar-glass {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%);
}

.navbar-glass.scrolled {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.scrolled .nav-link,
.scrolled .nav-action-btn {
  color: #1a1a1a;
}

.scrolled .nav-link:hover,
.scrolled .nav-action-btn:hover {
  color: #c5a47e;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link:hover {
  color: #c5a47e;
}

.nav-link.active {
  color: #c5a47e;
}

.nav-link.active .nav-underline {
  width: 100%;
}

.nav-action-btn {
  color: white;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
}

.nav-action-btn:hover {
  color: #c5a47e;
  background: rgba(255, 255, 255, 0.1);
}

.nav-action-btn.active {
  color: #c5a47e;
  background: rgba(197, 164, 126, 0.1);
}

.cart-badge {
  font-size: 10px;
  line-height: 1;
  animation: pulse 2s infinite;
}

.mega-menu {
  transform: translateY(-10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.group:hover .mega-menu {
  transform: translateY(0);
}

.search-dropdown,
.user-dropdown {
  transform: translateY(-10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.group:hover .user-dropdown {
  transform: translateY(0);
}

.dropdown-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
}

.dropdown-link:hover {
  background-color: #f9fafb;
  color: #1a1a1a;
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
}

.mobile-nav-link {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.5rem;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

/* Transitions */
.search-dropdown-enter-active,
.search-dropdown-leave-active {
  transition: all 0.2s ease;
}

.search-dropdown-enter-from,
.search-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  max-height: 0;
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  max-height: 400px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-link {
    font-size: 1rem;
  }
  
  .navbar-glass {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .nav-link,
  .nav-action-btn {
    color: #1a1a1a;
  }
  
  .nav-link:hover,
  .nav-action-btn:hover {
    color: #c5a47e;
  }
}

/* Tablet specific adjustments */
@media (min-width: 768px) and (max-width: 1023px) {
  .nav-link {
    font-size: 0.9rem;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .navbar-glass,
  .nav-link,
  .nav-action-btn,
  .mega-menu,
  .search-dropdown,
  .user-dropdown {
    transition: none;
  }
  
  .cart-badge {
    animation: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .mega-menu > div,
  .search-dropdown,
  .user-dropdown {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  .dropdown-link {
    color: #d1d5db;
  }
  
  .dropdown-link:hover {
    background-color: #374151;
    color: #f9fafb;
  }
  
  .mobile-menu {
    background: rgba(31, 41, 55, 0.95);
  }
  
  .mobile-nav-link {
    color: #d1d5db;
    border-color: #374151;
  }
}
</style>