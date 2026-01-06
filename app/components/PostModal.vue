<template>
  <div class="relative flex w-full max-w-4xl h-[85vh] bg-background-light dark:bg-background-dark rounded-lg shadow-xl overflow-hidden font-display" @click.stop>
    
    <!-- Close Button -->
    <button @click="$emit('close')" class="absolute top-4 right-4 z-10 text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors">
      <span class="material-symbols-outlined text-3xl">close</span>
    </button>

    <!-- Main Grid Layout -->
    <div class="flex flex-col md:flex-row w-full h-full">
      
      <!-- Image Container (Left Side) -->
      <div class="w-full md:w-1/2 h-[50vh] md:h-full flex items-center justify-center bg-stone-200 dark:bg-stone-800 relative group">
         <img 
           v-if="currentMedia.media_type !== 'VIDEO'" 
           :src="currentMedia.media_url" 
           class="w-full h-full object-contain"
         />
         <video v-else :src="currentMedia.media_url" :poster="currentMedia.thumbnail_url" controls autoplay class="w-full h-full object-contain"></video>

         <!-- Navigation Arrows -->
         <button 
           v-if="post.media_type === 'CAROUSEL_ALBUM' && post.children?.data" 
           @click.stop="prevImage" 
           class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
         >
           <span class="material-symbols-outlined">chevron_left</span>
         </button>
         <button 
           v-if="post.media_type === 'CAROUSEL_ALBUM' && post.children?.data" 
           @click.stop="nextImage" 
           class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
         >
           <span class="material-symbols-outlined">chevron_right</span>
         </button>
         
         <!-- Dots Indicator -->
         <div v-if="post.media_type === 'CAROUSEL_ALBUM' && post.children?.data" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
           <div 
             v-for="(_, index) in post.children.data" 
             :key="index"
             class="w-2 h-2 rounded-full transition-colors"
             :class="index === currentImageIndex ? 'bg-white' : 'bg-white/40'"
           ></div>
         </div>
      </div>

      <!-- Content Container (Right Side) -->
      <div class="w-full md:w-1/2 flex flex-col p-4 bg-background-light dark:bg-background-dark">
        
        <!-- User Profile Header (Compact) -->
        <div class="flex items-center gap-2 min-h-10 justify-between border-b border-stone-200 dark:border-stone-700 pb-2 mb-3">
          <div class="flex items-center gap-2">
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-7 w-7 border border-stone-200 dark:border-stone-700" :style="{ backgroundImage: `url('${profile?.profile_picture_url || '/default-avatar.png'}')` }"></div>
            <p class="text-text-light dark:text-white text-sm font-bold leading-normal flex-1 truncate">{{ post.username || profile?.username || 'Instagram User' }}</p>
          </div>
        </div>

        <!-- Scrollable Content Area (Description + Stats + Comments together) -->
        <div class="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <!-- Post Description -->
          <p v-if="post.caption" class="text-text-light dark:text-text-dark text-sm font-normal leading-relaxed pb-3 whitespace-pre-wrap">
            {{ post.caption }}
          </p>

          <!-- Stats -->
          <div class="flex gap-3 text-earth-600 dark:text-gray-300 text-xs py-2 border-t border-stone-200 dark:border-stone-700">
             <span class="flex items-center gap-1"><span class="material-symbols-outlined text-base">favorite</span> {{ post.like_count || 0 }}</span>
             <span class="flex items-center gap-1"><span class="material-symbols-outlined text-base">chat_bubble</span> {{ post.comments_count || 0 }}</span>
          </div>

          <!-- Comments List -->
          <div class="mt-3 border-t border-stone-200 dark:border-stone-700 pt-3">
            <h4 class="text-xs font-bold text-earth-800 dark:text-earth-200 mb-2">Yorumlar</h4>
            
            <div v-if="commentsLoading" class="text-xs text-stone-500">Yükleniyor...</div>
            
            <div v-else-if="comments.length > 0" class="flex flex-col gap-2">
              <div v-for="comment in comments" :key="comment.id" class="flex gap-2" :class="{ 'pl-4 border-l-2 border-stone-200 dark:border-stone-700': comment.isReply }">
                <div class="text-xs">
                  <span class="font-semibold text-earth-900 dark:text-earth-100 mr-1">{{ comment.username }}</span>
                  <span class="text-text-light dark:text-gray-300 font-light">{{ comment.text }}</span>
                  <div class="text-[10px] text-stone-400 mt-0.5">{{ new Date(comment.timestamp).toLocaleDateString('tr-TR') }}</div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-xs text-stone-500 italic">
              Henüz yorum yok.
            </div>
          </div>
        </div>

        <!-- CTA Button -->
        <div class="mt-auto pt-3">
          <a :href="post.permalink" target="_blank" class="block w-full text-center bg-primary text-white font-semibold py-2.5 px-4 rounded-lg text-sm hover:bg-opacity-90 transition-colors">
            Instagram'da Gör
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['post', 'profile'])
defineEmits(['close'])

const currentImageIndex = ref(0)
const comments = ref([])
const commentsLoading = ref(false)

const currentMedia = computed(() => {
  if (props.post.media_type === 'CAROUSEL_ALBUM' && props.post.children?.data) {
    return props.post.children.data[currentImageIndex.value]
  }
  return props.post
})

const nextImage = () => {
  if (props.post.children?.data) {
    currentImageIndex.value = (currentImageIndex.value + 1) % props.post.children.data.length
  }
}

const prevImage = () => {
  if (props.post.children?.data) {
    currentImageIndex.value = (currentImageIndex.value - 1 + props.post.children.data.length) % props.post.children.data.length
  }
}

// Fetch comments specifically for this post when mounted
const fetchComments = async () => {
  if (!props.post?.id) return
  
  commentsLoading.value = true
  try {
    const response = await $fetch(`/api/instagram/comments?id=${props.post.id}`)
    // Flatten comments and replies for simple display, or keep structure
    // Here we just take root comments. If you want replies, you'd process response.data[i].replies
    const rootComments = response.data || []
    
    // Optional: Flatten replies into the list for visibility
    const allComments = []
    for (const comment of rootComments) {
        allComments.push(comment)
        if (comment.replies?.data) {
            allComments.push(...comment.replies.data.map(r => ({ ...r, isReply: true })))
        }
    }
    
    comments.value = allComments
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    // You could set an error state here to show in UI
  } finally {
    commentsLoading.value = false
  }
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #8A8178;
  border-radius: 4px;
}
</style>
