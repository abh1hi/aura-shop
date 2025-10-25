<template>
  <div class="relative inline-block" @mouseenter="show = true" @mouseleave="show = false">
    <slot />
    
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="show && content"
        :class="tooltipClasses"
        role="tooltip"
      >
        {{ content }}
        <div :class="arrowClasses"></div>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'BaseTooltip',
  props: {
    content: {
      type: String,
      required: true
    },
    placement: {
      type: String,
      default: 'top',
      validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    tooltipClasses() {
      return [
        'absolute z-50 px-3 py-2 bg-neutral-900 text-white text-sm rounded-lg shadow-lg pointer-events-none whitespace-nowrap',
        this.positionClasses,
        this.sizeClasses
      ]
    },
    positionClasses() {
      const positions = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
      }
      return positions[this.placement]
    },
    sizeClasses() {
      const sizes = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-2',
        lg: 'text-base px-4 py-2'
      }
      return sizes[this.size]
    },
    arrowClasses() {
      const arrows = {
        top: 'absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-900',
        bottom: 'absolute bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-neutral-900',
        left: 'absolute left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-neutral-900',
        right: 'absolute right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-neutral-900'
      }
      return arrows[this.placement]
    }
  }
}
</script>
