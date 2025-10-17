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
      <p v-if="error" class="text-sm text-red-600 mt-3">{{ error }}</p>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const products = ref([])
const error = ref('')
const router = useRouter()

onMounted(load)

async function load(){
  error.value = ''
  try {
    const { data } = await api.get('/vendor/products')
    products.value = data || []
  } catch (err) {
    if (err?.response?.status === 401) {
      error.value = 'Unauthorized. Please sign in with a vendor account.'
      alert(error.value)
      router.push({ name: 'login' })
    } else {
      console.error(err)
      error.value = 'Failed to load products.'
    }
  }
}

function openNew(){ /* show modal (future) */ }
function edit(p){ /* route to edit (future) */ }
async function remove(p){ 
  if(confirm('Delete?')) { 
    try {
      await api.delete(`/vendor/products/${p._id}`)
      await load() 
    } catch (err) {
      if (err?.response?.status === 401) {
        alert('Unauthorized. Please sign in with a vendor account.')
        router.push({ name: 'login' })
      } else {
        alert('Failed to delete product.')
      }
    }
  } 
}
</script>
