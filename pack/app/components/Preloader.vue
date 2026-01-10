<template>
  <Transition name="fade">
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-earth-900">
      <div class="text-center">
        <svg class="w-24 h-24 text-sage-500 animate-pulse mx-auto" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-1.07 3.9-2.74 5.08z"/>
        </svg>
        <p class="mt-4 text-earth-300 font-serif tracking-widest text-sm">NAMASTE</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({ loading: Boolean })
</script>

<style scoped>
.fade-leave-active { transition: opacity 0.8s ease; }
.fade-leave-to { opacity: 0; }
</style>
