<template>
  <header class="vendor-navbar">
    <div class="navbar-container">
      <!-- Left Section -->
      <div class="navbar-left">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" v-if="breadcrumbs.length > 1">
          <ol class="breadcrumb-list">
            <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
              <router-link 
                v-if="crumb.to && index < breadcrumbs.length - 1" 
                :to="crumb.to" 
                class="breadcrumb-link"
              >
                {{ crumb.text }}
              </router-link>
              <span v-else class="breadcrumb-current">{{ crumb.text }}</span>
              <ChevronRightIcon 
                v-if="index < breadcrumbs.length - 1" 
                class="breadcrumb-separator" 
              />
            </li>
          </ol>
        </nav>
        
        <!-- Page Title -->
        <h1 class="page-title" v-if="!breadcrumbs.length || breadcrumbs.length === 1">
          {{ pageTitle }}
        </h1>
      </div>
      
      <!-- Right Section -->
      <div class="navbar-right">
        <!-- Quick Actions -->
        <div class="quick-actions">
          <button 
            class="action-btn"
            @click="quickAddProduct"
            title="Quick Add Product"
          >
            <PlusIcon class="h-5 w-5" />
          </button>
          
          <button 
            class="action-btn"
            @click="openSearch"
            title="Search"
          >
            <MagnifyingGlassIcon class="h-5 w-5" />
          </button>
        </div>
        
        <!-- Notifications -->
        <div class="notifications-container">
          <button 
            class="notification-btn"
            @click="toggleNotifications"
            :class="{ 'has-notifications': unreadCount > 0 }"
          >
            <BellIcon class="h-6 w-6" />
            <span v-if="unreadCount > 0" class="notification-badge">
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </button>
          
          <!-- Notifications Dropdown -->
          <div v-if="showNotifications" class="notifications-dropdown">
            <div class="dropdown-header">
              <h3 class="dropdown-title">Notifications</h3>
              <button 
                v-if="unreadCount > 0"
                @click="markAllRead"
                class="mark-all-read"
              >
                Mark all read
              </button>
            </div>
            
            <div class="notifications-list">
              <div 
                v-for="notification in recentNotifications" 
                :key="notification.id"
                class="notification-item"
                :class="{ 'unread': !notification.read }"
                @click="markAsRead(notification.id)"
              >
                <div class="notification-icon" :class="getNotificationIconClass(notification.type)">
                  <component :is="getNotificationIcon(notification.type)" class="h-4 w-4" />
                </div>
                <div class="notification-content">
                  <p class="notification-message">{{ notification.message }}</p>
                  <p class="notification-time">{{ formatTime(notification.timestamp) }}</p>
                </div>
              </div>
            </div>
            
            <div class="dropdown-footer">
              <router-link to="/notifications" class="view-all-link">
                View all notifications
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Sales Summary -->
        <div class="sales-summary">
          <div class="summary-item">
            <span class="summary-label">Today's Sales</span>
            <span class="summary-value">₹{{ formatCurrency(todaySales) }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item">
            <span class="summary-label">Pending Orders</span>
            <span class="summary-value">{{ pendingOrders }}</span>
          </div>
        </div>
        
        <!-- User Menu -->
        <div class="user-menu-container">
          <button 
            class="user-menu-trigger"
            @click="toggleUserMenu"
          >
            <img 
              :src="currentUser.avatar" 
              :alt="currentUser.name"
              class="user-avatar"
            />
            <div class="user-info">
              <span class="user-name">{{ currentUser.name }}</span>
              <span class="user-role">Vendor</span>
            </div>
            <ChevronDownIcon class="h-4 w-4 text-gray-500" />
          </button>
          
          <!-- User Dropdown -->
          <div v-if="showUserMenu" class="user-dropdown">
            <div class="dropdown-section">
              <router-link to="/account" class="dropdown-item">
                <UserIcon class="h-4 w-4" />
                <span>Account Settings</span>
              </router-link>
              <router-link to="/analytics" class="dropdown-item">
                <ChartBarIcon class="h-4 w-4" />
                <span>Analytics</span>
              </router-link>
              <button @click="toggleDarkMode" class="dropdown-item">
                <SunIcon v-if="isDarkMode" class="h-4 w-4" />
                <MoonIcon v-else class="h-4 w-4" />
                <span>{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
              </button>
            </div>
            
            <div class="dropdown-divider"></div>
            
            <div class="dropdown-section">
              <button @click="openHelp" class="dropdown-item">
                <QuestionMarkCircleIcon class="h-4 w-4" />
                <span>Help Center</span>
              </button>
              <button @click="logout" class="dropdown-item text-red-600">
                <ArrowRightOnRectangleIcon class="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Search Overlay -->
    <div v-if="showSearch" class="search-overlay" @click="closeSearch">
      <div class="search-container" @click.stop>
        <div class="search-input-container">
          <MagnifyingGlassIcon class="search-icon" />
          <input 
            ref="searchInput"
            v-model="searchQuery"
            @keyup.enter="performSearch"
            @keyup.escape="closeSearch"
            class="search-input"
            placeholder="Search products, orders, customers..."
          />
          <button @click="closeSearch" class="search-close">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
        
        <div v-if="searchResults.length" class="search-results">
          <div v-for="result in searchResults" :key="result.id" class="search-result-item">
            <component :is="getSearchResultIcon(result.type)" class="result-icon" />
            <div class="result-content">
              <p class="result-title">{{ result.title }}</p>
              <p class="result-subtitle">{{ result.subtitle }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
  ChartBarIcon,
  SunIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline';

export default {
  name: 'VendorNavbar',
  components: {
    ChevronRightIcon,
    ChevronDownIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    BellIcon,
    UserIcon,
    ChartBarIcon,
    SunIcon,
    MoonIcon,
    QuestionMarkCircleIcon,
    ArrowRightOnRectangleIcon,
    XMarkIcon,
    ShoppingBagIcon,
    ClipboardDocumentListIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    // Reactive data
    const showNotifications = ref(false);
    const showUserMenu = ref(false);
    const showSearch = ref(false);
    const searchQuery = ref('');
    const searchInput = ref(null);
    const isDarkMode = ref(false);
    
    // Mock data
    const currentUser = ref({
      name: 'Rajesh Kumar',
      avatar: '/images/vendor-avatar.jpg',
      email: 'rajesh@kumarelectronics.com'
    });
    
    const todaySales = ref(15750);
    const pendingOrders = ref(23);
    const unreadCount = ref(5);
    
    const recentNotifications = ref([
      {
        id: 1,
        type: 'order',
        message: 'New order received for Samsung Galaxy A54',
        timestamp: new Date(Date.now() - 5 * 60000),
        read: false
      },
      {
        id: 2,
        type: 'payment',
        message: 'Payment of ₹12,500 has been processed',
        timestamp: new Date(Date.now() - 30 * 60000),
        read: false
      },
      {
        id: 3,
        type: 'warning',
        message: 'Low stock alert: iPhone 15 Pro (3 units left)',
        timestamp: new Date(Date.now() - 60 * 60000),
        read: true
      }
    ]);
    
    const searchResults = ref([]);
    
    // Computed properties
    const breadcrumbs = computed(() => {
      // Get breadcrumbs from router or generate them
      return router.currentBreadcrumbs || [];
    });
    
    const pageTitle = computed(() => {
      return route.meta?.title || route.name || 'Dashboard';
    });
    
    // Methods
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      showUserMenu.value = false;
    };
    
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
      showNotifications.value = false;
    };
    
    const openSearch = async () => {
      showSearch.value = true;
      await nextTick();
      searchInput.value?.focus();
    };
    
    const closeSearch = () => {
      showSearch.value = false;
      searchQuery.value = '';
      searchResults.value = [];
    };
    
    const quickAddProduct = () => {
      router.push({ name: 'AddProduct' });
    };
    
    const markAsRead = (notificationId) => {
      const notification = recentNotifications.value.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    };
    
    const markAllRead = () => {
      recentNotifications.value.forEach(n => n.read = true);
      unreadCount.value = 0;
    };
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-IN').format(value);
    };
    
    const formatTime = (timestamp) => {
      const now = new Date();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / 60000);
      
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    };
    
    const getNotificationIcon = (type) => {
      switch (type) {
        case 'order': return 'ClipboardDocumentListIcon';
        case 'payment': return 'CheckCircleIcon';
        case 'warning': return 'ExclamationTriangleIcon';
        default: return 'BellIcon';
      }
    };
    
    const getNotificationIconClass = (type) => {
      switch (type) {
        case 'order': return 'bg-blue-100 text-blue-600';
        case 'payment': return 'bg-green-100 text-green-600';
        case 'warning': return 'bg-yellow-100 text-yellow-600';
        default: return 'bg-gray-100 text-gray-600';
      }
    };
    
    const getSearchResultIcon = (type) => {
      switch (type) {
        case 'product': return 'ShoppingBagIcon';
        case 'order': return 'ClipboardDocumentListIcon';
        default: return 'MagnifyingGlassIcon';
      }
    };
    
    const performSearch = async () => {
      if (!searchQuery.value.trim()) return;
      
      // Mock search results
      searchResults.value = [
        {
          id: 1,
          type: 'product',
          title: 'Samsung Galaxy A54',
          subtitle: 'Electronics > Smartphones'
        },
        {
          id: 2,
          type: 'order',
          title: 'Order #ORD-2024-001',
          subtitle: 'Pending • ₹12,500'
        }
      ];
    };
    
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      document.documentElement.classList.toggle('dark', isDarkMode.value);
    };
    
    const openHelp = () => {
      window.open('/help', '_blank');
    };
    
    const logout = async () => {
      try {
        // Handle logout
        router.push({ name: 'Login' });
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
    
    // Watch for search query changes
    watch(searchQuery, (newQuery) => {
      if (newQuery.length > 2) {
        performSearch();
      } else {
        searchResults.value = [];
      }
    });
    
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target.closest('.notifications-container')) {
        showNotifications.value = false;
      }
      if (!target.closest('.user-menu-container')) {
        showUserMenu.value = false;
      }
    };
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });
    
    return {
      breadcrumbs,
      pageTitle,
      currentUser,
      todaySales,
      pendingOrders,
      unreadCount,
      recentNotifications,
      searchResults,
      showNotifications,
      showUserMenu,
      showSearch,
      searchQuery,
      searchInput,
      isDarkMode,
      toggleNotifications,
      toggleUserMenu,
      openSearch,
      closeSearch,
      quickAddProduct,
      markAsRead,
      markAllRead,
      formatCurrency,
      formatTime,
      getNotificationIcon,
      getNotificationIconClass,
      getSearchResultIcon,
      performSearch,
      toggleDarkMode,
      openHelp,
      logout
    };
  }
};
</script>

<style scoped>
.vendor-navbar {
  @apply bg-white border-b border-gray-200 sticky top-0 z-30;
}

.navbar-container {
  @apply flex items-center justify-between h-16 px-6;
}

/* Left Section */
.navbar-left {
  @apply flex items-center space-x-4 flex-1;
}

.breadcrumb-list {
  @apply flex items-center space-x-2;
}

.breadcrumb-item {
  @apply flex items-center;
}

.breadcrumb-link {
  @apply text-sm text-gray-500 hover:text-gray-700 transition-colors;
}

.breadcrumb-current {
  @apply text-sm font-medium text-gray-900;
}

.breadcrumb-separator {
  @apply h-4 w-4 text-gray-400 mx-2;
}

.page-title {
  @apply text-2xl font-bold text-gray-900;
}

/* Right Section */
.navbar-right {
  @apply flex items-center space-x-6;
}

/* Quick Actions */
.quick-actions {
  @apply flex items-center space-x-2;
}

.action-btn {
  @apply p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors;
}

/* Notifications */
.notifications-container {
  @apply relative;
}

.notification-btn {
  @apply relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors;
}

.notification-btn.has-notifications {
  @apply text-blue-600;
}

.notification-badge {
  @apply absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center;
}

.notifications-dropdown {
  @apply absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50;
}

.dropdown-header {
  @apply flex items-center justify-between px-4 py-2 border-b border-gray-200;
}

.dropdown-title {
  @apply font-semibold text-gray-900;
}

.mark-all-read {
  @apply text-sm text-blue-600 hover:text-blue-700;
}

.notifications-list {
  @apply max-h-64 overflow-y-auto;
}

.notification-item {
  @apply flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer;
}

.notification-item.unread {
  @apply bg-blue-50;
}

.notification-icon {
  @apply flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center;
}

.notification-content {
  @apply flex-1 min-w-0;
}

.notification-message {
  @apply text-sm text-gray-900 font-medium;
}

.notification-time {
  @apply text-xs text-gray-500 mt-1;
}

.dropdown-footer {
  @apply px-4 py-2 border-t border-gray-200;
}

.view-all-link {
  @apply text-sm text-blue-600 hover:text-blue-700 font-medium;
}

/* Sales Summary */
.sales-summary {
  @apply flex items-center space-x-4 px-4 py-2 bg-gray-50 rounded-lg;
}

.summary-item {
  @apply flex flex-col;
}

.summary-label {
  @apply text-xs text-gray-600;
}

.summary-value {
  @apply text-sm font-semibold text-gray-900;
}

.summary-divider {
  @apply w-px h-8 bg-gray-300;
}

/* User Menu */
.user-menu-container {
  @apply relative;
}

.user-menu-trigger {
  @apply flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors;
}

.user-avatar {
  @apply h-8 w-8 rounded-full object-cover;
}

.user-info {
  @apply flex flex-col items-start;
}

.user-name {
  @apply text-sm font-medium text-gray-900;
}

.user-role {
  @apply text-xs text-gray-600;
}

.user-dropdown {
  @apply absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50;
}

.dropdown-section {
  @apply py-1;
}

.dropdown-item {
  @apply flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors w-full text-left;
}

.dropdown-divider {
  @apply border-t border-gray-200 my-1;
}

/* Search Overlay */
.search-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20;
}

.search-container {
  @apply w-full max-w-2xl bg-white rounded-lg shadow-2xl mx-4;
}

.search-input-container {
  @apply flex items-center px-4 py-3 border-b border-gray-200;
}

.search-icon {
  @apply h-5 w-5 text-gray-400 mr-3;
}

.search-input {
  @apply flex-1 text-lg placeholder-gray-500 border-none outline-none;
}

.search-close {
  @apply p-1 text-gray-400 hover:text-gray-600;
}

.search-results {
  @apply max-h-64 overflow-y-auto;
}

.search-result-item {
  @apply flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer;
}

.result-icon {
  @apply h-5 w-5 text-gray-400;
}

.result-content {
  @apply flex-1;
}

.result-title {
  @apply text-sm font-medium text-gray-900;
}

.result-subtitle {
  @apply text-xs text-gray-500;
}

/* Responsive */
@media (max-width: 1024px) {
  .sales-summary {
    @apply hidden;
  }
}

@media (max-width: 768px) {
  .breadcrumb {
    @apply hidden;
  }
  
  .page-title {
    @apply text-xl;
  }
  
  .user-info {
    @apply hidden;
  }
}</style>