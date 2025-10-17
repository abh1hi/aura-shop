
// File: frontend/admin/src/pages/AdminDashboard.vue
<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Dashboard Overview</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-md">
        <h3 class="text-lg font-medium text-gray-700">Total Influencers</h3>
        <p class="text-3xl font-bold mt-2">1,245</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md">
        <h3 class="text-lg font-medium text-gray-700">Active Campaigns</h3>
        <p class="text-3xl font-bold mt-2">35</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md">
        <h3 class="text-lg font-medium text-gray-700">Pending Payments</h3>
        <p class="text-3xl font-bold mt-2">$15,400</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md">
        <h3 class="text-lg font-medium text-gray-700">New Users (Last 30 days)</h3>
        <p class="text-3xl font-bold mt-2">120</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
};
</script>
