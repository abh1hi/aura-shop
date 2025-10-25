<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Influencers</h1>
          <p class="text-neutral-600 mt-1">Manage influencer partnerships and collaborations</p>
        </div>
        
        <BaseButton variant="primary" icon="plus" size="sm" @click="showCreateModal = true">
          Add Influencer
        </BaseButton>
      </div>
      
      <!-- Placeholder for future implementation -->
      <div class="text-center py-12">
        <BaseIcon name="user-group" size="xl" class="mx-auto text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">Influencers Management</h3>
        <p class="text-neutral-500 mb-4">This page is under development</p>
        <BaseButton variant="primary" disabled>
          Coming Soon
        </BaseButton>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseIcon from '../components/base/BaseIcon.vue'

export default {
  name: 'AdminInfluencers',
  components: {
    AdminLayout,
    BaseButton,
    BaseIcon
  },
  data() {
    return {
      showCreateModal: false
    }
  }
}
</script>