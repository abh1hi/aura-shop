<template>
  <div class="p-4 lg:p-6">
    <div class="ui-mobile space-y-3">
      <div v-for="o in orders" :key="o.id" class="bg-white rounded-xl p-4 shadow-soft active:scale-[0.995] transition">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">#{{ o.id }}</p>
            <p class="text-xs text-neutral-500">{{ o.customer }}</p>
          </div>
          <div class="text-right">
            <p class="font-semibold">${{ o.total }}</p>
            <p class="text-xs text-neutral-500">{{ o.status }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="ui-desktop bg-white rounded-xl p-6 shadow-soft">
      <h2 class="font-semibold mb-4">Orders</h2>
      <table class="w-full">
        <thead class="text-left text-sm text-neutral-500">
          <tr><th class="py-2">Order</th><th>Customer</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          <tr v-for="o in orders" :key="o.id">
            <td class="py-3 font-medium">#{{ o.id }}</td>
            <td>{{ o.customer }}</td>
            <td>${{ o.total }}</td>
            <td>{{ o.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { vendorApi } from '../services/vendorApi'
export default {
  name:'VendorOrders',
  data:()=>({ orders:[] }),
  async mounted(){
    try{ const data = await vendorApi.orders(); this.orders = data.items || [] }catch(e){ console.error(e) }
  }
}
</script>
