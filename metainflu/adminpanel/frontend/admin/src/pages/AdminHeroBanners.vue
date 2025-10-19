<template>
  <div>
    <h2 class="text-2xl font-semibold mb-6">Manage Hero Banners</h2>

    <!-- Add/Edit Hero Banner Form -->
    <div class="bg-white p-6 rounded-xl shadow-md mb-8">
      <h3 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Hero Banner' : 'Add New Hero Banner' }}</h3>
      <form @submit.prevent="isEditing ? updateBanner() : addBanner()" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" v-model="newBanner.title" id="title" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          </div>
          <div>
            <label for="subtitle" class="block text-sm font-medium text-gray-700">Subtitle</label>
            <input type="text" v-model="newBanner.subtitle" id="subtitle" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          </div>
        </div>
        <div>
          <label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="text" v-model="newBanner.imageUrl" id="imageUrl" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
          <label for="link" class="block text-sm font-medium text-gray-700">Link URL (optional)</label>
          <input type="text" v-model="newBanner.link" id="link" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="https://example.com/product">
        </div>
        <div class="flex items-center space-x-6">
          <div class="flex items-center">
            <input type="checkbox" v-model="newBanner.active" id="active" class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
            <label for="active" class="ml-2 block text-sm text-gray-900">Active</label>
          </div>
          <div>
            <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">Priority (higher shows first)</label>
            <input type="number" v-model.number="newBanner.priority" id="priority" min="0" class="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          </div>
        </div>
        <div class="flex space-x-4">
          <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {{ isEditing ? 'Update Banner' : 'Add Banner' }}
          </button>
          <button v-if="isEditing" @click="cancelEdit" type="button" class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Existing Hero Banners List -->
    <div class="bg-white p-6 rounded-xl shadow-md">
      <h3 class="text-xl font-semibold mb-4">Existing Hero Banners</h3>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="banner in banners" :key="banner._id" class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div class="h-48">
            <img :src="banner.imageUrl || 'https://placehold.co/400x200/cccccc/ffffff?text=Hero+Banner'" :alt="banner.title" class="w-full h-full object-cover">
          </div>
          <div class="p-4 space-y-2">
            <h4 class="text-lg font-semibold text-gray-800">{{ banner.title }}</h4>
            <p class="text-sm text-gray-600">{{ banner.subtitle }}</p>
            <div class="flex items-center justify-between text-sm">
              <span :class="banner.active ? 'text-green-500' : 'text-red-500'">
                {{ banner.active ? 'Active' : 'Inactive' }}
              </span>
              <span class="text-gray-500">Priority: {{ banner.priority || 0 }}</span>
            </div>
            <div v-if="banner.link" class="text-xs text-blue-500 truncate">
              🔗 {{ banner.link }}
            </div>
          </div>
          <div class="flex border-t border-gray-200">
            <button @click="editBanner(banner)" class="flex-1 bg-blue-500 text-white py-3 hover:bg-blue-600 transition-colors text-sm font-medium">
              Edit
            </button>
            <button @click="deleteBanner(banner._id)" class="flex-1 bg-red-500 text-white py-3 hover:bg-red-600 transition-colors text-sm font-medium border-l border-red-400">
              Delete
            </button>
          </div>
        </div>
      </div>
      <div v-if="banners.length === 0" class="text-center py-8 text-gray-500">
        No hero banners found. Create your first one above!
      </div>
    </div>
  </div>
</template>

<script>
import adminService from '../services/adminService';

export default {
  name: 'AdminHeroBanners',
  data() {
    return {
      banners: [],
      newBanner: {
        title: '',
        subtitle: '',
        imageUrl: '',
        link: '',
        priority: 0,
        active: true,
      },
      isEditing: false,
      editingId: null,
    };
  },
  async created() {
    await this.fetchBanners();
  },
  methods: {
    async fetchBanners() {
      try {
        this.banners = await adminService.getHeroBanners();
        // Sort by priority (highest first) then by creation date
        this.banners.sort((a, b) => {
          if (a.priority !== b.priority) {
            return (b.priority || 0) - (a.priority || 0);
          }
          return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
        });
      } catch (error) {
        console.error("Failed to fetch hero banners:", error);
        alert('Failed to fetch hero banners. Please try again.');
      }
    },
    async addBanner() {
      try {
        await adminService.createHeroBanner(this.newBanner);
        this.resetForm();
        await this.fetchBanners();
        alert('Hero banner added successfully!');
      } catch (error) {
        console.error("Failed to add hero banner:", error);
        alert('Failed to add hero banner. Please try again.');
      }
    },
    editBanner(banner) {
      this.isEditing = true;
      this.editingId = banner._id;
      this.newBanner = { ...banner };
      
      // Scroll to top to show the form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    cancelEdit() {
      this.isEditing = false;
      this.editingId = null;
      this.resetForm();
    },
    async updateBanner() {
      try {
        await adminService.updateHeroBanner(this.editingId, this.newBanner);
        this.cancelEdit();
        await this.fetchBanners();
        alert('Hero banner updated successfully!');
      } catch (error) {
        console.error("Failed to update hero banner:", error);
        alert('Failed to update hero banner. Please try again.');
      }
    },
    async deleteBanner(id) {
      if (confirm('Are you sure you want to delete this hero banner? This action cannot be undone.')) {
        try {
          await adminService.deleteHeroBanner(id);
          await this.fetchBanners();
          alert('Hero banner deleted successfully!');
        } catch (error) {
          console.error("Failed to delete hero banner:", error);
          alert('Failed to delete hero banner. Please try again.');
        }
      }
    },
    resetForm() {
      this.newBanner = {
        title: '',
        subtitle: '',
        imageUrl: '',
        link: '',
        priority: 0,
        active: true,
      };
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