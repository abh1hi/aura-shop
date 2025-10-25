<template>
  <div class="relative">
    <BaseButton
      variant="ghost"
      size="sm"
      @click="showMenu = !showMenu"
      class="flex items-center space-x-2 pl-2 pr-3"
    >
      <img
        :src="user.avatar"
        :alt="user.name"
        class="w-7 h-7 rounded-full object-cover"
      >
      <span class="font-medium text-sm text-neutral-700 hidden sm:block">
        {{ user.name }}
      </span>
      <BaseIcon name="chevron-down" size="xs" class="text-neutral-400" />
    </BaseButton>
    
    <!-- Dropdown menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showMenu"
        class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-neutral-200 py-2 z-50"
        @click.stop
      >
        <div class="px-4 py-2 border-b border-neutral-200">
          <p class="text-sm font-medium text-neutral-900">{{ user.name }}</p>
          <p class="text-xs text-neutral-500">{{ user.role }}</p>
        </div>
        
        <router-link
          to="/profile"
          class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
          @click="showMenu = false"
        >
          <BaseIcon name="user" size="sm" class="inline mr-2" />
          Profile
        </router-link>
        
        <router-link
          to="/settings"
          class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
          @click="showMenu = false"
        >
          <BaseIcon name="cog" size="sm" class="inline mr-2" />
          Settings
        </router-link>
        
        <hr class="my-2 border-neutral-200">
        
        <button
          class="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
          @click="logout"
        >
          <BaseIcon name="arrow-right-on-rectangle" size="sm" class="inline mr-2" />
          Sign out
        </button>
      </div>
    </Transition>
    
    <!-- Backdrop -->
    <div
      v-if="showMenu"
      class="fixed inset-0 z-40"
      @click="showMenu = false"
    ></div>
  </div>
</template>

<script>
import BaseButton from '../base/BaseButton.vue'
import BaseIcon from '../base/BaseIcon.vue'

export default {
  name: 'UserMenu',
  components: {
    BaseButton,
    BaseIcon
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showMenu: false
    }
  },
  methods: {
    logout() {
      this.showMenu = false
      // Implement logout logic
      console.log('Logout')
    }
  }
}
</script>
