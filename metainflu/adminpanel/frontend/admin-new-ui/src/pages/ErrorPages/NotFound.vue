<template>
  <div class="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <BaseIcon name="question-mark-circle" class="w-8 h-8 text-primary-600" />
        </div>
        <h1 class="text-6xl font-bold text-neutral-900 mb-2">404</h1>
        <h2 class="text-2xl font-semibold text-neutral-700 mb-4">Page Not Found</h2>
        <p class="text-neutral-600 mb-8">
          The page you're looking for doesn't exist or has been moved. Check the URL and try again.
        </p>
      </div>
      
      <div class="space-y-3">
        <BaseButton variant="primary" full-width @click="goHome">Return to Dashboard</BaseButton>
        <BaseButton variant="ghost" full-width @click="goBack">Go Back</BaseButton>
      </div>
      
      <div class="mt-8">
        <p class="text-sm text-neutral-500 mb-4">Popular pages:</p>
        <div class="flex flex-wrap justify-center gap-2">
          <BaseButton variant="outline" size="sm" @click="$router.push('/products')">Products</BaseButton>
          <BaseButton variant="outline" size="sm" @click="$router.push('/orders')">Orders</BaseButton>
          <BaseButton variant="outline" size="sm" @click="$router.push('/users')">Users</BaseButton>
          <BaseButton variant="outline" size="sm" @click="$router.push('/analytics')">Analytics</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import BaseIcon from '../../components/base/BaseIcon.vue'
import BaseButton from '../../components/base/BaseButton.vue'

export default {
  name: 'NotFound',
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