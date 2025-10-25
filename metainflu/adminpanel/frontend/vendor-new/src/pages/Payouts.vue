<template>
  <div class="ui-desktop">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Payouts</h1>
      <div class="flex items-center gap-3">
        <button class="rounded-xl bg-brand-black text-white px-4 py-2.5">Connect bank account</button>
        <button class="rounded-xl border border-gray-300 px-4 py-2.5 bg-white">Payout settings</button>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-6">
      <StatusTile label="Pending" :amount="summary.pending" icon="🕒" />
      <StatusTile label="Processing" :amount="summary.processing" icon="🌀" />
      <StatusTile label="Processed" :amount="summary.processed" icon="✅" />
      <StatusTile label="Sent" :amount="summary.sent" icon="✈️" />
      <StatusTile label="Completed" :amount="summary.completed" icon="✔️" />
    </div>
    <div class="card h-64 grid place-items-center text-gray-400">Payouts table</div>
  </div>
  <div class="ui-mobile p-4">
    <h1 class="text-xl font-bold mb-3">Payouts</h1>
    <div class="space-y-3">
      <StatusTile label="Pending" :amount="summary.pending" icon="🕒" />
      <StatusTile label="Processing" :amount="summary.processing" icon="🌀" />
      <StatusTile label="Processed" :amount="summary.processed" icon="✅" />
      <StatusTile label="Sent" :amount="summary.sent" icon="✈️" />
      <StatusTile label="Completed" :amount="summary.completed" icon="✔️" />
    </div>
  </div>
</template>
<script>
import StatusTile from '../shared/StatusTile.vue'
import { getPayoutSummary } from '../services/mocks'
export default{ name:'Payouts', components:{ StatusTile }, data:()=>({ summary:{ pending:0,processing:0,processed:0,sent:0,completed:0 } }), async mounted(){ this.summary=await getPayoutSummary() } }
</script>
