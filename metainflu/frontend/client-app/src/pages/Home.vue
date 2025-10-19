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
      <section class="hero-banner" v-touch:swipe.left="nextHeroBanner" v-touch:swipe.right="prevHeroBanner">
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
const categoryTabs = ['Limited', 'Recommended', 'New in', 'Trendy']

// Hero banners
const heroBanners = ref([
  {
    title: 'Summer 2024 Best Collection',
    subtitle: 'Available online and in store',
    cta: 'View shop →',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'
  },
  {
    title: 'New Winter Collection',
    subtitle: 'Cozy and stylish pieces',
    cta: 'Explore →',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80'
  },
  {
    title: 'Street Style Essentials',
    subtitle: 'Urban fashion redefined',
    cta: 'Shop now →',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'
  }
])

// Featured collections
const featuredCollections = ref([
  {
    name: 'Minimalist Basics',
    description: 'Clean lines, neutral colors',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80'
  },
  {
    name: 'Urban Street',
    description: 'Bold and contemporary',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80'
  }
])

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
          rating: 4.8,
          reviews: Math.floor(Math.random() * 500) + 50
        })
      })
    } else {
      allVariants.push({
        ...product,
        id: product._id,
        rating: 4.8,
        reviews: Math.floor(Math.random() * 500) + 50
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
  bannerInterval.value = setInterval(() => {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % heroBanners.value.length
  }, 5000)
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
  console.log('Swipe detected:', event)
}

// Fetch products
const fetchProducts = async () => {
  try {
    products.value = await productService.getProducts()
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}

// Lifecycle hooks
onMounted(async () => {
  await fetchProducts()
  startBannerRotation()
})

onUnmounted(() => {
  stopBannerRotation()
})
</script>

<style scoped>
/* styles unchanged for brevity */
</style>