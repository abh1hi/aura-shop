<template>
  <BaseModal :show="true" @close="$emit('close')">
    <template #title>
      {{ mode === 'create' ? 'Create Product' : mode === 'edit' ? 'Edit Product' : 'View Product' }}
    </template>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput v-model="form.name" label="Product Name" required :disabled="isView" />
        <BaseInput v-model.number="form.price" type="number" label="Price" required :disabled="isView" />
      </div>

      <BaseTextarea v-model="form.description" label="Description" :disabled="isView" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput v-model.number="form.stock" type="number" label="Stock" required :disabled="isView" />
        <BaseSelect v-model="form.category" :options="categoryOptions" label="Category" required :disabled="isView" />
      </div>

      <div class="flex justify-end space-x-2 mt-6">
        <BaseButton variant="secondary" @click="$emit('close')">Cancel</BaseButton>
        <BaseButton v-if="!isView" variant="primary" type="submit" :loading="isSubmitting">
          {{ mode === 'create' ? 'Create' : 'Save Changes' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useProductValidation } from '../composables/useValidation.js'
import adminService from '../services/adminService.js'

import BaseModal from '../components/base/BaseModal.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseTextarea from '../components/base/BaseTextarea.vue'
import BaseSelect from '../components/base/BaseSelect.vue'
import BaseButton from '../components/base/BaseButton.vue'

export default {
  name: 'AdminProductForm',
  components: { BaseModal, BaseInput, BaseTextarea, BaseSelect, BaseButton },
  props: {
    product: { type: Object, default: null },
    mode: { type: String, default: 'create' } // create | edit | view
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const { validateProduct } = useProductValidation()
    const isSubmitting = ref(false)

    const form = ref({
      name: '',
      description: '',
      brand: '',
      price: null,
      stock: 0,
      category: '',
      tags: []
    })

    const categories = ref([])
    const categoryOptions = computed(() => [
      { value: '', label: 'Select category' },
      ...categories.value.map(c => ({ value: c._id, label: c.name }))
    ])

    const isView = computed(() => props.mode === 'view')

    const loadCategories = async () => {
      try {
        const res = await adminService.getCategories()
        categories.value = res.data || res
      } catch (e) {
        categories.value = []
      }
    }

    const hydrateForm = () => {
      if (props.product) {
        form.value = {
          name: props.product.name || '',
          description: props.product.description || '',
          brand: props.product.brand || '',
          price: props.product.price || null,
          stock: props.product.stock || 0,
          category: props.product.category?._id || props.product.category || '',
          tags: props.product.tags || []
        }
      }
    }

    const onSubmit = async () => {
      const validated = validateProduct(form.value)
      if (!validated) return
      isSubmitting.value = true
      try {
        emit('save', validated)
      } finally {
        isSubmitting.value = false
      }
    }

    onMounted(async () => {
      await loadCategories()
      hydrateForm()
    })

    return { form, categoryOptions, isSubmitting, isView, onSubmit }
  }
}
</script>
