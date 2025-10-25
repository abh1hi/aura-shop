<template>
  <div class="ui-desktop">
    <h1 class="text-2xl font-bold mb-4">Notifications</h1>
    <div class="space-y-3">
      <div v-for="n in items" :key="n.key" class="card p-5 flex items-center justify-between">
        <div>
          <div class="font-semibold mb-1">{{ n.label }}</div>
          <div class="text-sm text-gray-600">{{ desc[n.key] }}</div>
        </div>
        <ToggleSwitch v-model="n.enabled" />
      </div>
    </div>
  </div>
  <div class="ui-mobile p-4">
    <h1 class="text-xl font-bold mb-3">Notifications</h1>
    <div class="space-y-2">
      <div v-for="n in items" :key="n.key" class="card p-4 flex items-center justify-between active:scale-[0.995] transition">
        <div class="text-sm">
          <div class="font-medium">{{ n.label }}</div>
          <div class="text-gray-600">{{ desc[n.key] }}</div>
        </div>
        <ToggleSwitch v-model="n.enabled" />
      </div>
    </div>
  </div>
</template>
<script>
import ToggleSwitch from '../shared/ToggleSwitch.vue'
import { getNotifications } from '../services/mocks'
export default{ name:'Notifications', components:{ ToggleSwitch }, data:()=>({ items:[], desc:{ new_commission:'Commission created', application_approval:'Application approved', new_message:'New message received' } }), async mounted(){ this.items=(await getNotifications()).items } }
</script>
