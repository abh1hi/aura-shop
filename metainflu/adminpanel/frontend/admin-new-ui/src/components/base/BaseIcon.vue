<template>
  <svg v-if="name" :class="classes" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path v-if="name==='information-circle'" fill-rule="evenodd" d="M12 2.25C6.615 2.25 2.25 6.615 2.25 12S6.615 21.75 12 21.75 21.75 17.385 21.75 12 17.385 2.25 12 2.25Zm.75 6a.75.75 0 1 0-1.5 0v.008a.75.75 0 0 0 1.5 0V8.25Zm0 3a.75.75 0 0 0-1.5 0v5.25a.75.75 0 0 0 1.5 0V11.25Z" clip-rule="evenodd" />
    <path v-else-if="name==='exclamation-triangle'" d="M11.259 3.404a1.5 1.5 0 0 1 2.482 0l8.996 14.994A1.5 1.5 0 0 1 21.496 21H2.504a1.5 1.5 0 0 1-1.241-2.602L11.259 3.404Z" />
    <path v-else-if="name==='check-circle'" fill-rule="evenodd" d="M12 2.25C6.615 2.25 2.25 6.615 2.25 12S6.615 21.75 12 21.75 21.75 17.385 21.75 12 17.385 2.25 12 2.25Zm3.53 8.03a.75.75 0 0 0-1.06-1.06l-3.97 3.97-1.47-1.47a.75.75 0 0 0-1.06 1.06l2 2c.293.293.767.293 1.06 0l4.5-4.5Z" clip-rule="evenodd" />
    <path v-else-if="name==='x-circle'" fill-rule="evenodd" d="M12 2.25C6.615 2.25 2.25 6.615 2.25 12S6.615 21.75 12 21.75 21.75 17.385 21.75 12 17.385 2.25 12 2.25Zm2.03 7.72a.75.75 0 0 0-1.06-1.06L12 9.94l-.97-.97a.75.75 0 1 0-1.06 1.06l.97.97-.97.97a.75.75 0 1 0 1.06 1.06l.97-.97.97.97a.75.75 0 0 0 1.06-1.06L13.06 12l.97-.97Z" clip-rule="evenodd" />
    <path v-else-if="name==='envelope'" d="M1.5 8.25A2.25 2.25 0 0 1 3.75 6h16.5A2.25 2.25 0 0 1 22.5 8.25v7.5A2.25 2.25 0 0 1 20.25 18H3.75A2.25 2.25 0 0 1 1.5 15.75v-7.5Zm3.372-.53a.75.75 0 0 0-1.044 1.08l6.75 6.532a.75.75 0 0 0 1.044 0l6.75-6.532a.75.75 0 0 0-1.044-1.08L12 13.982 4.872 7.72Z" />
    <path v-else-if="name==='lock-closed'" d="M12 1.5a4.5 4.5 0 0 0-4.5 4.5v3H6A2.25 2.25 0 0 0 3.75 11.25v7.5A2.25 2.25 0 0 0 6 21H18a2.25 2.25 0 0 0 2.25-2.25v-7.5A2.25 2.25 0 0 0 18 9H16.5V6A4.5 4.5 0 0 0 12 1.5Z" />
    <path v-else d="" />
  </svg>
</template>

<script>
export default {
  name: 'BaseIcon',
  props: {
    name: { type: String, required: true },
    size: { type: String, default: 'md' }
  },
  computed: {
    classes() {
      const map = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6', xl: 'h-8 w-8' }
      return map[this.size] || map.md
    }
  }
}
</script>
