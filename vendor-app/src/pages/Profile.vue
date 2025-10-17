<template>
  <div class="max-w-lg ios-card p-4">
    <h2 class="ios-title text-base">Profile</h2>
    <div class="mt-3 space-y-2">
      <div class="flex items-center justify-between"><span class="ios-muted">Name</span><span>{{ user?.name }}</span></div>
      <div class="flex items-center justify-between"><span class="ios-muted">Email</span><span>{{ user?.email }}</span></div>
      <div class="flex items-center justify-between"><span class="ios-muted">Role</span><span>{{ user?.role }}</span></div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
const user = computed(()=> useAuthStore().user)
</script>
