<template>
  <div class="space-y-4">
    <div class="ios-card p-4">
      <h2 class="ios-title text-base">Orders</h2>
      <div class="mt-3 divide-y">
        <div v-for="o in orders" :key="o._id" class="py-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold">#{{ o._id.slice(-6) }}</div>
              <div class="ios-muted text-xs">{{ o.status }}</div>
            </div>
            <button class="ios-button" @click="fulfill(o)">Mark fulfilled</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'

const orders = ref([])

onMounted(load)

async function load(){
  const { data } = await api.get('/vendor/orders')
  orders.value = data || []
}
async function fulfill(o){ await api.patch(`/vendor/orders/${o._id}`, { status: 'fulfilled' }); await load(); }
</script>
