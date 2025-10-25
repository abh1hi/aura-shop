<template>
  <div class="p-4 lg:p-6 space-y-4">
    <div class="ui-mobile grid grid-cols-2 gap-3">
      <button @click="openCreate" class="col-span-2 bg-primary-600 text-white rounded-lg py-2">Create Product</button>
      <div v-for="p in products" :key="p.id" class="bg-white rounded-xl p-3 shadow-soft">
        <p class="font-medium truncate">{{ p.name }}</p>
        <p class="text-sm text-neutral-500">${{ p.price }}</p>
      </div>
    </div>

    <div class="ui-desktop bg-white rounded-xl p-6 shadow-soft">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold">Products</h2>
        <button @click="openCreate" class="bg-primary-600 text-white rounded-lg px-4 py-2">Create Product</button>
      </div>
      <table class="w-full">
        <thead class="text-left text-sm text-neutral-500">
          <tr><th class="py-2">Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          <tr v-for="p in products" :key="p.id">
            <td class="py-3 font-medium">{{ p.name }}</td>
            <td>${{ p.price }}</td>
            <td>{{ p.stock }}</td>
            <td>
              <button class="text-primary-600" @click="edit(p)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { vendorApi } from '../services/vendorApi'
export default {
  name:'VendorProducts',
  data:()=>({ products:[] }),
  async mounted(){
    try{ const data = await vendorApi.products(); this.products = data.items || [] }catch(e){ console.error(e) }
  },
  methods:{
    openCreate(){ /* open modal placeholder */ },
    edit(p){ /* edit modal placeholder */ }
  }
}
</script>
