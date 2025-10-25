<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="px-4 pt-4">
        <h3 class="text-lg font-medium text-neutral-900">{{ title }}</h3>
        <p class="mt-2 text-sm text-neutral-600">{{ message }}</p>
      </div>
      <div class="px-4 py-3 flex justify-end space-x-2">
        <button class="px-4 py-2 rounded border border-neutral-300" @click="$emit('cancel')">Cancel</button>
        <button :class="confirmClasses" @click="$emit('confirm')">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ConfirmDialog',
  props: {
    show: { type: Boolean, default: false },
    title: { type: String, required: true },
    message: { type: String, required: true },
    confirmText: { type: String, default: 'Confirm' },
    confirmVariant: { type: String, default: 'primary' }
  },
  computed: {
    confirmClasses() {
      const base = 'px-4 py-2 rounded text-white '
      const map = { primary: 'bg-primary-600', danger: 'bg-red-600', secondary: 'bg-neutral-700' }
      return base + (map[this.confirmVariant] || map.primary)
    }
  }
}
</script>
