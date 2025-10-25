<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #title>{{ mode === 'create' ? 'Create User' : mode === 'edit' ? 'Edit User' : 'View User' }}</template>
    <div class="space-y-4">
      <BaseInput v-model="local.name" label="Full Name" :disabled="isView" />
      <BaseInput v-model="local.email" label="Email" type="email" :disabled="isView || mode==='edit'" />
      <BaseSelect v-model="local.role" :options="roleOptions" placeholder="Select role" :disabled="isView" />
    </div>
    <template #footer>
      <div class="flex justify-end space-x-2">
        <BaseButton variant="secondary" @click="$emit('close')">Close</BaseButton>
        <BaseButton v-if="!isView" variant="primary" @click="submit" :loading="loading">Save</BaseButton>
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
  name: 'UserFormModal',
  components: { BaseModal, BaseInput, BaseSelect, BaseButton },
  props: { show: Boolean, user: Object, mode: String },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const local = ref({ name: '', email: '', role: '' })
    const loading = ref(false)
    const isView = computed(() => props.mode === 'view')

    const roleOptions = [
      { value: 'user', label: 'User' },
      { value: 'vendor', label: 'Vendor' },
      { value: 'admin', label: 'Admin' }
    ]

    watch(() => props.user, (u) => { if (u) local.value = { name: u.name||'', email: u.email||'', role: u.role||'user' } }, { immediate: true })

    const submit = async () => { loading.value = true; try { emit('save', { ...local.value }) } finally { loading.value = false } }

    return { local, loading, isView, roleOptions, submit }
  }
}
</script>
