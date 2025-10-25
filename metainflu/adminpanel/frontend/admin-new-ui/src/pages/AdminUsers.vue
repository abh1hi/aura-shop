<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Users</h1>
          <p class="text-neutral-600 mt-1">Manage user accounts and permissions</p>
        </div>
        
        <div class="flex items-center space-x-3">
          <BaseButton variant="ghost" icon="funnel" size="sm">
            Export
          </BaseButton>
          <BaseButton variant="primary" icon="plus" size="sm">
            Invite User
          </BaseButton>
        </div>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          label="Total Users"
          :value="userStats.total"
          icon="users"
          icon-color="primary"
        />
        <MetricCard
          label="Active Users"
          :value="userStats.active"
          icon="check-circle"
          icon-color="success"
        />
        <MetricCard
          label="New This Month"
          :value="userStats.newThisMonth"
          icon="plus-circle"
          icon-color="info"
          :trend="{ type: 'up', value: '12%' }"
        />
        <MetricCard
          label="Pending Approval"
          :value="userStats.pending"
          icon="clock"
          icon-color="warning"
        />
      </div>
      
      <!-- Filters -->
      <BaseCard variant="default" padding="normal">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <BaseInput
            v-model="filters.search"
            placeholder="Search users..."
            left-icon="magnifying-glass"
            clearable
          />
          
          <BaseSelect
            v-model="filters.role"
            placeholder="All Roles"
            :options="roleOptions"
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
      
      <!-- Users Table -->
      <BaseCard variant="default" padding="none">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  User
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Role
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-neutral-50">
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <img
                      :src="user.avatar"
                      :alt="user.name"
                      class="w-10 h-10 rounded-full object-cover"
                    >
                    <div>
                      <div class="font-medium text-neutral-900">{{ user.name }}</div>
                      <div class="text-sm text-neutral-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <BaseBadge
                    :variant="getRoleVariant(user.role)"
                    size="sm"
                  >
                    {{ user.role }}
                  </BaseBadge>
                </td>
                <td class="px-6 py-4">
                  <BaseBadge
                    :variant="getStatusVariant(user.status)"
                    size="sm"
                  >
                    {{ user.status }}
                  </BaseBadge>
                </td>
                <td class="px-6 py-4 text-sm text-neutral-500">
                  {{ formatDate(user.lastActive) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <BaseButton
                      variant="ghost"
                      icon-only
                      size="sm"
                      icon="pencil"
                      @click="editUser(user)"
                    />
                    <BaseButton
                      variant="ghost"
                      icon-only
                      size="sm"
                      icon="eye"
                      @click="viewUser(user)"
                    />
                    <BaseButton
                      variant="ghost"
                      icon-only
                      size="sm"
                      icon="ellipsis-horizontal"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-neutral-200">
          <div class="flex items-center justify-between">
            <p class="text-sm text-neutral-500">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalUsers) }} of {{ totalUsers }} users
            </p>
            
            <div class="flex items-center space-x-2">
              <BaseButton
                variant="ghost"
                size="sm"
                icon="chevron-left"
                :disabled="currentPage === 1"
                @click="currentPage--"
              />
              
              <span class="text-sm font-medium text-neutral-700">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              
              <BaseButton
                variant="ghost"
                size="sm"
                icon="chevron-right"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              />
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseSelect from '../components/base/BaseSelect.vue'
import BaseBadge from '../components/base/BaseBadge.vue'
import MetricCard from '../components/dashboard/MetricCard.vue'

export default {
  name: 'AdminUsers',
  components: {
    AdminLayout,
    BaseCard,
    BaseButton,
    BaseInput,
    BaseSelect,
    BaseBadge,
    MetricCard
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      filters: {
        search: '',
        role: '',
        status: ''
      },
      userStats: {
        total: 1247,
        active: 1156,
        newThisMonth: 89,
        pending: 12
      },
      users: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff',
          role: 'Admin',
          status: 'Active',
          lastActive: new Date('2023-11-20')
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff',
          role: 'Editor',
          status: 'Active',
          lastActive: new Date('2023-11-19')
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff',
          role: 'User',
          status: 'Inactive',
          lastActive: new Date('2023-11-15')
        }
      ],
      roleOptions: [
        { value: 'admin', label: 'Admin' },
        { value: 'editor', label: 'Editor' },
        { value: 'user', label: 'User' },
        { value: 'viewer', label: 'Viewer' }
      ],
      statusOptions: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
        { value: 'suspended', label: 'Suspended' }
      ]
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const matchesSearch = !this.filters.search || 
          user.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(this.filters.search.toLowerCase())
        
        const matchesRole = !this.filters.role || 
          user.role.toLowerCase() === this.filters.role.toLowerCase()
        
        const matchesStatus = !this.filters.status || 
          user.status.toLowerCase() === this.filters.status.toLowerCase()
        
        return matchesSearch && matchesRole && matchesStatus
      })
    },
    totalUsers() {
      return this.filteredUsers.length
    },
    totalPages() {
      return Math.ceil(this.totalUsers / this.pageSize)
    }
  },
  methods: {
    applyFilters() {
      this.currentPage = 1
    },
    
    getRoleVariant(role) {
      const variants = {
        'Admin': 'primary',
        'Editor': 'info',
        'User': 'secondary',
        'Viewer': 'neutral'
      }
      return variants[role] || 'neutral'
    },
    
    getStatusVariant(status) {
      const variants = {
        'Active': 'success',
        'Inactive': 'neutral',
        'Pending': 'warning',
        'Suspended': 'danger'
      }
      return variants[status] || 'neutral'
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date)
    },
    
    editUser(user) {
      console.log('Editing user:', user)
    },
    
    viewUser(user) {
      console.log('Viewing user:', user)
    }
  }
}
</script>
