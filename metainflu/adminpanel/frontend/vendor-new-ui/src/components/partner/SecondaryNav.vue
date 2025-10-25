<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <!-- Secondary left nav (desktop) -->
    <aside class="ui-desktop w-80 shrink-0">
      <div class="card-base p-3">
        <h3 class="px-3 py-2 text-sm font-semibold text-gray-500">{{ title }}</h3>
        <nav class="space-y-1">
          <button
            v-for="item in items"
            :key="item.to"
            @click="$router.push(item.to)"
            :class="['w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50',
                    $route.path === item.to ? 'bg-gray-100' : '']"
          >
            <span class="w-5 h-5 grid place-items-center rounded-full bg-gray-100 text-gray-600">
              <slot name="icon" :item="item" />
            </span>
            <span class="text-sm">{{ item.label }}</span>
          </button>
        </nav>
      </div>
      <div class="card-base p-3 mt-3">
        <h4 class="px-3 py-2 text-sm font-semibold text-gray-500">Payouts</h4>
        <div class="px-3 pb-2 text-sm text-gray-600 space-y-1">
          <div>Upcoming payouts <span class="float-right">$0.00</span></div>
          <div>Received payouts <span class="float-right">$0.00</span></div>
        </div>
        <button class="w-full mt-2 rounded-xl bg-brand-black text-white py-2.5">Connect bank account</button>
      </div>
    </aside>

    <!-- Main slot -->
    <section class="flex-1 min-w-0">
      <slot />
    </section>
  </div>
</template>
<script>
export default { name:'SecondaryNav', props:{ title:String, items:{ type:Array, default:()=>[] } } }
</script>
<style scoped>
.card-base{ @apply rounded-xl border border-gray-200 bg-white shadow-card; }
</style>
