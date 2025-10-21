<template>
  <div class="pwa-install-prompt fixed bottom-20 left-4 right-4 z-50 md:bottom-4 md:left-auto md:right-4 md:w-80">
    <div class="bg-white rounded-lg shadow-xl border p-4">
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">Install AURA App</p>
          <p class="text-sm text-gray-600 mt-1">Add to your home screen for quick access and offline browsing.</p>
        </div>
      </div>
      <div class="flex space-x-2 mt-4">
        <button
          @click="installApp"
          class="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          Install
        </button>
        <button
          @click="dismissPrompt"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          Not now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['install', 'dismiss'])

const installApp = () => {
  emit('install')
}

const dismissPrompt = () => {
  emit('dismiss')
}
</script>