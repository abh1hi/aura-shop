import { defineStore } from 'pinia'
import api from '../services/api'

function safeParse(value) {
  if (value == null) return null // null or undefined
  const s = String(value).trim()
  if (!s || s === 'undefined' || s === 'null') return null
  try { return JSON.parse(s) } catch { return null }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('vendor_token') || '',
    user: safeParse(localStorage.getItem('vendor_user')),
  }),
  actions: {
    async login(email, password){
      // vendors authenticate through /api/auth/login then RBAC via role=vendor
      const { data } = await api.post('/auth/login', { email, password })
      if (data?.token) {
        this.token = data.token
        this.user = data.user || null
        localStorage.setItem('vendor_token', this.token)
        localStorage.setItem('vendor_user', JSON.stringify(this.user))
        return true
      }
      return false
    },
    logout(){
      this.token = ''
      this.user = null
      localStorage.removeItem('vendor_token')
      localStorage.removeItem('vendor_user')
    }
  }
})
