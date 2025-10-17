<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-4">Notifications</h1>
    <p class="text-gray-600 mb-6">Your recent updates and alerts will appear here.</p>
    <div class="space-y-3">
      <div v-for="n in notifications" :key="n.id" class="p-4 border border-gray-200 rounded-lg bg-white flex items-start space-x-3">
        <div class="w-2 h-2 rounded-full mt-2" :class="n.read ? 'bg-gray-300' : 'bg-blue-500'"></div>
        <div class="flex-1">
          <p class="text-sm text-gray-900">{{ n.message }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ n.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notifications',
  data() {
    return {
      notifications: [
        { id: 1, message: 'New order received', time: 'Just now', read: false },
        { id: 2, message: 'Payout processed: ₹12,500', time: '30m ago', read: true },
        { id: 3, message: 'Low stock: iPhone 15 Pro', time: '1h ago', read: true }
      ]
    };
  }
};
</script>
