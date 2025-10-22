<template>
  <div class="account-page">
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
        <!-- Loading / Error States -->
        <div v-if="isLoading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Loading your details...</p>
        </div>
        <div v-else-if="error" class="error-state">
          <i class="fas fa-exclamation-circle"></i>
          <p>{{ error }}</p>
        </div>

        <!-- Account Options Grid -->
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'
import { globalState } from '../main.js'

const router = useRouter()

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

// Mock check for login status
onMounted(() => {
  if (!globalState.isLoggedIn) {
    router.push({ name: 'Login' })
  }
})
</script>

<style scoped>
/* Page Styles */
.account-page {
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.account-header {
  background-color: var(--background);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.account-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}
.profile-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.profile-name {
  font-weight: 500;
  color: var(--text-secondary);
}
.avatar {
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

/* Main Content */
.main-content {
  padding: 2rem 0;
}

/* States */
.loading-state, .error-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-secondary);
}
.loading-state i, .error-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}
.error-state {
  color: #d9534f;
}

/* Account Section */
.account-section {
  margin-bottom: 2rem;
}
.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

/* Options Grid */
.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.option-card {
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
.option-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}
.option-card i {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: var(--primary);
}
.option-card span {
  font-weight: 500;
}

@media (max-width: 768px) {
  .header-title {
    font-size: 1.25rem;
  }
  .profile-name {
    display: none;
  }
  .options-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
