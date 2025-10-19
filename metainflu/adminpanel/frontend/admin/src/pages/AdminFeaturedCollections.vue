<template>
  <div>
    <h2 class="text-2xl font-semibold mb-6">Manage Featured Collections</h2>

    <!-- Add/Edit Featured Collection Form -->
    <div class="bg-white p-6 rounded-xl shadow-md mb-8">
      <h3 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Featured Collection' : 'Add New Featured Collection' }}</h3>
      <form @submit.prevent="isEditing ? updateCollection() : addCollection()" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" v-model="newCollection.title" id="title" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="newCollection.description" id="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
        </div>
        <div>
          <label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="text" v-model="newCollection.imageUrl" id="imageUrl" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
          <input type="text" v-model="newCollection.category" id="category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="e.g., Electronics, Fashion, Home">
        </div>
        <div>
          <label for="productIds" class="block text-sm font-medium text-gray-700">Product IDs (comma-separated)</label>
          <input type="text" v-model="productIdsString" id="productIds" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="product1,product2,product3">
        </div>
        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700">Priority (higher numbers show first)</label>
          <input type="number" v-model.number="newCollection.priority" id="priority" min="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div class="flex items-center">
          <input type="checkbox" v-model="newCollection.active" id="active" class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
          <label for="active" class="ml-2 block text-sm text-gray-900">Active</label>
        </div>
        <div class="flex space-x-4">
          <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {{ isEditing ? 'Update Collection' : 'Add Collection' }}
          </button>
          <button v-if="isEditing" @click="cancelEdit" type="button" class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Existing Featured Collections List -->
    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-xl font-semibold mb-4">Existing Featured Collections</h3>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="collection in collections" :key="collection._id" class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div class="mb-4">
            <img :src="collection.imageUrl || 'https://placehold.co/300x200/cccccc/ffffff?text=Collection'" :alt="collection.title" class="w-full h-48 object-cover rounded-md">
          </div>
          <div class="space-y-2">
            <h4 class="text-lg font-semibold text-gray-800">{{ collection.title }}</h4>
            <p class="text-sm text-gray-600">{{ collection.description }}</p>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Category: {{ collection.category || 'N/A' }}</span>
              <span class="text-gray-500">Priority: {{ collection.priority || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm" :class="collection.active ? 'text-green-500' : 'text-red-500'">{{ collection.active ? 'Active' : 'Inactive' }}</span>
              <span class="text-sm text-gray-500">{{ collection.productIds?.length || 0 }} products</span>
            </div>
          </div>
          <div class="flex space-x-2 mt-4">
            <button @click="editCollection(collection)" class="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm">
              Edit
            </button>
            <button @click="deleteCollection(collection._id)" class="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
      <div v-if="collections.length === 0" class="text-center py-8 text-gray-500">
        No featured collections found. Create your first one above!
      </div>
    </div>
  </div>
</template>

<script>
import adminService from '../services/adminService';

export default {
  name: 'AdminFeaturedCollections',
  data() {
    return {
      collections: [],
      newCollection: {
        title: '',
        description: '',
        imageUrl: '',
        category: '',
        productIds: [],
        priority: 0,
        active: true,
      },
      isEditing: false,
      editingId: null,
      productIdsString: '',
    };
  },
  async created() {
    await this.fetchCollections();
  },
  watch: {
    productIdsString(newVal) {
      this.newCollection.productIds = newVal
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);
    }
  },
  methods: {
    async fetchCollections() {
      try {
        this.collections = await adminService.getFeaturedCollections();
      } catch (error) {
        console.error("Failed to fetch featured collections:", error);
        alert('Failed to fetch featured collections. Please try again.');
      }
    },
    async addCollection() {
      try {
        await adminService.createFeaturedCollection(this.newCollection);
        this.resetForm();
        await this.fetchCollections();
        alert('Featured collection added successfully!');
      } catch (error) {
        console.error("Failed to add featured collection:", error);
        alert('Failed to add featured collection. Please try again.');
      }
    },
    editCollection(collection) {
      this.isEditing = true;
      this.editingId = collection._id;
      this.newCollection = { ...collection };
      this.productIdsString = collection.productIds?.join(', ') || '';
      
      // Scroll to top to show the form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    cancelEdit() {
      this.isEditing = false;
      this.editingId = null;
      this.resetForm();
    },
    async updateCollection() {
      try {
        await adminService.updateFeaturedCollection(this.editingId, this.newCollection);
        this.cancelEdit();
        await this.fetchCollections();
        alert('Featured collection updated successfully!');
      } catch (error) {
        console.error("Failed to update featured collection:", error);
        alert('Failed to update featured collection. Please try again.');
      }
    },
    async deleteCollection(id) {
      if (confirm('Are you sure you want to delete this featured collection? This action cannot be undone.')) {
        try {
          await adminService.deleteFeaturedCollection(id);
          await this.fetchCollections();
          alert('Featured collection deleted successfully!');
        } catch (error) {
          console.error("Failed to delete featured collection:", error);
          alert('Failed to delete featured collection. Please try again.');
        }
      }
    },
    resetForm() {
      this.newCollection = {
        title: '',
        description: '',
        imageUrl: '',
        category: '',
        productIds: [],
        priority: 0,
        active: true,
      };
      this.productIdsString = '';
    },
  },
};
</script>

<style scoped>
/* Custom styles for better visual hierarchy */
.grid {
  display: grid;
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>