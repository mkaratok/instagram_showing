<template>
  <div class="relative flex w-full max-w-4xl h-auto max-h-[90vh] bg-background-light dark:bg-background-dark rounded-lg shadow-xl overflow-hidden font-display" @click.stop>
    
    <!-- Close Button -->
    <button @click="$emit('close')" class="absolute top-4 right-4 z-10 text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors">
      <span class="material-symbols-outlined text-3xl">close</span>
    </button>

    <!-- Main Grid Layout -->
    <div class="flex flex-col md:flex-row w-full h-full">
      
      <!-- Image Container (Left Side) -->
      <div class="w-full md:w-1/2 flex items-center justify-center bg-stone-200 dark:bg-stone-800 relative group">
         <img v-if="currentMedia.media_type !== 'VIDEO'" :src="currentMedia.media_url" class="w-full h-full object-cover" />
         <video v-else :src="currentMedia.media_url" controls autoplay class="w-full h-full object-cover"></video>

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
      <div class="w-full md:w-1/2 flex flex-col p-6 overflow-y-auto bg-background-light dark:bg-background-dark">
        
        <!-- User Profile Header -->
        <div class="flex items-center gap-4 min-h-14 justify-between border-b border-stone-200 dark:border-stone-700 pb-4 mb-4">
          <div class="flex items-center gap-4">
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10 border border-stone-200 dark:border-stone-700" :style="{ backgroundImage: `url('${profile?.profile_picture_url || '/default-avatar.png'}')` }"></div>
            <p class="text-text-light dark:text-white text-base font-bold leading-normal flex-1 truncate">{{ post.username || profile?.username || 'Instagram User' }}</p>
          </div>
        </div>

        <!-- Post Content -->
        <div class="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <!-- Post Description -->
          <p class="text-text-light dark:text-text-dark text-base font-normal leading-normal pb-4 whitespace-pre-wrap">
            {{ post.caption }}
          </p>

          <!-- Stats (Replacing fake comments) -->
             <span class="flex items-center gap-1"><span class="material-symbols-outlined text-lg">favorite</span> {{ post.like_count || 0 }} Beğeni</span>
             <span class="flex items-center gap-1"><span class="material-symbols-outlined text-lg">chat_bubble</span> {{ post.comments_count || 0 }} Yorum</span>
          </div>

          <!-- Real Comments List -->
           <div class="mt-6 border-t border-stone-200 dark:border-stone-700 pt-4">
             <h4 class="text-sm font-bold text-earth-800 dark:text-earth-200 mb-2">Yorumlar</h4>
             
             <div v-if="commentsLoading" class="text-xs text-stone-500">Yükleniyor...</div>
             
             <div v-else-if="comments.length > 0" class="flex flex-col gap-3">
               <div v-for="comment in comments" :key="comment.id" class="flex gap-2">
                 <div class="text-xs">
                   <span class="font-bold text-earth-900 dark:text-earth-100 mr-2">{{ comment.username }}</span>
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
        <div class="mt-auto pt-6">
          <a :href="post.permalink" target="_blank" class="block w-full text-center bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
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
    comments.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch comments', error)
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
