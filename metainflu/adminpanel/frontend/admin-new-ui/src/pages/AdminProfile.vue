<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Profile</h1>
        <p class="text-neutral-600 mt-1">Manage your account settings and security</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Information -->
        <div class="lg:col-span-2">
          <BaseCard title="Profile Information">
            <form @submit.prevent="updateProfile" class="space-y-4">
              <BaseInput v-model="profileForm.name" label="Full Name" required :error="getFieldError('name')" />
              <BaseInput v-model="profileForm.email" label="Email Address" type="email" disabled />
              <BaseInput v-model="profileForm.phone" label="Phone Number" type="tel" :error="getFieldError('phone')" />
              
              <div class="flex justify-end space-x-3">
                <BaseButton variant="secondary" @click="resetProfileForm">Reset</BaseButton>
                <BaseButton variant="primary" type="submit" :loading="isUpdatingProfile">Update Profile</BaseButton>
              </div>
            </form>
          </BaseCard>
          
          <!-- Security Settings -->
          <BaseCard title="Security" class="mt-6">
            <form @submit.prevent="changePassword" class="space-y-4">
              <BaseInput v-model="passwordForm.currentPassword" label="Current Password" type="password" required :error="getFieldError('currentPassword')" />
              <BaseInput v-model="passwordForm.newPassword" label="New Password" type="password" required :error="getFieldError('newPassword')" />
              <BaseInput v-model="passwordForm.confirmPassword" label="Confirm New Password" type="password" required :error="getFieldError('confirmPassword')" />
              
              <!-- Password Strength Indicator -->
              <div v-if="passwordForm.newPassword" class="space-y-2">
                <div class="text-sm text-neutral-600">Password Strength:</div>
                <div class="flex space-x-1">
                  <div v-for="i in 5" :key="i" :class="[
                    'h-2 w-8 rounded',
                    i <= passwordStrength.score ? 
                      passwordStrength.strength === 'strong' ? 'bg-green-500' :
                      passwordStrength.strength === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    : 'bg-neutral-200'
                  ]"></div>
                </div>
                <div class="text-sm" :class="{
                  'text-green-600': passwordStrength.strength === 'strong',
                  'text-yellow-600': passwordStrength.strength === 'medium',
                  'text-red-600': passwordStrength.strength === 'weak'
                }">
                  {{ passwordStrength.strength === 'strong' ? 'Strong' : passwordStrength.strength === 'medium' ? 'Medium' : 'Weak' }} password
                </div>
              </div>
              
              <div class="flex justify-end">
                <BaseButton variant="primary" type="submit" :loading="isChangingPassword">Change Password</BaseButton>
              </div>
            </form>
          </BaseCard>
        </div>
        
        <!-- Account Overview -->
        <div>
          <BaseCard title="Account Overview">
            <div class="space-y-4">
              <div>
                <div class="text-sm text-neutral-500">Role</div>
                <div class="font-medium capitalize">{{ authStore.user?.role }}</div>
              </div>
              <div>
                <div class="text-sm text-neutral-500">Email Status</div>
                <div class="flex items-center space-x-2">
                  <BaseBadge :variant="authStore.user?.emailVerified ? 'success' : 'warning'">
                    {{ authStore.user?.emailVerified ? 'Verified' : 'Unverified' }}
                  </BaseBadge>
                </div>
              </div>
              <div>
                <div class="text-sm text-neutral-500">Member Since</div>
                <div class="font-medium">{{ formatDate(authStore.user?.createdAt) }}</div>
              </div>
              <div>
                <div class="text-sm text-neutral-500">Last Login</div>
                <div class="font-medium">{{ formatDate(authStore.user?.lastLogin) }}</div>
              </div>
            </div>
          </BaseCard>
          
          <!-- Account Actions -->
          <BaseCard title="Account Actions" class="mt-6">
            <div class="space-y-3">
              <BaseButton variant="secondary" full-width icon="arrow-path" @click="refreshUserData" :loading="isRefreshing">
                Refresh Account Data
              </BaseButton>
              <BaseButton variant="danger" full-width icon="power" @click="confirmLogout">
                Sign Out
              </BaseButton>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
    
    <!-- Logout Confirmation -->
    <ConfirmDialog
      :show="showLogoutDialog"
      title="Sign Out"
      message="Are you sure you want to sign out of your account?"
      confirm-text="Sign Out"
      confirm-variant="danger"
      @confirm="handleLogout"
      @cancel="showLogoutDialog = false"
    />
  </AdminLayout>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useAuthValidation } from '../composables/useValidation.js'
import { useToast } from 'vue-toastification'

import AdminLayout from '../layouts/AdminLayout.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseBadge from '../components/base/BaseBadge.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

export default {
  name: 'AdminProfile',
  components: { AdminLayout, BaseCard, BaseInput, BaseButton, BaseBadge, ConfirmDialog },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()
    const { checkPasswordStrength, getFieldError } = useAuthValidation()
    
    const isUpdatingProfile = ref(false)
    const isChangingPassword = ref(false)
    const isRefreshing = ref(false)
    const showLogoutDialog = ref(false)
    
    const profileForm = ref({
      name: authStore.user?.name || '',
      email: authStore.user?.email || '',
      phone: authStore.user?.phone || ''
    })
    
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    const passwordStrength = computed(() => {
      return checkPasswordStrength(passwordForm.value.newPassword)
    })
    
    const updateProfile = async () => {
      try {
        isUpdatingProfile.value = true
        await authStore.updateProfile(profileForm.value)
      } catch (error) {
        console.error('Profile update failed:', error)
      } finally {
        isUpdatingProfile.value = false
      }
    }
    
    const changePassword = async () => {
      try {
        isChangingPassword.value = true
        await authStore.changePassword(passwordForm.value)
        passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
      } catch (error) {
        console.error('Password change failed:', error)
      } finally {
        isChangingPassword.value = false
      }
    }
    
    const resetProfileForm = () => {
      profileForm.value = {
        name: authStore.user?.name || '',
        email: authStore.user?.email || '',
        phone: authStore.user?.phone || ''
      }
    }
    
    const refreshUserData = async () => {
      try {
        isRefreshing.value = true
        await authStore.refreshUserData()
        resetProfileForm()
        toast.success('Account data refreshed')
      } catch (error) {
        toast.error('Failed to refresh account data')
      } finally {
        isRefreshing.value = false
      }
    }
    
    const confirmLogout = () => {
      showLogoutDialog.value = true
    }
    
    const handleLogout = async () => {
      await authStore.logout()
      router.push('/login')
    }
    
    const formatDate = (date) => {
      return date ? new Date(date).toLocaleDateString() : 'N/A'
    }
    
    return {
      authStore,
      profileForm,
      passwordForm,
      passwordStrength,
      isUpdatingProfile,
      isChangingPassword,
      isRefreshing,
      showLogoutDialog,
      updateProfile,
      changePassword,
      resetProfileForm,
      refreshUserData,
      confirmLogout,
      handleLogout,
      formatDate,
      getFieldError
    }
  }
}
</script>