<template>
  <div class="relative">
    <span v-if="leftIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
      <BaseIcon :name="leftIcon" />
    </span>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
      class="block w-full rounded-md border-neutral-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      :class="[{ 'pl-10': leftIcon }, error ? 'border-red-300' : '']"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'BaseInput',
  components: { BaseIcon },
  props: {
    modelValue: [String, Number],
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    leftIcon: { type: String, default: '' },
    autocomplete: { type: String, default: 'off' },
    disabled: { type: Boolean, default: false },
    error: { type: String, default: '' },
    label: { type: String, default: '' }
  },
  emits: ['update:modelValue', 'blur']
}
</script>
