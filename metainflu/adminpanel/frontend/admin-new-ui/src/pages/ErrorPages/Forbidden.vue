<template>
  <div class="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <BaseIcon name="shield-exclamation" class="w-8 h-8 text-red-600" />
        </div>
        <h1 class="text-6xl font-bold text-neutral-900 mb-2">403</h1>
        <h2 class="text-2xl font-semibold text-neutral-700 mb-4">Access Denied</h2>
        <p class="text-neutral-600 mb-8">
          You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
        </p>
      </div>
      
      <div class="space-y-3">
        <BaseButton variant="primary" full-width @click="goBack">Go Back</BaseButton>
        <BaseButton variant="ghost" full-width @click="goHome">Return to Dashboard</BaseButton>
      </div>
      
      <div class="mt-8 text-center">
        <p class="text-sm text-neutral-500">
          Need help? 
          <a href="mailto:support@aurashop.com" class="text-primary-600 hover:text-primary-700 font-medium">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import BaseIcon from '../../components/base/BaseIcon.vue'
import BaseButton from '../../components/base/BaseButton.vue'

export default {
  name: 'Forbidden',
  components: { BaseIcon, BaseButton },
  setup() {
    const router = useRouter()
    
    const goBack = () => {
      router.go(-1)
    }
    
    const goHome = () => {
      router.push('/dashboard')
    }
    
    return { goBack, goHome }
  }
}
</script>