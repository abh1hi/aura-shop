<template>
  <div class="test-container">
    <div
      v-long-press="longPressOptions"
      class="test-box"
      :class="{ 'is-pressing': isPressing }"
    >
      <p v-if="!isPressing">Long press me</p>
      <p v-else>Pressing...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isPressing = ref(false)

const handleLongPress = () => {
  isPressing.value = true
}

const handleRelease = () => {
  isPressing.value = false
}

const longPressOptions = {
  onLongPress: handleLongPress,
  onRelease: handleRelease,
  delay: 500
}
</script>

<style scoped>
.test-container {
  padding: 20px;
  margin: 20px;
  border: 2px dashed #ccc;
}

.test-box {
  width: 200px;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.test-box.is-pressing {
  background-color: #a0a0a0;
}
</style>
