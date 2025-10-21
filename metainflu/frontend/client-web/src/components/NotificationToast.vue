<template>
  <teleport to="body">
    <div class="toast-container fixed top-4 right-4 z-50 space-y-2">
      <transition-group name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'toast-item max-w-sm bg-white rounded-lg shadow-lg border-l-4 p-4',
            getToastColorClass(toast.type)
          ]"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <component :is="getToastIcon(toast.type)" class="w-5 h-5" />
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900">{{ toast.title }}</p>
              <p v-if="toast.message" class="mt-1 text-sm text-gray-600">{{ toast.message }}</p>
            </div>
            <button
              @click="removeToast(toast.id)"
              class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'

// Toast state
const toasts = ref([])
let toastIdCounter = 0

// Toast types
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Methods
const addToast = (toast) => {
  const id = ++toastIdCounter
  const newToast = {
    id,
    type: toast.type || TOAST_TYPES.INFO,
    title: toast.title,
    message: toast.message,
    duration: toast.duration || 5000
  }
  
  toasts.value.push(newToast)
  
  // Auto remove after duration
  if (newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }
  
  return id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const clearAllToasts = () => {
  toasts.value = []
}

const getToastColorClass = (type) => {
  switch (type) {
    case TOAST_TYPES.SUCCESS:
      return 'border-green-500'
    case TOAST_TYPES.ERROR:
      return 'border-red-500'
    case TOAST_TYPES.WARNING:
      return 'border-yellow-500'
    case TOAST_TYPES.INFO:
    default:
      return 'border-blue-500'
  }
}

const getToastIcon = (type) => {
  switch (type) {
    case TOAST_TYPES.SUCCESS:
      return 'CheckIcon'
    case TOAST_TYPES.ERROR:
      return 'ExclamationIcon'
    case TOAST_TYPES.WARNING:
      return 'ExclamationTriangleIcon'
    case TOAST_TYPES.INFO:
    default:
      return 'InformationIcon'
  }
}

// Expose methods for global use
defineExpose({
  addToast,
  removeToast,
  clearAllToasts,
  TOAST_TYPES
})
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

@media (max-width: 640px) {
  .toast-container {
    top: 1rem;
    right: 1rem;
    left: 1rem;
  }
  
  .toast-item {
    max-width: none;
  }
}
</style>