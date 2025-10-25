<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p class="text-gray-600">Register to get started with Aura Shop</p>
      </div>

      <!-- Alert for messages -->
      <BaseAlert
        v-if="alert.show"
        :type="alert.type"
        :message="alert.message"
        @close="alert.show = false"
        class="mb-6"
      />

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Name Field -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <BaseInput
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Enter your full name"
            :disabled="loading"
            :error="errors.name"
            required
          />
        </div>

        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <BaseInput
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            :disabled="loading"
            :error="errors.email"
            required
          />
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <BaseInput
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            :disabled="loading"
            :error="errors.password"
            required
          />
          <p class="text-sm text-gray-500 mt-1">
            Password must be at least 8 characters with uppercase, lowercase, number, and special character
          </p>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <BaseInput
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            :disabled="loading"
            :error="errors.confirmPassword"
            required
          />
        </div>

        <!-- Terms and Privacy -->
        <div class="space-y-3">
          <label class="flex items-start space-x-3">
            <input
              v-model="form.termsAccepted"
              type="checkbox"
              class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              :disabled="loading"
              required
            >
            <span class="text-sm text-gray-700">
              I agree to the
              <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms of Service</a>
              and
              <a href="#" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
            </span>
          </label>

          <label class="flex items-start space-x-3">
            <input
              v-model="form.privacyPolicyAccepted"
              type="checkbox"
              class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              :disabled="loading"
              required
            >
            <span class="text-sm text-gray-700">
              I acknowledge that I have read and understood the Privacy Policy
            </span>
          </label>

          <label class="flex items-start space-x-3">
            <input
              v-model="form.marketingConsent"
              type="checkbox"
              class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              :disabled="loading"
            >
            <span class="text-sm text-gray-700">
              I would like to receive marketing emails and updates (optional)
            </span>
          </label>
        </div>

        <!-- Submit Button -->
        <BaseButton
          type="submit"
          variant="primary"
          :loading="loading"
          :disabled="!canSubmit"
          class="w-full"
        >
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </BaseButton>
      </form>

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <router-link
            to="/login"
            class="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign in
          </router-link>
        </p>
      </div>

      <!-- Debug Info (Development Only) -->
      <div v-if="isDevelopment" class="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Development Info:</h3>
        <p class="text-xs text-gray-600 mb-1">
          New accounts are created with 'user' role by default
        </p>
        <p class="text-xs text-gray-600">
          After registration, you can update the role to 'admin' in the database
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseAlert from '../components/base/BaseAlert.vue'
import authService from '../services/authService.js'

export default {
  name: 'AdminRegister',
  components: {
    BaseInput,
    BaseButton,
    BaseAlert
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const isDevelopment = import.meta.env.DEV

    // Form data
    const form = ref({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      privacyPolicyAccepted: false,
      marketingConsent: false,
      role: 'user' // Default role - will be updated to admin later
    })

    // Form errors
    const errors = ref({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    // Alert state
    const alert = ref({
      show: false,
      type: 'info',
      message: ''
    })

    // Validation
    const validateForm = () => {
      const newErrors = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }

      let isValid = true

      // Name validation
      if (!form.value.name.trim()) {
        newErrors.name = 'Name is required'
        isValid = false
      } else if (form.value.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters'
        isValid = false
      } else if (!/^[a-zA-Z\s]+$/.test(form.value.name)) {
        newErrors.name = 'Name can only contain letters and spaces'
        isValid = false
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.value.email) {
        newErrors.email = 'Email is required'
        isValid = false
      } else if (!emailRegex.test(form.value.email)) {
        newErrors.email = 'Invalid email format'
        isValid = false
      }

      // Password validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      if (!form.value.password) {
        newErrors.password = 'Password is required'
        isValid = false
      } else if (form.value.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
        isValid = false
      } else if (!passwordRegex.test(form.value.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, number, and special character'
        isValid = false
      }

      // Confirm password validation
      if (!form.value.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
        isValid = false
      } else if (form.value.password !== form.value.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
        isValid = false
      }

      errors.value = newErrors
      return isValid
    }

    // Can submit computed
    const canSubmit = computed(() => {
      return (
        form.value.name.trim() &&
        form.value.email.trim() &&
        form.value.password &&
        form.value.confirmPassword &&
        form.value.termsAccepted &&
        form.value.privacyPolicyAccepted &&
        !loading.value
      )
    })

    // Show alert
    const showAlert = (type, message) => {
      alert.value = {
        show: true,
        type,
        message
      }
    }

    // Handle registration
    const handleRegister = async () => {
      // Validate form
      if (!validateForm()) {
        showAlert('error', 'Please fix the errors below')
        return
      }

      loading.value = true

      try {
        // Prepare registration data
        const registrationData = {
          name: form.value.name.trim(),
          email: form.value.email.trim().toLowerCase(),
          password: form.value.password,
          role: form.value.role, // 'user' by default
          termsAccepted: form.value.termsAccepted,
          privacyPolicyAccepted: form.value.privacyPolicyAccepted,
          marketingConsent: form.value.marketingConsent
        }

        // Call registration API
        const response = await authService.register(registrationData)

        // Show success message
        showAlert('success', 
          `Registration successful! Account created with email: ${response.user.email}. ` +
          'You can now sign in to the admin panel. To make this account an admin, ' +
          'update the role to "admin" in the database.'
        )

        // Clear form
        form.value = {
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          termsAccepted: false,
          privacyPolicyAccepted: false,
          marketingConsent: false,
          role: 'user'
        }

        errors.value = {
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        }

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)

      } catch (error) {
        console.error('Registration error:', error)
        
        if (error.response?.data?.errors) {
          // Handle validation errors from server
          const serverErrors = error.response.data.errors
          let errorMessage = 'Registration failed: '
          
          if (Array.isArray(serverErrors)) {
            errorMessage += serverErrors.join(', ')
          } else {
            errorMessage += serverErrors
          }
          
          showAlert('error', errorMessage)
        } else if (error.response?.data?.message) {
          showAlert('error', error.response.data.message)
        } else if (error.message) {
          showAlert('error', error.message)
        } else {
          showAlert('error', 'Registration failed. Please try again.')
        }
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      errors,
      alert,
      loading,
      canSubmit,
      isDevelopment,
      handleRegister
    }
  }
}
</script>

<style scoped>
/* Additional styles if needed */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>