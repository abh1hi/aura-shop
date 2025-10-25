<template>
  <div class="ui-desktop">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Programs</h1>
    </div>
    <ProgramCard v-for="p in programs.items" :key="p.id" class="mb-4" :name="p.name" :url="p.url" :earnings="p.earnings" />
  </div>

  <div class="ui-mobile p-4">
    <h1 class="text-xl font-bold mb-4">Programs</h1>
    <ProgramCard v-for="p in programs.items" :key="p.id" class="mb-3" :name="p.name" :url="p.url" :earnings="p.earnings" />
  </div>
</template>
<script>
import ProgramCard from '../components/partner/ProgramCard.vue'
import { fetchProgramsMock } from '../services/mocks'
export default { name:'VendorPrograms', components:{ ProgramCard }, data:()=>({ programs:{ items:[] } }), async mounted(){ this.programs = await fetchProgramsMock() } }
</script>
