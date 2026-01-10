<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md" @click="$emit('close')">
    
    <!-- Close Button -->
    <button @click="$emit('close')" class="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors">
      <span class="material-symbols-outlined text-4xl">close</span>
    </button>

    <!-- Main Content -->
    <div class="relative w-full max-w-md h-full max-h-[90vh] flex flex-col items-center justify-center" @click.stop>
      
      <!-- Progress Bar (Simple) -->
      <div class="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
        <div 
          v-for="(story, index) in stories" 
          :key="story.id"
          class="h-1 flex-1 rounded-full overflow-hidden bg-white/30"
        >
          <div 
            class="h-full bg-white transition-all duration-300"
            :class="index < currentIndex ? 'w-full' : (index === currentIndex ? 'w-full animate-progress' : 'w-0')"
          ></div>
        </div>
      </div>

      <!-- Arrow Left -->
      <button 
        v-if="currentIndex > 0"
        @click="prevStory" 
        class="absolute left-4 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors"
      >
        <span class="material-symbols-outlined text-3xl">chevron_left</span>
      </button>

      <!-- Media -->
      <div class="w-full h-full rounded-lg overflow-hidden relative bg-black flex items-center justify-center">
        <img 
          v-if="currentStory.media_type !== 'VIDEO'" 
          :src="currentStory.media_url" 
          class="w-full h-full object-contain"
        />
        <video 
          v-else 
          :src="currentStory.media_url" 
          controls 
          autoplay 
          class="w-full h-full object-contain"
        ></video>

        <!-- Timestamp/Caption Overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
          <p class="text-sm font-medium mb-1">{{ new Date(currentStory.timestamp).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }}</p>
          <p class="text-sm opacity-90 line-clamp-2" v-if="currentStory.caption">{{ currentStory.caption }}</p>
        </div>
      </div>

      <!-- Arrow Right -->
      <button 
        v-if="currentIndex < stories.length - 1"
        @click="nextStory" 
        class="absolute right-4 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors"
      >
        <span class="material-symbols-outlined text-3xl">chevron_right</span>
      </button>

    </div>
  </div>
</template>

<script setup>
const props = defineProps(['stories', 'initialIndex'])
const emit = defineEmits(['close'])

const currentIndex = ref(props.initialIndex || 0)

const currentStory = computed(() => props.stories[currentIndex.value])

const nextStory = () => {
  if (currentIndex.value < props.stories.length - 1) {
    currentIndex.value++
  } else {
    emit('close')
  }
}

const prevStory = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// Keyboard navigation
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const handleKeydown = (e) => {
  if (e.key === 'ArrowRight') nextStory()
  if (e.key === 'ArrowLeft') prevStory()
  if (e.key === 'Escape') emit('close')
}
</script>

<style scoped>
/* Optional: Simple fake progress animation */
.animate-progress {
  /* For MVP, let's just make it full. Real implementation needs duration logic per story */
  width: 100%; 
}
</style>
