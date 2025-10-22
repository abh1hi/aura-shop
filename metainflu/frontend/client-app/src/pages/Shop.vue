<template>
  <div class="shop-page mobile-first" v-touch:swipe="onSwipe">
    <!-- Sticky Header with Breadcrumb (visible on desktop) -->
    <header class="mobile-header">
      <div class="header-content">
        <button class="back-btn" @click="goBack" aria-label="Back">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="header-title">
          <h1>Shop</h1>
        </div>
        <div class="header-actions">
          <button class="search-btn" @click="toggleSearch" aria-label="Search">
            <i class="fas fa-search"></i>
          </button>
          <button class="filter-btn" @click="toggleFilters" aria-label="Filter">
            <i class="fas fa-sliders-h"></i>
          </button>
          <router-link to="/cart" class="cart-btn" aria-label="Cart">
            <i class="fas fa-shopping-bag"></i>
          </router-link>
        </div>
      </div>
      <nav class="breadcrumb-nav" v-if="!showSearch">
        <!-- Example Breadcrumb, replace with dynamic -->
        <span class="breadcrumb">Home</span>
        <i class="fas fa-chevron-right"></i>
        <span class="breadcrumb active">Shop</span>
      </nav>
    </header>

    <!-- Search Bar Slides Down -->
    <transition name="slide-down">
      <div v-if="showSearch" class="search-container">
        <div class="search-bar">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search products..."
            class="search-input"
            @input="onSearch"
            ref="searchInput"
            aria-label="Search products"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn" aria-label="Clear Search">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </transition>

    <!-- Responsive Layout: Flex + CSS Grid -->
    <div class="shop-layout">
      <!-- Filter Sidebar for Desktop, Button for Mobile -->
      <transition name="slide-filter">
        <aside v-if="showFilters || isDesktop" class="filter-sidebar" @click.stop>
          <div class="filter-header">
            <h3>Filters</h3>
            <button @click="closeFilters" class="close-btn" aria-label="Close Filters">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="filter-content">
            <!-- Price, Size, Color as above -->
            <!-- ... same filter sections ... -->
          </div>
          <div class="filter-actions">
            <button @click="clearAllFilters" class="clear-btn">Clear All</button>
            <button @click="applyFilters" class="apply-btn">Apply Filters</button>
          </div>
        </aside>
      </transition>

      <main class="main-content">
        <!-- Category Tabs Always Top -->
        <nav class="category-tabs" v-if="!showSearch">
          <div class="tabs-container" ref="tabsContainer">
            <div
              v-for="(category, index) in categories"
              :key="category._id"
              :class="['tab-item', { active: selectedCategoryId === category._id }]"
              @click="selectCategory(category._id)"
              tabindex="0"
              aria-label="Category: {{ category.name }}"
            >
              {{ category.name }}
            </div>
            <div
              :class="['tab-item', { active: selectedCategoryId === null }]"
              @click="selectCategory(null)"
              tabindex="0"
              aria-label="All Categories"
            >
              All
            </div>
          </div>
        </nav>

        <!-- Filter/Sort Bar -->
        <div class="filter-sort-bar" v-if="!showSearch">
          <div class="sort-options">
            <select v-model="sortOption" class="sort-select" aria-label="Sort products">
              <option value="new">Newest First</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          <div class="view-toggle" role="group" aria-label="View Mode">
            <button
              :class="['view-btn', { active: viewMode === 'grid' }]"
              @click="viewMode = 'grid'"
              aria-label="Grid View"
            >
              <i class="fas fa-th"></i>
            </button>
            <button
              :class="['view-btn', { active: viewMode === 'list' }]"
              @click="viewMode = 'list'"
              aria-label="List View"
            >
              <i class="fas fa-bars"></i>
            </button>
          </div>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading products...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <i class="fas fa-exclamation-triangle error-icon"></i>
          <p class="error-text">{{ error }}</p>
          <button @click="fetchInitialData" class="retry-btn">Try Again</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredProducts.length === 0" class="empty-container">
          <i class="fas fa-shopping-bag empty-icon"></i>
          <h3>No Products Found</h3>
          <p>Try adjusting your search or filters</p>
          <button @click="clearAllFilters" class="clear-filters-btn">Clear Filters</button>
        </div>

        <!-- Product Grid/List with Pagination/Infinite -->
        <div v-else class="products-container">
          <div class="results-info">
            <span class="results-count">{{ filteredProducts.length }} items</span>
          </div>
          <transition-group
            :name="'fade-up'"
            tag="div"
            :class="[
              'products-grid',
              { 'list-view': viewMode === 'list' },
              { 'grid-view': viewMode === 'grid' }
            ]"
          >
            <ProductCard
              v-for="product in displayedProducts"
              :key="product.key"
              :product="product"
              :mobile="!isDesktop"
              :show-rating="true"
              class="product-item"
              @click="goToProduct(product)"
              @favoriteToggled="onFavoriteToggled"
              @addedToCart="onAddedToCart"
            />
          </transition-group>
          <div class="pagination-bar" v-if="hasMore">
            <button
              @click="loadMore"
              :disabled="loadingMore"
              class="load-more-btn"
            >
              <span v-if="!loadingMore">Load More</span>
              <div v-else class="loading-spinner small"></div>
            </button>
          </div>
        </div>
      </main>
    </div>
    <!-- Bottom Navigation -->
    <nav class="bottom-navigation">
      <router-link to="/" class="nav-item" active-class="nav-item-active">
        <i class="fas fa-home"></i>
        <span>Home</span>
      </router-link>
      <router-link to="/shop" class="nav-item active nav-indicate">
        <i class="fas fa-search"></i>
        <span>Shop</span>
      </router-link>
      <router-link to="/cart" class="nav-item" active-class="nav-item-active">
        <i class="fas fa-shopping-bag"></i>
        <span>Cart</span>
      </router-link>
      <router-link to="/account" class="nav-item" active-class="nav-item-active">
        <i class="fas fa-user"></i>
        <span>Account</span>
      </router-link>
    </nav>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import productService from '../services/productService'
import categoryService from '../services/categoryService'

const router = useRouter()

// Reactive data
const allProducts = ref([])
const categories = ref([])
const selectedCategoryId = ref(null)
const sortOption = ref('new')
const viewMode = ref('grid')
const isLoading = ref(true)
const loadingMore = ref(false)
const error = ref(null)
const displayedCount = ref(20)
const showSearch = ref(false)
const showFilters = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

// Filter options
const priceRange = ref({ min: null, max: null })
const selectedSizes = ref([])
const selectedColors = ref([])
const availableSizes = ref(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
const availableColors = ref(['Black', 'White', 'Gray', 'Navy', 'Brown', 'Beige'])

// Computed properties
const productsWithVariants = computed(() => {
  return allProducts.value.flatMap(product => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.map(variant => {
        const imageUrl = (variant.images && variant.images.length > 0) 
          ? variant.images[0] 
          : (product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/300')
        
        return {
          ...product,
          key: `${product._id}-${variant.sku || variant._id}`,
          price: variant.price,
          stock: variant.stock,
          sku: variant.sku,
          images: [{ url: imageUrl }],
          variantAttributes: variant.attributes,
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 500) + 50,
          sizes: ['S', 'M', 'L', 'XL']
        }
      })
    } else {
      return {
        ...product,
        key: product._id,
        price: product.price || 0,
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 500) + 50,
        sizes: ['S', 'M', 'L', 'XL']
      }
    }
  })
})

const filteredProducts = computed(() => {
  let products = productsWithVariants.value

  // Category filter
  if (selectedCategoryId.value) {
    products = products.filter(p => p.categories.some(c => c._id === selectedCategoryId.value))
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }

  // Price filter
  if (priceRange.value.min !== null) {
    products = products.filter(p => p.price >= priceRange.value.min)
  }
  if (priceRange.value.max !== null) {
    products = products.filter(p => p.price <= priceRange.value.max)
  }

  // Size filter
  if (selectedSizes.value.length > 0) {
    products = products.filter(p => 
      selectedSizes.value.some(size => p.sizes?.includes(size))
    )
  }

  // Sort products
  const sortFn = {
    'low-high': (a, b) => a.price - b.price,
    'high-low': (a, b) => b.price - a.price,
    'new': (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    'popular': (a, b) => (b.rating * b.reviews) - (a.rating * a.reviews)
  }[sortOption.value]

  return [...products].sort(sortFn)
})

const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, displayedCount.value)
})

const hasMore = computed(() => {
  return displayedCount.value < filteredProducts.value.length
})

// Methods
const fetchInitialData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const [productsData, categoriesData] = await Promise.all([
      productService.getProducts(),
      categoryService.getCategories()
    ])
    allProducts.value = productsData
    categories.value = categoriesData
  } catch (err) {
    
    error.value = 'Failed to load products. Please try again.'
  } finally {
    isLoading.value = false
  }
}
const isDesktop = computed(() => window.innerWidth >= 1024)
const selectCategory = (categoryId) => {
  selectedCategoryId.value = categoryId
  displayedCount.value = 20
}

const toggleSearch = async () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    await nextTick()
    searchInput.value?.focus()
  } else {
    searchQuery.value = ''
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const onSearch = () => {
  displayedCount.value = 20
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const closeFilters = () => {
  showFilters.value = false
}

const clearAllFilters = () => {
  selectedCategoryId.value = null
  searchQuery.value = ''
  priceRange.value = { min: null, max: null }
  selectedSizes.value = []
  selectedColors.value = []
  displayedCount.value = 20
}

const applyFilters = () => {
  showFilters.value = false
  displayedCount.value = 20
}

const loadMore = () => {
  loadingMore.value = true
  setTimeout(() => {
    displayedCount.value += 20
    loadingMore.value = false
  }, 500)
}

const goBack = () => {
  router.go(-1)
}

const goToProduct = (product) => {
  router.push({ name: 'ProductDetail', params: { id: product._id } })
}

const onSwipe = (event) => {
  
}

const onFavoriteToggled = (data) => {
  
}

const onAddedToCart = (product) => {
  
  // Could show toast notification
}

// Watchers
watch([selectedCategoryId, sortOption], () => {
  displayedCount.value = 20
})

// Lifecycle
onMounted(() => {
  fetchInitialData()
})
</script>

<style scoped>

:root {
  --accent-pink: #f4b6c2;
  --accent-green: #004b23;
  --accent-maroon: #800000;
}

/* Example of colors applied */
.apply-btn {
  background: var(--accent-green);
  color: #fff;
}
.clear-btn:hover, .filter-btn.active {
  background: var(--accent-pink);
  color: var(--accent-maroon);
}
.retry-btn, .clear-filters-btn {
  background: var(--accent-maroon);
  color: #fff;
}
.nav-indicate {
  border-bottom: 3px solid var(--accent-pink);
  transition: border-color 0.3s;
}
.products-grid.grid-view {
  grid-template-columns: repeat(2, 1fr);
}
@media (min-width: 1024px) {
  .shop-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
  }
  .filter-sidebar {
    position: sticky;
    top: 80px;
    height: calc(100vh - 80px);
    z-index: 2;
  }
  .products-grid.grid-view {
    grid-template-columns: repeat(4, 1fr);
  }
}
/* Mobile-First Design */
.shop-page {
  min-height: 100vh;
  background-color: #f8f9fa;
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

.back-btn, .search-btn, .filter-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.back-btn:hover, .search-btn:hover, .filter-btn:hover {
  background-color: #f1f5f9;
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

/* Search Container */
.search-container {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  z-index: 40;
  padding: 1rem;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #64748b;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #1a1a1a;
}

.clear-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
}

/* Category Tabs */
.category-tabs {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  z-index: 40;
}

.tabs-container {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 1rem;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}

.tab-item {
  flex-shrink: 0;
  padding: 1rem 1.5rem;
  color: #64748b;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item.active {
  color: #1a1a1a;
  border-bottom-color: #1a1a1a;
}

/* Main Content */
.main-content {
  margin-top: 130px;
  padding: 0 1rem;
}

/* Filter Sort Bar */
.filter-sort-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem 0;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
}

.view-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.view-btn.active {
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Loading States */
.loading-container, .error-container, .empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
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

.loading-text, .error-text {
  margin-top: 1rem;
  color: #64748b;
}

.error-icon, .empty-icon {
  font-size: 3rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.retry-btn, .clear-filters-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

/* Products Container */
.results-info {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #64748b;
}

.products-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.products-grid.grid-view {
  grid-template-columns: repeat(2, 1fr);
}

.products-grid.list-view {
  grid-template-columns: 1fr;
}

.product-item {
  transition: all 0.3s ease;
}

/* Load More */
.load-more-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.load-more-btn {
  padding: 1rem 2rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.load-more-btn:hover {
  border-color: #1a1a1a;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Filter Sidebar */
.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 100;
}

.filter-sidebar {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 300px;
  max-width: 85vw;
  background: white;
  display: flex;
  flex-direction: column;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.filter-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.filter-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.size-options, .color-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.size-option, .color-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
}

.clear-btn, .apply-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.clear-btn {
  background: #f1f5f9;
  color: #64748b;
}

.apply-btn {
  background: #1a1a1a;
  color: white;
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

/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-filter-enter-active,
.slide-filter-leave-active {
  transition: all 0.3s ease;
}

.slide-filter-enter-from {
  opacity: 0;
}

.slide-filter-enter-from .filter-sidebar {
  transform: translateX(100%);
}

.slide-filter-leave-to {
  opacity: 0;
}

.slide-filter-leave-to .filter-sidebar {
  transform: translateX(100%);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsive Design */
@media (min-width: 640px) {
  .products-grid.grid-view {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .products-grid.grid-view {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .main-content {
    padding: 0 2rem;
  }
}
</style>