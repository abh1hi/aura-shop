<template>
  <div class="home-page mobile-first" v-touch:swipe="onSwipe">
    <!-- Mobile Header Navigation -->
    <header class="mobile-header">
      <div class="header-content">
        <div class="menu-icon" @click="toggleMenu">
          <i class="fas fa-bars"></i>
        </div>
        <div class="logo">
          <h1>AURA</h1>
        </div>
        <div class="header-actions">
          <i class="fas fa-search" @click="toggleSearch"></i>
          <i class="fas fa-shopping-bag" @click="goToCart">
            <span class="cart-badge" v-if="cartItems > 0">{{ cartItems }}</span>
          </i>
        </div>
      </div>
    </header>

    <!-- Category Navigation Tabs -->
    <nav class="category-tabs">
      <div class="tabs-container" ref="tabsContainer">
        <div 
          v-for="(tab, index) in categoryTabs" 
          :key="index"
          :class="['tab-item', { active: activeTab === index }]"
          @click="setActiveTab(index)"
        >
          {{ tab }}
        </div>
      </div>
    </nav>

    <main class="main-content">
      <!-- Hero Collection Banner -->
      <section class="hero-banner" v-if="currentHeroBanner" v-touch:swipe.left="nextHeroBanner" v-touch:swipe.right="prevHeroBanner">
        <div class="hero-content">
          <div class="hero-image">
            <img :src="currentHeroBanner.image" :alt="currentHeroBanner.title" />
            <div class="hero-overlay">
              <div class="hero-text">
                <h2>{{ currentHeroBanner.title }}</h2>
                <p>{{ currentHeroBanner.subtitle }}</p>
                <router-link to="/shop" class="cta-button">{{ currentHeroBanner.cta }}</router-link>
              </div>
            </div>
          </div>
          <div class="hero-dots">
            <span 
              v-for="(banner, index) in heroBanners" 
              :key="index"
              :class="['dot', { active: currentBannerIndex === index }]"
              @click="setCurrentBanner(index)"
            ></span>
          </div>
        </div>
      </section>

      <!-- New Arrivals Section -->
      <section class="new-arrivals">
        <div class="section-header">
          <h3>New Arrival</h3>
          <router-link to="/shop" class="see-all">See all</router-link>
        </div>
        
        <div class="products-container">
          <div 
            class="products-carousel"
            ref="productsCarousel"
            @scroll="onProductsScroll"
            v-touch:swipe.left="scrollProductsLeft"
            v-touch:swipe.right="scrollProductsRight"
          >
            <ProductCard
              v-for="product in newArrivals"
              :key="product.id"
              :product="product"
              :mobile="true"
              class="product-card-mobile"
              @click="goToProduct(product)"
            />
          </div>
        </div>
      </section>

      <!-- Featured Collections -->
      <section class="featured-collections">
        <div class="collection-item" v-for="(collection, index) in featuredCollections" :key="index">
          <div class="collection-image">
            <img :src="collection.image" :alt="collection.name" />
            <div class="collection-overlay">
              <h4>{{ collection.name }}</h4>
              <p>{{ collection.description }}</p>
              <button class="explore-btn" @click="exploreCollection(collection)">Explore</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Trending Products -->
      <section class="trending-products">
        <div class="section-header">
          <h3>Trending Now</h3>
          <router-link to="/shop?sort=trending" class="see-all">View all</router-link>
        </div>
        
        <div class="trending-grid">
          <ProductCard
            v-for="product in trendingProducts"
            :key="product.id"
            :product="product"
            :mobile="true"
            class="trending-card"
          />
        </div>
      </section>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="bottom-navigation">
      <router-link to="/" class="nav-item active">
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

    <!-- Mobile Menu Overlay -->
    <transition name="slide-menu">
      <div v-if="showMenu" class="mobile-menu-overlay" @click="closeMenu">
        <div class="mobile-menu" @click.stop>
          <div class="menu-header">
            <h3>Menu</h3>
            <button @click="closeMenu">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <nav class="menu-nav">
            <router-link to="/" @click="closeMenu">Home</router-link>
            <router-link to="/shop" @click="closeMenu">Shop</router-link>
            <router-link to="/about" @click="closeMenu">About</router-link>
            <router-link to="/contact" @click="closeMenu">Contact</router-link>
            <router-link to="/account" @click="closeMenu">My Account</router-link>
          </nav>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import productService from '../services/productService'
import homeService from '../services/homeService'

const router = useRouter()

// Reactive data
const products = ref([])
const activeTab = ref(0)
const currentBannerIndex = ref(0)
const showMenu = ref(false)
const showSearch = ref(false)
const cartItems = ref(0)
const tabsContainer = ref(null)
const productsCarousel = ref(null)

// Category tabs
const categoryTabs = ref(['Limited', 'Recommended', 'New in', 'Trendy'])

// Hero banners
const heroBanners = ref([])

// Featured collections
const featuredCollections = ref([])

// Computed properties
const currentHeroBanner = computed(() => heroBanners.value[currentBannerIndex.value])

const newArrivals = computed(() => {
  const allVariants = []
  products.value.forEach(product => {
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        allVariants.push({
          _id: product._id,
          id: `${product._id}-${variant.sku}`,
          name: product.name,
          price: variant.price,
          images: variant.images?.length > 0 ? [{ url: variant.images[0] }] : product.images,
          rating: product.ratings.average,
          reviews: product.ratings.count
        })
      })
    } else {
      allVariants.push({
        ...product,
        id: product._id,
        rating: product.ratings.average,
        reviews: product.ratings.count
      })
    }
  })
  return allVariants.slice(0, 10)
})

const trendingProducts = computed(() => {
  return newArrivals.value.slice(0, 6)
})

// Auto-rotate banner
const bannerInterval = ref(null)

const startBannerRotation = () => {
  if (heroBanners.value.length > 1) {
    bannerInterval.value = setInterval(() => {
      currentBannerIndex.value = (currentBannerIndex.value + 1) % heroBanners.value.length
    }, 5000)
  }
}

const stopBannerRotation = () => {
  if (bannerInterval.value) {
    clearInterval(bannerInterval.value)
    bannerInterval.value = null
  }
}

// Methods
const setActiveTab = (index) => {
  activeTab.value = index
}

const setCurrentBanner = (index) => {
  currentBannerIndex.value = index
  stopBannerRotation()
  setTimeout(startBannerRotation, 3000)
}

const nextHeroBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value + 1) % heroBanners.value.length
}

const prevHeroBanner = () => {
  currentBannerIndex.value = currentBannerIndex.value === 0 
    ? heroBanners.value.length - 1 
    : currentBannerIndex.value - 1
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const closeMenu = () => {
  showMenu.value = false
}

const toggleSearch = () => {
  showSearch.value = !showSearch.value
}

const goToCart = () => {
  router.push('/cart')
}

const goToProduct = (product) => {
  router.push(`/product/${product._id}`)
}

const exploreCollection = (collection) => {
  router.push(`/shop?collection=${collection.name.toLowerCase().replace(' ', '-')}`)
}

const scrollProductsLeft = () => {
  if (productsCarousel.value) {
    productsCarousel.value.scrollBy({ left: -200, behavior: 'smooth' })
  }
}

const scrollProductsRight = () => {
  if (productsCarousel.value) {
    productsCarousel.value.scrollBy({ left: 200, behavior: 'smooth' })
  }
}

const onProductsScroll = () => {
  // Add scroll indicators or other scroll-based functionality
}

const onSwipe = (event) => {
  
}

// Fetch products
const fetchProducts = async () => {
  try {
    products.value = await productService.getProducts()
  } catch (error) {
    
  }
}

const fetchHeroBanners = async () => {
  try {
    heroBanners.value = await homeService.getHeroBanners()
  } catch (error) {
    
  }
}

const fetchFeaturedCollections = async () => {
  try {
    featuredCollections.value = await homeService.getFeaturedCollections()
  } catch (error) {
    
  }
}

const fetchCategoryTabs = async () => {
  // For now, we use hardcoded values
  // In the future, this could be fetched from an API
}

// Lifecycle hooks
onMounted(async () => {
  await fetchProducts()
  await fetchHeroBanners()
  await fetchFeaturedCollections()
  await fetchCategoryTabs()
  startBannerRotation()
})

onUnmounted(() => {
  stopBannerRotation()
})
</script>

<style scoped>
/* Mobile-First Design */
.home-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-bottom: 80px; /* Account for bottom nav */
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
  max-width: 100%;
}

.menu-icon, .header-actions {
  display: flex;
  gap: 1rem;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.header-actions {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Category Tabs */
.category-tabs {
  position: fixed;
  top: 60px;
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
  margin-top: 120px;
  padding: 0 1rem;
}

/* Hero Banner */
.hero-banner {
  margin-bottom: 2rem;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.hero-content {
  position: relative;
}

.hero-image {
  position: relative;
  height: 300px;
  overflow: hidden;
  border-radius: 16px;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%);
  display: flex;
  align-items: center;
  padding: 2rem;
}

.hero-text {
  color: white;
}

.hero-text h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.hero-text p {
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.cta-button {
  display: inline-block;
  background: white;
  color: #1a1a1a;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.hero-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #1a1a1a;
  transform: scale(1.2);
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
}

.see-all {
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
}

/* New Arrivals */
.new-arrivals {
  margin-bottom: 2rem;
}

.products-container {
  position: relative;
}

.products-carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: x mandatory;
  padding-bottom: 1rem;
}

.products-carousel::-webkit-scrollbar {
  display: none;
}

.product-card-mobile {
  flex-shrink: 0;
  width: 160px;
  scroll-snap-align: start;
}

/* Featured Collections */
.featured-collections {
  margin-bottom: 2rem;
}

.collection-item {
  margin-bottom: 1rem;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  height: 200px;
}

.collection-image {
  position: relative;
  height: 100%;
}

.collection-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.collection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  color: white;
}

.collection-overlay h4 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.collection-overlay p {
  margin-bottom: 1rem;
  opacity: 0.9;
}

.explore-btn {
  background: white;
  color: #1a1a1a;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
}

/* Trending Products */
.trending-products {
  margin-bottom: 2rem;
}

.trending-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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

/* Mobile Menu */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 100;
}

.mobile-menu {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background: white;
  padding: 1rem;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-nav a {
  padding: 1rem;
  text-decoration: none;
  color: #1a1a1a;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.menu-nav a:hover {
  background-color: #f1f5f9;
}

/* Animations */
.slide-menu-enter-active,
.slide-menu-leave-active {
  transition: all 0.3s ease;
}

.slide-menu-enter-from {
  opacity: 0;
}

.slide-menu-enter-from .mobile-menu {
  transform: translateX(-100%);
}

.slide-menu-leave-to {
  opacity: 0;
}

.slide-menu-leave-to .mobile-menu {
  transform: translateX(-100%);
}

/* Responsive Design */
@media (min-width: 768px) {
  .main-content {
    padding: 0 2rem;
  }
  
  .trending-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .product-card-mobile {
    width: 200px;
  }
}

@media (min-width: 1024px) {
  .trending-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
/* styles unchanged for brevity */
</style>