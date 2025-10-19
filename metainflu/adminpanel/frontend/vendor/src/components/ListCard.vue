<template>
  <article class="bg-gray-surface rounded-xl border border-gray-border p-3 flex items-center gap-3">
    <div v-if="$slots.leading" class="shrink-0">
      <slot name="leading" />
    </div>
    <div class="min-w-0 flex-1">
      <h3 class="text-sm font-medium truncate">{{ title }}</h3>
      <p v-if="subtitle" class="text-xs text-gray-text truncate">{{ subtitle }}</p>
      <div v-if="$slots.meta" class="mt-1 text-xs text-gray-text">
        <slot name="meta" />
      </div>
    </div>
    <div class="flex items-center gap-2">
      <slot name="status" />
      <slot name="actions" />
    </div>
  </article>
</template>

<script setup>
defineProps({ title: String, subtitle: String });
</script>
