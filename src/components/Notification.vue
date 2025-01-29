<template>
  <div v-if="notification.message" :class="`notification ${notification.type}`">
    {{ notification.message }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const notification = ref<{ message: string; type: 'success' | 'error' | '' }>({
  message: '',
  type: '',
});

const showNotification = (message: string, type: 'success' | 'error') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = { message: '', type: '' };
  }, 3000);
};

defineExpose({
  showNotification,
});
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  color: #fff;
  z-index: 1000;
  font-weight: bold;
  animation: fadeInOut 3s forwards;
}
.notification.success {
  background-color: #4caf50;
}
.notification.error {
  background-color: #f44336;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  10%,
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
