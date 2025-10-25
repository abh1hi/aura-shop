<template>
  <div class="rounded-lg border border-neutral-200 overflow-hidden bg-white p-4">
    <div class="flex items-center justify-between">
      <div>
        <div class="font-medium">{{ collection.name }}</div>
        <div class="text-sm text-neutral-500">{{ (collection.products||[]).length }} products</div>
      </div>
      <div class="space-x-2">
        <button class="text-sm text-neutral-700" @click="$emit('edit', collection)">Edit</button>
        <button class="text-sm text-red-600" @click="$emit('delete', collection)">Delete</button>
      </div>
    </div>
  </div>
</template>
<script>
export default { name: 'CollectionCard', props: { collection: { type: Object, required: true } } }
</script>
