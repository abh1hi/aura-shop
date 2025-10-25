import { createRouter, createWebHistory } from 'vue-router'
import Programs from '../pages/Programs.vue'
import Payouts from '../pages/Payouts.vue'
import Notifications from '../pages/Notifications.vue'

const routes=[
  { path:'/', redirect:'/programs' },
  { path:'/programs', component:Programs },
  { path:'/payouts', component:Payouts },
  { path:'/profile/notifications', component:Notifications },
]
export default createRouter({ history:createWebHistory(), routes })
