<template>
  <div class="rounded-lg border border-neutral-200 overflow-hidden hover:shadow transition bg-white">
    <div class="aspect-[4/3] bg-neutral-100"></div>
    <div class="p-4 space-y-2">
      <h3 class="font-medium text-neutral-900 truncate">{{ product.name }}</h3>
      <div class="text-sm text-neutral-500 truncate-2-lines">{{ product.description }}</div>
      <div class="flex items-center justify-between">
        <div class="font-semibold">{{ formatCurrency(product.price) }}</div>
        <div class="space-x-2">
          <button class="text-sm text-primary-600" @click="$emit('view', product)">View</button>
          <button class="text-sm text-neutral-700" @click="$emit('edit', product)">Edit</button>
          <button class="text-sm text-red-600" @click="$emit('delete', product)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProductCard',
  props: { product: { type: Object, required: true } },
  methods: {
    formatCurrency(v) { return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(v||0)) }
  }
}
</script>
