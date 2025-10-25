<template>
  <div class="rounded-lg border border-neutral-200 overflow-hidden animate-pulse bg-white">
    <div class="aspect-[4/3] bg-neutral-200"></div>
    <div class="p-4 space-y-2">
      <div class="h-4 bg-neutral-200 rounded w-2/3"></div>
      <div class="h-3 bg-neutral-200 rounded w-5/6"></div>
      <div class="flex items-center justify-between pt-2">
        <div class="h-4 bg-neutral-200 rounded w-16"></div>
        <div class="flex space-x-2">
          <div class="h-4 bg-neutral-200 rounded w-10"></div>
          <div class="h-4 bg-neutral-200 rounded w-10"></div>
          <div class="h-4 bg-neutral-200 rounded w-10"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default { name: 'ProductCardSkeleton' }
</script>
