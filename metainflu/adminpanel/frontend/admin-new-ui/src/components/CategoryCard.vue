<template>
  <div class="rounded-lg border border-neutral-200 p-4 bg-white">
    <div class="flex items-center justify-between">
      <div class="font-medium">{{ category.name }}</div>
      <div class="space-x-2">
        <button class="text-sm text-neutral-700" @click="$emit('edit', category)">Edit</button>
        <button class="text-sm text-red-600" @click="$emit('delete', category)">Delete</button>
      </div>
    </div>
    <div v-if="category.children?.length" class="mt-3 pl-3 border-l border-neutral-200 space-y-2">
      <CategoryCard v-for="child in category.children" :key="child._id" :category="child" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'CategoryCard',
  props: { category: { type: Object, required: true } },
  components: { CategoryCard: undefined }
}
</script>
