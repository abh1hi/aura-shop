<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Featured Collections</h1>
          <p class="text-neutral-600 mt-1">Curate and manage featured product collections</p>
        </div>
        
        <BaseButton variant="primary" icon="plus" size="sm" @click="showCreateModal = true">
          Add Collection
        </BaseButton>
      </div>
      
      <!-- Collections List -->
      <BaseCard variant="default" padding="none">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Collection
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Products
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Priority
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Performance
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              <tr v-for="collection in collections" :key="collection.id" class="hover:bg-neutral-50">
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <img
                      :src="collection.image"
                      :alt="collection.name"
                      class="w-12 h-12 rounded-lg object-cover"
                    >
                    <div>
                      <div class="font-medium text-neutral-900">{{ collection.name }}</div>
                      <div class="text-sm text-neutral-500">{{ collection.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-neutral-900">
                  {{ collection.productCount }} products
                </td>
                <td class="px-6 py-4">
                  <BaseBadge
                    :variant="getStatusVariant(collection.status)"
                    size="sm"
                  >
                    {{ collection.status }}
                  </BaseBadge>
                </td>
                <td class="px-6 py-4 text-sm text-neutral-900">
                  {{ collection.priority }}
                </td>
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <div class="text-sm font-medium text-neutral-900">
                      {{ collection.views.toLocaleString() }} views
                    </div>
                    <div class="text-xs text-neutral-500">
                      {{ collection.conversionRate }}% conversion
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <BaseButton
                      variant="ghost"
                      icon-only
                      size="sm"
                      icon="pencil"
                      @click="editCollection(collection)"
                    />
                    <BaseButton
                      variant="ghost"
                      icon-only
                      size="sm"
                      icon="eye"
                      @click="viewProducts(collection)"
                    />
                    <BaseButton
                      variant="ghost"
                      icon-only
                      size="sm"
                      icon="trash"
                      @click="deleteCollection(collection.id)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>
      
      <!-- Empty State -->
      <div v-if="collections.length === 0" class="text-center py-12">
        <BaseIcon name="squares-2x2" size="xl" class="mx-auto text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">No collections found</h3>
        <p class="text-neutral-500 mb-4">Create your first featured collection</p>
        <BaseButton variant="primary" icon="plus" @click="showCreateModal = true">
          Add Collection
        </BaseButton>
      </div>
    </div>
    
    <!-- Create/Edit Modal -->
    <BaseModal
      :show="showCreateModal"
      :title="editingCollection ? 'Edit Collection' : 'Add New Collection'"
      size="xl"
      @close="closeModal"
    >
      <form @submit.prevent="saveCollection" class="space-y-6">
        <BaseInput
          v-model="collectionForm.name"
          label="Collection Name"
          placeholder="Enter collection name"
          required
        />
        
        <BaseInput
          v-model="collectionForm.description"
          label="Description"
          placeholder="Collection description"
        />
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BaseSelect
            v-model="collectionForm.status"
            label="Status"
            :options="statusOptions"
            required
          />
          
          <BaseInput
            v-model="collectionForm.priority"
            type="number"
            label="Priority"
            placeholder="1"
            min="1"
            required
          />
          
          <BaseInput
            v-model="collectionForm.slug"
            label="URL Slug"
            placeholder="collection-slug"
            required
          />
        </div>
        
        <BaseInput
          v-model="collectionForm.tags"
          label="Tags"
          placeholder="tag1, tag2, tag3"
          help-text="Comma-separated list of tags"
        />
      </form>
      
      <template #footer>
        <BaseButton variant="ghost" @click="closeModal">
          Cancel
        </BaseButton>
        <BaseButton variant="primary" @click="saveCollection">
          {{ editingCollection ? 'Update' : 'Create' }} Collection
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
  name: 'AdminFeaturedCollections',
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
      editingCollection: null,
      collectionForm: {
        name: '',
        description: '',
        status: 'active',
        priority: 1,
        slug: '',
        tags: ''
      },
      collections: [
        {
          id: 1,
          name: 'Summer Essentials',
          description: 'Must-have items for the summer season',
          image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&h=100&fit=crop',
          status: 'active',
          priority: 1,
          slug: 'summer-essentials',
          productCount: 24,
          views: 15847,
          conversionRate: 4.2
        },
        {
          id: 2,
          name: 'Tech Gadgets',
          description: 'Latest technology and gadgets',
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop',
          status: 'active',
          priority: 2,
          slug: 'tech-gadgets',
          productCount: 18,
          views: 12394,
          conversionRate: 3.8
        },
        {
          id: 3,
          name: 'Home Decor',
          description: 'Beautiful items for your home',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop',
          status: 'draft',
          priority: 3,
          slug: 'home-decor',
          productCount: 32,
          views: 8756,
          conversionRate: 2.9
        }
      ],
      statusOptions: [
        { value: 'active', label: 'Active' },
        { value: 'draft', label: 'Draft' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  },
  methods: {
    getStatusVariant(status) {
      const variants = {
        active: 'success',
        draft: 'warning',
        inactive: 'neutral'
      }
      return variants[status] || 'neutral'
    },
    
    editCollection(collection) {
      this.editingCollection = collection
      this.collectionForm = { ...collection }
      this.showCreateModal = true
    },
    
    viewProducts(collection) {
      // Navigate to products page with collection filter
      this.$router.push(`/products?collection=${collection.id}`)
    },
    
    deleteCollection(collectionId) {
      if (confirm('Are you sure you want to delete this collection?')) {
        this.collections = this.collections.filter(c => c.id !== collectionId)
      }
    },
    
    saveCollection() {
      if (this.editingCollection) {
        // Update existing collection
        const index = this.collections.findIndex(c => c.id === this.editingCollection.id)
        if (index !== -1) {
          this.collections[index] = { ...this.collectionForm }
        }
      } else {
        // Create new collection
        const newCollection = {
          ...this.collectionForm,
          id: Date.now(),
          productCount: 0,
          views: 0,
          conversionRate: 0,
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop'
        }
        this.collections.push(newCollection)
      }
      
      this.closeModal()
    },
    
    closeModal() {
      this.showCreateModal = false
      this.editingCollection = null
      this.collectionForm = {
        name: '',
        description: '',
        status: 'active',
        priority: 1,
        slug: '',
        tags: ''
      }
    }
  }
}
</script>