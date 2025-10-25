<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Products</h1>
          <p class="text-neutral-600 mt-1">Manage your product catalog</p>
        </div>
        
        <div class="flex items-center space-x-3">
          <BaseButton variant="ghost" icon="funnel" size="sm">
            Filters
          </BaseButton>
          <BaseButton variant="primary" icon="plus" size="sm" @click="showCreateModal = true">
            Add Product
          </BaseButton>
        </div>
      </div>
      
      <!-- Filters -->
      <BaseCard variant="default" padding="normal">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <BaseInput
            v-model="filters.search"
            placeholder="Search products..."
            left-icon="magnifying-glass"
            clearable
          />
          
          <BaseSelect
            v-model="filters.category"
            placeholder="All Categories"
            :options="categoryOptions"
          />
          
          <BaseSelect
            v-model="filters.status"
            placeholder="All Status"
            :options="statusOptions"
          />
          
          <BaseButton variant="secondary" full-width @click="applyFilters">
            Apply Filters
          </BaseButton>
        </div>
      </BaseCard>
      
      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <BaseCard
          v-for="product in filteredProducts"
          :key="product.id"
          variant="default"
          padding="none"
          hover
        >
          <!-- Product Image -->
          <div class="aspect-square bg-neutral-100 relative overflow-hidden">
            <img
              v-if="product.image"
              :src="product.image"
              :alt="product.name"
              class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full flex items-center justify-center">
              <BaseIcon name="photo" size="xl" class="text-neutral-400" />
            </div>
            
            <!-- Status badge -->
            <div class="absolute top-3 left-3">
              <BaseBadge
                :variant="product.status === 'active' ? 'success' : product.status === 'draft' ? 'warning' : 'neutral'"
                size="sm"
              >
                {{ product.status }}
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
                  @click="editProduct(product)"
                />
                <BaseButton
                  variant="danger"
                  icon-only
                  size="sm"
                  icon="trash"
                  @click="deleteProduct(product.id)"
                />
              </div>
            </div>
          </div>
          
          <!-- Product Info -->
          <div class="p-4">
            <h3 class="font-semibold text-neutral-900 mb-1 truncate">{{ product.name }}</h3>
            <p class="text-sm text-neutral-500 mb-2 line-clamp-2">{{ product.description }}</p>
            
            <div class="flex items-center justify-between">
              <div>
                <div class="font-bold text-lg text-neutral-900">${{ product.price }}</div>
                <div class="text-xs text-neutral-500">{{ product.category }}</div>
              </div>
              
              <div class="text-right">
                <div class="text-sm font-medium text-neutral-700">{{ product.stock }} in stock</div>
                <div class="text-xs text-neutral-500">{{ product.sales }} sold</div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="text-center py-12">
        <BaseIcon name="shopping-bag" size="xl" class="mx-auto text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
        <p class="text-neutral-500 mb-4">Get started by creating your first product</p>
        <BaseButton variant="primary" icon="plus" @click="showCreateModal = true">
          Add Product
        </BaseButton>
      </div>
    </div>
    
    <!-- Create/Edit Modal -->
    <BaseModal
      :show="showCreateModal"
      title="Add New Product"
      size="xl"
      @close="showCreateModal = false"
    >
      <form @submit.prevent="saveProduct" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            v-model="productForm.name"
            label="Product Name"
            placeholder="Enter product name"
            required
          />
          
          <BaseSelect
            v-model="productForm.category"
            label="Category"
            placeholder="Select category"
            :options="categoryOptions"
            required
          />
        </div>
        
        <BaseInput
          v-model="productForm.description"
          label="Description"
          placeholder="Product description"
          type="textarea"
        />
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BaseInput
            v-model="productForm.price"
            type="number"
            label="Price"
            placeholder="0.00"
            required
          />
          
          <BaseInput
            v-model="productForm.stock"
            type="number"
            label="Stock Quantity"
            placeholder="0"
            required
          />
          
          <BaseSelect
            v-model="productForm.status"
            label="Status"
            :options="statusOptions"
            required
          />
        </div>
      </form>
      
      <template #footer>
        <BaseButton variant="ghost" @click="showCreateModal = false">
          Cancel
        </BaseButton>
        <BaseButton variant="primary" @click="saveProduct">
          Save Product
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
  name: 'AdminProducts',
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
      filters: {
        search: '',
        category: '',
        status: ''
      },
      productForm: {
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        status: 'active'
      },
      products: [
        {
          id: 1,
          name: 'Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          category: 'Electronics',
          price: 299.99,
          stock: 25,
          sales: 156,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center'
        },
        {
          id: 2,
          name: 'Smart Watch',
          description: 'Feature-rich smartwatch with health monitoring',
          category: 'Electronics',
          price: 199.99,
          stock: 42,
          sales: 203,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&crop=center'
        },
        {
          id: 3,
          name: 'Coffee Mug',
          description: 'Premium ceramic coffee mug',
          category: 'Home & Kitchen',
          price: 24.99,
          stock: 0,
          sales: 89,
          status: 'out_of_stock'
        }
      ],
      categoryOptions: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'home_kitchen', label: 'Home & Kitchen' },
        { value: 'books', label: 'Books' },
        { value: 'sports', label: 'Sports & Outdoors' }
      ],
      statusOptions: [
        { value: 'active', label: 'Active' },
        { value: 'draft', label: 'Draft' },
        { value: 'out_of_stock', label: 'Out of Stock' },
        { value: 'discontinued', label: 'Discontinued' }
      ]
    }
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        const matchesSearch = !this.filters.search || 
          product.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          product.description.toLowerCase().includes(this.filters.search.toLowerCase())
        
        const matchesCategory = !this.filters.category || 
          product.category.toLowerCase() === this.filters.category.toLowerCase()
        
        const matchesStatus = !this.filters.status || product.status === this.filters.status
        
        return matchesSearch && matchesCategory && matchesStatus
      })
    }
  },
  methods: {
    applyFilters() {
      // Filters are reactive, so this just serves as a trigger
      console.log('Applying filters:', this.filters)
    },
    
    editProduct(product) {
      this.productForm = { ...product }
      this.showCreateModal = true
    },
    
    deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        this.products = this.products.filter(p => p.id !== productId)
      }
    },
    
    saveProduct() {
      // Implement save logic
      console.log('Saving product:', this.productForm)
      this.showCreateModal = false
      this.productForm = {
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        status: 'active'
      }
    }
  }
}
</script>
