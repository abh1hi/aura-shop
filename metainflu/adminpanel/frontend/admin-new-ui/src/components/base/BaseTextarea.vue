<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-neutral-700 mb-1">{{ label }}</label>
    <textarea
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      class="block w-full rounded-md border-neutral-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      :class="[error ? 'border-red-300' : '']"
    ></textarea>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
<script>
export default {
  name: 'BaseTextarea',
  props: {
    modelValue: { type: String, default: '' },
    rows: { type: Number, default: 4 },
    placeholder: { type: String, default: '' },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    error: { type: String, default: '' }
  },
  emits: ['update:modelValue']
}
</script>
