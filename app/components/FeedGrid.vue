<template>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
    <div 
      v-for="(post, index) in posts" 
      :key="post.id" 
      class="block relative aspect-square overflow-hidden rounded-xl cursor-pointer bg-earth-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
      @click="$emit('open', post)"
      @mouseenter="handleMouseEnter(post, $event)"
      @mouseleave="handleMouseLeave(post, $event)"
    >
      <!-- Image / Carousel / Thumbnail -->
      <NuxtImg 
        v-show="!post.isPlaying"
        :src="getPostImage(post)" 
        :alt="getAltText(post)"
        format="webp"
        quality="80"
        :loading="index < 3 ? 'eager' : 'lazy'"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
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
          <div class="flex items-center"><svg class="w-4 h-4 mr-1.5 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/></svg> {{ post.like_count || 0 }}</div>
          <div class="flex items-center"><svg class="w-4 h-4 mr-1.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clip-rule="evenodd"/></svg> {{ post.comments_count || 0 }}</div>
        </div>
      </div>
      </div>
  </div>
</template>

<script setup>
const props = defineProps(['posts'])
defineEmits(['open'])

const carouselState = reactive({})

const getPostImage = (post) => {
  // Helper to check if URL is a video
  const isVideoUrl = (url) => url && (url.includes('.mp4') || url.includes('/video/'))
  
  // VIDEO type always uses thumbnail
  if (post.media_type === 'VIDEO' || post.media_type === 'REELS') {
    return post.thumbnail_url || '/placeholder.jpg'
  }
  
  // CAROUSEL - find first IMAGE child, not video
  if (post.media_type === 'CAROUSEL_ALBUM' && post.children?.data) {
    const index = carouselState[post.id]?.index || 0
    const child = post.children.data[index]
    
    // If current child is video, use its thumbnail
    if (child?.media_type === 'VIDEO' || isVideoUrl(child?.media_url)) {
      return child?.thumbnail_url || post.thumbnail_url || '/placeholder.jpg'
    }
    return child?.media_url || post.thumbnail_url || '/placeholder.jpg'
  }
  
  // For IMAGE type - but check if URL is actually a video
  if (isVideoUrl(post.media_url)) {
    return post.thumbnail_url || '/placeholder.jpg'
  }
  
  return post.media_url || post.thumbnail_url || '/placeholder.jpg'
}

// Generate SEO-friendly alt text
const getAltText = (post) => {
  if (!post.caption) return 'Instagram gönderi görseli'
  const clean = post.caption.replace(/#[\wğüşıöçĞÜŞİÖÇ]+/g, '').trim()
  const words = clean.split(/\s+/).slice(0, 5).join(' ')
  return `${words} görseli`
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
