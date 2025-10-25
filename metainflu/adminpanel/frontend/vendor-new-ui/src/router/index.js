import { createRouter, createWebHistory } from 'vue-router'
import VendorPrograms from '../pages/VendorPrograms.vue'
import VendorPayouts from '../pages/VendorPayouts.vue'
import VendorProfileNotifications from '../pages/VendorProfileNotifications.vue'

const routes = [
  { path: '/', redirect: '/programs' },
  { path: '/programs', name: 'VendorPrograms', component: VendorPrograms },
  { path: '/payouts', name: 'VendorPayouts', component: VendorPayouts },
  { path: '/profile/notifications', name: 'VendorProfileNotifications', component: VendorProfileNotifications },
]

export default createRouter({ history: createWebHistory(), routes })
