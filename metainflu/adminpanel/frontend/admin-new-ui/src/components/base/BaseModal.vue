<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- Modal container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="show"
              :class="modalClasses"
              @click.stop
            >
              <!-- Header -->
              <div
                v-if="$slots.header || title || closable"
                class="flex items-center justify-between p-6 border-b border-neutral-200"
              >
                <div>
                  <slot name="header">
                    <h3 v-if="title" class="text-lg font-semibold text-neutral-900">
                      {{ title }}
                    </h3>
                  </slot>
                </div>
                
                <BaseButton
                  v-if="closable"
                  variant="ghost"
                  icon-only
                  size="sm"
                  icon="x-mark"
                  @click="$emit('close')"
                />
              </div>
              
              <!-- Content -->
              <div :class="contentClasses">
                <slot />
              </div>
              
              <!-- Footer -->
              <div
                v-if="$slots.footer"
                class="flex items-center justify-end space-x-3 p-6 border-t border-neutral-200 bg-neutral-50"
              >
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import BaseButton from './BaseButton.vue'

export default {
  name: 'BaseModal',
  components: {
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl'].includes(value)
    },
    closable: {
      type: Boolean,
      default: true
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    },
    padding: {
      type: String,
      default: 'normal',
      validator: (value) => ['none', 'compact', 'normal', 'spacious'].includes(value)
    }
  },
  emits: ['close'],
  computed: {
    modalClasses() {
      return [
        'relative bg-white rounded-xl shadow-strong transform transition-all',
        this.sizeClasses
      ]
    },
    sizeClasses() {
      const sizes = {
        sm: 'max-w-sm w-full',
        md: 'max-w-md w-full',
        lg: 'max-w-lg w-full',
        xl: 'max-w-xl w-full',
        '2xl': 'max-w-2xl w-full'
      }
      return sizes[this.size]
    },
    contentClasses() {
      if (this.$slots.header || this.$slots.footer || this.title) {
        // Has header/footer, no padding
        return ''
      }
      
      // No header/footer, apply padding
      const paddings = {
        none: '',
        compact: 'p-4',
        normal: 'p-6',
        spacious: 'p-8'
      }
      return paddings[this.padding]
    }
  },
  methods: {
    handleBackdropClick() {
      if (this.closeOnBackdrop && this.closable) {
        this.$emit('close')
      }
    }
  }
}
</script>
