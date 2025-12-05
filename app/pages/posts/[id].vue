<template>
  <!-- Main Container mimicking the Modal Overlay -->
  <!-- Using bg-earth-900 to match the site theme, but acting as a backdrop -->
  <div class="min-h-screen bg-background-light dark:bg-earth-900 flex items-center justify-center p-4" @click="goHome">
    
    <div v-if="post" class="relative flex flex-col md:flex-row w-full max-w-4xl h-auto max-h-[90vh] bg-background-light dark:bg-background-dark rounded-lg shadow-xl overflow-hidden font-display" @click.stop>
      
      <!-- Close Button -->
      <button @click="goHome" class="absolute top-4 right-4 z-10 text-text-light-primary dark:text-text-dark-primary hover:text-primary dark:hover:text-primary transition-colors bg-white/20 backdrop-blur-sm rounded-full p-1 md:bg-transparent md:p-0">
        <span class="material-symbols-outlined text-3xl">close</span>
      </button>

      <!-- Image Container -->
      <div class="w-full md:w-1/2 flex items-center justify-center bg-stone-200 dark:bg-stone-800 relative">
         <img v-if="post.media_type !== 'VIDEO'" :src="post.media_url" :alt="post.caption" class="w-full h-full object-cover" />
         <video v-else :src="post.media_url" controls autoplay class="w-full h-full object-cover"></video>
      </div>

      <!-- Content Container -->
      <div class="w-full md:w-1/2 flex flex-col p-6 bg-background-light dark:bg-background-dark overflow-y-auto">
        <!-- Profile Info -->
        <div class="flex items-center gap-4 border-b border-stone-200 dark:border-stone-700 pb-4 mb-4 min-h-[60px]">
           <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10 border border-stone-200 dark:border-stone-700" style="background-image: url('/default-avatar.png')"></div>
           <div class="text-text-light-primary dark:text-text-dark-primary text-base font-bold leading-normal flex-1 truncate">Arzu Özen Yoga</div>
        </div>

        <!-- Caption -->
        <div class="flex-grow overflow-y-auto pr-2 custom-scrollbar mb-6">
          <p class="text-text-light-primary dark:text-text-dark-primary text-base font-normal leading-normal whitespace-pre-wrap">
            {{ post.caption }}
          </p>
          
          <!-- Stats -->
          <div class="flex gap-4 mt-4 text-text-light-secondary dark:text-text-dark-secondary text-sm">
             <span class="flex items-center gap-1"><span class="material-symbols-outlined text-lg">favorite</span> {{ post.like_count }} Beğeni</span>
             <span class="flex items-center gap-1"><span class="material-symbols-outlined text-lg">chat_bubble</span> {{ post.comments_count }} Yorum</span>
          </div>
        </div>

        <!-- Date & Link -->
        <div class="text-sm text-earth-500 mb-4">
          {{ new Date(post.timestamp).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </div>
        
        <a :href="post.permalink" target="_blank" class="block w-full text-center bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
          Instagram'da Gör
        </a>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="!error" class="text-earth-400 animate-pulse">
      Yükleniyor...
    </div>

    <!-- Error State -->
    <div v-else class="text-red-400 text-center">
      <p>Gönderi bulunamadı.</p>
      <button @click="goHome" class="mt-4 text-earth-300 hover:text-white underline">Ana Sayfaya Dön</button>
    </div>

  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { data: post, error } = await useFetch(`/api/instagram/post/${route.params.id}`)

const goHome = () => {
  router.push('/')
}

// SEO Meta Tags
useSeoMeta({
  title: () => post.value ? (post.value.caption?.slice(0, 60) + '... - Arzu Özen Yoga') : 'Gönderi - Arzu Özen Yoga',
  description: () => post.value?.caption || 'Arzu Özen Yoga Instagram Gönderisi',
  ogTitle: () => post.value ? (post.value.caption?.slice(0, 60) + '...') : 'Gönderi',
  ogDescription: () => post.value?.caption,
  ogImage: () => post.value?.media_url,
  twitterCard: 'summary_large_image',
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
