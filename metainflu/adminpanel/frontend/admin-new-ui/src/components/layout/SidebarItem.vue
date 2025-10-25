<template>
  <router-link
    :to="item.route"
    :class="itemClasses"
    :title="collapsed ? item.label : undefined"
  >
    <BaseIcon
      :name="item.icon"
      :size="collapsed ? 'md' : 'sm'"
      :class="iconClasses"
    />
    
    <span
      v-if="!collapsed"
      class="font-medium transition-all duration-200"
    >
      {{ item.label }}
    </span>
    
    <!-- Active indicator -->
    <div
      v-if="isActive && !collapsed"
      class="ml-auto w-2 h-2 bg-primary-600 rounded-full"
    />
  </router-link>
</template>

<script>
import BaseIcon from '../base/BaseIcon.vue'

export default {
  name: 'SidebarItem',
  components: {
    BaseIcon
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isActive() {
      return this.$route.path === this.item.route || this.item.active
    },
    itemClasses() {
      return [
        'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
        this.collapsed ? 'justify-center' : '',
        this.isActive
          ? 'bg-primary-50 text-primary-700 shadow-sm'
          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
      ]
    },
    iconClasses() {
      return [
        'transition-colors duration-200',
        this.isActive
          ? 'text-primary-600'
          : 'text-neutral-400 group-hover:text-neutral-600'
      ]
    }
  }
}
</script>
