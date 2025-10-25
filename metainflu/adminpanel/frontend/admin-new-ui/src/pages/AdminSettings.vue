<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Settings</h1>
        <p class="text-neutral-600 mt-1">Configure application settings and preferences</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- General Settings -->
        <BaseCard title="General Settings">
          <div class="space-y-4">
            <BaseInput v-model="settings.siteName" label="Site Name" />
            <BaseInput v-model="settings.siteDescription" label="Site Description" />
            <BaseInput v-model="settings.contactEmail" label="Contact Email" type="email" />
            <BaseInput v-model="settings.supportPhone" label="Support Phone" type="tel" />
            
            <div class="flex justify-end">
              <BaseButton variant="primary" @click="saveGeneralSettings" :loading="isSaving">Save Changes</BaseButton>
            </div>
          </div>
        </BaseCard>
        
        <!-- Email Settings -->
        <BaseCard title="Email Configuration">
          <div class="space-y-4">
            <BaseInput v-model="emailSettings.smtpHost" label="SMTP Host" />
            <BaseInput v-model="emailSettings.smtpPort" label="SMTP Port" type="number" />
            <BaseInput v-model="emailSettings.smtpUser" label="SMTP Username" />
            <BaseInput v-model="emailSettings.smtpPassword" label="SMTP Password" type="password" />
            
            <div class="flex justify-between">
              <BaseButton variant="secondary" @click="testEmailSettings">Test Connection</BaseButton>
              <BaseButton variant="primary" @click="saveEmailSettings" :loading="isSaving">Save Settings</BaseButton>
            </div>
          </div>
        </BaseCard>
        
        <!-- Security Settings -->
        <BaseCard title="Security Settings">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Two-Factor Authentication</div>
                <div class="text-sm text-neutral-500">Add an extra layer of security</div>
              </div>
              <BaseButton variant="outline" size="sm">Configure</BaseButton>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Session Timeout</div>
                <div class="text-sm text-neutral-500">Auto-logout after inactivity</div>
              </div>
              <BaseSelect v-model="securitySettings.sessionTimeout" :options="timeoutOptions" class="w-32" />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Login Notifications</div>
                <div class="text-sm text-neutral-500">Get notified of new logins</div>
              </div>
              <BaseToggle v-model="securitySettings.loginNotifications" />
            </div>
          </div>
        </BaseCard>
        
        <!-- System Information -->
        <BaseCard title="System Information">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-neutral-600">Version:</span>
              <span class="font-medium">{{ systemInfo.version }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-600">Environment:</span>
              <span class="font-medium capitalize">{{ systemInfo.environment }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-600">API Status:</span>
              <BaseBadge :variant="systemInfo.apiConnected ? 'success' : 'danger'">
                {{ systemInfo.apiConnected ? 'Connected' : 'Disconnected' }}
              </BaseBadge>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-600">Database:</span>
              <BaseBadge :variant="systemInfo.dbConnected ? 'success' : 'danger'">
                {{ systemInfo.dbConnected ? 'Connected' : 'Disconnected' }}
              </BaseBadge>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useToast } from 'vue-toastification'

import AdminLayout from '../layouts/AdminLayout.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseSelect from '../components/base/BaseSelect.vue'
import BaseToggle from '../components/base/BaseToggle.vue'
import BaseBadge from '../components/base/BaseBadge.vue'

export default {
  name: 'AdminSettings',
  components: { AdminLayout, BaseCard, BaseInput, BaseButton, BaseSelect, BaseToggle, BaseBadge },
  setup() {
    const authStore = useAuthStore()
    const toast = useToast()
    
    const isSaving = ref(false)
    
    const settings = ref({
      siteName: 'Aura Shop',
      siteDescription: 'Modern e-commerce platform',
      contactEmail: 'contact@aurashop.com',
      supportPhone: '+1 (555) 123-4567'
    })
    
    const emailSettings = ref({
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: ''
    })
    
    const securitySettings = ref({
      sessionTimeout: '15m',
      loginNotifications: true
    })
    
    const timeoutOptions = [
      { value: '5m', label: '5 minutes' },
      { value: '15m', label: '15 minutes' },
      { value: '30m', label: '30 minutes' },
      { value: '1h', label: '1 hour' },
      { value: '2h', label: '2 hours' }
    ]
    
    const systemInfo = ref({
      version: '1.2.0',
      environment: 'development',
      apiConnected: true,
      dbConnected: true
    })
    
    const saveGeneralSettings = async () => {
      try {
        isSaving.value = true
        // TODO: Implement settings save API
        toast.success('Settings saved successfully')
      } catch (error) {
        toast.error('Failed to save settings')
      } finally {
        isSaving.value = false
      }
    }
    
    const saveEmailSettings = async () => {
      try {
        isSaving.value = true
        // TODO: Implement email settings API
        toast.success('Email settings saved successfully')
      } catch (error) {
        toast.error('Failed to save email settings')
      } finally {
        isSaving.value = false
      }
    }
    
    const testEmailSettings = async () => {
      try {
        // TODO: Implement email test API
        toast.success('Email configuration test successful')
      } catch (error) {
        toast.error('Email configuration test failed')
      }
    }
    
    const getFieldError = (field) => {
      // Placeholder for validation errors
      return null
    }
    
    onMounted(() => {
      // Load current settings
    })
    
    return {
      authStore,
      settings,
      emailSettings,
      securitySettings,
      systemInfo,
      timeoutOptions,
      isSaving,
      saveGeneralSettings,
      saveEmailSettings,
      testEmailSettings,
      getFieldError
    }
  }
}
</script>