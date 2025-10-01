

// File: frontend/client/src/components/InfluencerCard.vue
<template>
  <div class="bg-white p-6 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
    <div class="flex items-center mb-4">
      <img :src="influencer.image" :alt="influencer.name" class="w-20 h-20 rounded-full object-cover mr-4">
      <div class="flex flex-col">
        <h3 class="text-xl font-bold text-gray-800">{{ influencer.name }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ influencer.category }}</p>
      </div>
    </div>
    <div class="space-y-2 text-sm text-gray-600">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span>{{ influencer.followers }}</span>
      </div>
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
        </svg>
        <span>{{ influencer.engagements }}</span>
      </div>
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm10 2a1 1 0 110 2h-4a1 1 0 110-2h4zM7 8a1 1 0 100 2h1a1 1 0 100-2H7zm-3 2a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 10-2h1a1 1 0 110 2H5z" clip-rule="evenodd" />
        </svg>
        <span>{{ influencer.cost }}</span>
      </div>
    </div>
    <div class="mt-6">
      <button class="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors">
        View Profile
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InfluencerCard',
  props: {
    influencer: {
      type: Object,
      required: true,
    },
  },
};
</script>

