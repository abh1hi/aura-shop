<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Influencers</h1>
          <p class="text-neutral-600 mt-1">Manage influencer partnerships and collaborations</p>
        </div>
        <BaseButton variant="primary" icon="plus" @click="addInfluencer">Add Influencer</BaseButton>
      </div>
      
      <!-- Influencers Table -->
      <BaseCard>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-neutral-200">
            <thead class="bg-neutral-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Influencer</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Platform</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Followers</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-neutral-200">
              <tr v-if="!isLoading && influencers.length === 0">
                <td colspan="5" class="px-4 py-10 text-center text-neutral-500">
                  No influencers found. This feature is coming soon.
                </td>
              </tr>
              <tr v-if="isLoading">
                <td colspan="5" class="px-4 py-6 text-center text-neutral-500">Loading influencers...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
  </AdminLayout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

import AdminLayout from '../layouts/AdminLayout.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'

export default {
  name: 'AdminInfluencers',
  components: { AdminLayout, BaseCard, BaseButton },
  setup() {
    const toast = useToast()
    
    const influencers = ref([])
    const isLoading = ref(false)
    
    const fetchInfluencers = async () => {
      try {
        isLoading.value = true
        // TODO: Implement influencers API
        influencers.value = []
      } catch (error) {
        console.error('Failed to fetch influencers:', error)
      } finally {
        isLoading.value = false
      }
    }
    
    const addInfluencer = () => {
      toast.info('Influencer management feature coming soon')
    }
    
    onMounted(() => {
      fetchInfluencers()
    })
    
    return {
      influencers,
      isLoading,
      addInfluencer
    }
  }
}
</script>