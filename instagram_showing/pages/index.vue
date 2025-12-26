<template>
  <div class="min-h-screen relative overflow-hidden bg-neutral-950 font-sans selection:bg-rose-500 selection:text-white pb-20">
    
    <!-- Background Ambience -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-900/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
    </div>

    <div class="relative z-10 w-full max-w-[1920px] mx-auto">
      
      <!-- Loading State -->
      <div v-if="pending" class="h-screen flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <Icon name="svg-spinners:270-ring-with-bg" class="w-12 h-12 text-rose-500" />
          <p class="text-neutral-500 text-sm tracking-widest uppercase animate-pulse">Profil Yükleniyor...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="h-screen flex items-center justify-center text-center px-4">
        <div class="bg-neutral-900/50 backdrop-blur-xl p-8 rounded-2xl border border-red-500/20 max-w-md">
          <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 class="text-xl font-bold text-white mb-2">Hata Oluştu</h2>
          <p class="text-neutral-400 text-sm mb-6">{{ error.message }}</p>
          <button @click="refresh" class="px-6 py-2 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform">
            Tekrar Dene
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="animate-fade-in">
        
        <!-- Profile Header -->
        <ProfileHero :profile="data?.profile!" />

        <!-- Grid Container -->
        <main class="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
          
          <!-- Filters (Optional future expansion) -->
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <h3 class="text-lg font-medium text-white flex items-center gap-2">
              <Icon name="heroicons:squares-2x2" class="w-5 h-5 text-rose-500" />
              Son Gönderiler
            </h3>
            <span class="text-xs text-neutral-500 uppercase tracking-widest">{{ data?.media?.length || 0 }} Medya</span>
          </div>

          <!-- Masonry / Bento Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px]">
            <!-- 
              Logic for sizing:
              - Standard: 1x1 (span-1)
              - Featured/Large: 2x2 (row-span-2 col-span-2) - randomly or logic based
              For simplicity, standard grid with aspect-square enforced in card, but here we can span.
            -->
            <PostCard 
              v-for="(post, index) in data?.media" 
              :key="post.id"
              :post="post"
              :class="{
                'md:col-span-2 md:row-span-2': index % 10 === 0, // Highlight every 10th post
                'md:col-span-1 md:row-span-1': index % 10 !== 0
              }"
              @click="openModal(post)"
            />
          </div>
          
          <div v-if="!data?.media?.length" class="py-20 text-center text-neutral-500">
             <Icon name="heroicons:photo" class="w-12 h-12 mx-auto mb-4 opacity-50" />
             <p>Henüz gönderi bulunmuyor.</p>
          </div>

          <!-- Footer -->
          <footer class="mt-20 text-center text-neutral-600 text-sm py-8 border-t border-white/5">
            <p>&copy; {{ new Date().getFullYear() }} {{ data.profile.username }}. Tüm hakları saklıdır.</p>
          </footer>
        </main>
      </div>

    </div>

    <!-- Detail Modal -->
    <Transition name="modal">
      <div v-if="selectedPost" class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" @click.self="closeModal">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>
        
        <!-- Modal Content -->
        <div class="relative w-full max-w-6xl max-h-[90vh] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-fade-in-up border border-white/10 group">
          
          <!-- Close Button -->
          <button @click="closeModal" class="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-colors backdrop-blur-md">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>

          <!-- Media Section -->
          <div class="w-full md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden">
            
            <!-- Video Player -->
            <video 
              v-if="selectedPost.media_type === 'VIDEO' || selectedPost.media_type === 'REELS'" 
              :src="selectedPost.media_url" 
              controls 
              autoplay 
              class="max-w-full max-h-[85vh] object-contain"
            ></video>
            
            <!-- Image Viewer -->
            <div v-else class="w-full h-full flex items-center justify-center">
               <NuxtImg 
                :src="selectedPost.media_url" 
                class="max-w-full max-h-[85vh] object-contain"
                placeholder
               />
            </div>

            <!-- Carousel Nav (future impl) -->
            <div v-if="selectedPost.media_type === 'CAROUSEL_ALBUM'" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
               <!-- Indicators could go here -->
               <Icon name="heroicons:square-2-stack" class="w-6 h-6 text-white drop-shadow-lg" />
            </div>
          </div>

          <!-- Details Sidebar -->
          <div class="w-full md:w-2/5 p-6 md:p-8 flex flex-col bg-neutral-900/95 backdrop-blur-xl border-l border-white/5">
             
             <!-- Header -->
             <div class="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                <NuxtImg :src="data?.profile.profile_picture_url" class="w-10 h-10 rounded-full border border-white/10" />
                <div>
                   <h4 class="font-bold text-white text-sm">@{{ data?.profile.username }}</h4>
                   <span class="text-xs text-neutral-500">{{ new Date(selectedPost.timestamp).toLocaleDateString('tr-TR') }}</span>
                </div>
                <a :href="selectedPost.permalink" target="_blank" class="ml-auto text-neutral-500 hover:text-rose-500 transition-colors" title="Instagram'da Gör">
                   <Icon name="uil:instagram" class="w-5 h-5" />
                </a>
             </div>

             <!-- Caption -->
             <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6">
                <p class="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap font-light">
                   {{ selectedPost.caption }}
                </p>
             </div>

             <!-- Stats (Placeholder as Basic Display API might not give real-time likes/comments count without specific perms) -->
             <div class="mt-auto grid grid-cols-2 gap-4">
                <!-- If available in future -->
             </div>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import type { InstagramApiResponse, InstagramMedia } from '~/types'

useHead({
  title: 'Portfolio | Instagram Showcase'
})

const { data, pending, error, refresh } = await useFetch<InstagramApiResponse>('/api/instagram', {
  lazy: true,
  key: 'instagram-feed'
})

const selectedPost = ref<InstagramMedia | null>(null)

const openModal = (post: InstagramMedia) => {
  selectedPost.value = post
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedPost.value = null
  document.body.style.overflow = 'auto'
}

// Global modal transition styles
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
