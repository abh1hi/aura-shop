<template>
  <div 
    class="home-page"
    :class="{
      'mobile-layout': deviceType === 'mobile',
      'tablet-layout': deviceType === 'tablet',
      'desktop-layout': deviceType === 'desktop'
    }"
    v-touch:swipe="onSwipe"
  >
    <!-- Hero Section - Adaptive Layout -->
    <section class="hero-section relative overflow-hidden">
      <!-- Desktop/Tablet Hero -->
      <div v-if="!isMobileDevice" class="desktop-hero">
        <div class="hero-slider relative h-96 md:h-[500px] lg:h-[600px] xl:h-[700px]">
          <div 
            v-for="(banner, index) in heroBanners" 
            :key="index"
            :class="[
              'hero-slide absolute inset-0 transition-all duration-1000 ease-in-out',
              {
                'opacity-100 scale-100': currentBannerIndex === index,
                'opacity-0 scale-105': currentBannerIndex !== index
              }
            ]"
          >
            <img 
              :src="banner.image" 
              :alt="banner.title"
              class="w-full h-full object-cover"
              loading="lazy"
            >
            <div class="hero-overlay absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent">
              <div class="container mx-auto h-full flex items-center">
                <div class="hero-content max-w-lg xl:max-w-2xl text-white">
                  <h1 class="hero-title text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 lg:mb-6">
                    {{ banner.title }}
                  </h1>
                  <p class="hero-subtitle text-lg md:text-xl lg:text-2xl mb-6 lg:mb-8 opacity-90">
                    {{ banner.subtitle }}
                  </p>
                  <div class="hero-actions flex flex-col sm:flex-row gap-4">
                    <router-link 
                      to="/shop" 
                      class="cta-button bg-white text-primary-500 hover:bg-accent-500 hover:text-white px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                      {{ banner.cta || 'Shop Now' }}
                    </router-link>
                    <button class="cta-button-outline border-2 border-white text-white hover:bg-white hover:text-primary-500 px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold rounded-full transition-all duration-300">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Hero Navigation -->
        <div class="hero-navigation absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <button
            v-for="(banner, index) in heroBanners"
            :key="index"
            @click="setCurrentBanner(index)"
            :class="[
              'w-3 h-3 rounded-full transition-all duration-300',
              currentBannerIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            ]"
            :aria-label="`Go to slide ${index + 1}`"
          />
        </div>
        
        <!-- Hero Arrow Navigation -->
        <button 
          @click="prevBanner" 
          class="hero-nav-btn absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
          aria-label="Previous slide"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          @click="nextBanner" 
          class="hero-nav-btn absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
          aria-label="Next slide"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Hero -->
      <div v-else class="mobile-hero">
        <div class="hero-slider relative h-64 sm:h-80" v-touch:swipe.left="nextBanner" v-touch:swipe.right="prevBanner">
          <div 
            v-for="(banner, index) in heroBanners" 
            :key="index"
            :class="[
              'hero-slide absolute inset-0 transition-transform duration-500 ease-out',
              {
                'translate-x-0': currentBannerIndex === index,
                '-translate-x-full': currentBannerIndex > index,
                'translate-x-full': currentBannerIndex < index
              }
            ]"
          >
            <img 
              :src="banner.image" 
              :alt="banner.title"
              class="w-full h-full object-cover"
              loading="lazy"
            >
            <div class="hero-overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h1 class="text-xl sm:text-2xl font-bold mb-2 leading-tight">{{ banner.title }}</h1>
                <p class="text-sm sm:text-base mb-4 opacity-90">{{ banner.subtitle }}</p>
                <router-link 
                  to="/shop" 
                  class="cta-button inline-block bg-white text-primary-500 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-full transition-all duration-300"
                >
                  {{ banner.cta || 'Shop Now' }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mobile Navigation Dots -->
        <div class="flex justify-center mt-4 space-x-2">
          <button
            v-for="(banner, index) in heroBanners"
            :key="index"
            @click="setCurrentBanner(index)"
            :class="[
              'w-2 h-2 rounded-full transition-all duration-300',
              currentBannerIndex === index ? 'bg-primary-500 scale-125' : 'bg-gray-300'
            ]"
            :aria-label="`Go to slide ${index + 1}`"
          />
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Featured Categories - Responsive Grid -->
      <section class="featured-categories py-8 md:py-12 lg:py-16">
        <div class="container mx-auto">
          <div class="section-header text-center mb-8 md:mb-12">
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-500 mb-2 md:mb-4">Shop by Category</h2>
            <p class="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">Discover our curated collections designed for every style and occasion</p>
          </div>
          
          <div class="categories-grid grid gap-4 md:gap-6 lg:gap-8" :class="getCategoriesGridClass()">
            <div 
              v-for="(category, index) in featuredCategories"
              :key="index"
              class="category-card group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
              :class="getCategoryCardClass(index)"
              @click="exploreCategory(category)"
            >
              <img 
                :src="category.image" 
                :alt="category.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              >
              <div class="category-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70">
                <div class="category-content absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                  <h3 class="text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2">{{ category.name }}</h3>
                  <p class="text-sm md:text-base opacity-90 mb-2 md:mb-3">{{ category.description }}</p>
                  <span class="inline-flex items-center text-sm md:text-base font-medium group-hover:translate-x-1 transition-transform duration-300">
                    Shop Now 
                    <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- New Arrivals - Responsive Product Carousel -->
      <section class="new-arrivals py-8 md:py-12 lg:py-16 bg-surface-100">
        <div class="container mx-auto">
          <div class="section-header flex items-center justify-between mb-6 md:mb-8">
            <h2 class="text-xl md:text-2xl lg:text-3xl font-bold text-primary-500">New Arrivals</h2>
            <router-link 
              to="/shop?filter=new" 
              class="text-sm md:text-base text-accent-500 hover:text-accent-600 font-medium flex items-center transition-colors"
            >
              View All
              <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
          
          <!-- Product Carousel -->
          <div class="products-carousel-container relative">
            <!-- Desktop/Tablet Grid -->
            <div v-if="!isMobileDevice" class="products-grid" :class="getProductsGridClass()">
              <ProductCard
                v-for="product in newArrivals.slice(0, getProductsPerRow())"
                :key="product.id"
                :product="product"
                :device-type="deviceType"
                class="product-card transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              />
            </div>
            
            <!-- Mobile Horizontal Scroll -->
            <div v-else class="mobile-products-scroll">
              <div 
                class="products-carousel flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
                ref="productsCarousel"
                @scroll="onProductsScroll"
                v-touch:swipe.left="scrollProductsLeft"
                v-touch:swipe.right="scrollProductsRight"
              >
                <ProductCard
                  v-for="product in newArrivals"
                  :key="product.id"
                  :product="product"
                  device-type="mobile"
                  class="product-card-mobile flex-shrink-0 w-40 sm:w-44"
                />
              </div>
              
              <!-- Scroll Indicators -->
              <div class="scroll-indicators flex justify-center mt-3 space-x-1">
                <div 
                  v-for="(_, index) in Math.ceil(newArrivals.length / 3)"
                  :key="index"
                  :class="[
                    'w-2 h-2 rounded-full transition-all duration-300',
                    index === currentScrollIndex ? 'bg-primary-500' : 'bg-gray-300'
                  ]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action Banner - Responsive -->
      <section class="cta-banner py-12 md:py-16 lg:py-20 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500"></div>
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="container mx-auto relative z-10 text-center">
          <h2 class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 md:mb-6">
            Join Our Style Community
          </h2>
          <p class="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto">
            Get exclusive access to new collections, styling tips, and member-only discounts
          </p>
          <div class="cta-actions flex flex-col sm:flex-row gap-4 justify-center items-center">
            <router-link 
              to="/register" 
              class="cta-button bg-white text-primary-500 hover:bg-accent-100 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Sign Up Now
            </router-link>
            <router-link 
              to="/about" 
              class="cta-button-outline border-2 border-white text-white hover:bg-white hover:text-primary-500 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full transition-all duration-300"
            >
              Learn More
            </router-link>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useDeviceDetection } from '../composables/useDeviceDetection'
import { useResponsiveBreakpoints } from '../composables/useResponsiveBreakpoints'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()

// Device detection
const { isMobileDevice, isTabletDevice, isDesktopDevice, deviceType } = useDeviceDetection()
const { screenSize, isMd, isLg, isXl } = useResponsiveBreakpoints()

// Props
const props = defineProps({
  deviceType: String,
  screenSize: String
})

// Reactive data
const currentBannerIndex = ref(0)
const currentScrollIndex = ref(0)
const productsCarousel = ref(null)

// Sample data (replace with actual API calls)
const heroBanners = ref([
  {
    id: 1,
    title: "Summer Collection 2025",
    subtitle: "Discover the latest trends in fashion",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
    cta: "Shop Summer"
  },
  {
    id: 2,
    title: "Exclusive Designer Pieces",
    subtitle: "Limited edition luxury items",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200",
    cta: "Explore Now"
  },
  {
    id: 3,
    title: "Sustainable Fashion",
    subtitle: "Eco-friendly style choices",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200",
    cta: "Go Green"
  }
])

const featuredCategories = ref([
  {
    name: "Women's Fashion",
    description: "Elegant and trendy pieces",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600",
    slug: "womens"
  },
  {
    name: "Men's Collection",
    description: "Classic and modern styles",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600",
    slug: "mens"
  },
  {
    name: "Accessories",
    description: "Complete your look",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    slug: "accessories"
  },
  {
    name: "Shoes",
    description: "Step up your style",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600",
    slug: "shoes"
  }
])

const newArrivals = ref([
  {
    id: 1,
    name: "Elegant Dress",
    price: 120,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
    rating: 4.5
  },
  {
    id: 2,
    name: "Classic Shirt",
    price: 80,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    rating: 4.8
  },
  {
    id: 3,
    name: "Designer Bag",
    price: 200,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    rating: 4.7
  },
  {
    id: 4,
    name: "Summer Sandals",
    price: 60,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    rating: 4.3
  }
  // Add more products as needed
])

// Auto-rotate banner
let bannerInterval = null

// Computed properties
const getCategoriesGridClass = () => {
  if (isMobileDevice.value) return 'grid-cols-2'
  if (isTabletDevice.value) return 'grid-cols-2 md:grid-cols-3'
  return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
}

const getCategoryCardClass = (index) => {
  const baseClass = 'aspect-square'
  if (isMobileDevice.value) {
    return `${baseClass} ${index < 2 ? 'h-32 sm:h-40' : 'h-28 sm:h-36'}`
  }
  if (isTabletDevice.value) {
    return `${baseClass} h-48 md:h-56`
  }
  return `${baseClass} h-56 lg:h-64 xl:h-72`
}

const getProductsGridClass = () => {
  if (isTabletDevice.value) return 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'
  return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8'
}

const getProductsPerRow = () => {
  if (isXl.value) return 5
  if (isLg.value) return 4
  if (isMd.value) return 3
  return 2
}

// Methods
const setCurrentBanner = (index) => {
  currentBannerIndex.value = index
  resetBannerInterval()
}

const nextBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value + 1) % heroBanners.value.length
  resetBannerInterval()
}

const prevBanner = () => {
  currentBannerIndex.value = currentBannerIndex.value === 0 
    ? heroBanners.value.length - 1 
    : currentBannerIndex.value - 1
  resetBannerInterval()
}

const startBannerInterval = () => {
  bannerInterval = setInterval(() => {
    nextBanner()
  }, 5000)
}

const resetBannerInterval = () => {
  if (bannerInterval) {
    clearInterval(bannerInterval)
  }
  startBannerInterval()
}

const exploreCategory = (category) => {
  router.push(`/shop?category=${category.slug}`)
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
  if (productsCarousel.value) {
    const scrollWidth = productsCarousel.value.scrollWidth
    const clientWidth = productsCarousel.value.clientWidth
    const scrollLeft = productsCarousel.value.scrollLeft
    
    const totalSlides = Math.ceil(newArrivals.value.length / 3)
    currentScrollIndex.value = Math.floor((scrollLeft / (scrollWidth - clientWidth)) * (totalSlides - 1))
  }
}

const onSwipe = (event) => {
  // Handle swipe gestures for mobile
  if (event.direction === 'left') {
    nextBanner()
  } else if (event.direction === 'right') {
    prevBanner()
  }
}

// Lifecycle
onMounted(() => {
  startBannerInterval()
})

onUnmounted(() => {
  if (bannerInterval) {
    clearInterval(bannerInterval)
  }
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.hero-slide {
  will-change: transform, opacity;
}

.hero-nav-btn {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hero-section:hover .hero-nav-btn {
  opacity: 1;
}

.category-card {
  will-change: transform;
}

.products-carousel {
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.products-carousel::-webkit-scrollbar {
  display: none;
}

.product-card-mobile {
  scroll-snap-align: start;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Mobile optimizations */
@media (max-width: 767px) {
  .hero-title {
    font-size: clamp(1.5rem, 5vw, 2rem);
  }
  
  .hero-subtitle {
    font-size: clamp(0.875rem, 3vw, 1rem);
  }
}

/* Tablet optimizations */
@media (min-width: 768px) and (max-width: 1023px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop optimizations */
@media (min-width: 1024px) {
  .hero-content {
    max-width: 50%;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hero-slide,
  .category-card,
  .product-card {
    transition: none;
  }
  
  .category-card:hover {
    transform: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .hero-overlay,
  .category-overlay {
    background: rgba(0, 0, 0, 0.8);
  }
}
</style>