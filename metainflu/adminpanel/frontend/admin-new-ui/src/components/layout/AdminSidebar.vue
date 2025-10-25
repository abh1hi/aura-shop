<template>
  <div
    :class="[
      'bg-white border-r border-neutral-200 flex flex-col transition-all duration-300 ease-in-out',
      collapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- Logo section -->
    <div class="flex items-center justify-between p-4 border-b border-neutral-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">A</span>
        </div>
        <h1
          v-if="!collapsed"
          class="font-display font-bold text-xl text-neutral-900 transition-opacity duration-200"
        >
          Aura Admin
        </h1>
      </div>
      
      <BaseButton
        variant="ghost"
        icon-only
        size="sm"
        icon="bars-3"
        @click="$emit('toggle')"
        class="lg:hidden"
      />
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2 custom-scrollbar overflow-y-auto">
      <template v-for="item in navigationItems" :key="item.label || item.section">
        <!-- Section header -->
        <div v-if="item.section && !collapsed" class="pt-4 pb-2 first:pt-0">
          <h3 class="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-3">
            {{ item.section }}
          </h3>
        </div>
        
        <!-- Navigation items -->
        <template v-if="item.items">
          <SidebarItem
            v-for="subItem in item.items"
            :key="subItem.route"
            :item="subItem"
            :collapsed="collapsed"
          />
        </template>
        
        <!-- Single navigation item -->
        <SidebarItem
          v-else
          :item="item"
          :collapsed="collapsed"
        />
      </template>
    </nav>
    
    <!-- Collapse toggle -->
    <div class="p-4 border-t border-neutral-200">
      <BaseButton
        variant="ghost"
        :icon-only="collapsed"
        size="sm"
        icon="chevron-left"
        @click="$emit('toggle')"
        class="w-full hidden lg:flex"
        :class="collapsed ? 'rotate-180' : ''"
      >
        <span v-if="!collapsed">Collapse</span>
      </BaseButton>
    </div>
  </div>
</template>

<script>
import BaseButton from '../base/BaseButton.vue'
import SidebarItem from './SidebarItem.vue'

export default {
  name: 'AdminSidebar',
  components: {
    BaseButton,
    SidebarItem
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
    navigationItems: {
      type: Array,
      required: true
    }
  },
  emits: ['toggle']
}
</script>
