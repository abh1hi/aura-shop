<template>
  <section class="page-header">
    <div class="container">
      <h1>{{ title }}</h1>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.page-header {
  background-color: var(--c7);
  padding: 4rem 0;
  text-align: center;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 600;
  color: var(--text-color);
}
</style>
