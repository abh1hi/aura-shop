<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Settings</h1>
          <p class="text-neutral-600 mt-1">Configure your admin panel preferences</p>
        </div>
      </div>
      
      <!-- Placeholder for future implementation -->
      <div class="text-center py-12">
        <BaseIcon name="cog" size="xl" class="mx-auto text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">Settings Panel</h3>
        <p class="text-neutral-500 mb-4">Settings configuration coming soon</p>
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
  name: 'AdminSettings',
  components: {
    AdminLayout,
    BaseButton,
    BaseIcon
  }
}
</script>