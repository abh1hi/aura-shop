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
        <div :class="['tab-item', { active: activeTab === 0 }]" @click="setActiveTab(0)">Limited</div>
        <div :class="['tab-item', { active: activeTab === 1 }]" @click="setActiveTab(1)">Recommended</div>
        <div :class="['tab-item', { active: activeTab === 2 }]" @click="setActiveTab(2)">New in</div>
        <div :class="['tab-item', { active: activeTab === 3 }]" @click="setActiveTab(3)">Trendy</div>
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
            <span v-for="(banner, index) in heroBanners" :key="index" :class="['dot', { active: currentBannerIndex === index }]" @click="setCurrentBanner(index)"></span>
          </div>
        </div>
      </section>

      <!-- Sections by Tab -->
      <LimitedSection v-if="activeTab === 0" :products="limitedProducts" />
      <RecommendedSection v-if="activeTab === 1" :products="recommendedProducts" />
      <NewInSection v-if="activeTab === 2" :products="newInProducts" />
      <TrendySection v-if="activeTab === 3" :products="trendyProducts" />
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-navigation">
      <router-link to="/" class="nav-item active"><i class="fas fa-home"></i><span>Home</span></router-link>
      <router-link to="/shop" class="nav-item"><i class="fas fa-search"></i><span>Shop</span></router-link>
      <router-link to="/cart" class="nav-item"><i class="fas fa-shopping-bag"></i><span>Cart</span></router-link>
      <router-link to="/account" class="nav-item"><i class="fas fa-user"></i><span>Account</span></router-link>
    </nav>

    <!-- Mobile Menu Overlay -->
    <transition name="slide-menu">
      <div v-if="showMenu" class="mobile-menu-overlay" @click="closeMenu">
        <div class="mobile-menu" @click.stop>
          <div class="menu-header"><h3>Menu</h3><button @click="closeMenu"><i class="fas fa-times"></i></button></div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import productService from '../services/productService'
import LimitedSection from '../components/LimitedSection.vue'
import RecommendedSection from '../components/RecommendedSection.vue'
import NewInSection from '../components/NewInSection.vue'
import TrendySection from '../components/TrendySection.vue'

const router = useRouter()

const products = ref([])
const activeTab = ref(0)
const currentBannerIndex = ref(0)
const showMenu = ref(false)
const showSearch = ref(false)
const cartItems = ref(0)

// Hero banners
const heroBanners = ref([
  { title: 'Summer 2024 Best Collection', subtitle: 'Available online and in store', cta: 'View shop →', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80' },
  { title: 'New Winter Collection', subtitle: 'Cozy and stylish pieces', cta: 'Explore →', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80' },
  { title: 'Street Style Essentials', subtitle: 'Urban fashion redefined', cta: 'Shop now →', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80' }
])

const currentHeroBanner = computed(() => heroBanners.value[currentBannerIndex.value])

const categorized = computed(() => {
  const arr = products.value
  return {
    limited: arr.filter((_, i) => i % 4 === 0),
    recommended: arr.filter((_, i) => i % 4 === 1),
    newIn: arr.filter((_, i) => i % 4 === 2),
    trendy: arr.filter((_, i) => i % 4 === 3)
  }
})

const limitedProducts = computed(() => flattenVariants(categorized.value.limited))
const recommendedProducts = computed(() => flattenVariants(categorized.value.recommended))
const newInProducts = computed(() => flattenVariants(categorized.value.newIn))
const trendyProducts = computed(() => flattenVariants(categorized.value.trendy))

function flattenVariants(list){
  const res = []
  list.forEach(p => {
    if (p.variants?.length){
      p.variants.forEach(v => res.push({
        _id: p._id,
        id: `${p._id}-${v.sku || v._id}`,
        name: p.name,
        price: v.price,
        images: v.images?.length ? [{ url: v.images[0] }] : p.images,
        key: `${p._id}-${v.sku || v._id}`
      }))
    } else {
      res.push({ ...p, id: p._id, key: p._id })
    }
  })
  return res
}

const setActiveTab = (i) => { activeTab.value = i }
const setCurrentBanner = (i) => { currentBannerIndex.value = i }
const nextHeroBanner = () => { currentBannerIndex.value = (currentBannerIndex.value + 1) % heroBanners.value.length }
const prevHeroBanner = () => { currentBannerIndex.value = (currentBannerIndex.value + heroBanners.value.length - 1) % heroBanners.value.length }

const toggleMenu = () => showMenu.value = !showMenu.value
const closeMenu = () => showMenu.value = false
const toggleSearch = () => showSearch.value = !showSearch.value

const fetchProducts = async () => {
  try { products.value = await productService.getProducts() } catch(e){ console.error(e) }
}

let bannerInterval
onMounted(async () => { await fetchProducts(); bannerInterval = setInterval(nextHeroBanner, 5000) })
onUnmounted(() => { if (bannerInterval) clearInterval(bannerInterval) })
</script>

<style scoped>
/* keep existing styles below */
</style>