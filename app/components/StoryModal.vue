<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4" @click.self="$emit('close')">
    <div class="relative w-full max-w-md">
      <!-- Close button -->
      <button 
        @click="$emit('close')" 
        class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
      >
        <span class="material-symbols-outlined text-4xl">close</span>
      </button>

      <!-- Story viewer -->
      <div class="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl">
        <!-- Progress bars -->
        <div class="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
          <div 
            v-for="(story, index) in stories" 
            :key="story.id" 
            class="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div 
              class="h-full bg-white transition-all duration-300"
              :style="{ width: index < currentIndex ? '100%' : index === currentIndex ? progress + '%' : '0%' }"
            ></div>
          </div>
        </div>

        <!-- Story content -->
        <div v-if="currentStory" class="relative w-full h-full">
          <img 
            v-if="currentStory.media_type === 'IMAGE'" 
            :src="currentStory.media_url" 
            class="w-full h-full object-contain"
            alt="Story"
          />
          <video 
            v-else-if="currentStory.media_type === 'VIDEO'"
            :src="currentStory.media_url" 
            class="w-full h-full object-contain"
            autoplay
            loop
            muted
            playsinline
          ></video>
          
          <!-- Caption -->
          <div v-if="currentStory.caption" class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p class="text-white text-sm">{{ currentStory.caption }}</p>
          </div>
        </div>

        <!-- Navigation -->
        <button 
          @click="previousStory" 
          class="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          v-if="currentIndex > 0"
        >
          <span class="material-symbols-outlined text-4xl">chevron_left</span>
        </button>
        <button 
          @click="nextStory" 
          class="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          v-if="currentIndex < stories.length - 1"
        >
          <span class="material-symbols-outlined text-4xl">chevron_right</span>
        </button>

        <!-- Click areas for navigation -->
        <div class="absolute inset-0 flex">
          <div class="flex-1" @click="previousStory"></div>
          <div class="flex-1" @click="nextStory"></div>
        </div>
      </div>

      <!-- No stories message -->
      <div v-if="!stories || stories.length === 0" class="text-center py-12">
        <p class="text-white text-lg">Son 24 saatte story yok</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

const currentIndex = ref(0)
const progress = ref(0)
let progressInterval = null

const currentStory = computed(() => props.stories[currentIndex.value])

const nextStory = () => {
  if (currentIndex.value < props.stories.length - 1) {
    currentIndex.value++
    resetProgress()
  } else {
    emit('close')
  }
}

const previousStory = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    resetProgress()
  }
}

const resetProgress = () => {
  progress.value = 0
  if (progressInterval) {
    clearInterval(progressInterval)
  }
  startProgress()
}

const startProgress = () => {
  progressInterval = setInterval(() => {
    progress.value += 1
    if (progress.value >= 100) {
      nextStory()
    }
  }, 50) // 5 seconds total (100 * 50ms)
}

onMounted(() => {
  if (props.stories && props.stories.length > 0) {
    startProgress()
  }
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})

// Keyboard navigation
const handleKeydown = (e) => {
  if (e.key === 'ArrowLeft') previousStory()
  if (e.key === 'ArrowRight') nextStory()
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Smooth transitions */
</style>
