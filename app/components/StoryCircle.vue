<template>
  <div class="relative w-24 h-24 md:w-32 md:h-32 cursor-pointer group">
    <!-- Gradient Ring -->
    <div class="absolute inset-0 rounded-full border-[3px] border-transparent bg-gradient-to-tr from-earth-800 via-sage-500 to-sage-200 bg-clip-border animate-spin-slow"></div>
    
    <!-- Gap -->
    <div class="absolute inset-[4px] bg-earth-900 rounded-full z-10"></div>

    <!-- Image -->
    <img 
      :src="src" 
      alt="Profile" 
      class="absolute inset-[6px] w-[calc(100%-12px)] h-[calc(100%-12px)] rounded-full object-cover z-20 border border-earth-800"
    />
  </div>
</template>

<script setup>
defineProps(['src'])
</script>

<style>
.animate-spin-slow { animation: spin 10s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>
