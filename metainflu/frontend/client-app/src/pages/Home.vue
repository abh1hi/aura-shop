<template>
  <div class="home-page" :class="{ 'mobile-first': isMobile, 'desktop-view': !isMobile }" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <!-- Mobile UI -->
    <div v-if="isMobile">
      <main class="main-content">
        <section class="hero-banner" v-if="currentHeroBanner" v-touch:swipe.left="nextHeroBanner" v-touch:swipe.right="prevHeroBanner">
          <div class="hero-content">
            <div class="hero-image">
              <img :src="currentHeroBanner.imageUrl" :alt="currentHeroBanner.title" />
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

        <section class="new-arrivals">
          <div class="section-header">
            <h3>New Arrival</h3>
            <div class="view-toggle">
              <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'"><i class="fas fa-bars"></i></button>
              <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'"><i class="fas fa-th"></i></button>
            </div>
            <router-link to="/shop" class="see-all">See all</router-link>
          </div>
          
          <div class="products-container">
            <div 
              v-if="viewMode === 'list'"
              class="products-carousel"
              ref="productsCarousel"
              @scroll="onProductsScroll"
              v-touch:swipe.left="scrollProductsLeft"
              v-touch:swipe.right="scrollProductsRight"
            >
              <ProductCard
                v-for="product in newArrivals"
                :key="product.key"
                :product="product"
                :mobile="true"
                class="product-card-mobile"
                @click="goToProduct(product)"
              />
            </div>
            <div v-else class="products-grid">
              <ProductCard
                v-for="product in newArrivals"
                :key="product.key"
                :product="product"
                :mobile="true"
                class="product-card-mobile"
                @click="goToProduct(product)"
              />
            </div>
          </div>
        </section>

        <section class="featured-collections">
          <div class="collection-item" v-for="(collection, index) in featuredCollections" :key="index">
            <div class="collection-image">
              <img :src="collection.imageUrl" :alt="collection.title" />
              <div class="collection-overlay">
                <h4>{{ collection.name }}</h4>
                <p>{{ collection.description }}</p>
                <button class="explore-btn" @click="exploreCollection(collection)">Explore</button>
              </div>
            </div>
          </div>
        </section>

        <section class="trending-products">
          <div class="section-header">
            <h3>Trending Now</h3>
            <div class="view-toggle">
              <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'"><i class="fas fa-bars"></i></button>
              <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'"><i class="fas fa-th"></i></button>
            </div>
            <router-link to="/shop?sort=trending" class="see-all">View all</router-link>
          </div>
          
          <div v-if="viewMode === 'list'" class="products-carousel">
            <ProductCard
              v-for="product in trendingProducts"
              :key="product.key"
              :product="product"
              :mobile="true"
              class="trending-card"
            />
          </div>
          <div v-else class="trending-grid">
            <ProductCard
              v-for="product in trendingProducts"
              :key="product.key"
              :product="product"
              :mobile="true"
              class="trending-card"
            />
          </div>
        </section>
      </main>
    </div>

    <!-- Desktop UI -->
    <div v-else class="desktop-home-page">
      <main class="desktop-main-content">
        <section class="hero-banner" v-if="currentHeroBanner">
          <div class="hero-content">
            <div class="hero-image">
              <img :src="currentHeroBanner.imageUrl" :alt="currentHeroBanner.title" />
              <div class="hero-overlay">
                <div class="hero-text">
                  <h2>{{ currentHeroBanner.title }}</h2>
                  <p>{{ currentHeroBanner.subtitle }}</p>
                  <router-link to="/shop" class="cta-button">{{ currentHeroBanner.cta }}</router-link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="new-arrivals">
          <div class="section-header">
            <h3>New Arrivals</h3>
            <router-link to="/shop" class="see-all">Shop Now</router-link>
          </div>
          <div class="desktop-products-grid">
            <ProductCard
              v-for="product in newArrivals"
              :key="product.key"
              :product="product"
              :mobile="false"
              @click="goToProduct(product)"
            />
          </div>
        </section>

        <section class="featured-collections">
          <div class="collection-item" v-for="(collection, index) in featuredCollections" :key="index">
            <div class="collection-image">
              <img :src="collection.imageUrl" :alt="collection.title" />
              <div class="collection-overlay">
                <h4>{{ collection.name }}</h4>
                <p>{{ collection.description }}</p>
                <button class="explore-btn" @click="exploreCollection(collection)">Explore</button>
              </div>
            </div>
          </div>
        </section>

        <section class="trending-products">
          <div class="section-header">
            <h3>Trending Now</h3>
            <router-link to="/shop?sort=trending" class="see-all">View All</router-link>
          </div>
          <div class="desktop-products-grid">
            <ProductCard
              v-for="product in trendingProducts"
              :key="product.key"
              :product="product"
              :mobile="false"
              @click="goToProduct(product)"
            />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import productService from '../services/productService'
import homeService from '../services/homeService'

const router = useRouter()

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

// Reactive data
const products = ref([])
const activeTab = ref(0)
const currentBannerIndex = ref(0)
const cartItems = ref(0)
const tabsContainer = ref(null)
const productsCarousel = ref(null)
const touchStartX = ref(0)
const touchEndX = ref(0)
const swipeThreshold = 200 // Minimum swipe distance
const viewMode = ref('list') // Add this line

// Category tabs
const categoryTabs = ref(['Limited', 'Recommended', 'New in', 'Trendy'])

// Hero banners
const heroBanners = ref([])

// Featured collections
const featuredCollections = ref([])

// Computed properties
const currentHeroBanner = computed(() => heroBanners.value[currentBannerIndex.value])

// Fixed: Use the same variant flattening logic as Shop.vue
const newArrivals = computed(() => {
  const expanded = []
  
  products.value.forEach(product => {
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        // Build each "card product" with variant-specific fields - same as Shop.vue
        expanded.push({
          // Base product identity
          _id: product._id,
          key: `${product._id}-${variant._id || variant.sku || variant.price || ''}`,
          name: product.name,
          description: product.description,
          categories: product.categories || [],
          createdAt: product.createdAt,
          
          // Variant-first fields used by ProductCard
          price: Number(variant.price ?? product.price ?? 0),
          stock: Number(variant.stock ?? 0),
          images: Array.isArray(variant.images) && variant.images.length > 0
            ? variant.images.map(img => ({ url: img }))
            : (Array.isArray(product.images) && product.images.length > 0
              ? product.images.map(img => ({ url: img.url || img }))
              : [{ url: 'https://via.placeholder.com/300' }]),
          
          // Extra fields for downstream usage
          sku: variant.sku,
          variantAttributes: Array.isArray(variant.attributes) ? variant.attributes : [],
          currentVariant: {
            _id: variant._id,
            sku: variant.sku,
            price: variant.price,
            stock: variant.stock,
            images: variant.images || [],
            attributes: Array.isArray(variant.attributes) ? variant.attributes : []
          },
          
          // Demo/display fields
          rating: product.ratings?.average || 4.5,
          reviews: product.ratings?.count || 0
        })
      })
    } else {
      // Fallback for products without variants
      expanded.push({
        ...product,
        key: product._id,
        price: Number(product.price || 0),
        stock: Number(product.stock || 0),
        images: Array.isArray(product.images) && product.images.length > 0
          ? product.images.map(img => ({ url: img.url || img }))
          : [{ url: 'https://via.placeholder.com/300' }],
        currentVariant: null, // No variant for base products
        variantAttributes: [],
        rating: product.ratings?.average || 4.5,
        reviews: product.ratings?.count || 0
      })
    }
  })
  
  return expanded.slice(0, 10)
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

const onTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX
}

const onTouchMove = (event) => {
  touchEndX.value = event.touches[0].clientX
}

const onTouchEnd = () => {
  if (touchStartX.value === 0 || touchEndX.value === 0) return
  const swipeDistance = touchStartX.value - touchEndX.value
  if (swipeDistance > swipeThreshold) {
    router.push('/shop')
  }
  // Reset touch positions
  touchStartX.value = 0
  touchEndX.value = 0
}

// Fetch products
const fetchProducts = async () => {
  try {
    products.value = await productService.getProducts()
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}

const fetchHeroBanners = async () => {
  try {
    heroBanners.value = await homeService.getHeroBanners()
  } catch (error) {
    console.error('Failed to fetch hero banners:', error)
  }
}

const fetchFeaturedCollections = async () => {
  try {
    featuredCollections.value = await homeService.getFeaturedCollections()
  } catch (error) {
    console.error('Failed to fetch featured collections:', error)
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
/* Base Styles */
.home-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  touch-action: pan-y;
}

/* Mobile-First Design */
.mobile-first {
  padding-bottom: 80px; /* Account for bottom nav */
}

.main-content {
  padding: 0 1rem;
}

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

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.view-toggle button {
  background: none;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}

.view-toggle button.active {
  background: #e2e8f0;
}

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

.trending-products {
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.trending-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Desktop Styles */
.desktop-home-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.desktop-main-content .hero-banner {
  height: 500px;
  margin-bottom: 3rem;
}

.desktop-main-content .hero-image {
  height: 500px;
}

.desktop-main-content .section-header {
  margin-bottom: 2rem;
}

.desktop-main-content .section-header h3 {
  font-size: 2rem;
}

.desktop-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.desktop-main-content .featured-collections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
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