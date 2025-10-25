<template>
  <header class="bg-white border-b border-neutral-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Left section -->
      <div class="flex items-center space-x-4">
        <!-- Mobile menu toggle -->
        <BaseButton
          variant="ghost"
          icon-only
          size="sm"
          icon="bars-3"
          @click="$emit('toggle-sidebar')"
          class="lg:hidden"
        />
        
        <!-- Search -->
        <div class="relative hidden md:block">
          <BaseInput
            v-model="searchQuery"
            placeholder="Search..."
            left-icon="search"
            size="md"
            class="w-80"
            @keyup.enter="handleSearch"
          />
        </div>
      </div>
      
      <!-- Right section -->
      <div class="flex items-center space-x-4">
        <!-- Quick actions -->
        <BaseButton
          variant="primary"
          icon="plus"
          size="sm"
          class="hidden sm:flex"
        >
          New Report
        </BaseButton>
        
        <!-- Mobile search -->
        <BaseButton
          variant="ghost"
          icon-only
          size="sm"
          icon="search"
          class="md:hidden"
          @click="showMobileSearch = !showMobileSearch"
        />
        
        <!-- Notifications -->
        <div class="relative">
          <BaseButton
            variant="ghost"
            icon-only
            size="sm"
            icon="bell"
            @click="$emit('notifications')"
          />
          <!-- Notification badge -->
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-accent-red rounded-full border-2 border-white"></div>
        </div>
        
        <!-- User menu -->
        <UserMenu :user="user" />
      </div>
    </div>
    
    <!-- Mobile search -->
    <div v-if="showMobileSearch" class="mt-4 md:hidden">
      <BaseInput
        v-model="searchQuery"
        placeholder="Search..."
        left-icon="search"
        size="md"
        @keyup.enter="handleSearch"
      />
    </div>
  </header>
</template>

<script>
import BaseButton from '../base/BaseButton.vue'
import BaseInput from '../base/BaseInput.vue'
import UserMenu from './UserMenu.vue'

export default {
  name: 'AdminNavbar',
  components: {
    BaseButton,
    BaseInput,
    UserMenu
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ['toggle-sidebar', 'search', 'notifications'],
  data() {
    return {
      searchQuery: '',
      showMobileSearch: false
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.searchQuery)
      this.showMobileSearch = false
    }
  }
}
</script>
