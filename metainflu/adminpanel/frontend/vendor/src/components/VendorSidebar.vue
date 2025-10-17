<template>
  <aside class="vendor-sidebar" :class="sidebarClasses">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <div class="logo-container">
        <router-link to="/" class="logo-link">
          <img src="/images/aura-vendor-logo.svg" alt="Aura Vendor" class="logo" />
          <span class="logo-text">Aura Vendor</span>
        </router-link>
      </div>
      
      <!-- Mobile Close Button -->
      <button 
        v-if="isMobile" 
        @click="$emit('close-mobile')"
        class="mobile-close-btn"
      >
        <XMarkIcon class="h-6 w-6" />
      </button>
    </div>
    
    <!-- Vendor Profile Card -->
    <div class="vendor-profile-card">
      <div class="profile-avatar">
        <img :src="vendorProfile.avatar" :alt="vendorProfile.name" class="avatar-img" />
        <div class="status-indicator" :class="vendorProfile.status"></div>
      </div>
      <div class="profile-info">
        <h3 class="vendor-name">{{ vendorProfile.name }}</h3>
        <p class="vendor-business">{{ vendorProfile.businessName }}</p>
        <div class="rating-container">
          <div class="stars">
            <StarIcon v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= vendorProfile.rating }" />
          </div>
          <span class="rating-text">{{ vendorProfile.rating }}/5</span>
        </div>
      </div>
    </div>
    
    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <!-- Main Navigation -->
      <div class="nav-section">
        <h4 class="nav-section-title">Dashboard</h4>
        <ul class="nav-list">
          <li v-for="item in mainNavigation" :key="item.name" class="nav-item">
            <router-link 
              :to="item.to" 
              class="nav-link group"
              :class="{ 'active': isActiveRoute(item.to) }"
              @click="handleNavClick"
            >
              <component :is="item.icon" class="nav-icon" />
              <span class="nav-text">{{ item.label }}</span>
              <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      
      <!-- Products Section -->
      <div class="nav-section">
        <h4 class="nav-section-title">Products</h4>
        <ul class="nav-list">
          <li v-for="item in productNavigation" :key="item.name" class="nav-item">
            <router-link 
              :to="item.to" 
              class="nav-link group"
              :class="{ 'active': isActiveRoute(item.to) }"
              @click="handleNavClick"
            >
              <component :is="item.icon" class="nav-icon" />
              <span class="nav-text">{{ item.label }}</span>
              <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      
      <!-- Orders Section -->
      <div class="nav-section">
        <h4 class="nav-section-title">Orders & Sales</h4>
        <ul class="nav-list">
          <li v-for="item in orderNavigation" :key="item.name" class="nav-item">
            <router-link 
              :to="item.to" 
              class="nav-link group"
              :class="{ 'active': isActiveRoute(item.to) }"
              @click="handleNavClick"
            >
              <component :is="item.icon" class="nav-icon" />
              <span class="nav-text">{{ item.label }}</span>
              <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      
      <!-- Tools Section -->
      <div class="nav-section">
        <h4 class="nav-section-title">Tools</h4>
        <ul class="nav-list">
          <li v-for="item in toolsNavigation" :key="item.name" class="nav-item">
            <router-link 
              :to="item.to" 
              class="nav-link group"
              :class="{ 'active': isActiveRoute(item.to) }"
              @click="handleNavClick"
            >
              <component :is="item.icon" class="nav-icon" />
              <span class="nav-text">{{ item.label }}</span>
              <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    
    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-value">₹{{ formatCurrency(monthlyRevenue) }}</div>
        <div class="stat-label">This Month</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ pendingOrders }}</div>
        <div class="stat-label">Pending Orders</div>
      </div>
    </div>
    
    <!-- Sidebar Footer -->
    <div class="sidebar-footer">
      <div class="help-section">
        <button class="help-btn" @click="openHelp">
          <QuestionMarkCircleIcon class="h-5 w-5" />
          <span>Need Help?</span>
        </button>
      </div>
      
      <div class="logout-section">
        <button class="logout-btn" @click="logout">
          <ArrowRightOnRectangleIcon class="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  XMarkIcon,
  StarIcon,
  HomeIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  EyeIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  UserIcon
} from '@heroicons/vue/24/outline';

export default {
  name: 'VendorSidebar',
  components: {
    XMarkIcon,
    StarIcon,
    HomeIcon,
    ChartBarIcon,
    ShoppingBagIcon,
    PlusCircleIcon,
    PencilSquareIcon,
    ClipboardDocumentListIcon,
    DocumentTextIcon,
    EyeIcon,
    CogIcon,
    QuestionMarkCircleIcon,
    ArrowRightOnRectangleIcon,
    BellIcon,
    UserIcon
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close-mobile'],
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();
    
    // Vendor profile data
    const vendorProfile = ref({
      name: 'Rajesh Kumar',
      businessName: 'Kumar Electronics',
      avatar: '/images/vendor-avatar.jpg',
      rating: 4.5,
      status: 'online' // online, offline, away
    });
    
    // Stats data
    const monthlyRevenue = ref(125000);
    const pendingOrders = ref(23);
    
    // Navigation items
    const mainNavigation = ref([
      {
        name: 'dashboard',
        label: 'Dashboard',
        to: { name: 'Dashboard' },
        icon: 'HomeIcon'
      },
      {
        name: 'analytics',
        label: 'Analytics',
        to: { name: 'Analytics' },
        icon: 'ChartBarIcon'
      }
    ]);
    
    const productNavigation = ref([
      {
        name: 'manage-products',
        label: 'Manage Products',
        to: { name: 'ManageProducts' },
        icon: 'ShoppingBagIcon'
      },
      {
        name: 'add-product',
        label: 'Add Product',
        to: { name: 'AddProduct' },
        icon: 'PlusCircleIcon'
      }
    ]);
    
    const orderNavigation = ref([
      {
        name: 'orders',
        label: 'Orders',
        to: { name: 'OrderFulfillment' },
        icon: 'ClipboardDocumentListIcon',
        badge: pendingOrders.value > 0 ? pendingOrders.value.toString() : null
      },
      {
        name: 'invoices',
        label: 'Invoices',
        to: { name: 'Invoices' },
        icon: 'DocumentTextIcon'
      },
      {
        name: 'sales',
        label: 'Sales Report',
        to: { name: 'ViewSales' },
        icon: 'EyeIcon'
      }
    ]);
    
    const toolsNavigation = ref([
      {
        name: 'account',
        label: 'Account Settings',
        to: { name: 'Account' },
        icon: 'UserIcon'
      },
      {
        name: 'notifications',
        label: 'Notifications',
        to: { name: 'Notifications' },
        icon: 'BellIcon',
        badge: '3'
      }
    ]);
    
    // Computed properties
    const sidebarClasses = computed(() => {
      return {
        'mobile-sidebar': props.isMobile,
        'desktop-sidebar': !props.isMobile
      };
    });
    
    // Methods
    const isActiveRoute = (routeTo) => {
      if (routeTo.name) {
        return route.name === routeTo.name;
      }
      return route.path === routeTo.path || route.path === routeTo;
    };
    
    const handleNavClick = () => {
      if (props.isMobile) {
        emit('close-mobile');
      }
    };
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-IN').format(value);
    };
    
    const openHelp = () => {
      // Open help center or support chat
      window.open('/help', '_blank');
    };
    
    const logout = async () => {
      try {
        // Handle logout logic
        await authService.logout();
        router.push({ name: 'Login' });
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
    
    // Load vendor data on mount
    onMounted(async () => {
      try {
        // Load vendor profile and stats
        // const profile = await vendorService.getProfile();
        // vendorProfile.value = profile;
      } catch (error) {
        console.error('Failed to load vendor data:', error);
      }
    });
    
    return {
      vendorProfile,
      monthlyRevenue,
      pendingOrders,
      mainNavigation,
      productNavigation,
      orderNavigation,
      toolsNavigation,
      sidebarClasses,
      isActiveRoute,
      handleNavClick,
      formatCurrency,
      openHelp,
      logout
    };
  }
};
</script>

<style scoped>
.vendor-sidebar {
  @apply bg-white border-r border-gray-200 flex flex-col h-full;
  width: 280px;
}

.mobile-sidebar {
  @apply fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out;
}

.desktop-sidebar {
  @apply relative;
}

/* Sidebar Header */
.sidebar-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.logo-container {
  @apply flex-1;
}

.logo-link {
  @apply flex items-center space-x-3 no-underline;
}

.logo {
  @apply h-8 w-8;
}

.logo-text {
  @apply text-xl font-bold text-gray-900;
}

.mobile-close-btn {
  @apply p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md;
}

/* Vendor Profile Card */
.vendor-profile-card {
  @apply p-6 border-b border-gray-200;
}

.profile-avatar {
  @apply relative mb-3;
}

.avatar-img {
  @apply w-16 h-16 rounded-full object-cover border-2 border-gray-200;
}

.status-indicator {
  @apply absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white;
}

.status-indicator.online {
  @apply bg-green-500;
}

.status-indicator.away {
  @apply bg-yellow-500;
}

.status-indicator.offline {
  @apply bg-gray-400;
}

.vendor-name {
  @apply text-lg font-semibold text-gray-900;
}

.vendor-business {
  @apply text-sm text-gray-600 mb-2;
}

.rating-container {
  @apply flex items-center space-x-2;
}

.stars {
  @apply flex space-x-1;
}

.star {
  @apply h-4 w-4 text-gray-300;
}

.star.filled {
  @apply text-yellow-400;
}

.rating-text {
  @apply text-sm text-gray-600;
}

/* Navigation */
.sidebar-nav {
  @apply flex-1 overflow-y-auto py-4;
}

.nav-section {
  @apply mb-6;
}

.nav-section-title {
  @apply px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3;
}

.nav-list {
  @apply space-y-1;
}

.nav-item {
  @apply px-6;
}

.nav-link {
  @apply flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-200;
}

.nav-link.active {
  @apply bg-blue-50 text-blue-700 border-r-2 border-blue-600;
}

.nav-icon {
  @apply h-5 w-5 mr-3 text-gray-500;
}

.nav-link:hover .nav-icon {
  color: theme('colors.blue.500');
}

.nav-link.active .nav-icon {
  @apply text-blue-600;
}

.nav-text {
  @apply flex-1;
}

.nav-badge {
  @apply bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full;
}

.nav-link.active .nav-badge {
  @apply bg-blue-100 text-blue-800;
}

/* Quick Stats */
.quick-stats {
  @apply p-6 border-t border-gray-200 bg-gray-50;
}

.stat-item {
  @apply mb-3 last:mb-0;
}

.stat-value {
  @apply text-lg font-bold text-gray-900;
}

.stat-label {
  @apply text-xs text-gray-600;
}

/* Sidebar Footer */
.sidebar-footer {
  @apply p-6 border-t border-gray-200 space-y-3;
}

.help-btn,
.logout-btn {
  @apply w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200;
}

.logout-btn {
  @apply text-red-600 hover:bg-red-50;
}

/* Mobile Responsiveness */
@media (max-width: 767px) {
  .vendor-sidebar {
    @apply shadow-2xl;
  }
  
  .nav-section-title {
    @apply px-4;
  }
  
  .nav-item {
    @apply px-4;
  }
}

/* Scrollbar Styling */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>