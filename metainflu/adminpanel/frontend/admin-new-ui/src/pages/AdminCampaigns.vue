<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Campaigns</h1>
          <p class="text-neutral-600 mt-1">Manage marketing campaigns and promotions</p>
        </div>
        <BaseButton variant="primary" icon="plus" @click="createCampaign">Create Campaign</BaseButton>
      </div>
      
      <!-- Campaigns Grid -->
      <div v-if="!isLoading && campaigns.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignCard
          v-for="campaign in campaigns"
          :key="campaign._id"
          :campaign="campaign"
          @edit="editCampaign"
          @delete="confirmDeleteCampaign"
          @toggle-status="toggleCampaignStatus"
        />
      </div>
      
      <!-- Loading State -->
      <div v-else-if="isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="bg-neutral-200 rounded-lg h-48"></div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <BaseIcon name="megaphone" size="xl" class="mx-auto text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">No campaigns found</h3>
        <p class="text-neutral-500 mb-4">Create your first marketing campaign</p>
        <BaseButton variant="primary" icon="plus" @click="createCampaign">Create Campaign</BaseButton>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

import AdminLayout from '../layouts/AdminLayout.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseIcon from '../components/base/BaseIcon.vue'
import CampaignCard from '../components/CampaignCard.vue'

export default {
  name: 'AdminCampaigns',
  components: { AdminLayout, BaseButton, BaseIcon, CampaignCard },
  setup() {
    const toast = useToast()
    
    const campaigns = ref([])
    const isLoading = ref(false)
    
    const fetchCampaigns = async () => {
      try {
        isLoading.value = true
        // TODO: Implement campaigns API
        campaigns.value = []
      } catch (error) {
        console.error('Failed to fetch campaigns:', error)
        toast.error('Failed to load campaigns')
      } finally {
        isLoading.value = false
      }
    }
    
    const createCampaign = () => {
      toast.info('Campaign creation feature coming soon')
    }
    
    const editCampaign = (campaign) => {
      toast.info('Campaign editing feature coming soon')
    }
    
    const confirmDeleteCampaign = (campaign) => {
      toast.info('Campaign deletion feature coming soon')
    }
    
    const toggleCampaignStatus = (campaign) => {
      toast.info('Campaign status toggle feature coming soon')
    }
    
    onMounted(() => {
      fetchCampaigns()
    })
    
    return {
      campaigns,
      isLoading,
      createCampaign,
      editCampaign,
      confirmDeleteCampaign,
      toggleCampaignStatus
    }
  }
}
</script>