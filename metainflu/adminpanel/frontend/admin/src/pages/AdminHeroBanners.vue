<template>
  <div>
    <h2 class="text-2xl font-semibold mb-6">Manage Hero Banners</h2>

    <!-- Add/Edit Hero Banner Form -->
    <div class="bg-white p-6 rounded-xl shadow-md mb-8">
      <h3 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Hero Banner' : 'Add New Hero Banner' }}</h3>
      <form @submit.prevent="isEditing ? updateBanner() : addBanner()" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" v-model="newBanner.title" id="title" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
          <label for="subtitle" class="block text-sm font-medium text-gray-700">Subtitle</label>
          <input type="text" v-model="newBanner.subtitle" id="subtitle" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
          <label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="text" v-model="newBanner.imageUrl" id="imageUrl" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
          <label for="link" class="block text-sm font-medium text-gray-700">Link</label>
          <input type="text" v-model="newBanner.link" id="link" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div class="flex items-center">
          <input type="checkbox" v-model="newBanner.active" id="active" class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
          <label for="active" class="ml-2 block text-sm text-gray-900">Active</label>
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
      <ul class="divide-y divide-gray-200">
        <li v-for="banner in banners" :key="banner._id" class="py-4 flex items-center justify-between">
          <div class="flex items-center">
            <img :src="banner.imageUrl || 'https://placehold.co/40x40/cccccc/ffffff?text=Img'" :alt="banner.title" class="h-10 w-10 rounded-full mr-4 object-cover">
            <div>
              <h3 class="text-lg font-medium text-gray-800">{{ banner.title }}</h3>
              <p class="text-sm text-gray-500">{{ banner.subtitle }}</p>
              <p class="text-sm" :class="banner.active ? 'text-green-500' : 'text-red-500'">{{ banner.active ? 'Active' : 'Inactive' }}</p>
            </div>
          </div>
          <div class="flex space-x-2">
            <button @click="editBanner(banner)" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
              Edit
            </button>
            <button @click="deleteBanner(banner._id)" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
              Delete
            </button>
          </div>
        </li>
      </ul>
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
      } catch (error) {
        console.error("Failed to fetch hero banners:", error);
      }
    },
    async addBanner() {
      try {
        await adminService.createHeroBanner(this.newBanner);
        this.resetForm();
        await this.fetchBanners();
      } catch (error) {
        console.error("Failed to add hero banner:", error);
      }
    },
    editBanner(banner) {
      this.isEditing = true;
      this.editingId = banner._id;
      this.newBanner = { ...banner };
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
      } catch (error) {
        console.error("Failed to update hero banner:", error);
      }
    },
    async deleteBanner(id) {
      if (confirm('Are you sure you want to delete this banner?')) {
        try {
          await adminService.deleteHeroBanner(id);
          await this.fetchBanners();
        } catch (error) {
          console.error("Failed to delete hero banner:", error);
        }
      }
    },
    resetForm() {
      this.newBanner = {
        title: '',
        subtitle: '',
        imageUrl: '',
        link: '',
        active: true,
      };
    },
  },
};
</script>
