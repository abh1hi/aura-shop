<template>
  <div>
    <header class="sticky top-0 z-10 bg-iosBg/80 backdrop-blur border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 class="ios-title text-lg">Vendor</h1>
        <div class="flex items-center gap-2">
          <button v-if="!isAuthed" class="ios-button" @click="goLogin">Sign in</button>
          <div v-else class="flex items-center gap-3">
            <span class="ios-muted text-sm">{{ user?.name }} (vendor)</span>
            <button class="ios-button bg-iosRed" @click="logout">Logout</button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const isAuthed = computed(()=> !!auth.token)
const user = computed(()=> auth.user)

function goLogin(){ router.push({ name:'login' }) }
function logout(){ auth.logout(); router.push({ name:'login' }) }
</script>
