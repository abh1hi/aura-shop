<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Categories</h1>
          <p class="text-neutral-600 mt-1">Organize your products with categories</p>
        </div>
        
        <BaseButton variant="primary" icon="plus" size="sm" @click="showCreateModal = true">
          Add Category
        </BaseButton>
      </div>
      
      <!-- Categories Tree -->
      <BaseCard variant="default" padding="normal">
        <div class="space-y-2">
          <CategoryItem
            v-for="category in rootCategories"
            :key="category.id"
            :category="category"
            :level="0"
            @edit="editCategory"
            @delete="deleteCategory"
            @add-subcategory="addSubcategory"
          />
        </div>
      </BaseCard>
      
      <!-- Empty State -->
      <div v-if="categories.length === 0" class="text-center py-12">
        <BaseIcon name="tag" size="xl" class="mx-auto text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">No categories found</h3>
        <p class="text-neutral-500 mb-4">Create your first product category</p>
        <BaseButton variant="primary" icon="plus" @click="showCreateModal = true">
          Add Category
        </BaseButton>
      </div>
    </div>
    
    <!-- Create/Edit Modal -->
    <BaseModal
      :show="showCreateModal"
      :title="editingCategory ? 'Edit Category' : 'Add New Category'"
      size="lg"
      @close="closeModal"
    >
      <form @submit.prevent="saveCategory" class="space-y-6">
        <BaseInput
          v-model="categoryForm.name"
          label="Category Name"
          placeholder="Enter category name"
          required
        />
        
        <BaseInput
          v-model="categoryForm.description"
          label="Description"
          placeholder="Category description"
        />
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseSelect
            v-model="categoryForm.parentId"
            label="Parent Category"
            placeholder="Select parent (optional)"
            :options="parentCategoryOptions"
          />
          
          <BaseSelect
            v-model="categoryForm.status"
            label="Status"
            :options="statusOptions"
            required
          />
        </div>
        
        <BaseInput
          v-model="categoryForm.slug"
          label="URL Slug"
          placeholder="category-slug"
          help-text="Used in URLs, will be auto-generated if left empty"
        />
      </form>
      
      <template #footer>
        <BaseButton variant="ghost" @click="closeModal">
          Cancel
        </BaseButton>
        <BaseButton variant="primary" @click="saveCategory">
          {{ editingCategory ? 'Update' : 'Create' }} Category
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

// Category Item Component
const CategoryItem = {
  name: 'CategoryItem',
  components: { BaseButton, BaseIcon },
  props: {
    category: Object,
    level: Number
  },
  emits: ['edit', 'delete', 'add-subcategory'],
  template: `
    <div>
      <div 
        :class="[
          'flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors',
          level > 0 ? 'ml-8 border-l-4 border-l-primary-200' : ''
        ]"
      >
        <div class="flex items-center space-x-3">
          <BaseIcon 
            name="tag" 
            size="sm" 
            :class="level > 0 ? 'text-neutral-400' : 'text-primary-600'"
          />
          
          <div>
            <h3 class="font-medium text-neutral-900">{{ category.name }}</h3>
            <p v-if="category.description" class="text-sm text-neutral-500">
              {{ category.description }}
            </p>
            <div class="flex items-center space-x-4 mt-1">
              <span class="text-xs text-neutral-400">
                {{ category.productCount }} products
              </span>
              <span 
                :class="[
                  'text-xs px-2 py-0.5 rounded-full',
                  category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-600'
                ]"
              >
                {{ category.status }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-1">
          <BaseButton
            variant="ghost"
            icon-only
            size="sm"
            icon="plus"
            @click="$emit('add-subcategory', category)"
          />
          <BaseButton
            variant="ghost"
            icon-only
            size="sm"
            icon="pencil"
            @click="$emit('edit', category)"
          />
          <BaseButton
            variant="ghost"
            icon-only
            size="sm"
            icon="trash"
            @click="$emit('delete', category.id)"
          />
        </div>
      </div>
      
      <!-- Subcategories -->
      <div v-if="category.children && category.children.length > 0" class="mt-2">
        <CategoryItem
          v-for="child in category.children"
          :key="child.id"
          :category="child"
          :level="level + 1"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
          @add-subcategory="$emit('add-subcategory', $event)"
        />
      </div>
    </div>
  `
}

export default {
  name: 'AdminCategories',
  components: {
    AdminLayout,
    BaseCard,
    BaseButton,
    BaseInput,
    BaseSelect,
    BaseModal,
    BaseIcon,
    CategoryItem
  },
  data() {
    return {
      showCreateModal: false,
      editingCategory: null,
      categoryForm: {
        name: '',
        description: '',
        parentId: '',
        status: 'active',
        slug: ''
      },
      categories: [
        {
          id: 1,
          name: 'Electronics',
          description: 'Electronic devices and accessories',
          parentId: null,
          status: 'active',
          slug: 'electronics',
          productCount: 156,
          children: [
            {
              id: 2,
              name: 'Smartphones',
              description: 'Mobile phones and accessories',
              parentId: 1,
              status: 'active',
              slug: 'smartphones',
              productCount: 45,
              children: []
            },
            {
              id: 3,
              name: 'Laptops',
              description: 'Portable computers',
              parentId: 1,
              status: 'active',
              slug: 'laptops',
              productCount: 32,
              children: []
            }
          ]
        },
        {
          id: 4,
          name: 'Clothing',
          description: 'Fashion and apparel',
          parentId: null,
          status: 'active',
          slug: 'clothing',
          productCount: 234,
          children: [
            {
              id: 5,
              name: 'Men\'s Fashion',
              description: 'Clothing for men',
              parentId: 4,
              status: 'active',
              slug: 'mens-fashion',
              productCount: 112,
              children: []
            }
          ]
        },
        {
          id: 6,
          name: 'Home & Garden',
          description: 'Home improvement and garden supplies',
          parentId: null,
          status: 'active',
          slug: 'home-garden',
          productCount: 89,
          children: []
        }
      ],
      statusOptions: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  },
  computed: {
    rootCategories() {
      return this.buildCategoryTree()
    },
    
    parentCategoryOptions() {
      const options = [{ value: '', label: 'None (Root Category)' }]
      
      const addCategoryOptions = (categories, prefix = '') => {
        categories.forEach(category => {
          if (!this.editingCategory || category.id !== this.editingCategory.id) {
            options.push({
              value: category.id,
              label: prefix + category.name
            })
            
            if (category.children && category.children.length > 0) {
              addCategoryOptions(category.children, prefix + category.name + ' > ')
            }
          }
        })
      }
      
      addCategoryOptions(this.rootCategories)
      return options
    }
  },
  methods: {
    buildCategoryTree() {
      const categoryMap = new Map()
      const rootCategories = []
      
      // Create map of all categories
      this.categories.forEach(category => {
        categoryMap.set(category.id, { ...category, children: [] })
      })
      
      // Build tree structure
      categoryMap.forEach(category => {
        if (category.parentId) {
          const parent = categoryMap.get(category.parentId)
          if (parent) {
            parent.children.push(category)
          }
        } else {
          rootCategories.push(category)
        }
      })
      
      return rootCategories
    },
    
    editCategory(category) {
      this.editingCategory = category
      this.categoryForm = { ...category }
      this.showCreateModal = true
    },
    
    addSubcategory(parentCategory) {
      this.categoryForm = {
        name: '',
        description: '',
        parentId: parentCategory.id,
        status: 'active',
        slug: ''
      }
      this.showCreateModal = true
    },
    
    deleteCategory(categoryId) {
      if (confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
        this.categories = this.categories.filter(c => c.id !== categoryId && c.parentId !== categoryId)
      }
    },
    
    saveCategory() {
      if (this.editingCategory) {
        // Update existing category
        const index = this.categories.findIndex(c => c.id === this.editingCategory.id)
        if (index !== -1) {
          this.categories[index] = { ...this.categoryForm }
        }
      } else {
        // Create new category
        const newCategory = {
          ...this.categoryForm,
          id: Date.now(),
          productCount: 0,
          children: []
        }
        
        // Generate slug if empty
        if (!newCategory.slug) {
          newCategory.slug = newCategory.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }
        
        this.categories.push(newCategory)
      }
      
      this.closeModal()
    },
    
    closeModal() {
      this.showCreateModal = false
      this.editingCategory = null
      this.categoryForm = {
        name: '',
        description: '',
        parentId: '',
        status: 'active',
        slug: ''
      }
    }
  }
}
</script>