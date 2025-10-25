<template>
  <div class="ui-desktop">
    <h1 class="text-2xl font-bold mb-4">Programs</h1>
    <div class="space-y-3">
      <ProgramCard v-for="p in data.items" :key="p.id" :name="p.name" :url="p.url" :earnings="p.earnings" />
    </div>
  </div>
  <div class="ui-mobile p-4">
    <h1 class="text-xl font-bold mb-3">Programs</h1>
    <div class="space-y-3">
      <ProgramCard v-for="p in data.items" :key="p.id" :name="p.name" :url="p.url" :earnings="p.earnings" />
    </div>
  </div>
</template>
<script>
import ProgramCard from '../shared/ProgramCard.vue'
import { getPrograms } from '../services/mocks'
export default{ name:'Programs', components:{ ProgramCard }, data:()=>({ data:{ items:[] } }), async mounted(){ this.data=await getPrograms() } }
</script>
