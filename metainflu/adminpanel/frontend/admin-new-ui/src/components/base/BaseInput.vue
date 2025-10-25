<template>
  <div class="space-y-1">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-neutral-700"
    >
      {{ label }}
      <span v-if="required" class="text-accent-red">*</span>
    </label>
    
    <div class="relative">
      <!-- Left icon -->
      <div
        v-if="leftIcon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <BaseIcon
          :name="leftIcon"
          size="sm"
          class="text-neutral-400"
        />
      </div>
      
      <!-- Input field -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        v-bind="$attrs"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      >
      
      <!-- Right icon -->
      <div
        v-if="rightIcon || clearable"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <button
          v-if="clearable && modelValue"
          type="button"
          @click="$emit('update:modelValue', '')"
          class="text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <BaseIcon name="x-mark" size="sm" />
        </button>
        <BaseIcon
          v-else-if="rightIcon"
          :name="rightIcon"
          size="sm"
          class="text-neutral-400"
        />
      </div>
    </div>
    
    <!-- Help text or error -->
    <p
      v-if="helpText || error"
      :class="[
        'text-sm',
        error ? 'text-accent-red' : 'text-neutral-500'
      ]"
    >
      {{ error || helpText }}
    </p>
  </div>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

let inputIdCounter = 0

export default {
  name: 'BaseInput',
  components: {
    BaseIcon
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    helpText: {
      type: String,
      default: null
    },
    error: {
      type: String,
      default: null
    },
    leftIcon: {
      type: String,
      default: null
    },
    rightIcon: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  data() {
    return {
      inputId: `input-${++inputIdCounter}`
    }
  },
  computed: {
    inputClasses() {
      return [
        // Base styles
        'block w-full border-neutral-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors',
        
        // Size styles
        this.sizeClasses,
        
        // Icon padding
        this.leftIcon ? 'pl-10' : '',
        this.rightIcon || this.clearable ? 'pr-10' : '',
        
        // State styles
        this.disabled ? 'bg-neutral-50 text-neutral-500 cursor-not-allowed' : 'bg-white',
        this.error ? 'border-accent-red focus:border-accent-red focus:ring-accent-red' : ''
      ]
    },
    sizeClasses() {
      const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base'
      }
      return sizes[this.size]
    }
  }
}
</script>
