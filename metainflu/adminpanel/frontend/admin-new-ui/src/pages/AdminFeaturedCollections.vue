<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Featured Collections</h1>
          <p class="text-neutral-600 mt-1">Curate featured product collections for homepage</p>
        </div>
        <BaseButton variant="primary" icon="plus" @click="createCollection">Create Collection</BaseButton>
      </div>
      
      <!-- Collections Grid -->
      <div v-if="!isLoading && collections.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CollectionCard
          v-for="collection in collections"
          :key="collection._id"
          :collection="collection"
          @edit="editCollection"
          @delete="confirmDeleteCollection"
          @toggle-featured="toggleFeatured"
        />
      </div>
      
      <!-- Loading State -->
      <div v-else-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-neutral-200 rounded-lg h-48"></div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <BaseIcon name="squares-plus" size="xl" class="mx-auto text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">No collections found</h3>
        <p class="text-neutral-500 mb-4">Create featured collections to showcase on homepage</p>
        <BaseButton variant="primary" icon="plus" @click="createCollection">Create Collection</BaseButton>
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
import CollectionCard from '../components/CollectionCard.vue'

export default {
  name: 'AdminFeaturedCollections',
  components: { AdminLayout, BaseButton, BaseIcon, CollectionCard },
  setup() {
    const toast = useToast()
    
    const collections = ref([])
    const isLoading = ref(false)
    
    const fetchCollections = async () => {
      try {
        isLoading.value = true
        // TODO: Implement collections API
        collections.value = []
      } catch (error) {
        console.error('Failed to fetch collections:', error)
      } finally {
        isLoading.value = false
      }
    }
    
    const createCollection = () => {
      toast.info('Featured collections feature coming soon')
    }
    
    const editCollection = (collection) => {
      toast.info('Collection editing feature coming soon')
    }
    
    const confirmDeleteCollection = (collection) => {
      toast.info('Collection deletion feature coming soon')
    }
    
    const toggleFeatured = (collection) => {
      toast.info('Featured toggle feature coming soon')
    }
    
    onMounted(() => {
      fetchCollections()
    })
    
    return {
      collections,
      isLoading,
      createCollection,
      editCollection,
      confirmDeleteCollection,
      toggleFeatured
    }
  }
}
</script>