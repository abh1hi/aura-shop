<template>
  <div class="p-4 lg:p-6">
    <div class="ui-mobile space-y-3">
      <div class="bg-white rounded-xl p-4 shadow-soft">
        <p class="text-xs text-neutral-500">Total Revenue</p>
        <p class="text-2xl font-bold">${{ stats.revenue }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-soft">
        <p class="text-xs text-neutral-500">Pending Payouts</p>
        <p class="text-2xl font-bold">${{ stats.pending }}</p>
      </div>
    </div>

    <div class="ui-desktop grid grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-6 shadow-soft">
        <h2 class="font-semibold mb-2">Revenue</h2>
        <p class="text-3xl font-bold">${{ stats.revenue }}</p>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-soft">
        <h2 class="font-semibold mb-2">Pending Payouts</h2>
        <p class="text-3xl font-bold">${{ stats.pending }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { vendorApi } from '../services/vendorApi'
export default {
  name:'VendorPayments',
  data:()=>({ stats:{ revenue:0, pending:0 } }),
  async mounted(){
    try{ const data = await vendorApi.payments(); this.stats = data.stats || this.stats }catch(e){ console.error(e) }
  }
}
</script>
