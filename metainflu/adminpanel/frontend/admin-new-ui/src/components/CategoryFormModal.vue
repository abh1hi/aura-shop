<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #title>{{ mode === 'create' ? 'Create Category' : 'Edit Category' }}</template>
    <div class="space-y-4">
      <BaseInput v-model="local.name" label="Name" />
      <BaseSelect v-model="local.parentId" :options="categoryOptions" placeholder="No parent (root)" />
    </div>
    <template #footer>
      <div class="flex justify-end space-x-2">
        <BaseButton variant="secondary" @click="$emit('close')">Cancel</BaseButton>
        <BaseButton variant="primary" @click="submit" :loading="loading">Save</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
<script>
import { ref, computed, watch } from 'vue'
import BaseModal from './base/BaseModal.vue'
import BaseInput from './base/BaseInput.vue'
import BaseSelect from './base/BaseSelect.vue'
import BaseButton from './base/BaseButton.vue'

export default {
  name: 'CategoryFormModal',
  components: { BaseModal, BaseInput, BaseSelect, BaseButton },
  props: { show: Boolean, category: Object, categories: Array, mode: String },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const local = ref({ name: '', parentId: '' })
    const loading = ref(false)

    watch(() => props.category, (c) => { if (c) local.value = { name: c.name||'', parentId: c.parentId||'' } }, { immediate: true })

    const categoryOptions = computed(() => [
      { value: '', label: 'No parent (root)' },
      ...(props.categories||[]).map(c => ({ value: c._id || c.value, label: c.name || c.label }))
    ])

    const submit = async () => { loading.value = true; try { emit('save', { ...local.value }) } finally { loading.value = false } }

    return { local, loading, categoryOptions, submit }
  }
}
</script>
