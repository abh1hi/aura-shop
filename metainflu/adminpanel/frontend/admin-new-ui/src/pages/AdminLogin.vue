<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
          <span class="text-white font-bold text-2xl">A</span>
        </div>
        <h1 class="text-3xl font-bold text-neutral-900">Aura Admin</h1>
        <p class="text-neutral-600 mt-2">Sign in to your admin account</p>
      </div>
      
      <!-- Account Lockout Warning -->
      <div v-if="authStore.isAccountLocked" class="mb-6">
        <BaseAlert variant="danger">
          <template #icon>
            <BaseIcon name="exclamation-triangle" />
          </template>
          <template #title>Account Temporarily Locked</template>
          <p class="text-sm">
            Too many failed login attempts. Please try again in 
            <strong>{{ authStore.formatLockoutTime }}</strong>
          </p>
        </BaseAlert>
      </div>
      
      <!-- Login Form -->
      <BaseCard variant="elevated" padding="spacious">
        <form @submit.prevent="handleLogin" class="space-y-6" novalidate>
          <!-- Validation Errors -->
          <div v-if="hasValidationErrors" class="space-y-2">
            <BaseAlert variant="danger">
              <template #icon>
                <BaseIcon name="exclamation-circle" />
              </template>
              <template #title>Please fix the following errors:</template>
              <ul class="text-sm list-disc list-inside space-y-1">
                <li v-for="error in validationErrors" :key="error.field">
                  {{ error.message }}
                </li>
              </ul>
            </BaseAlert>
          </div>
          
          <BaseInput
            v-model="form.email"
            type="email"
            label="Email address"
            placeholder="Enter your admin email"
            left-icon="envelope"
            required
            autocomplete="email"
            :error="getFieldError('email')"
            :disabled="authStore.isLoading || authStore.isAccountLocked"
            @input="clearFieldError('email')"
            @blur="validateField('email', form.email)"
          />
          
          <BaseInput
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            left-icon="lock-closed"
            required
            autocomplete="current-password"
            :error="getFieldError('password')"
            :disabled="authStore.isLoading || authStore.isAccountLocked"
            @input="clearFieldError('password')"
          />
          
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="form.remember"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                :disabled="authStore.isLoading"
              >
              <span class="ml-2 text-sm text-neutral-600">Remember me</span>
            </label>
            
            <router-link 
              to="/forgot-password" 
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Forgot password?
            </router-link>
          </div>
          
          <!-- Login Attempts Warning -->
          <div v-if="authStore.loginAttempts > 2 && !authStore.isAccountLocked" class="">
            <BaseAlert variant="warning">
              <template #icon>
                <BaseIcon name="exclamation-triangle" />
              </template>
              <p class="text-sm">
                {{ 5 - authStore.loginAttempts }} login attempts remaining before account lockout.
              </p>
            </BaseAlert>
          </div>
          
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            full-width
            :loading="authStore.isLoading"
            :disabled="!canSubmit"
          >
            <template v-if="authStore.isLoading">
              Signing in...
            </template>
            <template v-else>
              Sign in
            </template>
          </BaseButton>
        </form>
        
        <!-- API Status -->
        <div class="mt-6 pt-6 border-t border-neutral-200">
          <div class="flex items-center justify-between text-sm">
            <span class="text-neutral-500">API Status:</span>
            <div class="flex items-center space-x-2">
              <div 
                :class="[
                  'w-2 h-2 rounded-full',
                  apiStatus === 'connected' ? 'bg-green-500' : 
                  apiStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                ]"
              ></div>
              <span 
                :class="[
                  'text-xs font-medium',
                  apiStatus === 'connected' ? 'text-green-600' : 
                  apiStatus === 'connecting' ? 'text-yellow-600' : 'text-red-600'
                ]"
              >
                {{ apiStatus }}
              </span>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-sm text-neutral-500">
          Having trouble signing in?
          <a href="mailto:support@aurashop.com" class="text-primary-600 hover:text-primary-700 font-medium">
            Contact support
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useAuthValidation } from '../composables/useValidation.js'
import { useToast } from 'vue-toastification'

// Import components
import BaseCard from '../components/base/BaseCard.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseAlert from '../components/base/BaseAlert.vue'
import BaseIcon from '../components/base/BaseIcon.vue'

export default {
  name: 'AdminLogin',
  components: {
    BaseCard,
    BaseInput,
    BaseButton,
    BaseAlert,
    BaseIcon
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    const toast = useToast()
    
    // Validation composable
    const {
      errors: validationErrors,
      validateLogin,
      getFieldError,
      clearFieldError,
      clearAllErrors,
      hasErrors
    } = useAuthValidation()
    
    // Form state
    const form = ref({
      email: '',
      password: '',
      remember: false
    })
    
    const apiStatus = ref('disconnected')
    
    // Computed properties
    const canSubmit = computed(() => {
      return form.value.email && 
             form.value.password && 
             !authStore.isLoading && 
             !authStore.isAccountLocked
    })
    
    const hasValidationErrors = computed(() => {
      return hasErrors()
    })
    
    // Methods
    const validateField = (field, value) => {
      // Simple field validation
      if (field === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          validationErrors.value = validationErrors.value || []
          const existingError = validationErrors.value.find(e => e.field === 'email')
          if (!existingError) {
            validationErrors.value.push({
              field: 'email',
              message: 'Please enter a valid email address'
            })
          }
        }
      }
    }
    
    const handleLogin = async () => {
      try {
        // Clear previous errors
        clearAllErrors()
        
        // Client-side validation
        const validatedData = validateLogin(form.value)
        if (!validatedData) {
          return
        }
        
        // Attempt login
        const response = await authStore.login({
          email: form.value.email,
          password: form.value.password
        })
        
        if (response.success) {
          // Redirect to intended page or dashboard
          const redirectPath = route.query.redirect || '/dashboard'
          router.push(redirectPath)
        }
      } catch (error) {
        console.error('Login failed:', error)
        
        // Handle validation errors from server
        if (error.name === 'ValidationError' && error.details) {
          validationErrors.value = error.details
        }
        
        // Error message is handled by the auth store and toast
      }
    }
    
    const checkAPIStatus = async () => {
      try {
        apiStatus.value = 'connecting'
        
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/info`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        
        if (response.ok) {
          apiStatus.value = 'connected'
        } else {
          apiStatus.value = 'error'
        }
      } catch (error) {
        console.error('API connection check failed:', error)
        apiStatus.value = 'disconnected'
      }
    }
    
    // Lifecycle hooks
    onMounted(() => {
      // Check API status on component mount
      checkAPIStatus()
      
      // Focus email input
      setTimeout(() => {
        const emailInput = document.querySelector('input[type="email"]')
        if (emailInput) {
          emailInput.focus()
        }
      }, 100)
    })
    
    // Watch for form changes to clear errors
    watch(
      () => form.value,
      () => {
        if (hasValidationErrors.value) {
          // Clear errors when user starts typing
          clearAllErrors()
        }
      },
      { deep: true }
    )
    
    return {
      // Store
      authStore,
      
      // Form data
      form,
      apiStatus,
      
      // Computed
      canSubmit,
      hasValidationErrors,
      validationErrors,
      
      // Methods
      handleLogin,
      getFieldError,
      clearFieldError,
      validateField
    }
  }
}
</script>

<style scoped>
/* Custom toast styles */
:deep(.custom-toast) {
  @apply rounded-lg shadow-lg;
}

:deep(.custom-toast-body) {
  @apply text-sm font-medium;
}

/* Loading animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>