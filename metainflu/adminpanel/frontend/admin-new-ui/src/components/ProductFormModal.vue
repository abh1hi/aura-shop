<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #title>
      {{ mode === 'create' ? 'Create Product' : mode === 'edit' ? 'Edit Product' : 'View Product' }}
    </template>
    <div class="space-y-4">
      <BaseInput v-model="local.name" label="Name" :disabled="isView" />
      <BaseTextarea v-model="local.description" label="Description" :disabled="isView" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput v-model.number="local.price" type="number" label="Price" :disabled="isView" />
        <BaseInput v-model.number="local.stock" type="number" label="Stock" :disabled="isView" />
      </div>
      <BaseSelect v-model="local.category" :options="categoryOptions" placeholder="Select category" />
    </div>
    <template #footer>
      <div class="flex justify-end space-x-2">
        <BaseButton variant="secondary" @click="$emit('close')">Cancel</BaseButton>
        <BaseButton v-if="!isView" variant="primary" @click="submit" :loading="loading">
          {{ mode === 'create' ? 'Create' : 'Save' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
<script>
import { ref, computed, watch } from 'vue'
import BaseModal from './base/BaseModal.vue'
import BaseInput from './base/BaseInput.vue'
import BaseTextarea from './base/BaseTextarea.vue'
import BaseSelect from './base/BaseSelect.vue'
import BaseButton from './base/BaseButton.vue'

export default {
  name: 'ProductFormModal',
  components: { BaseModal, BaseInput, BaseTextarea, BaseSelect, BaseButton },
  props: {
    show: { type: Boolean, default: false },
    product: { type: Object, default: null },
    mode: { type: String, default: 'create' },
    categories: { type: Array, default: () => [] }
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const local = ref({ name: '', description: '', price: null, stock: 0, category: '' })
    const loading = ref(false)
    const isView = computed(() => props.mode === 'view')

    const categoryOptions = computed(() => [
      { value: '', label: 'Select category' },
      ...props.categories.map(c => ({ value: c._id || c.value, label: c.name || c.label }))
    ])

    watch(() => props.product, (p) => {
      if (p) local.value = { name: p.name||'', description: p.description||'', price: p.price||null, stock: p.stock||0, category: p.category?._id || p.category || '' }
    }, { immediate: true })

    const submit = async () => {
      loading.value = true
      try {
        emit('save', { ...local.value })
      } finally {
        loading.value = false
      }
    }

    return { local, loading, isView, categoryOptions, submit }
  }
}
</script>
