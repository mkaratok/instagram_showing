<template>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
    <NuxtLink 
      v-for="post in posts" 
      :key="post.id" 
      :to="`/posts/${post.id}`"
      class="block relative aspect-square overflow-hidden rounded-xl cursor-pointer bg-earth-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
      @click.prevent="$emit('open', post)"
      @mouseenter="handleMouseEnter(post, $event)"
      @mouseleave="handleMouseLeave(post, $event)"
    >
      <!-- Image / Carousel / Thumbnail -->
      <img 
        v-show="!post.isPlaying"
        :src="getPostImage(post)" 
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        loading="lazy"
      />

      <!-- Carousel Indicator -->
      <div v-if="post.media_type === 'CAROUSEL_ALBUM'" class="absolute top-3 right-3 text-white/90 drop-shadow-md bg-black/20 backdrop-blur-sm p-1 rounded-full z-10 pointer-events-none">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
      </div>

      <!-- Video Player (Hidden by default, shown on hover for videos) -->
      <video
        v-if="post.media_type === 'VIDEO'"
        ref="videoRefs"
        :src="post.media_url"
        class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        muted
        loop
        playsinline
        preload="metadata"
      ></video>
      
      <div v-if="post.media_type === 'VIDEO'" class="absolute top-3 right-3 text-white/90 drop-shadow-md bg-black/20 backdrop-blur-sm p-1 rounded-full z-10 pointer-events-none">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </div>

      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20 pointer-events-none">
        <div class="flex items-center gap-4 text-white/90 text-sm font-medium">
          <div class="flex items-center"><span class="mr-1.5 text-sage-400">♥</span> {{ post.like_count || 0 }}</div>
          <div class="flex items-center"><span class="mr-1.5 text-sage-400">💬</span> {{ post.comments_count || 0 }}</div>
        </div>
      </div>
      </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps(['posts'])
defineEmits(['open'])

const carouselState = reactive({})

const getPostImage = (post) => {
  if (post.media_type === 'VIDEO') return post.thumbnail_url
  if (post.media_type === 'CAROUSEL_ALBUM' && post.children?.data) {
    const index = carouselState[post.id]?.index || 0
    return post.children.data[index].media_url
  }
  return post.media_url
}

const handleMouseEnter = async (post, event) => {
  // Handle Video
  if (post.media_type === 'VIDEO') {
    const video = event.currentTarget.querySelector('video')
    if (video) {
      try {
        video.currentTime = 0
        await video.play()
      } catch (e) {
        // Autoplay prevented
      }
    }
  }
  
  // Handle Carousel
  if (post.media_type === 'CAROUSEL_ALBUM' && post.children?.data) {
    if (!carouselState[post.id]) {
      carouselState[post.id] = { index: 0, interval: null }
    }
    
    // Clear existing to be safe
    if (carouselState[post.id].interval) clearInterval(carouselState[post.id].interval)

    carouselState[post.id].interval = setInterval(() => {
      const total = post.children.data.length
      carouselState[post.id].index = (carouselState[post.id].index + 1) % total
    }, 1500)
  }
}

const handleMouseLeave = (post, event) => {
  // Handle Video
  if (post.media_type === 'VIDEO') {
    const video = event.currentTarget.querySelector('video')
    if (video) {
      video.pause()
      video.currentTime = 0
    }
  }

  // Handle Carousel
  if (post.media_type === 'CAROUSEL_ALBUM' && carouselState[post.id]) {
    if (carouselState[post.id].interval) {
      clearInterval(carouselState[post.id].interval)
      carouselState[post.id].interval = null
    }
    carouselState[post.id].index = 0
  }
}
</script>
