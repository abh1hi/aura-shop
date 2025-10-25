<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Hero Banners</h1>
          <p class="text-neutral-600 mt-1">Manage homepage hero banners and promotional content</p>
        </div>
        <BaseButton variant="primary" icon="plus" @click="createBanner">Add Banner</BaseButton>
      </div>
      
      <!-- Banners Grid -->
      <div v-if="!isLoading && banners.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BannerCard
          v-for="banner in banners"
          :key="banner._id"
          :banner="banner"
          @edit="editBanner"
          @delete="confirmDeleteBanner"
          @toggle-status="toggleBannerStatus"
        />
      </div>
      
      <!-- Loading State -->
      <div v-else-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="bg-neutral-200 rounded-lg h-48"></div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <BaseIcon name="photo" size="xl" class="mx-auto text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">No banners found</h3>
        <p class="text-neutral-500 mb-4">Create your first hero banner for the homepage</p>
        <BaseButton variant="primary" icon="plus" @click="createBanner">Add Banner</BaseButton>
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
import BannerCard from '../components/BannerCard.vue'

export default {
  name: 'AdminHeroBanners',
  components: { AdminLayout, BaseButton, BaseIcon, BannerCard },
  setup() {
    const toast = useToast()
    
    const banners = ref([])
    const isLoading = ref(false)
    
    const fetchBanners = async () => {
      try {
        isLoading.value = true
        // TODO: Implement banners API
        banners.value = []
      } catch (error) {
        console.error('Failed to fetch banners:', error)
      } finally {
        isLoading.value = false
      }
    }
    
    const createBanner = () => {
      toast.info('Hero banner management feature coming soon')
    }
    
    const editBanner = (banner) => {
      toast.info('Banner editing feature coming soon')
    }
    
    const confirmDeleteBanner = (banner) => {
      toast.info('Banner deletion feature coming soon')
    }
    
    const toggleBannerStatus = (banner) => {
      toast.info('Banner status toggle feature coming soon')
    }
    
    onMounted(() => {
      fetchBanners()
    })
    
    return {
      banners,
      isLoading,
      createBanner,
      editBanner,
      confirmDeleteBanner,
      toggleBannerStatus
    }
  }
}
</script>