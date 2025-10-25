<template>
  <div class="space-y-1">
    <label
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-neutral-700"
    >
      {{ label }}
      <span v-if="required" class="text-accent-red">*</span>
    </label>
    
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="selectClasses"
        v-bind="$attrs"
        @change="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- Arrow icon -->
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <BaseIcon name="chevron-down" size="sm" class="text-neutral-400" />
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

let selectIdCounter = 0

export default {
  name: 'BaseSelect',
  components: {
    BaseIcon
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    options: {
      type: Array,
      required: true
      // Expected format: [{ value, label, disabled? }]
    },
    helpText: {
      type: String,
      default: null
    },
    error: {
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
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  data() {
    return {
      selectId: `select-${++selectIdCounter}`
    }
  },
  computed: {
    selectClasses() {
      return [
        // Base styles
        'block w-full border-neutral-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors appearance-none',
        
        // Size styles
        this.sizeClasses,
        
        // State styles
        this.disabled ? 'bg-neutral-50 text-neutral-500 cursor-not-allowed' : 'bg-white',
        this.error ? 'border-accent-red focus:border-accent-red focus:ring-accent-red' : ''
      ]
    },
    sizeClasses() {
      const sizes = {
        sm: 'px-3 py-2 pr-10 text-sm',
        md: 'px-4 py-2.5 pr-10 text-sm',
        lg: 'px-4 py-3 pr-10 text-base'
      }
      return sizes[this.size]
    }
  }
}
</script>
