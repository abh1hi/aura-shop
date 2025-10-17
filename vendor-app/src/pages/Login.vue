<template>
  <div class="max-w-sm mx-auto mt-10 ios-card p-4">
    <h2 class="ios-title text-lg">Sign in</h2>
    <p class="ios-muted text-sm mt-1">Vendor access</p>

    <form class="mt-4 space-y-3" @submit.prevent="submit">
      <div>
        <label class="ios-muted text-sm">Email</label>
        <input v-model="email" type="email" class="ios-input w-full mt-1" required />
      </div>
      <div>
        <label class="ios-muted text-sm">Password</label>
        <input v-model="password" type="password" class="ios-input w-full mt-1" required />
      </div>
      <button class="ios-button w-full mt-2">Continue</button>
    </form>

    <p class="ios-muted text-xs mt-3">Your account must have role=vendor to access vendor routes.</p>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

async function submit(){
  const ok = await auth.login(email.value, password.value)
  if (ok) router.push('/')
  else alert('Login failed')
}
</script>
