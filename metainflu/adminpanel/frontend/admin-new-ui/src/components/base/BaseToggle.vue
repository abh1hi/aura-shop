<template>
  <button
    type="button"
    :class="['relative inline-flex h-6 w-11 items-center rounded-full transition', modelValue ? 'bg-primary-600' : 'bg-neutral-200']"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span
      :class="['inline-block h-5 w-5 transform rounded-full bg-white transition', modelValue ? 'translate-x-5' : 'translate-x-1']"
    />
  </button>
</template>
<script>
export default {
  name: 'BaseToggle',
  props: { modelValue: { type: Boolean, default: false } },
  emits: ['update:modelValue']
}
</script>
