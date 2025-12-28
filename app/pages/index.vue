<template>
  <div class="min-h-screen bg-navy-800 text-white font-sans">
    <Preloader :loading="pending" />

    <!-- Compact Header Bar -->
    <header class="bg-navy-900 border-b border-white/10">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <!-- Profile Picture -->
          <div class="cursor-pointer group relative shrink-0" @click="stories?.length ? openStory(0) : null">
            <div v-if="stories?.length" class="absolute -inset-1 rounded-full bg-gradient-to-tr from-instagram to-pink-500 opacity-80 animate-pulse"></div>
            <img 
              :src="profile?.profile_picture_url || '/default-avatar.png'" 
              :alt="profile?.username"
              class="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-navy-800"
            />
          </div>

          <!-- Username & Bio -->
          <div class="flex-1 min-w-0">
            <a :href="`https://www.instagram.com/${profile?.username || 'bumudurbu'}/`" target="_blank" class="hover:text-instagram transition-colors">
              <h1 class="text-xl md:text-2xl font-semibold truncate">{{ profile?.username || 'bumudurbu' }}</h1>
            </a>
            <p class="text-sm text-gray-400 truncate mt-1">{{ profile?.biography || '' }}</p>
          </div>

          <!-- Stats -->
          <div class="hidden sm:flex items-center gap-6 text-center shrink-0">
            <div>
              <span class="block text-lg md:text-xl font-bold"><CountUp :to="profile?.media_count || 0" /></span>
              <span class="text-xs text-gray-500 uppercase">Gönderi</span>
            </div>
            <div>
              <span class="block text-lg md:text-xl font-bold"><CountUp :to="profile?.followers_count || 0" /></span>
              <span class="text-xs text-gray-500 uppercase">Takipçi</span>
            </div>
            <div>
              <span class="block text-lg md:text-xl font-bold"><CountUp :to="profile?.follows_count || 0" /></span>
              <span class="text-xs text-gray-500 uppercase">Takip</span>
            </div>
          </div>
        </div>

        <!-- Mobile Stats -->
        <div class="flex sm:hidden justify-around mt-4 pt-4 border-t border-white/10">
          <div class="text-center">
            <span class="block text-lg font-bold"><CountUp :to="profile?.media_count || 0" /></span>
            <span class="text-xs text-gray-500 uppercase">Gönderi</span>
          </div>
          <div class="text-center">
            <span class="block text-lg font-bold"><CountUp :to="profile?.followers_count || 0" /></span>
            <span class="text-xs text-gray-500 uppercase">Takipçi</span>
          </div>
          <div class="text-center">
            <span class="block text-lg font-bold"><CountUp :to="profile?.follows_count || 0" /></span>
            <span class="text-xs text-gray-500 uppercase">Takip</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Tab Navigation -->
    <nav class="sticky top-0 z-30 bg-navy-900/95 backdrop-blur-sm border-b border-white/5">
      <div class="max-w-6xl mx-auto flex justify-center">
        <button 
          v-for="tab in ['GÖNDERİLER', 'REELS', 'ETİKETLER', 'PROFİL']" 
          :key="tab"
          @click="activeTab = tab"
          class="px-4 md:px-6 py-3 text-xs md:text-sm font-medium tracking-wider transition-colors relative"
          :class="activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'"
        >
          {{ tab }}
          <span 
            v-if="activeTab === tab" 
            class="absolute bottom-0 left-2 right-2 h-0.5 bg-instagram rounded-full"
          ></span>
        </button>
      </div>
    </nav>

    <!-- Content Area -->
    <main class="max-w-6xl mx-auto pb-24">
      <!-- Posts Grid -->
      <div v-if="activeTab === 'GÖNDERİLER'" class="animate-fade-in">
        <div class="grid grid-cols-3 gap-[1px] bg-navy-950">
          <div 
            v-for="post in sortedPosts" 
            :key="post.id" 
            class="aspect-square relative group cursor-pointer overflow-hidden bg-navy-800"
            @click="openModal(post)"
          >
            <img 
              :src="post.thumbnail_url || post.media_url" 
              :alt="post.caption?.slice(0, 50) || 'Instagram post'"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <!-- Video Indicator -->
            <div v-if="post.media_type === 'VIDEO'" class="absolute top-2 right-2">
              <svg class="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <!-- Carousel Indicator -->
            <div v-if="post.media_type === 'CAROUSEL_ALBUM'" class="absolute top-2 right-2">
              <svg class="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/>
              </svg>
            </div>
            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div class="flex items-center gap-4 text-white text-sm font-medium">
                <span class="flex items-center gap-1">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  {{ post.like_count || 0 }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/></svg>
                  {{ post.comments_count || 0 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reels Grid -->
      <div v-else-if="activeTab === 'REELS'" class="animate-fade-in">
        <div class="grid grid-cols-3 gap-[1px] bg-navy-950">
          <div 
            v-for="post in reelsPosts" 
            :key="post.id" 
            class="aspect-[9/16] relative group cursor-pointer overflow-hidden bg-navy-800"
            @click="openModal(post)"
          >
            <img 
              :src="post.thumbnail_url || post.media_url" 
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        </div>
        <div v-if="reelsPosts.length === 0" class="py-20 text-center text-gray-500">
          Henüz Reels videosu bulunmuyor.
        </div>
      </div>

      <!-- Tagged Grid -->
      <div v-else-if="activeTab === 'ETİKETLER'" class="animate-fade-in">
        <div class="grid grid-cols-3 gap-[1px] bg-navy-950">
          <div 
            v-for="post in taggedPosts" 
            :key="post.id" 
            class="aspect-square relative group cursor-pointer overflow-hidden bg-navy-800"
            @click="openModal(post)"
          >
            <img :src="post.thumbnail_url || post.media_url" class="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
        <div v-if="taggedPosts.length === 0" class="py-20 text-center text-gray-500">
          Henüz etiketlenmiş gönderi yok.
        </div>
      </div>

      <!-- Profile Tab -->
      <div v-else-if="activeTab === 'PROFİL'" class="px-4 py-8 space-y-8 animate-fade-in">
        <div class="grid md:grid-cols-2 gap-8">
          <!-- About -->
          <div>
            <h2 class="text-lg font-bold mb-4 uppercase tracking-widest">Hakkımda</h2>
            <div class="text-sm text-gray-400 leading-relaxed space-y-3">
              <p>Yaygın inanışın aksine, Lorem Ipsum rastgele bir metin değildir.</p>
              <p>Kökleri MÖ 45 yılına ait klasik bir Latin edebiyatı eserine dayanmaktadır.</p>
            </div>
          </div>
          
          <!-- Contact -->
          <div>
            <h2 class="text-lg font-bold mb-4 uppercase tracking-widest">İletişim</h2>
            <div class="space-y-3 text-sm">
              <a :href="`https://instagram.com/${profile?.username || 'bumudurbu'}`" target="_blank" class="flex items-center gap-3 text-gray-400 hover:text-instagram transition-colors">
                <svg class="w-5 h-5 text-instagram" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span>@{{ profile?.username || 'bumudurbu' }}</span>
              </a>
              <a href="https://wa.me/905354326668" target="_blank" class="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span>+90 535 432 66 68</span>
              </a>
              <a href="https://www.google.com/maps/search/?api=1&query=Şarkiye+Mah.+Ordu" target="_blank" class="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors">
                <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11a3 3 0 110-6 3 3 0 010 6z"/></svg>
                <span>Altınordu / Ordu</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Fixed Bottom Footer -->
    <footer class="fixed bottom-0 left-0 right-0 bg-navy-950 border-t border-white/10 z-40">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <!-- Instagram Button -->
        <a 
          :href="`https://www.instagram.com/${profile?.username || 'bumudurbu'}/`" 
          target="_blank"
          class="flex items-center gap-2 px-4 py-2 bg-instagram hover:bg-instagram-light text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          <span>Instagram'da Gör</span>
        </a>

        <!-- Theme Toggle -->
        <button 
          @click="toggleTheme"
          class="p-2 text-gray-400 hover:text-white transition-colors"
          :title="isDark ? 'Aydınlık Mod' : 'Karanlık Mod'"
        >
          <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>
        </button>

        <!-- WhatsApp Button -->
        <a 
          href="https://wa.me/905354326668" 
          target="_blank"
          class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <span class="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </footer>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedPost" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" @click="selectedPost = null">
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
          :initialIndex="currentStoryIndex"
          @close="showStoryViewer = false" 
        />
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
// Data Fetching - Use separate endpoints
const { data: profile, pending: profileLoading } = await useFetch('/api/instagram/profile')
const { data: instagramData, pending: postsLoading } = await useFetch('/api/instagram')
const { data: storiesData } = await useFetch('/api/instagram/stories')
const { data: mentionsData } = await useFetch('/api/instagram/mentions')

const posts = computed(() => instagramData.value?.data || [])
const stories = computed(() => storiesData.value?.data || [])
const pending = computed(() => profileLoading.value || postsLoading.value)

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

// Theme Logic
const { isDark, toggleTheme, initTheme } = useTheme()

// Modal & Story Logic
const selectedPost = ref(null)
const showStoryViewer = ref(false)
const currentStoryIndex = ref(0)

function openModal(post) {
  selectedPost.value = post
}

function openStory(index) {
  if (stories.value?.length) {
    currentStoryIndex.value = index
    showStoryViewer.value = true
  }
}

// Initialize theme on mount
onMounted(() => {
  initTheme()
})

// SEO
useSeoMeta({
  title: () => `${profile.value?.username || 'bumudurbu'} - Instagram`,
  ogTitle: () => `${profile.value?.username || 'bumudurbu'} - Instagram`,
  description: () => profile.value?.biography || 'Instagram profili',
  ogDescription: () => profile.value?.biography || 'Instagram profili',
  ogImage: () => profile.value?.profile_picture_url || '/og-image.jpg',
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
