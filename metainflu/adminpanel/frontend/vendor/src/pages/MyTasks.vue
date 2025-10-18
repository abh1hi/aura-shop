<template>
  <div class="p-4 space-y-5 max-w-xl mx-auto">
    <h1 class="text-xl font-semibold text-gray-dark-text mb-4 mt-2">My Tasks</h1>

    <!-- Task Summary Cards -->
    <div class="grid grid-cols-2 gap-4">
      <div class="card p-4 flex flex-col items-start bg-secondary-blue shadow-md">
        <div class="flex items-center justify-center bg-primary-blue bg-opacity-20 w-10 h-10 rounded-lg mb-2">
          <!-- In Progress Icon (Clock) -->
          <svg class="w-6 h-6 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <p class="text-3xl font-bold text-gray-dark-text">{{ inProgressTasks }}</p>
        <p class="text-sm text-gray-text">In Progress Tasks</p>
      </div>
      <div class="card p-4 flex flex-col items-start bg-chart-light-green shadow-md">
        <div class="flex items-center justify-center bg-success-green bg-opacity-20 w-10 h-10 rounded-lg mb-2">
          <!-- Completed Icon (Checkmark) -->
          <svg class="w-6 h-6 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <p class="text-3xl font-bold text-gray-dark-text">{{ completedTasks }}</p>
        <p class="text-sm text-gray-text">Completed Tasks</p>
      </div>
    </div>

    <!-- Upcoming Tasks List -->
    <div class="card p-4 shadow-md">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-dark-text">Upcoming Tasks</h2>
        <router-link to="/tasks/all" class="text-primary-blue text-sm font-medium hover:underline">See More</router-link>
      </div>
      <div class="space-y-4">
        <div v-for="task in upcomingTasks" :key="task.id" class="flex items-center justify-between pb-3 border-b border-gray-border last:border-b-0 last:pb-0">
          <div class="flex items-start">
            <input 
              type="checkbox" 
              :checked="task.status === 'Completed'" 
              @change="toggleTaskStatus(task.id)" 
              class="mt-1 mr-3 w-5 h-5 rounded text-primary-blue focus:ring-primary-blue border-gray-300" 
            />
            <div>
              <p :class="['text-gray-dark-text text-sm font-medium', { 'line-through text-gray-text': task.status === 'Completed' }]">{{ task.name }}</p>
              <p class="text-xs text-gray-text mt-0.5">{{ task.date }}</p>
            </div>
          </div>
          <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getStatusClass(task.status)]">{{ task.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import vendorService from '../services/vendorService';

const route = useRoute();
route.meta.title = 'My Tasks'; 

const inProgressTasks = ref(0);
const completedTasks = ref(0);
const upcomingTasks = ref([]);

const getStatusClass = (status) => {
  switch (status) {
    case 'Completed': return 'bg-success-green text-white';
    case 'In Progress': return 'bg-info-purple text-white';
    case 'Pending': return 'bg-warning-orange text-white';
    default: return 'bg-gray-200 text-gray-800';
  }
};

const toggleTaskStatus = (taskId) => {
  const task = upcomingTasks.value.find(t => t.id === taskId);
  if (task) {
    const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    // Optimistic update
    task.status = newStatus;
    
    // Update server (implement this in vendorService)
    // vendorService.updateTask(taskId, { status: newStatus }).catch(() => {
    //   task.status = task.status === 'Completed' ? 'In Progress' : 'Completed'; // Rollback on error
    // });
  }
};

onMounted(async () => {
  // Use the comprehensive getDashboardStats to fetch task counts/lists
  try {
    // Note: getDashboardStats is modified to return task data as well.
    const data = await vendorService.getDashboardStats();
    inProgressTasks.value = data.inProgressTasks;
    completedTasks.value = data.completedTasks;
    upcomingTasks.value = data.upcomingTasks;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    // Fallback logic here if needed
  }
});
</script>
