<template>
  <div class="rounded-xl border border-gray-200 bg-white p-4 hover:shadow transition">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-gray-100 grid place-items-center">{{ initials }}</div>
      <div>
        <h3 class="font-semibold">{{ name }}</h3>
        <p class="text-sm text-gray-600">🔗 {{ url }}</p>
      </div>
    </div>
    <div class="mt-4">
      <p class="text-sm text-gray-600 mb-1">Earnings</p>
      <div class="flex items-center gap-4">
        <div class="text-2xl font-bold">${{ earnings }}</div>
        <div class="flex-1 h-2 rounded-full bg-gradient-to-r from-purple-200 via-pink-200 to-red-200"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default{ name:'ProgramCard', props:{ name:String,url:String,earnings:{type:[String,Number],default:0}}, computed:{ initials(){return (this.name||'P').slice(0,2).toUpperCase()} } }
</script>
