<template>
  <div class="min-h-screen bg-background-light dark:bg-earth-900 text-text-light dark:text-earth-100 font-sans pb-20 md:pb-0">
    <Preloader :loading="pending" />

    <!-- Navbar Removed -->

    <main class="max-w-4xl mx-auto pt-8 md:pt-12">
      
      <!-- Hero Section -->
      <header class="px-6 mb-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start animate-fade-in-up">
        <StoryCircle :src="profile?.profile_picture_url || '/default-avatar.png'" />
        
        <div class="flex-1 text-center md:text-left w-full">
          <div class="flex flex-col md:flex-row items-center gap-4 mb-6">
            <a :href="`https://www.instagram.com/${profile?.username || 'arzuozen'}/`" target="_blank" class="hover:text-sage-400 transition-colors">
              <h2 class="text-2xl md:text-3xl font-light tracking-wide">{{ profile?.username || 'arzuozen' }}</h2>
            </a>
            <a :href="`https://www.instagram.com/${profile?.username || 'arzuozen'}/`" target="_blank" class="hover:scale-105 transition-transform">
              <span class="bg-white dark:bg-earth-800 text-text-light dark:text-earth-300 text-xs px-3 py-1 rounded-full border border-subtle-light dark:border-earth-700 tracking-wider">YOGA STUDIO</span>
            </a>
          </div>

          <!-- Stats -->
          <div class="flex justify-center md:justify-start gap-8 md:gap-12 mb-8 border-y border-subtle-light dark:border-earth-800/50 py-4 md:border-none md:py-0">
            <div class="text-center md:text-left">
              <span class="font-bold block text-xl md:text-2xl text-text-light dark:text-earth-100"><CountUp :to="profile?.media_count || 42" /></span>
              <span class="text-xs text-subtle-light dark:text-earth-500 uppercase tracking-widest">Gönderi</span>
            </div>
            <div class="text-center md:text-left">
              <span class="font-bold block text-xl md:text-2xl text-text-light dark:text-earth-100"><CountUp :to="profile?.followers_count || 17588" /></span>
              <span class="text-xs text-subtle-light dark:text-earth-500 uppercase tracking-widest">Takipçi</span>
            </div>
            <div class="text-center md:text-left">
              <span class="font-bold block text-xl md:text-2xl text-text-light dark:text-earth-100"><CountUp :to="profile?.follows_count || 258" /></span>
              <span class="text-xs text-subtle-light dark:text-earth-500 uppercase tracking-widest">Takip</span>
            </div>
          </div>

          <!-- Bio -->
          <div class="text-text-light dark:text-earth-300 text-sm md:text-base whitespace-pre-line leading-relaxed font-light">
            {{ profile?.biography || 'Yoga Studio in Ordu\nZihin, Beden ve Ruh bütünlüğü.' }}
          </div>
          
          <div class="mt-6 flex items-center justify-center md:justify-start gap-2 text-xs text-subtle-light dark:text-earth-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Şarkiye, Kazım Karabekir Cd. No:33/15, Ordu
          </div>
        </div>
      </header>

      <!-- Tab Navigation -->
      <div class="sticky top-0 z-30 bg-background-light/95 dark:bg-earth-900/95 backdrop-blur-sm border-b border-subtle-light dark:border-earth-800 mb-8">
        <div class="flex justify-center gap-8 md:gap-16 text-sm font-medium tracking-widest overflow-x-auto px-4 no-scrollbar">
          <button 
            v-for="tab in ['GÖNDERİLER', 'REELS', 'ETİKETLER']" 
            :key="tab"
            @click="activeTab = tab"
            class="py-4 relative transition-colors duration-300 whitespace-nowrap"
            :class="activeTab === tab ? 'text-text-light dark:text-earth-100' : 'text-subtle-light dark:text-earth-500 hover:text-primary dark:hover:text-earth-300'"
          >
            {{ tab }}
            <span 
              v-if="activeTab === tab" 
              class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sage-600 to-sand-500"
            ></span>
          </button>
          
          <!-- Added Profile Menu Items -->
          <NuxtLink to="/profile" class="py-4 text-subtle-light dark:text-earth-500 hover:text-primary dark:hover:text-earth-300 transition-colors duration-300 whitespace-nowrap">
            PROFIL
          </NuxtLink>
          
          <a href="https://wa.me/905555555555" target="_blank" class="py-4 text-subtle-light dark:text-earth-500 hover:text-primary dark:hover:text-earth-300 transition-colors duration-300 whitespace-nowrap">
            İLETİŞİM
          </a>
        </div>
      </div>

      <!-- Content Grid -->
      <div v-if="activeTab === 'GÖNDERİLER'" class="animate-fade-in">
        <FeedGrid :posts="sortedPosts" @open="openModal" />
      </div>
      
      <div v-else-if="activeTab === 'REELS'" class="animate-fade-in">
        <FeedGrid :posts="reelsPosts" @open="openModal" />
        <div v-if="reelsPosts.length === 0" class="py-20 text-center text-earth-600 font-light">
          Henüz Reels videosu bulunmuyor.
        </div>
      </div>

      <div v-else-if="activeTab === 'ETİKETLER'" class="animate-fade-in">
         <!-- Simulating Tags Tab with a subset or specific layout -->
         <div class="grid grid-cols-3 gap-1 md:gap-4 px-4">
            <div 
              v-for="post in taggedPosts" 
              :key="post.id" 
              class="aspect-square relative group cursor-pointer overflow-hidden bg-earth-800"
              @click="openModal(post)"
            >
               <img :src="post.thumbnail_url || post.media_url" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
            </div>
         </div>
         <div v-if="taggedPosts.length === 0" class="py-20 text-center text-earth-600 font-light">
          Henüz etiketlenmiş gönderi yok.
        </div>
      </div>

    </main>

    <!-- Sticky Footer (Mobile) -->
    <StickyFooter />

    <!-- Floating Action Buttons (Desktop) -->
    <div class="fixed bottom-5 right-5 hidden md:flex flex-row-reverse items-center gap-4 z-50">
      <div class="flex flex-col gap-2 p-2 rounded-full bg-accent-light dark:bg-accent-dark shadow-lg">
        <button 
          @click="toggleTheme"
          class="p-3 text-text-light dark:text-text-dark rounded-full hover:bg-subtle-light dark:hover:bg-subtle-dark transition-colors"
          :title="isDark ? 'Aydınlık Mod' : 'Karanlık Mod'"
        >
          <span class="material-symbols-outlined">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
        </button>
        <button class="p-3 text-text-light dark:text-text-dark rounded-full hover:bg-subtle-light dark:hover:bg-subtle-dark transition-colors">
          <span class="material-symbols-outlined">location_on</span>
        </button>
      </div>
      <div class="flex flex-col gap-2 p-2 rounded-3xl bg-accent-light dark:bg-accent-dark shadow-lg">
        <!-- Message Button -->
        <button class="group flex items-center justify-center rounded-full h-12 bg-primary text-text-on-primary font-bold overflow-hidden transition-all duration-300 ease-out w-12 hover:w-[140px] hover:px-4 hover:justify-end">
          <span class="material-symbols-outlined !text-xl flex-shrink-0">sms</span>
          <span class="whitespace-nowrap overflow-hidden transition-all duration-300 ease-out text-sm ml-0 w-0 opacity-0 group-hover:ml-2 group-hover:w-auto group-hover:opacity-100">Mesaj At</span>
        </button>
        <!-- Instagram Button -->
        <a :href="profile?.username ? `https://instagram.com/${profile.username}` : '#'" target="_blank" rel="noopener noreferrer" class="group flex items-center justify-center rounded-full h-12 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 text-white font-bold overflow-hidden transition-all duration-300 ease-out w-12 hover:w-[140px] hover:px-4 hover:justify-end">
          <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span class="whitespace-nowrap overflow-hidden transition-all duration-300 ease-out text-sm ml-0 w-0 opacity-0 group-hover:ml-2 group-hover:w-auto group-hover:opacity-100">Instagram</span>
        </a>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedPost" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" @click="selectedPost = null">
          <PostModal :post="selectedPost" :profile="profile" @close="selectedPost = null" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
// Data Fetching
const { data: profile, pending: profileLoading } = await useFetch('/api/instagram/profile')
const { data: posts, pending: postsLoading } = await useFetch('/api/instagram/posts')

const pending = computed(() => profileLoading.value || postsLoading.value)

// Sorted Posts (Newest First)
const sortedPosts = computed(() => {
  if (!posts.value?.data) return []
  return [...posts.value.data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

// Computed Lists
const reelsPosts = computed(() => {
  return sortedPosts.value.filter(p => p.media_type === 'VIDEO')
})

// Simulating Tagged posts by just taking a subset or random selection for visual fullness
// In a real app, this would be a separate API call if permissions allowed
const taggedPosts = computed(() => {
  return sortedPosts.value.slice(0, 6)
})

// UI State
const activeTab = ref('GÖNDERİLER')
const isScrolled = ref(false)

// Theme Logic
const { isDark, toggleTheme, initTheme } = useTheme()

onMounted(() => {
  initTheme()
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50
  })
})

// Modal Logic
const selectedPost = ref(null)
const openModal = (post) => {
  selectedPost.value = post
}
</script>

<style>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .bg-earth-900,
.modal-leave-active .bg-earth-900 {
  transition: transform 0.3s ease-out;
}
.modal-enter-from .bg-earth-900,
.modal-leave-to .bg-earth-900 {
  transform: scale(0.95);
}
</style>
