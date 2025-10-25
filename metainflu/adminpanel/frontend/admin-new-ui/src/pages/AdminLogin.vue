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
      
      <!-- Login Form -->
      <BaseCard variant="elevated" padding="spacious">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <BaseInput
            v-model="form.email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            left-icon="envelope"
            required
            :error="errors.email"
          />
          
          <BaseInput
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            left-icon="lock-closed"
            required
            :error="errors.password"
          />
          
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="form.remember"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              >
              <span class="ml-2 text-sm text-neutral-600">Remember me</span>
            </label>
            
            <a href="#" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Forgot password?
            </a>
          </div>
          
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            full-width
            :loading="loading"
          >
            Sign in
          </BaseButton>
        </form>
      </BaseCard>
      
      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-sm text-neutral-500">
          Don't have an account?
          <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">
            Contact support
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import BaseCard from '../components/base/BaseCard.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'

export default {
  name: 'AdminLogin',
  components: {
    BaseCard,
    BaseInput,
    BaseButton
  },
  data() {
    return {
      loading: false,
      form: {
        email: '',
        password: '',
        remember: false
      },
      errors: {
        email: null,
        password: null
      }
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.errors = { email: null, password: null }
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Redirect to dashboard
        this.$router.push('/dashboard')
      } catch (error) {
        console.error('Login failed:', error)
        this.errors.email = 'Invalid email or password'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
