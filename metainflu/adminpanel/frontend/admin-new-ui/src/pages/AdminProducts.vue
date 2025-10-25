<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Products</h1>
          <p class="text-neutral-600 mt-1">
            Manage your product catalog 
            <span v-if="totalProducts > 0" class="text-primary-600 font-medium">
              ({{ totalProducts }} products)
            </span>
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <BaseButton 
            variant="ghost" 
            icon="funnel" 
            size="sm"
            @click="showFilters = !showFilters"
            :class="{ 'bg-primary-50 text-primary-600': showFilters }"
          >
            Filters
          </BaseButton>
          <BaseButton 
            variant="primary" 
            icon="plus" 
            size="sm" 
            @click="createProduct"
            :disabled="isLoading"
          >
            Add Product
          </BaseButton>
        </div>
      </div>
      
      <!-- Filters -->
      <Transition name="slide-down">
        <BaseCard v-if="showFilters" variant="default" padding="normal">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BaseInput
              v-model="filters.search"
              placeholder="Search products..."
              left-icon="magnifying-glass"
              clearable
              @input="debouncedSearch"
            />
            
            <BaseSelect
              v-model="filters.category"
              placeholder="All Categories"
              :options="categoryOptions"
              :loading="categoriesLoading"
            />
            
            <BaseSelect
              v-model="filters.status"
              placeholder="All Status"
              :options="statusOptions"
            />
            
            <BaseButton 
              variant="secondary" 
              full-width 
              @click="applyFilters"
              :loading="isLoading"
            >
              Apply Filters
            </BaseButton>
          </div>
        </BaseCard>
      </Transition>
      
      <!-- Loading State -->
      <div v-if="isLoading && products.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCardSkeleton v-for="i in 8" :key="i" />
      </div>
      
      <!-- Products Grid -->
      <div v-else-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in products"
          :key="product._id"
          :product="product"
          @edit="editProduct"
          @delete="confirmDeleteProduct"
          @view="viewProduct"
        />
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <BaseIcon name="shopping-bag" size="xl" class="mx-auto text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">
          {{ hasActiveFilters ? 'No products match your filters' : 'No products found' }}
        </h3>
        <p class="text-neutral-500 mb-4">
          {{ hasActiveFilters ? 'Try adjusting your search criteria' : 'Get started by creating your first product' }}
        </p>
        <BaseButton 
          v-if="!hasActiveFilters"
          variant="primary" 
          icon="plus" 
          @click="createProduct"
        >
          Add Product
        </BaseButton>
        <BaseButton 
          v-else
          variant="secondary" 
          @click="clearFilters"
        >
          Clear Filters
        </BaseButton>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center">
        <BasePagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="totalProducts"
          @page-change="handlePageChange"
        />
      </div>
    </div>
    
    <!-- Product Form Modal -->
    <ProductFormModal
      :show="showProductModal"
      :product="selectedProduct"
      :mode="modalMode"
      @close="closeProductModal"
      @save="handleProductSave"
    />
    
    <!-- Delete Confirmation Modal -->
    <ConfirmDialog
      :show="showDeleteDialog"
      :title="`Delete ${productToDelete?.name}?`"
      message="This action cannot be undone. The product will be permanently removed from your catalog."
      confirm-text="Delete Product"
      confirm-variant="danger"
      @confirm="deleteProduct"
      @cancel="closeDeleteDialog"
    />
  </AdminLayout>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth.js'
import { useProductValidation } from '../composables/useValidation.js'
import adminService from '../services/adminService.js'
import { debounce } from 'lodash.debounce'

// Import components
import AdminLayout from '../layouts/AdminLayout.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseSelect from '../components/base/BaseSelect.vue'
import BaseIcon from '../components/base/BaseIcon.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductCardSkeleton from '../components/ProductCardSkeleton.vue'
import ProductFormModal from '../components/ProductFormModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import BasePagination from '../components/base/BasePagination.vue'

export default {
  name: 'AdminProducts',
  components: {
    AdminLayout,
    BaseCard,
    BaseButton,
    BaseInput,
    BaseSelect,
    BaseIcon,
    ProductCard,
    ProductCardSkeleton,
    ProductFormModal,
    ConfirmDialog,
    BasePagination
  },
  setup() {
    const router = useRouter()
    const toast = useToast()
    const authStore = useAuthStore()
    
    // State
    const products = ref([])
    const categories = ref([])
    const isLoading = ref(false)
    const categoriesLoading = ref(false)
    const showFilters = ref(false)
    const showProductModal = ref(false)
    const showDeleteDialog = ref(false)
    const selectedProduct = ref(null)
    const productToDelete = ref(null)
    const modalMode = ref('create') // 'create' | 'edit' | 'view'
    
    // Pagination
    const currentPage = ref(1)
    const itemsPerPage = ref(12)
    const totalProducts = ref(0)
    const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage.value))
    
    // Filters
    const filters = ref({
      search: '',
      category: '',
      status: ''
    })
    
    const statusOptions = [
      { value: '', label: 'All Status' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'draft', label: 'Draft' },
      { value: 'out_of_stock', label: 'Out of Stock' }
    ]
    
    const categoryOptions = computed(() => [
      { value: '', label: 'All Categories' },
      ...categories.value.map(cat => ({
        value: cat._id,
        label: cat.name
      }))
    ])
    
    const hasActiveFilters = computed(() => {
      return filters.value.search || filters.value.category || filters.value.status
    })
    
    // Methods
    const fetchProducts = async () => {
      try {
        isLoading.value = true
        
        const queryParams = {
          page: currentPage.value,
          limit: itemsPerPage.value,
          ...filters.value
        }
        
        // Remove empty filters
        Object.keys(queryParams).forEach(key => {
          if (queryParams[key] === '' || queryParams[key] === null) {
            delete queryParams[key]
          }
        })
        
        const response = await adminService.getProducts(queryParams)
        
        if (response.success) {
          products.value = response.data.products || response.data
          totalProducts.value = response.data.total || products.value.length
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
        toast.error('Failed to load products')
        products.value = []
      } finally {
        isLoading.value = false
      }
    }
    
    const fetchCategories = async () => {
      try {
        categoriesLoading.value = true
        const response = await adminService.getCategories()
        
        if (response.success) {
          categories.value = response.data || []
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        categories.value = []
      } finally {
        categoriesLoading.value = false
      }
    }
    
    const createProduct = () => {
      selectedProduct.value = null
      modalMode.value = 'create'
      showProductModal.value = true
    }
    
    const editProduct = (product) => {
      selectedProduct.value = { ...product }
      modalMode.value = 'edit'
      showProductModal.value = true
    }
    
    const viewProduct = (product) => {
      selectedProduct.value = product
      modalMode.value = 'view'
      showProductModal.value = true
    }
    
    const confirmDeleteProduct = (product) => {
      productToDelete.value = product
      showDeleteDialog.value = true
    }
    
    const deleteProduct = async () => {
      try {
        if (!productToDelete.value) return
        
        await adminService.deleteProduct(productToDelete.value._id)
        
        // Remove from local array
        products.value = products.value.filter(p => p._id !== productToDelete.value._id)
        totalProducts.value--
        
        toast.success('Product deleted successfully')
        closeDeleteDialog()
        
      } catch (error) {
        console.error('Failed to delete product:', error)
        toast.error(error.message || 'Failed to delete product')
      }
    }
    
    const handleProductSave = async (productData) => {
      try {
        let response
        
        if (modalMode.value === 'create') {
          response = await adminService.createProduct(productData)
          if (response.success) {
            products.value.unshift(response.data)
            totalProducts.value++
            toast.success('Product created successfully')
          }
        } else if (modalMode.value === 'edit') {
          response = await adminService.updateProduct(selectedProduct.value._id, productData)
          if (response.success) {
            // Update in local array
            const index = products.value.findIndex(p => p._id === selectedProduct.value._id)
            if (index !== -1) {
              products.value[index] = response.data
            }
            toast.success('Product updated successfully')
          }
        }
        
        closeProductModal()
      } catch (error) {
        console.error('Failed to save product:', error)
        toast.error(error.message || 'Failed to save product')
        throw error // Re-throw to let modal handle it
      }
    }
    
    const closeProductModal = () => {
      showProductModal.value = false
      selectedProduct.value = null
      modalMode.value = 'create'
    }
    
    const closeDeleteDialog = () => {
      showDeleteDialog.value = false
      productToDelete.value = null
    }
    
    const applyFilters = async () => {
      currentPage.value = 1 // Reset to first page
      await fetchProducts()
    }
    
    const clearFilters = () => {
      filters.value = {
        search: '',
        category: '',
        status: ''
      }
      applyFilters()
    }
    
    const handlePageChange = (page) => {
      currentPage.value = page
      fetchProducts()
    }
    
    // Debounced search
    const debouncedSearch = debounce(() => {
      applyFilters()
    }, 500)
    
    // Lifecycle
    onMounted(async () => {
      await Promise.all([
        fetchProducts(),
        fetchCategories()
      ])
    })
    
    // Watch for filter changes
    watch(
      () => [filters.value.category, filters.value.status],
      () => {
        applyFilters()
      }
    )
    
    return {
      // State
      products,
      categories,
      isLoading,
      categoriesLoading,
      showFilters,
      showProductModal,
      showDeleteDialog,
      selectedProduct,
      productToDelete,
      modalMode,
      
      // Pagination
      currentPage,
      totalProducts,
      totalPages,
      
      // Filters
      filters,
      statusOptions,
      categoryOptions,
      hasActiveFilters,
      
      // Store
      authStore,
      
      // Methods
      createProduct,
      editProduct,
      viewProduct,
      confirmDeleteProduct,
      deleteProduct,
      handleProductSave,
      closeProductModal,
      closeDeleteDialog,
      applyFilters,
      clearFilters,
      handlePageChange,
      debouncedSearch
    }
  }
}
</script>

<style scoped>
/* Transition animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Grid responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-1 {
    @apply gap-4;
  }
}
</style>