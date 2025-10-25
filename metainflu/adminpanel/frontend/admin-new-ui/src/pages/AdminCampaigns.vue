<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Campaigns</h1>
          <p class="text-neutral-600 mt-1">Manage marketing campaigns and promotions</p>
        </div>
        
        <BaseButton variant="primary" icon="plus" size="sm" @click="showCreateModal = true">
          Create Campaign
        </BaseButton>
      </div>
      
      <!-- Campaign Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          label="Active Campaigns"
          :value="campaignStats.active"
          icon="megaphone"
          icon-color="primary"
        />
        <MetricCard
          label="Total Reach"
          :value="campaignStats.totalReach.toLocaleString()"
          icon="users"
          icon-color="success"
          :trend="{ type: 'up', value: '15.2%' }"
        />
        <MetricCard
          label="Avg. Engagement"
          :value="campaignStats.avgEngagement + '%'"
          icon="heart"
          icon-color="danger"
          :trend="{ type: 'up', value: '3.8%' }"
        />
        <MetricCard
          label="Total Spend"
          :value="campaignStats.totalSpend"
          currency
          icon="credit-card"
          icon-color="warning"
        />
      </div>
      
      <!-- Campaigns Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <BaseCard
          v-for="campaign in campaigns"
          :key="campaign.id"
          variant="default"
          padding="normal"
          class="group"
        >
          <!-- Campaign Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="font-semibold text-neutral-900 mb-1">{{ campaign.name }}</h3>
              <p class="text-sm text-neutral-500 line-clamp-2">{{ campaign.description }}</p>
            </div>
            
            <div class="flex items-center space-x-2">
              <BaseBadge
                :variant="getStatusVariant(campaign.status)"
                size="sm"
              >
                {{ campaign.status }}
              </BaseBadge>
              
              <BaseButton
                variant="ghost"
                icon-only
                size="sm"
                icon="ellipsis-horizontal"
              />
            </div>
          </div>
          
          <!-- Campaign Metrics -->
          <div class="space-y-3 mb-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600">Reach</span>
              <span class="font-medium text-neutral-900">{{ campaign.reach.toLocaleString() }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600">Engagement</span>
              <span class="font-medium text-neutral-900">{{ campaign.engagement }}%</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600">Budget</span>
              <span class="font-medium text-neutral-900">${{ campaign.budget.toLocaleString() }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-neutral-600">Spent</span>
              <span class="font-medium text-neutral-900">${{ campaign.spent.toLocaleString() }}</span>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="mb-4">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-neutral-600">Progress</span>
              <span class="font-medium text-neutral-900">{{ Math.round((campaign.spent / campaign.budget) * 100) }}%</span>
            </div>
            <div class="w-full bg-neutral-200 rounded-full h-2">
              <div 
                class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: Math.min((campaign.spent / campaign.budget) * 100, 100) + '%' }"
              ></div>
            </div>
          </div>
          
          <!-- Campaign Dates -->
          <div class="text-xs text-neutral-500 mb-4">
            {{ formatDateRange(campaign.startDate, campaign.endDate) }}
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <BaseButton
              variant="secondary"
              size="sm"
              icon="pencil"
              @click="editCampaign(campaign)"
              class="flex-1"
            >
              Edit
            </BaseButton>
            
            <BaseButton
              variant="ghost"
              icon-only
              size="sm"
              icon="eye"
              @click="viewCampaign(campaign)"
            />
            
            <BaseButton
              variant="ghost"
              icon-only
              size="sm"
              icon="chart-bar"
              @click="viewAnalytics(campaign)"
            />
          </div>
        </BaseCard>
      </div>
      
      <!-- Empty State -->
      <div v-if="campaigns.length === 0" class="text-center py-12">
        <BaseIcon name="megaphone" size="xl" class="mx-auto text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">No campaigns found</h3>
        <p class="text-neutral-500 mb-4">Create your first marketing campaign</p>
        <BaseButton variant="primary" icon="plus" @click="showCreateModal = true">
          Create Campaign
        </BaseButton>
      </div>
    </div>
    
    <!-- Create/Edit Modal -->
    <BaseModal
      :show="showCreateModal"
      :title="editingCampaign ? 'Edit Campaign' : 'Create New Campaign'"
      size="xl"
      @close="closeModal"
    >
      <form @submit.prevent="saveCampaign" class="space-y-6">
        <BaseInput
          v-model="campaignForm.name"
          label="Campaign Name"
          placeholder="Enter campaign name"
          required
        />
        
        <BaseInput
          v-model="campaignForm.description"
          label="Description"
          placeholder="Campaign description"
        />
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseSelect
            v-model="campaignForm.type"
            label="Campaign Type"
            :options="campaignTypes"
            required
          />
          
          <BaseSelect
            v-model="campaignForm.status"
            label="Status"
            :options="statusOptions"
            required
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            v-model="campaignForm.budget"
            type="number"
            label="Budget"
            placeholder="0"
            required
          />
          
          <BaseInput
            v-model="campaignForm.targetAudience"
            label="Target Audience"
            placeholder="e.g., Age 25-45, Tech enthusiasts"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            v-model="campaignForm.startDate"
            type="date"
            label="Start Date"
            required
          />
          
          <BaseInput
            v-model="campaignForm.endDate"
            type="date"
            label="End Date"
            required
          />
        </div>
      </form>
      
      <template #footer>
        <BaseButton variant="ghost" @click="closeModal">
          Cancel
        </BaseButton>
        <BaseButton variant="primary" @click="saveCampaign">
          {{ editingCampaign ? 'Update' : 'Create' }} Campaign
        </BaseButton>
      </template>
    </BaseModal>
  </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseSelect from '../components/base/BaseSelect.vue'
import BaseModal from '../components/base/BaseModal.vue'
import BaseIcon from '../components/base/BaseIcon.vue'
import BaseBadge from '../components/base/BaseBadge.vue'
import MetricCard from '../components/dashboard/MetricCard.vue'

export default {
  name: 'AdminCampaigns',
  components: {
    AdminLayout,
    BaseCard,
    BaseButton,
    BaseInput,
    BaseSelect,
    BaseModal,
    BaseIcon,
    BaseBadge,
    MetricCard
  },
  data() {
    return {
      showCreateModal: false,
      editingCampaign: null,
      campaignForm: {
        name: '',
        description: '',
        type: '',
        status: 'draft',
        budget: '',
        targetAudience: '',
        startDate: '',
        endDate: ''
      },
      campaignStats: {
        active: 8,
        totalReach: 125847,
        avgEngagement: 4.2,
        totalSpend: 24567
      },
      campaigns: [
        {
          id: 1,
          name: 'Summer Sale 2023',
          description: 'Promote summer collection with up to 50% off',
          type: 'promotional',
          status: 'active',
          budget: 10000,
          spent: 7500,
          reach: 45678,
          engagement: 3.8,
          targetAudience: 'Age 25-45, Fashion lovers',
          startDate: new Date('2023-06-01'),
          endDate: new Date('2023-08-31')
        },
        {
          id: 2,
          name: 'Tech Product Launch',
          description: 'Launch campaign for new smartphone line',
          type: 'product_launch',
          status: 'scheduled',
          budget: 15000,
          spent: 0,
          reach: 0,
          engagement: 0,
          targetAudience: 'Tech enthusiasts, Early adopters',
          startDate: new Date('2023-12-01'),
          endDate: new Date('2023-12-31')
        },
        {
          id: 3,
          name: 'Holiday Special',
          description: 'Black Friday and Cyber Monday promotions',
          type: 'seasonal',
          status: 'completed',
          budget: 8000,
          spent: 7800,
          reach: 32145,
          engagement: 5.2,
          targetAudience: 'Bargain hunters, General audience',
          startDate: new Date('2023-11-20'),
          endDate: new Date('2023-11-30')
        }
      ],
      campaignTypes: [
        { value: 'promotional', label: 'Promotional' },
        { value: 'product_launch', label: 'Product Launch' },
        { value: 'brand_awareness', label: 'Brand Awareness' },
        { value: 'seasonal', label: 'Seasonal' },
        { value: 'retargeting', label: 'Retargeting' }
      ],
      statusOptions: [
        { value: 'draft', label: 'Draft' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'active', label: 'Active' },
        { value: 'paused', label: 'Paused' },
        { value: 'completed', label: 'Completed' }
      ]
    }
  },
  methods: {
    getStatusVariant(status) {
      const variants = {
        active: 'success',
        scheduled: 'info',
        paused: 'warning',
        completed: 'neutral',
        draft: 'neutral'
      }
      return variants[status] || 'neutral'
    },
    
    formatDateRange(startDate, endDate) {
      const options = { month: 'short', day: 'numeric', year: 'numeric' }
      const start = startDate.toLocaleDateString('en-US', options)
      const end = endDate.toLocaleDateString('en-US', options)
      return `${start} - ${end}`
    },
    
    editCampaign(campaign) {
      this.editingCampaign = campaign
      this.campaignForm = {
        ...campaign,
        startDate: campaign.startDate.toISOString().split('T')[0],
        endDate: campaign.endDate.toISOString().split('T')[0]
      }
      this.showCreateModal = true
    },
    
    viewCampaign(campaign) {
      console.log('Viewing campaign:', campaign)
    },
    
    viewAnalytics(campaign) {
      console.log('Viewing analytics for campaign:', campaign)
    },
    
    saveCampaign() {
      const formData = {
        ...this.campaignForm,
        startDate: new Date(this.campaignForm.startDate),
        endDate: new Date(this.campaignForm.endDate),
        budget: parseFloat(this.campaignForm.budget)
      }
      
      if (this.editingCampaign) {
        // Update existing campaign
        const index = this.campaigns.findIndex(c => c.id === this.editingCampaign.id)
        if (index !== -1) {
          this.campaigns[index] = { ...this.campaigns[index], ...formData }
        }
      } else {
        // Create new campaign
        const newCampaign = {
          ...formData,
          id: Date.now(),
          spent: 0,
          reach: 0,
          engagement: 0
        }
        this.campaigns.push(newCampaign)
      }
      
      this.closeModal()
    },
    
    closeModal() {
      this.showCreateModal = false
      this.editingCampaign = null
      this.campaignForm = {
        name: '',
        description: '',
        type: '',
        status: 'draft',
        budget: '',
        targetAudience: '',
        startDate: '',
        endDate: ''
      }
    }
  }
}
</script>