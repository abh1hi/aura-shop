<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Hero Banners</h1>
          <p class="text-neutral-600 mt-1">Manage homepage hero banners and promotional content</p>
        </div>
        
        <BaseButton variant="primary" icon="plus" size="sm" @click="showCreateModal = true">
          Add Banner
        </BaseButton>
      </div>
      
      <!-- Banners Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <BaseCard
          v-for="banner in banners"
          :key="banner.id"
          variant="default"
          padding="none"
          class="group"
        >
          <!-- Banner Preview -->
          <div class="relative aspect-video bg-neutral-100 overflow-hidden">
            <img
              v-if="banner.image"
              :src="banner.image"
              :alt="banner.title"
              class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full flex items-center justify-center">
              <BaseIcon name="photo" size="xl" class="text-neutral-400" />
            </div>
            
            <!-- Status Badge -->
            <div class="absolute top-3 left-3">
              <BaseBadge
                :variant="banner.status === 'active' ? 'success' : banner.status === 'scheduled' ? 'warning' : 'neutral'"
                size="sm"
              >
                {{ banner.status }}
              </BaseBadge>
            </div>
            
            <!-- Actions -->
            <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="flex space-x-1">
                <BaseButton
                  variant="secondary"
                  icon-only
                  size="sm"
                  icon="pencil"
                  @click="editBanner(banner)"
                />
                <BaseButton
                  variant="danger"
                  icon-only
                  size="sm"
                  icon="trash"
                  @click="deleteBanner(banner.id)"
                />
              </div>
            </div>
          </div>
          
          <!-- Banner Info -->
          <div class="p-4">
            <h3 class="font-semibold text-neutral-900 mb-2">{{ banner.title }}</h3>
            <p class="text-sm text-neutral-600 mb-3 line-clamp-2">{{ banner.description }}</p>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-neutral-500">Priority:</span>
                <span class="font-medium">{{ banner.priority }}</span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-neutral-500">Clicks:</span>
                <span class="font-medium">{{ banner.clicks.toLocaleString() }}</span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-neutral-500">CTR:</span>
                <span class="font-medium">{{ banner.ctr }}%</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
      
      <!-- Empty State -->
      <div v-if="banners.length === 0" class="text-center py-12">
        <BaseIcon name="photo" size="xl" class="mx-auto text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">No banners found</h3>
        <p class="text-neutral-500 mb-4">Create your first hero banner to get started</p>
        <BaseButton variant="primary" icon="plus" @click="showCreateModal = true">
          Add Banner
        </BaseButton>
      </div>
    </div>
    
    <!-- Create/Edit Modal -->
    <BaseModal
      :show="showCreateModal"
      :title="editingBanner ? 'Edit Banner' : 'Add New Banner'"
      size="xl"
      @close="closeModal"
    >
      <form @submit.prevent="saveBanner" class="space-y-6">
        <BaseInput
          v-model="bannerForm.title"
          label="Banner Title"
          placeholder="Enter banner title"
          required
        />
        
        <BaseInput
          v-model="bannerForm.description"
          label="Description"
          placeholder="Banner description"
        />
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            v-model="bannerForm.buttonText"
            label="Button Text"
            placeholder="Call to action text"
          />
          
          <BaseInput
            v-model="bannerForm.buttonLink"
            label="Button Link"
            placeholder="https://example.com"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BaseSelect
            v-model="bannerForm.status"
            label="Status"
            :options="statusOptions"
            required
          />
          
          <BaseInput
            v-model="bannerForm.priority"
            type="number"
            label="Priority"
            placeholder="1"
            min="1"
            required
          />
          
          <BaseInput
            v-model="bannerForm.position"
            label="Position"
            placeholder="hero-main"
          />
        </div>
      </form>
      
      <template #footer>
        <BaseButton variant="ghost" @click="closeModal">
          Cancel
        </BaseButton>
        <BaseButton variant="primary" @click="saveBanner">
          {{ editingBanner ? 'Update' : 'Create' }} Banner
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

export default {
  name: 'AdminHeroBanners',
  components: {
    AdminLayout,
    BaseCard,
    BaseButton,
    BaseInput,
    BaseSelect,
    BaseModal,
    BaseIcon,
    BaseBadge
  },
  data() {
    return {
      showCreateModal: false,
      editingBanner: null,
      bannerForm: {
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '',
        status: 'active',
        priority: 1,
        position: 'hero-main'
      },
      banners: [
        {
          id: 1,
          title: 'Summer Sale 2023',
          description: 'Up to 50% off on selected items. Limited time offer!',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=300&fit=crop',
          buttonText: 'Shop Now',
          buttonLink: '/products?sale=summer',
          status: 'active',
          priority: 1,
          position: 'hero-main',
          clicks: 12847,
          ctr: 3.2
        },
        {
          id: 2,
          title: 'New Collection Launch',
          description: 'Discover our latest premium collection',
          image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=300&fit=crop',
          buttonText: 'Explore',
          buttonLink: '/collections/new',
          status: 'scheduled',
          priority: 2,
          position: 'hero-secondary',
          clicks: 8234,
          ctr: 2.8
        }
      ],
      statusOptions: [
        { value: 'active', label: 'Active' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  },
  methods: {
    editBanner(banner) {
      this.editingBanner = banner
      this.bannerForm = { ...banner }
      this.showCreateModal = true
    },
    
    deleteBanner(bannerId) {
      if (confirm('Are you sure you want to delete this banner?')) {
        this.banners = this.banners.filter(b => b.id !== bannerId)
      }
    },
    
    saveBanner() {
      if (this.editingBanner) {
        // Update existing banner
        const index = this.banners.findIndex(b => b.id === this.editingBanner.id)
        if (index !== -1) {
          this.banners[index] = { ...this.bannerForm }
        }
      } else {
        // Create new banner
        const newBanner = {
          ...this.bannerForm,
          id: Date.now(),
          clicks: 0,
          ctr: 0
        }
        this.banners.push(newBanner)
      }
      
      this.closeModal()
    },
    
    closeModal() {
      this.showCreateModal = false
      this.editingBanner = null
      this.bannerForm = {
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '',
        status: 'active',
        priority: 1,
        position: 'hero-main'
      }
    }
  }
}
</script>