<template>
  <label class="inline-flex items-center cursor-pointer select-none">
    <input type="checkbox" class="sr-only" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked); vibrate()"/>
    <span :class="['w-11 h-6 rounded-full transition-colors', modelValue ? 'bg-blue-500' : 'bg-gray-300']">
      <span :class="['block w-5 h-5 bg-white rounded-full shadow transform transition', modelValue ? 'translate-x-5' : 'translate-x-0']"></span>
    </span>
  </label>
</template>
<script>
export default { name:'ToggleSwitch', props:{ modelValue:Boolean }, emits:['update:modelValue'], methods:{ vibrate(){ navigator.vibrate?.(10) } } }
</script>
