<template>
  <div class="flex h-screen bg-neutral-50">
    <!-- Sidebar -->
    <AdminSidebar
      :collapsed="sidebarCollapsed"
      :navigation-items="navigationItems"
      @toggle="toggleSidebar"
    />
    
    <!-- Main content area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top navbar -->
      <AdminNavbar
        :user="currentUser"
        @toggle-sidebar="toggleSidebar"
        @search="handleSearch"
        @notifications="handleNotifications"
      />
      
      <!-- Page content -->
      <main class="flex-1 overflow-auto custom-scrollbar p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../components/layout/AdminSidebar.vue'
import AdminNavbar from '../components/layout/AdminNavbar.vue'

export default {
  name: 'AdminLayout',
  components: {
    AdminSidebar,
    AdminNavbar
  },
  data() {
    return {
      sidebarCollapsed: false,
      currentUser: {
        name: 'Admin User',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ec4899&color=fff',
        role: 'Administrator'
      },
      navigationItems: [
        {
          label: 'Dashboard',
          icon: 'home',
          route: '/dashboard',
          active: true
        },
        {
          label: 'Analytics',
          icon: 'chart-bar',
          route: '/analytics'
        },
        {
          section: 'Content Management',
          items: [
            {
              label: 'Hero Banners',
              icon: 'document',
              route: '/hero-banners'
            },
            {
              label: 'Featured Collections',
              icon: 'grid',
              route: '/featured-collections'
            }
          ]
        },
        {
          section: 'E-commerce',
          items: [
            {
              label: 'Products',
              icon: 'shopping-bag',
              route: '/products'
            },
            {
              label: 'Categories',
              icon: 'tag',
              route: '/categories'
            }
          ]
        },
        {
          section: 'User Management',
          items: [
            {
              label: 'Users',
              icon: 'users',
              route: '/users'
            },
            {
              label: 'Campaigns',
              icon: 'megaphone',
              route: '/campaigns'
            },
            {
              label: 'Influencers',
              icon: 'user-group',
              route: '/influencers'
            }
          ]
        },
        {
          section: 'Financial',
          items: [
            {
              label: 'Payments',
              icon: 'credit-card',
              route: '/payments'
            }
          ]
        },
        {
          label: 'Settings',
          icon: 'cog',
          route: '/settings'
        }
      ]
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    handleSearch(query) {
      console.log('Search query:', query)
      // Implement search functionality
    },
    handleNotifications() {
      console.log('Show notifications')
      // Implement notifications
    }
  }
}
</script>
