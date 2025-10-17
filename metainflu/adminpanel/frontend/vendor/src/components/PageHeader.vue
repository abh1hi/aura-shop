<template>
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
    <p v-if="subtitle" class="text-gray-600 mt-1">{{ subtitle }}</p>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }
  }
};
</script>
