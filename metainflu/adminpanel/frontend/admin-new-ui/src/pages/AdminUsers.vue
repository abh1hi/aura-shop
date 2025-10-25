<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Users</h1>
          <p class="text-neutral-600 mt-1">Manage user accounts and permissions</p>
        </div>
        <div class="flex items-center space-x-3">
          <BaseButton variant="ghost" icon="funnel" @click="showFilters = !showFilters">Filters</BaseButton>
          <BaseButton variant="primary" icon="plus" @click="createUser">Add User</BaseButton>
        </div>
      </div>
      
      <!-- Filters -->
      <BaseCard v-if="showFilters" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <BaseInput v-model="filters.search" placeholder="Search users..." left-icon="magnifying-glass" />
          <BaseSelect v-model="filters.role" :options="roleOptions" placeholder="All Roles" />
          <BaseSelect v-model="filters.status" :options="statusOptions" placeholder="All Status" />
          <BaseButton variant="secondary" @click="applyFilters" :loading="isLoading">Apply</BaseButton>
        </div>
      </BaseCard>
      
      <!-- Users Table -->
      <BaseCard>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-neutral-200">
            <thead class="bg-neutral-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">User</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Role</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase">Verified</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Joined</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-neutral-200">
              <tr v-for="user in users" :key="user._id" class="hover:bg-neutral-50">
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-primary-600">{{ user.name?.[0]?.toUpperCase() }}</span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-neutral-900">{{ user.name }}</div>
                      <div class="text-sm text-neutral-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <BaseBadge :variant="roleVariant(user.role)" class="capitalize">{{ user.role }}</BaseBadge>
                </td>
                <td class="px-4 py-3 text-center">
                  <BaseBadge :variant="user.isActive ? 'success' : 'danger'">{{ user.isActive ? 'Active' : 'Inactive' }}</BaseBadge>
                </td>
                <td class="px-4 py-3 text-center">
                  <BaseBadge :variant="user.emailVerified ? 'success' : 'warning'">{{ user.emailVerified ? 'Verified' : 'Pending' }}</BaseBadge>
                </td>
                <td class="px-4 py-3 text-sm text-neutral-700">{{ formatDate(user.createdAt) }}</td>
                <td class="px-4 py-3 text-right space-x-2">
                  <BaseButton variant="ghost" size="sm" icon="eye" @click="viewUser(user)">View</BaseButton>
                  <BaseButton variant="ghost" size="sm" icon="pencil" @click="editUser(user)">Edit</BaseButton>
                  <BaseButton v-if="user._id !== authStore.user?._id" variant="danger" size="sm" icon="trash" @click="confirmDeleteUser(user)">Delete</BaseButton>
                </td>
              </tr>
              
              <tr v-if="!isLoading && users.length === 0">
                <td colspan="6" class="px-4 py-10 text-center text-neutral-500">No users found</td>
              </tr>
              
              <tr v-if="isLoading">
                <td colspan="6" class="px-4 py-6 text-center text-neutral-500">Loading users...</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-4">
          <BasePagination :current-page="currentPage" :total-pages="totalPages" :total-items="totalUsers" @page-change="handlePageChange" />
        </div>
      </BaseCard>
    </div>
    
    <!-- User Form Modal -->
    <UserFormModal :show="showUserModal" :user="selectedUser" :mode="modalMode" @close="closeUserModal" @save="handleUserSave" />
    
    <!-- Delete Confirmation -->
    <ConfirmDialog
      :show="showDeleteDialog"
      :title="`Delete ${userToDelete?.name}?`"
      message="This action cannot be undone. The user account will be permanently removed."
      confirm-text="Delete User"
      confirm-variant="danger"
      @confirm="deleteUser"
      @cancel="closeDeleteDialog"
    />
  </AdminLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useToast } from 'vue-toastification'
import adminService from '../services/adminService.js'

import AdminLayout from '../layouts/AdminLayout.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseSelect from '../components/base/BaseSelect.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseBadge from '../components/base/BaseBadge.vue'
import BasePagination from '../components/base/BasePagination.vue'
import UserFormModal from '../components/UserFormModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

export default {
  name: 'AdminUsers',
  components: { AdminLayout, BaseCard, BaseInput, BaseSelect, BaseButton, BaseBadge, BasePagination, UserFormModal, ConfirmDialog },
  setup() {
    const authStore = useAuthStore()
    const toast = useToast()
    
    const users = ref([])
    const isLoading = ref(false)
    const showFilters = ref(false)
    const showUserModal = ref(false)
    const showDeleteDialog = ref(false)
    const selectedUser = ref(null)
    const userToDelete = ref(null)
    const modalMode = ref('create')
    
    const currentPage = ref(1)
    const totalUsers = ref(0)
    const itemsPerPage = ref(20)
    const totalPages = computed(() => Math.ceil(totalUsers.value / itemsPerPage.value))
    
    const filters = ref({
      search: '',
      role: '',
      status: ''
    })
    
    const roleOptions = [
      { value: '', label: 'All Roles' },
      { value: 'user', label: 'User' },
      { value: 'vendor', label: 'Vendor' },
      { value: 'admin', label: 'Admin' }
    ]
    
    const statusOptions = [
      { value: '', label: 'All Status' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
    
    const fetchUsers = async () => {
      try {
        isLoading.value = true
        const params = {
          page: currentPage.value,
          limit: itemsPerPage.value,
          ...filters.value
        }
        
        const response = await adminService.getUsers(params)
        
        if (response.success) {
          users.value = response.data.users
          totalUsers.value = response.data.pagination.totalItems
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
        toast.error('Failed to load users')
      } finally {
        isLoading.value = false
      }
    }
    
    const applyFilters = async () => {
      currentPage.value = 1
      await fetchUsers()
    }
    
    const handlePageChange = (page) => {
      currentPage.value = page
      fetchUsers()
    }
    
    const createUser = () => {
      selectedUser.value = null
      modalMode.value = 'create'
      showUserModal.value = true
    }
    
    const viewUser = (user) => {
      selectedUser.value = user
      modalMode.value = 'view'
      showUserModal.value = true
    }
    
    const editUser = (user) => {
      selectedUser.value = { ...user }
      modalMode.value = 'edit'
      showUserModal.value = true
    }
    
    const confirmDeleteUser = (user) => {
      userToDelete.value = user
      showDeleteDialog.value = true
    }
    
    const deleteUser = async () => {
      try {
        await adminService.deleteUser(userToDelete.value._id)
        users.value = users.value.filter(u => u._id !== userToDelete.value._id)
        totalUsers.value--
        toast.success('User deleted successfully')
        closeDeleteDialog()
      } catch (error) {
        toast.error('Failed to delete user')
      }
    }
    
    const handleUserSave = async (userData) => {
      try {
        if (modalMode.value === 'create') {
          // TODO: Create user API
          toast.success('User created successfully')
        } else if (modalMode.value === 'edit') {
          const response = await adminService.updateUser(selectedUser.value._id, userData)
          const index = users.value.findIndex(u => u._id === selectedUser.value._id)
          if (index !== -1) {
            users.value[index] = response.data
          }
          toast.success('User updated successfully')
        }
        closeUserModal()
      } catch (error) {
        toast.error('Failed to save user')
      }
    }
    
    const closeUserModal = () => {
      showUserModal.value = false
      selectedUser.value = null
    }
    
    const closeDeleteDialog = () => {
      showDeleteDialog.value = false
      userToDelete.value = null
    }
    
    const roleVariant = (role) => {
      switch (role) {
        case 'admin': return 'danger'
        case 'vendor': return 'warning'
        case 'user': return 'primary'
        default: return 'neutral'
      }
    }
    
    const formatDate = (date) => {
      return date ? new Date(date).toLocaleDateString() : 'N/A'
    }
    
    onMounted(() => {
      fetchUsers()
    })
    
    return {
      authStore,
      users,
      isLoading,
      showFilters,
      showUserModal,
      showDeleteDialog,
      selectedUser,
      userToDelete,
      modalMode,
      currentPage,
      totalUsers,
      totalPages,
      filters,
      roleOptions,
      statusOptions,
      fetchUsers,
      applyFilters,
      handlePageChange,
      createUser,
      viewUser,
      editUser,
      confirmDeleteUser,
      deleteUser,
      handleUserSave,
      closeUserModal,
      closeDeleteDialog,
      roleVariant,
      formatDate
    }
  }
}
</script>