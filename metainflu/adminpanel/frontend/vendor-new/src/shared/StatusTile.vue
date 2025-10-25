<template>
  <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 grid place-items-center rounded-full bg-gray-100">{{ icon }}</div>
      <div class="text-sm">
        <div class="font-medium">{{ label }}</div>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-black"></span>
      <div class="text-lg font-semibold">${{ amount }}</div>
    </div>
  </div>
</template>
<script>
export default{ name:'StatusTile', props:{ label:String, amount:{type:[String,Number],default:0}, icon:{type:String,default:'⏱️'} } }
</script>
