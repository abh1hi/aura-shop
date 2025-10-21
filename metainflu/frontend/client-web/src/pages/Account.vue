<template>
  <div class="account-page mobile-first">
    <!-- Mobile Header -->
    <header class="mobile-header lg:hidden">
      <div class="header-content">
        <button class="icon-btn" @click="goBack" aria-label="Back">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="page-title">My Account</h1>
        <button class="icon-btn" @click="toggleMenu" aria-label="Menu">
          <i class="fas fa-ellipsis-v"></i>
        </button>
      </div>
    </header>

    <!-- Desktop Page Header -->
    <PageHeader class="hidden lg:block" title="My Account" />

    <main class="main-content">
      <div class="container">
        <!-- Loading / Error States -->
        <div v-if="isLoading" class="state-card">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Loading your account...</p>
        </div>
        <div v-else-if="error" class="state-card error">
          <i class="fas fa-triangle-exclamation"></i>
          <p>{{ error }}</p>
        </div>

        <!-- Content -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <!-- Sidebar (Desktop) / Tabs (Mobile) -->
          <aside class="lg:col-span-1">
            <!-- Mobile Tabs -->
            <div class="lg:hidden mb-4">
              <div class="tabs">
                <button :class="['tab', {active: activeTab==='overview'}]" @click="activeTab='overview'">
                  <i class="fas fa-user-circle"></i>
                  <span>Overview</span>
                </button>
                <button :class="['tab', {active: activeTab==='orders'}]" @click="activeTab='orders'">
                  <i class="fas fa-box"></i>
                  <span>Orders</span>
                </button>
                <button :class="['tab', {active: activeTab==='addresses'}]" @click="activeTab='addresses'">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>Addresses</span>
                </button>
              </div>
            </div>

            <!-- Desktop Sidebar -->
            <div class="sidebar hidden lg:block">
              <div class="profile-card">
                <div class="avatar">
                  <span>{{ profileInitials }}</span>
                </div>
                <div class="profile-meta">
                  <h3>{{ profileData.name }}</h3>
                  <p>{{ profileData.email }}</p>
                </div>
                <router-link to="/account" class="profile-link">
                  <i class="fas fa-pen"></i>
                  Edit profile
                </router-link>
              </div>

              <nav class="account-nav">
                <button :class="['nav-item', {active: activeTab==='overview'}]" @click="activeTab='overview'">
                  <i class="fas fa-user"></i>
                  <span>Account overview</span>
                </button>
                <button :class="['nav-item', {active: activeTab==='orders'}]" @click="activeTab='orders'">
                  <i class="fas fa-box"></i>
                  <span>Order history</span>
                </button>
                <button :class="['nav-item', {active: activeTab==='addresses'}]" @click="activeTab='addresses'">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>Addresses</span>
                </button>
                <button class="nav-item danger" @click="handleLogout">
                  <i class="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          <!-- Main Panels -->
          <section class="lg:col-span-3">
            <transition name="fade" mode="out-in">
              <div :key="activeTab">
                <!-- Overview -->
                <div v-if="activeTab==='overview'" class="grid gap-6 md:grid-cols-2">
                  <div class="card">
                    <div class="card-header">
                      <h3>Profile</h3>
                    </div>
                    <div class="card-body space-y-3">
                      <div>
                        <p class="label">Name</p>
                        <p class="value">{{ profileData.name }}</p>
                      </div>
                      <div>
                        <p class="label">Email</p>
                        <p class="value">{{ profileData.email }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="card">
                    <div class="card-header">
                      <h3>Update password</h3>
                    </div>
                    <div class="card-body">
                      <form @submit.prevent="updatePassword" class="space-y-4">
                        <div>
                          <label for="new-password" class="sr-only">New password</label>
                          <input id="new-password" type="password" v-model="newPassword" class="input" placeholder="New password" />
                        </div>
                        <button type="submit" class="btn-primary w-full md:w-auto">
                          <i class="fas fa-key"></i>
                          <span>Update</span>
                        </button>
                      </form>
                    </div>
                  </div>

                  <div class="card md:col-span-2">
                    <div class="card-header">
                      <h3>Quick actions</h3>
                    </div>
                    <div class="quick-actions">
                      <router-link to="/orders" class="qa-item">
                        <i class="fas fa-receipt"></i>
                        <span>Track orders</span>
                      </router-link>
                      <router-link to="/returns" class="qa-item">
                        <i class="fas fa-undo"></i>
                        <span>Returns</span>
                      </router-link>
                      <router-link to="/support" class="qa-item">
                        <i class="fas fa-headset"></i>
                        <span>Support</span>
                      </router-link>
                      <router-link to="/settings" class="qa-item">
                        <i class="fas fa-sliders-h"></i>
                        <span>Settings</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Orders -->
                <div v-else-if="activeTab==='orders'">
                  <div class="card">
                    <div class="card-header between">
                      <h3>Order history</h3>
                      <router-link to="/shop" class="link">Continue shopping</router-link>
                    </div>

                    <div v-if="orders.length===0" class="empty">
                      <i class="fas fa-box-open"></i>
                      <p>No orders yet</p>
                      <router-link to="/shop" class="btn-primary">Start shopping</router-link>
                    </div>

                    <div v-else class="orders">
                      <div v-for="order in orders" :key="order._id" class="order-row">
                        <div class="row-top">
                          <div>
                            <p class="muted">Order</p>
                            <p class="strong">#{{ order._id.slice(-6) }}</p>
                          </div>
                          <div>
                            <p class="muted">Date</p>
                            <p class="strong">{{ formatDate(order.createdAt) }}</p>
                          </div>
                          <div>
                            <p class="muted">Total</p>
                            <p class="strong">${{ order.total.toFixed(2) }}</p>
                          </div>
                          <span :class="['status', order.status]">{{ order.status }}</span>
                        </div>
                        <div class="row-bottom">
                          <router-link :to="{ name: 'OrderPlaced', query: { orderId: order._id } }" class="link">View details</router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Addresses -->
                <div v-else-if="activeTab==='addresses'">
                  <div class="card">
                    <div class="card-header between">
                      <h3>Addresses</h3>
                      <button class="btn-secondary" @click="addAddress"><i class="fas fa-plus"></i>Add new</button>
                    </div>
                    <div class="addresses">
                      <div class="address-card">
                        <p class="label">Default shipping</p>
                        <p class="value">Add your default shipping address</p>
                        <button class="link" @click="addAddress">Set address</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </section>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation (Mobile) -->
    <nav class="bottom-navigation lg:hidden">
      <router-link to="/" class="nav-item"><i class="fas fa-home"></i><span>Home</span></router-link>
      <router-link to="/shop" class="nav-item"><i class="fas fa-search"></i><span>Shop</span></router-link>
      <router-link to="/cart" class="nav-item"><i class="fas fa-shopping-bag"></i><span>Cart</span></router-link>
      <router-link to="/account" class="nav-item active"><i class="fas fa-user"></i><span>Account</span></router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import orderService from '../services/orderService'
import authService from '../services/authService'
import { globalState } from '../main.js'
import PageHeader from '../components/PageHeader.vue'

const router = useRouter()

const activeTab = ref('overview')
const isLoading = ref(true)
const error = ref(null)
const orders = ref([])
const newPassword = ref('')

const profileData = ref({
  name: globalState.user ? globalState.user.name : 'Guest User',
  email: globalState.user ? globalState.user.email : 'guest@example.com',
})

const profileInitials = computed(() => {
  const parts = (profileData.value.name || '').split(' ').filter(Boolean)
  return parts.slice(0,2).map(p => p[0]?.toUpperCase()).join('') || 'AU'
})

const fetchAccountData = async () => {
  isLoading.value = true
  error.value = null
  if (!globalState.isLoggedIn) {
    router.push({ name: 'Login' })
    return
  }
  try {
    orders.value = await orderService.getMyOrders()
  } catch (err) {
    error.value = err.message || 'Failed to load account data.'
  } finally {
    isLoading.value = false
  }
}

const handleLogout = () => {
  authService.logout()
  globalState.isLoggedIn = false
  globalState.user = null
  router.push({ name: 'Login' })
}

const updatePassword = async () => {
  if (!newPassword.value || newPassword.value.length < 6) {
    alert('Password must be at least 6 characters')
    return
  }
  // TODO: integrate password update API
  alert('Password updated (placeholder).')
  newPassword.value = ''
}

const addAddress = () => {
  alert('Address form coming soon')
}

const formatDate = (dateString) => {
  const opts = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, opts)
}

const toggleMenu = () => {}
const goBack = () => router.go(-1)

onMounted(fetchAccountData)
</script>

<style scoped>
.account-page{min-height:100vh;background:#f8fafc;padding-bottom:80px}
/* Mobile header */
.mobile-header{position:fixed;top:0;left:0;right:0;background:#fff;z-index:50;box-shadow:0 2px 10px rgba(0,0,0,.05)}
.header-content{display:flex;align-items:center;justify-content:space-between;padding:1rem}
.icon-btn{background:transparent;border:none;font-size:1.125rem;color:#1f2937;padding:.5rem;border-radius:.5rem}
.icon-btn:hover{background:#f3f4f6}
.page-title{font-weight:700;color:#111827}

/* Main */
.main-content{margin-top:70px;padding:1rem}
.container{max-width:1200px;margin:0 auto}

/* States */
.state-card{background:#fff;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,.05);padding:2rem;text-align:center;color:#64748b;display:grid;place-items:center;gap:.5rem}
.state-card i{color:#8b5cf6}
.state-card.error{color:#ef4444}

/* Tabs (mobile) */
.tabs{display:flex;gap:.5rem;background:#fff;border-radius:12px;padding:.5rem;box-shadow:0 4px 20px rgba(0,0,0,.05)}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:.25rem;border:none;background:transparent;padding:.75rem .5rem;border-radius:10px;color:#6b7280;font-weight:600}
.tab.active{background:#f3f4f6;color:#1f2937}

/* Sidebar */
.sidebar{display:flex;flex-direction:column;gap:16px}
.profile-card{background:#fff;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,.05);padding:1.25rem;text-align:center}
.avatar{width:72px;height:72px;border-radius:9999px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.25rem;margin:0 auto .75rem}
.profile-meta h3{font-weight:700;color:#111827}
.profile-meta p{color:#64748b;font-size:.9rem}
.profile-link{display:inline-flex;align-items:center;gap:.5rem;margin-top:.75rem;color:#8b5cf6;text-decoration:none;font-weight:600}
.profile-link:hover{color:#7c3aed}

.account-nav{background:#fff;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,.05);overflow:hidden}
.nav-item{width:100%;display:flex;align-items:center;gap:.75rem;padding:1rem 1.25rem;border:none;background:transparent;color:#4b5563;font-weight:700;text-align:left;border-left:4px solid transparent}
.nav-item:hover{background:#f9fafb;color:#111827}
.nav-item.active{background:#f3f4f6;color:#8b5cf6;border-left-color:#8b5cf6}
.nav-item.danger{color:#ef4444}

/* Cards */
.card{background:#fff;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,.05);overflow:hidden}
.card-header{padding:1rem 1.25rem;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:.75rem}
.card-header.between{justify-content:space-between}
.card-header h3{font-weight:700;color:#0f172a}
.card-body{padding:1rem 1.25rem}
.label{font-size:.8rem;color:#94a3b8}
.value{font-weight:700;color:#111827}

/* Quick actions */
.quick-actions{display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem;padding:1rem 1.25rem}
.qa-item{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:1rem;border:2px solid #f1f5f9;border-radius:12px;text-decoration:none;color:#374151;font-weight:600;transition:.2s}
.qa-item:hover{border-color:#8b5cf6;color:#8b5cf6;transform:translateY(-2px)}

/* Orders */
.empty{display:grid;place-items:center;text-align:center;padding:2rem;color:#64748b;gap:.5rem}
.orders{display:flex;flex-direction:column;gap:1rem;padding:1rem 1.25rem}
.order-row{border:1px solid #f1f5f9;border-radius:12px;padding:1rem}
.row-top{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem;align-items:center}
.row-bottom{margin-top:.75rem;display:flex;justify-content:flex-end}
.status{padding:.25rem .5rem;border-radius:9999px;font-size:.75rem;font-weight:700;text-transform:capitalize;justify-self:end}
.status.pending{background:#fef3c7;color:#92400e}
.status.shipped{background:#dbeafe;color:#1e40af}
.status.delivered{background:#dcfce7;color:#166534}
.status.cancelled{background:#fee2e2;color:#991b1b}

/* Inputs & buttons */
.input{width:100%;padding:1rem;border:2px solid #e5e7eb;border-radius:12px;background:#fafafa;transition:.2s;font-size:1rem}
.input:focus{outline:none;border-color:#8b5cf6;background:#fff;box-shadow:0 0 0 3px rgba(139,92,246,.15)}
.btn-primary{display:inline-flex;align-items:center;gap:.5rem;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;border:none;border-radius:12px;padding:.85rem 1rem;font-weight:700;cursor:pointer;transition:.2s;text-decoration:none}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(139,92,246,.3)}
.btn-secondary{display:inline-flex;align-items:center;gap:.5rem;background:#f3f4f6;color:#111827;border:none;border-radius:12px;padding:.75rem 1rem;font-weight:700;cursor:pointer}
.link{color:#8b5cf6;text-decoration:none;font-weight:700}
.link:hover{color:#7c3aed}

/* Bottom nav */
.bottom-navigation{position:fixed;bottom:0;left:0;right:0;background:#fff;display:flex;padding:.75rem 0;box-shadow:0 -2px 10px rgba(0,0,0,.05);z-index:50}
.nav-item{flex:1;display:flex;flex-direction:column;align-items:center;color:#9ca3af;text-decoration:none}
.nav-item.active,.nav-item:hover{color:#111827}
.nav-item i{font-size:1.1rem;margin-bottom:.25rem}
.nav-item span{font-size:.7rem;font-weight:600}

/* Desktop adjustments */
@media(min-width:769px){.main-content{margin-top:0;padding:2rem}.quick-actions{grid-template-columns:repeat(4,1fr)}.row-top{grid-template-columns:repeat(5,minmax(0,1fr))}}

/* Transitions */
.fade-enter-active,.fade-leave-active{transition:opacity .25s ease}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
