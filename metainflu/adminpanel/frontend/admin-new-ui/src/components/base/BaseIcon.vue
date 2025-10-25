<template>
  <component
    :is="iconComponent"
    :class="[
      'inline-block',
      sizeClasses,
      colorClasses
    ]"
    v-bind="$attrs"
  />
</template>

<script>
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  BellIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisHorizontalIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  CalendarDaysIcon,
  FunnelIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  ShoppingBagIcon,
  TagIcon,
  CreditCardIcon,
  UsersIcon,
  MegaphoneIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  ClockIcon,
  MinusIcon,
  CameraIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

import {
  HomeIcon as HomeSolid,
  ChartBarIcon as ChartBarSolid,
  UserGroupIcon as UserGroupSolid,
  BellIcon as BellSolid,
  HeartIcon as HeartSolid
} from '@heroicons/vue/24/solid'

const iconMap = {
  // Outline icons
  'home': HomeIcon,
  'chart-bar': ChartBarIcon,
  'user-group': UserGroupIcon,
  'cog': CogIcon,
  'bell': BellIcon,
  'search': MagnifyingGlassIcon,
  'magnifying-glass': MagnifyingGlassIcon,
  'plus': PlusIcon,
  'dots': EllipsisHorizontalIcon,
  'ellipsis-horizontal': EllipsisHorizontalIcon,
  'trending-up': ArrowTrendingUpIcon,
  'trending-down': ArrowTrendingDownIcon,
  'eye': EyeIcon,
  'heart': HeartIcon,
  'share': ShareIcon,
  'calendar': CalendarDaysIcon,
  'filter': FunnelIcon,
  'funnel': FunnelIcon,
  'grid': Squares2X2Icon,
  'squares-2x2': Squares2X2Icon,
  'document': DocumentTextIcon,
  'shopping-bag': ShoppingBagIcon,
  'tag': TagIcon,
  'credit-card': CreditCardIcon,
  'users': UsersIcon,
  'megaphone': MegaphoneIcon,
  'bars-3': Bars3Icon,
  'chevron-left': ChevronLeftIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-down': ChevronDownIcon,
  'x-mark': XMarkIcon,
  'pencil': PencilIcon,
  'trash': TrashIcon,
  'photo': PhotoIcon,
  'check-circle': CheckCircleIcon,
  'plus-circle': PlusCircleIcon,
  'clock': ClockIcon,
  'minus': MinusIcon,
  'camera': CameraIcon,
  'envelope': EnvelopeIcon,
  'lock-closed': LockClosedIcon,
  'user': UserIcon,
  'arrow-right-on-rectangle': ArrowRightOnRectangleIcon,
  
  // Solid icons
  'home-solid': HomeSolid,
  'chart-bar-solid': ChartBarSolid,
  'user-group-solid': UserGroupSolid,
  'bell-solid': BellSolid,
  'heart-solid': HeartSolid
}

export default {
  name: 'BaseIcon',
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    color: {
      type: String,
      default: 'current'
    }
  },
  computed: {
    iconComponent() {
      return iconMap[this.name] || HomeIcon
    },
    sizeClasses() {
      const sizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8'
      }
      return sizes[this.size]
    },
    colorClasses() {
      if (this.color === 'current') return 'text-current'
      
      const colors = {
        primary: 'text-primary-600',
        secondary: 'text-secondary-600',
        success: 'text-accent-green',
        warning: 'text-accent-yellow',
        danger: 'text-accent-red',
        info: 'text-accent-blue',
        neutral: 'text-neutral-600'
      }
      return colors[this.color] || 'text-current'
    }
  }
}
</script>
