<template>
  <div v-if="open" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/30" @click="$emit('close')" aria-hidden="true"></div>
    <section class="absolute inset-x-0 bottom-0 bg-gray-surface rounded-t-2xl p-4 shadow-lg" role="dialog" aria-modal="true">
      <header class="flex items-center justify-between">
        <h2 class="text-base font-semibold">Filters</h2>
        <button class="text-primary-blue" @click="$emit('apply')">Apply</button>
      </header>
      <div class="mt-3 space-y-4">
        <slot />
      </div>
    </section>
  </div>
</template>

<script setup>
defineProps({ open: Boolean });
</script>
