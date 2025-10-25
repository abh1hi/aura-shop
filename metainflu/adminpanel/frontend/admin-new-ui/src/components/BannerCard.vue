<template>
  <div class="rounded-lg border border-neutral-200 overflow-hidden bg-white">
    <div class="aspect-[16/6] bg-neutral-100"></div>
    <div class="p-4 flex items-center justify-between">
      <div>
        <div class="font-medium">{{ banner.title || 'Banner' }}</div>
        <div class="text-sm text-neutral-500">{{ banner.subtitle || '—' }}</div>
      </div>
      <div class="space-x-2">
        <button class="text-sm text-neutral-700" @click="$emit('edit', banner)">Edit</button>
        <button class="text-sm text-red-600" @click="$emit('delete', banner)">Delete</button>
      </div>
    </div>
  </div>
</template>
<script>
export default { name: 'BannerCard', props: { banner: { type: Object, required: true } } }
</script>
