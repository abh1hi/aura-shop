import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api' })

api.interceptors.request.use((config)=>{
  const auth = useAuthStore()
  if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

export default api
