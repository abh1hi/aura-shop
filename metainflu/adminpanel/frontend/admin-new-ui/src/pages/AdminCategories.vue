<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Categories</h1>
          <p class="text-neutral-600 mt-1">Organize your product catalog with categories</p>
        </div>
        <BaseButton variant="primary" icon="plus" @click="createCategory">Add Category</BaseButton>
      </div>
      
      <!-- Categories Grid -->
      <div v-if="!isLoading && categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CategoryCard
          v-for="category in categories"
          :key="category._id"
          :category="category"
          @edit="editCategory"
          @delete="confirmDeleteCategory"
        />
      </div>
      
      <!-- Loading State -->
      <div v-else-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-neutral-200 rounded-lg h-32"></div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <BaseIcon name="tag" size="xl" class="mx-auto text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">No categories found</h3>
        <p class="text-neutral-500 mb-4">Create your first category to organize products</p>
        <BaseButton variant="primary" icon="plus" @click="createCategory">Add Category</BaseButton>
      </div>
    </div>
    
    <!-- Category Form Modal -->
    <CategoryFormModal
      :show="showCategoryModal"
      :category="selectedCategory"
      :categories="categories"
      :mode="modalMode"
      @close="closeCategoryModal"
      @save="handleCategorySave"
    />
    
    <!-- Delete Confirmation -->
    <ConfirmDialog
      :show="showDeleteDialog"
      :title="`Delete ${categoryToDelete?.name}?`"
      message="This action cannot be undone. Products in this category will become uncategorized."
      confirm-text="Delete Category"
      confirm-variant="danger"
      @confirm="deleteCategory"
      @cancel="closeDeleteDialog"
    />
  </AdminLayout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import adminService from '../services/adminService.js'

import AdminLayout from '../layouts/AdminLayout.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseIcon from '../components/base/BaseIcon.vue'
import CategoryCard from '../components/CategoryCard.vue'
import CategoryFormModal from '../components/CategoryFormModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

export default {
  name: 'AdminCategories',
  components: { AdminLayout, BaseButton, BaseIcon, CategoryCard, CategoryFormModal, ConfirmDialog },
  setup() {
    const toast = useToast()
    
    const categories = ref([])
    const isLoading = ref(false)
    const showCategoryModal = ref(false)
    const showDeleteDialog = ref(false)
    const selectedCategory = ref(null)
    const categoryToDelete = ref(null)
    const modalMode = ref('create')
    
    const fetchCategories = async () => {
      try {
        isLoading.value = true
        const response = await adminService.getCategories()
        categories.value = response.data || []
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        toast.error('Failed to load categories')
      } finally {
        isLoading.value = false
      }
    }
    
    const createCategory = () => {
      selectedCategory.value = null
      modalMode.value = 'create'
      showCategoryModal.value = true
    }
    
    const editCategory = (category) => {
      selectedCategory.value = { ...category }
      modalMode.value = 'edit'
      showCategoryModal.value = true
    }
    
    const confirmDeleteCategory = (category) => {
      categoryToDelete.value = category
      showDeleteDialog.value = true
    }
    
    const deleteCategory = async () => {
      try {
        await adminService.deleteCategory(categoryToDelete.value._id)
        categories.value = categories.value.filter(c => c._id !== categoryToDelete.value._id)
        toast.success('Category deleted successfully')
        closeDeleteDialog()
      } catch (error) {
        toast.error('Failed to delete category')
      }
    }
    
    const handleCategorySave = async (categoryData) => {
      try {
        if (modalMode.value === 'create') {
          const response = await adminService.createCategory(categoryData)
          categories.value.push(response.data)
          toast.success('Category created successfully')
        } else if (modalMode.value === 'edit') {
          const response = await adminService.updateCategory(selectedCategory.value._id, categoryData)
          const index = categories.value.findIndex(c => c._id === selectedCategory.value._id)
          if (index !== -1) {
            categories.value[index] = response.data
          }
          toast.success('Category updated successfully')
        }
        closeCategoryModal()
      } catch (error) {
        toast.error('Failed to save category')
      }
    }
    
    const closeCategoryModal = () => {
      showCategoryModal.value = false
      selectedCategory.value = null
    }
    
    const closeDeleteDialog = () => {
      showDeleteDialog.value = false
      categoryToDelete.value = null
    }
    
    onMounted(() => {
      fetchCategories()
    })
    
    return {
      categories,
      isLoading,
      showCategoryModal,
      showDeleteDialog,
      selectedCategory,
      categoryToDelete,
      modalMode,
      createCategory,
      editCategory,
      confirmDeleteCategory,
      deleteCategory,
      handleCategorySave,
      closeCategoryModal,
      closeDeleteDialog
    }
  }
}
</script>