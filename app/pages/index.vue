<template>
  <div class="min-h-screen bg-background-light dark:bg-earth-900 text-text-light dark:text-earth-100 font-sans pb-20 md:pb-0">
    <Preloader :loading="pending" />

    <!-- Navbar Removed -->

    <main class="max-w-4xl mx-auto pt-8 md:pt-12">
      
      <!-- Hero Section -->
      <header class="px-6 mb-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start animate-fade-in-up">
        <div class="cursor-pointer group relative" @click="stories?.length ? openStory(0) : null">
           <!-- Ring only if stories exist -->
           <div v-if="stories?.length" class="absolute -inset-[3px] rounded-full bg-gradient-to-tr from-earth-800 via-sage-500 to-sage-200 bg-size-200 animate-spin-slow opacity-80 group-hover:opacity-100 transition-opacity"></div>
           <StoryCircle :src="profile?.profile_picture_url || '/default-avatar.png'" class="relative z-10 transition-transform duration-500 group-hover:scale-105" />
        </div>
        
        <div class="flex-1 text-center md:text-left w-full">
          <div class="flex flex-col md:flex-row items-center gap-4 mb-6">
            <a :href="`https://www.instagram.com/${profile?.username || 'bumudurbu'}/`" target="_blank" class="hover:text-sage-400 transition-colors">
              <h2 class="text-2xl md:text-3xl font-light tracking-wide">{{ profile?.username || 'bumudurbu' }}</h2>
            </a>

          </div>

          <!-- Stats -->
          <div class="flex justify-center md:justify-start gap-8 md:gap-12 mb-8 border-y border-subtle-light dark:border-earth-800/50 py-4 md:border-none md:py-0">
            <div class="text-center md:text-left">
              <span class="font-bold block text-xl md:text-2xl text-text-light dark:text-earth-100"><CountUp :to="profile?.media_count || 0" /></span>
              <span class="text-xs text-subtle-light dark:text-earth-500 uppercase tracking-widest">Gönderi</span>
            </div>
            <div class="text-center md:text-left">
              <span class="font-bold block text-xl md:text-2xl text-text-light dark:text-earth-100"><CountUp :to="profile?.followers_count || 0" /></span>
              <span class="text-xs text-subtle-light dark:text-earth-500 uppercase tracking-widest">Takipçi</span>
            </div>
            <div class="text-center md:text-left">
              <span class="font-bold block text-xl md:text-2xl text-text-light dark:text-earth-100"><CountUp :to="profile?.follows_count || 0" /></span>
              <span class="text-xs text-subtle-light dark:text-earth-500 uppercase tracking-widest">Takip</span>
            </div>
          </div>

          <!-- Bio -->
          <div class="text-text-light dark:text-earth-300 text-sm md:text-base whitespace-pre-line leading-relaxed font-light">
            {{ profile?.biography || '' }}
          </div>
          
          <div class="mt-6 flex items-center justify-center md:justify-start gap-2 text-xs text-subtle-light dark:text-earth-500">
          </div>
        </div>
      </header>

      <!-- Tab Navigation -->
      <div class="sticky top-0 z-30 bg-background-light/95 dark:bg-earth-900/95 backdrop-blur-sm border-b border-subtle-light dark:border-earth-800 mb-8">
        <div class="flex justify-center gap-8 md:gap-16 text-sm font-medium tracking-widest overflow-x-auto px-4 no-scrollbar">
          <button 
            v-for="tab in ['GÖNDERİLER', 'REELS', 'ETİKETLER', 'PROFİL']" 
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
         <!-- Tags Grid using mentions API -->
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
      
      <!-- PROFIL TAB -->
      <div v-else-if="activeTab === 'PROFİL'" class="px-4 py-8 sm:px-8 space-y-12 animate-fade-in">
        <!-- Hakkimda -->
        <div class="grid md:grid-cols-2 gap-12">
          <div>
            <h2 class="text-xl font-bold mb-4 uppercase tracking-widest text-text-light dark:text-earth-100">Hakkımda</h2>
            <div class="text-sm leading-relaxed text-subtle-light dark:text-earth-300 space-y-4">
               <p>Yaygın inanışın aksine, Lorem Ipsum rastgele bir metin değildir. Kökleri MÖ 45 yılına ait klasik bir Latin edebiyatı eserine dayanmaktadır ve bu da onu 2000 yıldan daha eski yapmaktadır.</p>
               <p>1500'lerden beri kullanılan standart Lorem Ipsum metni, ilgilenenler için aşağıda yeniden üretilmiştir.</p>
            </div>
          </div>
          
          <!-- Sertifikalar -->
          <div>
            <h2 class="text-xl font-bold mb-4 uppercase tracking-widest text-text-light dark:text-earth-100">Sertifikalar</h2>
            <div class="space-y-6">
              <div v-for="i in 3" :key="i">
                <h3 class="font-bold text-sm mb-1 text-text-light dark:text-earth-100">{{ i }}. SERTİFİKA:</h3>
                <p class="text-xs text-subtle-light dark:text-earth-400">Yaygın inanışın aksine, Lorem Ipsum rastgele bir metin değildir. Kökleri MÖ 45.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Map / Contact Embedded -->
        <section class="pt-8 border-t border-subtle-light dark:border-earth-800">
          <h2 class="text-2xl font-bold mb-6 font-display text-text-light dark:text-earth-100">İletişim</h2>
          <div class="grid md:grid-cols-2 gap-8 items-start">
            <div class="space-y-4 text-sm font-medium text-text-light dark:text-earth-200">
               <a href="https://facebook.com/arzuozen" target="_blank" class="flex items-center gap-3 hover:opacity-70 transition-opacity">
                 <svg class="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 <span>@arzuozen</span>
               </a>
               <a :href="`https://instagram.com/${profile?.username || 'bumudurbu'}`" target="_blank" class="flex items-center gap-3 hover:opacity-70 transition-opacity">
                 <svg class="w-5 h-5" viewBox="0 0 24 24"><defs><linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#FFDC80"/><stop offset="25%" style="stop-color:#F77737"/><stop offset="50%" style="stop-color:#E1306C"/><stop offset="75%" style="stop-color:#C13584"/><stop offset="100%" style="stop-color:#833AB4"/></linearGradient></defs><path fill="url(#ig-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                 <span>@{{ profile?.username || 'bumudurbu' }}</span>
               </a>
               <a href="https://youtube.com/@arzuozen" target="_blank" class="flex items-center gap-3 hover:opacity-70 transition-opacity">
                 <svg class="w-5 h-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                 <span>@arzuozen</span>
               </a>
               <a href="https://wa.me/905354326668" target="_blank" class="flex items-center gap-3 hover:opacity-70 transition-opacity">
                 <svg class="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                 <span>+90 535 432 66 68</span>
               </a>
               <a href="https://www.google.com/maps/search/?api=1&query=Şarkiye+Mah.+Kazım+Karabekir+Cad.+NO:33/401+Altınordu+Ordu" target="_blank" class="flex items-center gap-3 hover:opacity-70 transition-opacity">
                  <svg class="w-5 h-5 text-[#EA4335]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11a3 3 0 110-6 3 3 0 010 6z"/></svg>
                  <span>Şarkiye Mah. Kazım Karabekir Cad. NO: 33/401 Altınordu / Ordu</span>
               </a>
               <a href="mailto:arzuozen.yoga@gmail.com" class="flex items-center gap-3 hover:opacity-70 transition-opacity">
                  <svg class="w-5 h-5 text-[#EA4335]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
                  <span>arzuozen.yoga@gmail.com</span>
               </a>
            </div>
            <div class="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
              <iframe 
                class="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.5!2d37.8783!3d40.9857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z%C5%9Earkiye+Mah.+Kaz%C4%B1m+Karabekir+Cad.+Orduu!5e0!3m2!1str!2str" 
                allowfullscreen 
                loading="lazy">
              </iframe>
            </div>
          </div>
        </section>
      </div>
      
      <div v-if="activeTab !== 'ETİKETLER' && activeTab !== 'PROFİL'" class="flex justify-center mt-8 mb-12 text-xs text-subtle-light dark:text-earth-500">
         <!-- End of Content -->
         <span class="opacity-50">Tüm gönderiler yüklendi.</span>
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
        <a :href="profile?.website || '#'" target="_blank" class="group flex items-center justify-center rounded-full h-12 bg-primary text-text-on-primary font-bold overflow-hidden transition-all duration-300 ease-out w-12 hover:w-[140px] hover:px-4 hover:justify-end">
          <span class="material-symbols-outlined !text-xl flex-shrink-0">sms</span>
          <span class="whitespace-nowrap overflow-hidden transition-all duration-300 ease-out text-sm ml-0 w-0 opacity-0 group-hover:ml-2 group-hover:w-auto group-hover:opacity-100">İletişim</span>
        </a>
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

    <!-- Story Viewer -->
    <Teleport to="body">
      <Transition name="modal">
        <StoryViewer 
          v-if="showStoryViewer" 
          :stories="stories" 
          :initial-index="initialStoryIndex" 
          @close="showStoryViewer = false" 
        />
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
// Data Fetching - Use unified feed endpoint for profile + posts + stories
const { data: feedData, pending: feedLoading } = await useFetch('/api/instagram/feed')
const { data: mentionsData } = await useFetch('/api/instagram/mentions')

// Extract from unified feed
const profile = computed(() => feedData.value?.profile || null)
const posts = computed(() => feedData.value?.posts || [])
const stories = computed(() => feedData.value?.stories || [])

const pending = computed(() => feedLoading.value)

// Sorted Posts (Graph API usually returns sorted, but we ensure it)
const sortedPosts = computed(() => posts.value)

// Computed Lists - Reels now uses media_product_type
const reelsPosts = computed(() => {
  return posts.value.filter(p => p.media_product_type === 'REELS')
})

// Tagged/Mentioned posts - now using real API data
const taggedPosts = computed(() => {
  return mentionsData.value?.data || []
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

// Story Viewer Logic
const showStoryViewer = ref(false)
const initialStoryIndex = ref(0)

const openStory = (index) => {
  initialStoryIndex.value = index
  showStoryViewer.value = true
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
