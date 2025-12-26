<template>
  <div 
    class="relative group w-full h-full bg-neutral-900/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-rose-500/10 border border-white/5"
    @click="$emit('click')"
  >
    <!-- Image/Thumbnail -->
    <div class="aspect-square w-full h-full relative">
      <NuxtImg
        :src="displayUrl"
        :alt="post.caption || 'Instagram Post'"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        format="webp"
        placeholder
      />
      
      <!-- Type Indicator Icon -->
      <div class="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-1.5 rounded-full text-white/90">
        <Icon v-if="post.media_type === 'VIDEO'" name="heroicons:video-camera" class="w-4 h-4" />
        <Icon v-else-if="post.media_type === 'CAROUSEL_ALBUM'" name="heroicons:square-2-stack" class="w-4 h-4" />
        <Icon v-else name="heroicons:photo" class="w-4 h-4" />
      </div>

      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <p class="text-white text-xs line-clamp-2 mb-2 opacity-90 font-medium">
          {{ post.caption }}
        </p>
        <div class="text-[10px] text-white/60 uppercase tracking-widest">
          {{ formattedDate }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InstagramMedia } from '~/types'

const props = defineProps<{
  post: InstagramMedia
}>()

defineEmits(['click'])

const displayUrl = computed(() => {
  if (props.post.media_type === 'VIDEO') {
    return props.post.thumbnail_url || props.post.media_url
  }
  return props.post.media_url
})

const formattedDate = computed(() => {
  return new Date(props.post.timestamp).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})
</script>
