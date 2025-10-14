<template>
  <div class="p-4 sm:p-6 md:p-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Manage Pending Categories</h1>

    <div v-if="isLoading" class="text-center text-gray-500 py-10">Loading categories...</div>
    <div v-else-if="error" class="text-center py-10 text-red-500">Error loading categories: {{ error }}</div>

    <div v-else class="bg-white shadow-md rounded-lg overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Category Name</th>
            <th class="text-center py-3 px-4 font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pendingCategories.length === 0">
            <td colspan="2" class="text-center py-10 text-gray-500">No pending categories found.</td>
          </tr>
          <tr v-for="category in pendingCategories" :key="category._id" class="border-b hover:bg-gray-50">
            <td class="py-3 px-4 text-gray-700">{{ category.name }}</td>
            <td class="py-3 px-4 text-center">
              <button @click="approveCategory(category._id)" class="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition-colors mr-2">Approve</button>
              <button @click="rejectCategory(category._id)" class="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition-colors">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import adminService from '../services/adminService';

const pendingCategories = ref([]);
const isLoading = ref(true);
const error = ref(null);

const fetchPendingCategories = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    pendingCategories.value = await adminService.getPendingCategories();
  } catch (err) {
    console.error('Error fetching pending categories:', err);
    error.value = err.message || 'Failed to load categories.';
  } finally {
    isLoading.value = false;
  }
};

const approveCategory = async (id) => {
  try {
    await adminService.approveCategory(id);
    pendingCategories.value = pendingCategories.value.filter(c => c._id !== id);
  } catch (err) {
    console.error('Error approving category:', err);
    alert('Failed to approve category.');
  }
};

const rejectCategory = async (id) => {
  if (!confirm('Are you sure you want to reject this category? This will delete it permanently.')) {
    return;
  }
  try {
    await adminService.rejectCategory(id);
    pendingCategories.value = pendingCategories.value.filter(c => c._id !== id);
  } catch (err) {
    console.error('Error rejecting category:', err);
    alert('Failed to reject category.');
  }
};

onMounted(fetchPendingCategories);
</script>

<style scoped>
/* Using Tailwind CSS classes directly in the template */
</style>
