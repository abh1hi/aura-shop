<template>
  <div class="flex items-center justify-center space-x-2">
    <button
      :disabled="currentPage === 1"
      class="px-2 py-1 text-sm rounded border border-neutral-300 disabled:opacity-50"
      @click="$emit('page-change', currentPage - 1)"
    >Prev</button>
    <span class="text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
    <button
      :disabled="currentPage === totalPages"
      class="px-2 py-1 text-sm rounded border border-neutral-300 disabled:opacity-50"
      @click="$emit('page-change', currentPage + 1)"
    >Next</button>
  </div>
</template>
<script>
export default {
  name: 'BasePagination',
  props: {
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    totalItems: { type: Number, default: 0 }
  },
  emits: ['page-change']
}
</script>
