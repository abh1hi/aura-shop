<template>
  <div class="min-h-screen grid place-items-center p-6">
    <div class="w-full max-w-md bg-white p-6 rounded-xl shadow-soft">
      <h1 class="text-2xl font-bold mb-1 text-center">Vendor Login</h1>
      <p class="text-sm text-neutral-600 text-center mb-6">Sign in to manage your store</p>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input v-model="email" type="email" class="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500" required>
        </div>
        <div>
          <label class="block text-sm mb-1">Password</label>
          <input v-model="password" type="password" class="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500" required>
        </div>
        <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-lg py-2 font-medium">Sign in</button>
      </form>
    </div>
  </div>
</template>
<script>
import { vendorApi } from '../services/vendorApi'
export default {
  name:'VendorLogin',
  data:()=>({ email:'', password:'' }),
  methods:{
    async login(){
      try{
        const res = await vendorApi.login({ email:this.email, password:this.password })
        localStorage.setItem('vendor_token', res.token)
        this.$router.push('/dashboard')
      }catch(e){ alert('Login failed') }
    }
  }
}
</script>
