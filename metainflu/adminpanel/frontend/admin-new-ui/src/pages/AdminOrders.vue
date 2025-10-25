<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Orders</h1>
          <p class="text-neutral-600 mt-1">Manage customer orders and track fulfillment</p>
        </div>
        <div class="flex items-center space-x-3">
          <BaseButton variant="ghost" icon="arrow-path" :loading="isLoading" @click="refresh">Refresh</BaseButton>
        </div>
      </div>

      <!-- Filters -->
      <BaseCard>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <BaseInput v-model="filters.search" placeholder="Search by order ID, user, email" left-icon="magnifying-glass" @keyup.enter="applyFilters" />

          <BaseSelect v-model="filters.status" :options="statusOptions" placeholder="All Status" />

          <BaseInput v-model="filters.startDate" type="date" label="Start" />
          <BaseInput v-model="filters.endDate" type="date" label="End" />

          <div class="flex items-end space-x-2">
            <BaseButton variant="secondary" class="w-full" @click="applyFilters" :loading="isLoading">Apply</BaseButton>
            <BaseButton variant="ghost" class="w-full" @click="clearFilters">Clear</BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Table -->
      <BaseCard>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-neutral-200">
            <thead class="bg-neutral-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Order</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Customer</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-neutral-200">
              <tr v-for="order in orders" :key="order._id" class="hover:bg-neutral-50">
                <td class="px-4 py-3">
                  <div class="text-sm font-medium text-neutral-900">#{{ order._id?.slice(-8) }}</div>
                  <div class="text-xs text-neutral-500">{{ order.items?.length || order.orderItems?.length || 0 }} items</div>
                </td>
                <td class="px-4 py-3">
                  <div class="text-sm text-neutral-900">{{ order.user?.name || 'Guest' }}</div>
                  <div class="text-xs text-neutral-500">{{ order.user?.email || '-' }}</div>
                </td>
                <td class="px-4 py-3 text-sm text-neutral-700">{{ formatDate(order.createdAt) }}</td>
                <td class="px-4 py-3 text-right text-sm font-medium text-neutral-900">{{ formatCurrency(order.total) }}</td>
                <td class="px-4 py-3 text-center">
                  <BaseBadge :variant="statusVariant(order.status)">{{ order.status }}</BaseBadge>
                </td>
                <td class="px-4 py-3 text-right space-x-2">
                  <BaseButton variant="ghost" size="sm" icon="eye" @click="viewOrder(order)">View</BaseButton>
                  <BaseButton v-if="order.status==='paid'" variant="primary" size="sm" icon="truck" @click="markShipped(order)" :loading="actionLoadingId===order._id">Mark Shipped</BaseButton>
                </td>
              </tr>

              <tr v-if="!isLoading && orders.length===0">
                <td colspan="6" class="px-4 py-10 text-center text-neutral-500">No orders found</td>
              </tr>

              <tr v-if="isLoading">
                <td colspan="6" class="px-4 py-6 text-center text-neutral-500">Loading orders...</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages>1" class="mt-4">
          <BasePagination :current-page="currentPage" :total-pages="totalPages" :total-items="totalOrders" @page-change="handlePageChange" />
        </div>
      </BaseCard>
    </div>

    <!-- Order drawer / modal could go here (future) -->
  </AdminLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseSelect from '../components/base/BaseSelect.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseBadge from '../components/base/BaseBadge.vue'
import BasePagination from '../components/base/BasePagination.vue'
import adminService from '../services/adminService.js'

export default {
  name: 'AdminOrders',
  components: { AdminLayout, BaseCard, BaseInput, BaseSelect, BaseButton, BaseBadge, BasePagination },
  setup() {
    const orders = ref([])
    const isLoading = ref(false)
    const actionLoadingId = ref(null)

    const currentPage = ref(1)
    const totalOrders = ref(0)
    const itemsPerPage = ref(20)
    const totalPages = computed(() => Math.ceil(totalOrders.value / itemsPerPage.value))

    const filters = ref({
      search: '',
      status: '',
      startDate: '',
      endDate: ''
    })

    const statusOptions = [
      { value: '', label: 'All Status' },
      { value: 'pending', label: 'Pending' },
      { value: 'paid', label: 'Paid' },
      { value: 'shipped', label: 'Shipped' },
      { value: 'delivered', label: 'Delivered' },
      { value: 'cancelled', label: 'Cancelled' }
    ]

    const fetchOrders = async () => {
      try {
        isLoading.value = true
        const params = {
          page: currentPage.value,
          limit: itemsPerPage.value,
          status: filters.value.status,
          startDate: filters.value.startDate,
          endDate: filters.value.endDate
        }
        const res = await adminService.api.get('/admin/orders', { params })
        if (res.data?.success) {
          orders.value = res.data.data.orders
          const pagination = res.data.data.pagination
          totalOrders.value = pagination.totalItems
        } else {
          orders.value = res.data?.orders || []
          totalOrders.value = orders.value.length
        }
      } catch (e) {
        console.error('Failed to fetch orders:', e)
        orders.value = []
      } finally {
        isLoading.value = false
      }
    }

    const applyFilters = async () => {
      currentPage.value = 1
      await fetchOrders()
    }

    const clearFilters = () => {
      filters.value = { search: '', status: '', startDate: '', endDate: '' }
      applyFilters()
    }

    const handlePageChange = (page) => {
      currentPage.value = page
      fetchOrders()
    }

    const refresh = () => fetchOrders()

    const statusVariant = (status) => {
      switch (status) {
        case 'paid': return 'success'
        case 'shipped': return 'info'
        case 'delivered': return 'primary'
        case 'cancelled': return 'danger'
        default: return 'neutral'
      }
    }

    const formatDate = (d) => new Date(d).toLocaleString()
    const formatCurrency = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(n || 0))

    const viewOrder = (order) => {
      // TODO: open order details drawer
      console.log('View order', order._id)
    }

    const markShipped = async (order) => {
      try {
        actionLoadingId.value = order._id
        // Placeholder: you can implement /admin/orders/:id/ship endpoint
        console.log('Mark shipped', order._id)
      } finally {
        actionLoadingId.value = null
      }
    }

    onMounted(() => fetchOrders())

    return { orders, isLoading, actionLoadingId, filters, statusOptions, currentPage, totalOrders, totalPages, applyFilters, clearFilters, handlePageChange, refresh, statusVariant, formatDate, formatCurrency, viewOrder, markShipped }
  }
}
</script>
