<template>
  <div class="flex gap-6">
    <SecondaryNav
      class="hidden lg:block"
      title="Partner profile"
      :items="[
        { label:'Profile', to:'/profile' },
        { label:'Members', to:'/profile/members' },
        { label:'Notifications', to:'/profile/notifications' }
      ]"
    />

    <section class="flex-1 min-w-0">
      <div class="ui-desktop">
        <h1 class="text-2xl font-bold mb-4">Notifications <span class="text-gray-400">•</span></h1>
        <div class="space-y-3">
          <div v-for="n in notifications.items" :key="n.key" class="rounded-xl border border-gray-200 bg-white p-5 flex items-center justify-between">
            <div>
              <div class="font-semibold mb-1">{{ n.label }}</div>
              <div class="text-sm text-gray-600">Alert when {{ descriptions[n.key] }}</div>
            </div>
            <ToggleSwitch v-model="n.enabled" />
          </div>
        </div>
      </div>

      <div class="ui-mobile p-4">
        <h1 class="text-xl font-bold mb-3">Notifications</h1>
        <div class="space-y-2">
          <div v-for="n in notifications.items" :key="n.key" class="rounded-xl border border-gray-200 bg-white p-4 flex items-center justify-between active:scale-[0.995] transition">
            <div class="text-sm">
              <div class="font-medium">{{ n.label }}</div>
              <div class="text-gray-600">{{ mobileDescriptions[n.key] }}</div>
            </div>
            <ToggleSwitch v-model="n.enabled" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import SecondaryNav from '../components/partner/SecondaryNav.vue'
import ToggleSwitch from '../components/partner/ToggleSwitch.vue'
import { fetchNotificationsMock } from '../services/mocks'
export default { name:'VendorProfileNotifications', components:{ SecondaryNav, ToggleSwitch }, data:()=>({ notifications:{ items:[] }, descriptions:{ new_commission:'a new commission event is created', application_approval:'an application is approved', new_message:'a new message is received' }, mobileDescriptions:{ new_commission:'Commission created', application_approval:'Application approved', new_message:'New message received' } }), async mounted(){ this.notifications = await fetchNotificationsMock() } }
</script>
