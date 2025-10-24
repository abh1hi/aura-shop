<template>
  <div class="account-page" :class="{ 'mobile-first': isMobile, 'desktop-view': !isMobile }">
    <!-- Mobile UI -->
    <div v-if="isMobile">
      <header class="account-header">
        <div class="container">
          <h1 class="header-title">Your Account</h1>
          <div class="profile-info">
            <span class="profile-name">Hello, {{ profileData.name }}</span>
            <div class="avatar">{{ profileInitials }}</div>
          </div>
        </div>
      </header>

      <main class="main-content">
        <div class="container">
          <div v-if="isLoading" class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading your details...</p>
          </div>
          <div v-else-if="error" class="error-state">
            <i class="fas fa-exclamation-circle"></i>
            <p>{{ error }}</p>
          </div>

          <div v-else>
            <section class="account-section">
              <h2 class="section-title">Your Orders</h2>
              <div class="options-grid">
                <router-link to="/orders" class="option-card">
                  <i class="fas fa-box-open"></i>
                  <span>Track & Manage Orders</span>
                </router-link>
                <router-link to="/returns" class="option-card">
                  <i class="fas fa-undo-alt"></i>
                  <span>Returns & Exchanges</span>
                </router-link>
              </div>
            </section>

            <section class="account-section">
              <h2 class="section-title">Account Settings</h2>
              <div class="options-grid">
                <router-link to="/profile" class="option-card">
                  <i class="fas fa-user-edit"></i>
                  <span>Edit Profile</span>
                </router-link>
                <router-link to="/addresses" class="option-card">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>Shipping Addresses</span>
                </router-link>
                <router-link to="/payment-methods" class="option-card">
                  <i class="fas fa-credit-card"></i>
                  <span>Payment Methods</span>
                </router-link>
                <a href="#" @click.prevent="handleLogout" class="option-card">
                  <i class="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </a>
              </div>
            </section>

            <section class="account-section">
              <h2 class="section-title">Customer Service</h2>
              <div class="options-grid">
                <router-link to="/contact" class="option-card">
                  <i class="fas fa-headset"></i>
                  <span>Contact Us</span>
                </router-link>
                <router-link to="/faq" class="option-card">
                  <i class="fas fa-question-circle"></i>
                  <span>FAQ</span>
                </router-link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>

    <!-- Desktop UI -->
    <div v-else class="desktop-account-page">
      <div class="desktop-container">
        <aside class="desktop-sidebar">
          <div class="profile-summary">
            <div class="avatar-large">{{ profileInitials }}</div>
            <h3>{{ profileData.name }}</h3>
            <p>{{ profileData.email }}</p>
          </div>
          <nav class="desktop-nav">
            <router-link to="/orders" class="nav-item" active-class="active">
              <i class="fas fa-box-open"></i>
              <span>My Orders</span>
            </router-link>
            <router-link to="/profile" class="nav-item" active-class="active">
              <i class="fas fa-user-edit"></i>
              <span>Edit Profile</span>
            </router-link>
            <router-link to="/addresses" class="nav-item" active-class="active">
              <i class="fas fa-map-marker-alt"></i>
              <span>Shipping Addresses</span>
            </router-link>
            <router-link to="/payment-methods" class="nav-item" active-class="active">
              <i class="fas fa-credit-card"></i>
              <span>Payment Methods</span>
            </router-link>
            <router-link to="/contact" class="nav-item" active-class="active">
              <i class="fas fa-headset"></i>
              <span>Contact Us</span>
            </router-link>
            <a href="#" @click.prevent="handleLogout" class="nav-item">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </a>
          </nav>
        </aside>

        <main class="desktop-main-content">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'
import { globalState } from '../main.js'

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

const isLoading = ref(false)
const error = ref(null)

const profileData = ref({
  name: globalState.user ? globalState.user.name : 'Guest',
  email: globalState.user ? globalState.user.email : 'guest@example.com',
})

const profileInitials = computed(() => {
  const name = profileData.value.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const handleLogout = () => {
  authService.logout()
  globalState.isLoggedIn = false
  globalState.user = null
  router.push({ name: 'Login' })
}

onMounted(() => {
  if (!globalState.isLoggedIn) {
    router.push({ name: 'Login' })
  }
})
</script>

<style scoped>
/* Base Styles */
.account-page {
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* Mobile-First Design */
.mobile-first .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.mobile-first .account-header {
  background-color: var(--background);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.mobile-first .account-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-first .header-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.mobile-first .profile-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-first .profile-name {
  display: none;
}

.mobile-first .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary);
  color: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.mobile-first .main-content {
  padding: 2rem 0;
}

.mobile-first .loading-state, .mobile-first .error-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-secondary);
}

.mobile-first .loading-state i, .mobile-first .error-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.mobile-first .error-state {
  color: #d9534f;
}

.mobile-first .account-section {
  margin-bottom: 2rem;
}

.mobile-first .section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.mobile-first .options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.mobile-first .option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--background);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
  text-decoration: none;
  color: var(--text-primary);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.mobile-first .option-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.mobile-first .option-card i {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

.mobile-first .option-card span {
  font-weight: 500;
}

/* Desktop Styles */
.desktop-account-page {
  padding: 2rem;
}

.desktop-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.desktop-sidebar {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.profile-summary {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary);
  color: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 2rem;
  margin: 0 auto 1rem;
}

.profile-summary h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.profile-summary p {
  color: #718096;
}

.desktop-nav {
  display: flex;
  flex-direction: column;
}

.desktop-nav .nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  color: #4a5568;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.desktop-nav .nav-item.active {
  background-color: #f0f2f5;
  color: #000;
  font-weight: 600;
}

.desktop-nav .nav-item:hover {
  background-color: #f7fafc;
}

.desktop-main-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
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