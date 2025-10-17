<template>
  <div class="space-y-4">
    <div class="ios-card p-4">
      <div class="flex items-center justify-between">
        <h2 class="ios-title text-base">Products</h2>
        <button class="ios-button" @click="openNew">Add</button>
      </div>
      <div class="mt-3 grid md:grid-cols-2 gap-3">
        <div v-for="p in products" :key="p._id" class="p-3 border rounded-xl">
          <div class="font-semibold">{{ p.name }}</div>
          <div class="ios-muted text-sm">${{ p.price }}</div>
          <div class="flex gap-2 mt-2">
            <button class="ios-button" @click="edit(p)">Edit</button>
            <button class="ios-button bg-iosRed" @click="remove(p)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'

const products = ref([])

onMounted(load)

async function load(){
  // vendor-specific: backend should guard /api/vendor/products
  const { data } = await api.get('/vendor/products')
  products.value = data || []
}

function openNew(){ /* show modal (future) */ }
function edit(p){ /* route to edit (future) */ }
async function remove(p){ if(confirm('Delete?')) { await api.delete(`/vendor/products/${p._id}`); await load(); } }
</script>
