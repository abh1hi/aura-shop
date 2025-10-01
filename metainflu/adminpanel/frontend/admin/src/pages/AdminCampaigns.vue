

// File: frontend/admin/src/pages/AdminCampaigns.vue
<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Manage Campaigns</h2>
    <div class="bg-white p-6 rounded-xl shadow-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="campaign in campaigns" :key="campaign.id" class="py-4 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-800">{{ campaign.title }}</h3>
            <p class="text-sm text-gray-500">Status: {{ campaign.status }}</p>
          </div>
          <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            View Details
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminCampaigns',
  data() {
    return {
      campaigns: [
        { id: 1, title: 'Summer Collection Launch', status: 'completed' },
        { id: 2, title: 'New Product Teaser', status: 'in-progress' },
      ],
    };
  },
};
</script>

