

// File: frontend/admin/src/pages/AdminInfluencers.vue
<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Manage Influencers</h2>
    <div class="bg-white p-6 rounded-xl shadow-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="influencer in influencers" :key="influencer.id" class="py-4 flex items-center justify-between">
          <div class="flex items-center">
            <img :src="influencer.image" :alt="influencer.name" class="h-10 w-10 rounded-full mr-4">
            <div>
              <h3 class="text-lg font-medium text-gray-800">{{ influencer.name }}</h3>
              <p class="text-sm text-gray-500">{{ influencer.email }}</p>
            </div>
          </div>
          <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            View Profile
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminInfluencers',
  data() {
    return {
      influencers: [
        { id: 1, name: 'Ava Johnson', email: 'ava@example.com', image: 'https://placehold.co/40x40/cccccc/ffffff?text=Ava' },
        { id: 2, name: 'Liam Chen', email: 'liam@example.com', image: 'https://placehold.co/40x40/cccccc/ffffff?text=Liam' },
      ],
    };
  },
};
</script>
