<template>
  <div class="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark transition-colors duration-300">
    <div class="layout-container flex h-full grow flex-col">
      <div class="px-0 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
        <div class="layout-content-container flex flex-col w-full max-w-4xl flex-1">
          
          <!-- Header (Bio & Stats) -->
          <header class="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 px-5 sm:px-6 py-6 border-b border-subtle-light dark:border-subtle-dark">
            
            <!-- Avatar -->
            <div class="relative group flex-shrink-0 mx-auto md:mx-0 cursor-pointer" @click="stories?.length ? openStory(0) : null">
              <!-- Animated Ring (Only shows if stories exist) -->
              <div v-if="stories?.length" class="absolute -inset-[3px] rounded-full bg-gradient-to-tr from-earth-800 via-sage-500 to-sage-200 bg-size-200 animate-spin-slow opacity-80 group-hover:opacity-100 transition-opacity"></div>
              
              <div class="w-28 h-28 md:w-40 md:h-40 relative rounded-full p-[3px] bg-background-light dark:bg-background-dark z-10">
                <div class="w-full h-full rounded-full overflow-hidden relative">
                   <img 
                    v-if="profile?.profile_picture_url" 
                    :src="profile.profile_picture_url" 
                    :alt="profile.username" 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div v-else class="w-full h-full bg-earth-200 dark:bg-earth-700 flex items-center justify-center">
                    <span class="text-3xl">🧘</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info -->
            <div class="flex flex-col flex-1 w-full relative">
              <!-- Username + Actions -->
              <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
                <h1 class="text-xl md:text-2xl font-bold tracking-tight text-text-light dark:text-text-dark">
                  {{ profile?.username || 'bumudurbu' }}
                </h1>
                
                <!-- Tag remove as requested, leaving just basic structure if needed -->
              </div>

              <!-- Stats -->
              <div class="flex justify-center sm:justify-start gap-8 md:gap-12 mb-6">
                <div class="text-center sm:text-left">
                  <span class="block font-bold text-lg text-text-light dark:text-text-dark">{{ profile?.media_count || 0 }}</span>
                  <span class="text-xs text-subtle-light dark:text-subtle-dark tracking-wide">GÖNDERİ</span>
                </div>

                <div class="text-center sm:text-left">
                  <span class="block font-bold text-lg text-text-light dark:text-text-dark">{{ profile?.followers_count || 0 }}</span>
                  <span class="text-xs text-subtle-light dark:text-subtle-dark tracking-wide">TAKİPÇİ</span>
                </div>
                <div class="text-center sm:text-left">
                  <span class="block font-bold text-lg text-text-light dark:text-text-dark">{{ profile?.follows_count || 0 }}</span>
                  <span class="text-xs text-subtle-light dark:text-subtle-dark tracking-wide">TAKİP</span>
                </div>
              </div>

              <!-- Bio -->
              <div class="text-sm md:text-base space-y-1 mb-4 text-center sm:text-left px-2 sm:px-0">
                <p class="font-medium text-text-light dark:text-text-dark whitespace-pre-line">
                  {{ profile?.biography || '' }}
                </p>
                <div class="flex items-center justify-center sm:justify-start gap-2 pt-2 text-earth-600 dark:text-sage-400">
                  <span>Dm</span>
                  <a :href="profile?.website || '#'" target="_blank" class="hover:opacity-80 transition-opacity">
                     💌 🌿
                  </a>
                </div>
              </div>

              <!-- Location Button -->
               <div class="flex justify-center sm:justify-start">
               </div>

            </div>
          </header>

          <!-- Stories -->
          <div v-if="stories?.length" class="py-6 px-4 border-b border-subtle-light dark:border-subtle-dark overflow-x-auto no-scrollbar">
            <div class="flex gap-4 sm:gap-6 min-w-min">
              <StoryCircle 
                v-for="(story, index) in stories" 
                :key="story.id" 
                :src="story.thumbnail_url || story.media_url" 
                @click="openStory(index)"
              />
            </div>
          </div>

          <!-- Tabs Navigation -->
          <nav class="flex border-b border-subtle-light dark:border-subtle-dark sticky top-0 bg-background-light dark:bg-background-dark z-30 pt-2">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="flex-1 py-3 text-xs sm:text-sm font-semibold tracking-widest text-center transition-colors uppercase relative"
              :class="activeTab === tab.id ? 'text-text-light dark:text-text-dark' : 'text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark'"
            >
              {{ tab.label }}
              <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-[1px] bg-text-light dark:bg-text-dark"></div>
            </button>
          </nav>

          <!-- Main Content Area -->
          <main class="min-h-[400px]">
            
            <!-- PROFIL TAB -->
            <div v-if="activeTab === 'profile'" class="px-4 py-8 sm:px-8 space-y-12 animate-fade-in">
              <!-- Hakkimda -->
              <div class="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 class="text-xl font-bold mb-4 uppercase tracking-widest">Hakkımda</h2>
                  <div class="text-sm leading-relaxed text-subtle-light dark:text-text-dark space-y-4">
                     <p>Yaygın inanışın aksine, Lorem Ipsum rastgele bir metin değildir. Kökleri MÖ 45 yılına ait klasik bir Latin edebiyatı eserine dayanmaktadır ve bu da onu 2000 yıldan daha eski yapmaktadır.</p>
                     <p>1500'lerden beri kullanılan standart Lorem Ipsum metni, ilgilenenler için aşağıda yeniden üretilmiştir.</p>
                  </div>
                </div>
                
                <!-- Sertifikalar -->
                <div>
                  <h2 class="text-xl font-bold mb-4 uppercase tracking-widest">Sertifikalar</h2>
                  <div class="space-y-6">
                    <div v-for="i in 3" :key="i">
                      <h3 class="font-bold text-sm mb-1">{{ i }}. SERTİFİKA:</h3>
                      <p class="text-xs text-subtle-light dark:text-subtle-dark">Yaygın inanışın aksine, Lorem Ipsum rastgele bir metin değildir. Kökleri MÖ 45.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Map / Contact Embedded -->
              <section class="pt-8 border-t border-subtle-light dark:border-subtle-dark">
                <h2 class="text-2xl font-bold mb-6 font-display">İletişim</h2>
                <div class="grid md:grid-cols-2 gap-8 items-start">
                  <div class="space-y-4 text-sm font-medium">
                     <div class="flex items-center gap-3">
                       <span class="w-6 text-center">fb</span> <span>@arzuozen</span>
                     </div>
                     <div class="flex items-center gap-3">
                       <span class="w-6 text-center">ig</span> <span>@{{ profile?.username || 'bumudurbu' }}</span>
                     </div>
                     <div class="flex items-center gap-3">
                       <span class="w-6 text-center">yt</span> <span>@arzuozen</span>
                     </div>
                     <div class="flex items-center gap-3">
                       <span class="w-6 text-center">wp</span> <a :href="profile?.website || 'https://wa.me/905354326668'" target="_blank">{{ profile?.business_phone_number || '+90 535 432 66 68' }}</a>
                     </div>
                     <div class="flex items-center gap-3">
                        <span class="w-6 text-center">📍</span> <span>{{ profile?.business_address_json ? JSON.parse(profile.business_address_json).street_address : 'Şarkiye Mah. Kazım Karabekir Cad. NO: 33/401 Altınordu / Ordu' }}</span>
                     </div>
                     <div class="flex items-center gap-3">
                        <span class="w-6 text-center">✉️</span> <a href="mailto:arzuozen.yoga@gmail.com">{{ profile?.business_email || 'arzuozen.yoga@gmail.com' }}</a>
                     </div>
                  </div>
                  <div class="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <iframe 
                      class="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.597561!2d37.878336!3d40.985654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDU5JzA4LjQiTiAzN8KwNTInNDIuMCJF!5e0!3m2!1sen!2str!4v1625667000000!5m2!1sen!2str" 
                      allowfullscreen 
                      loading="lazy">
                    </iframe>
                  </div>
                </div>
              </section>
            </div>

            <!-- GÖNDERİLER TAB -->
            <div v-else-if="activeTab === 'posts'" class="animate-fade-in">
              <FeedGrid v-if="posts?.length" :posts="posts" />
              <div v-else class="py-20 text-center text-subtle-light dark:text-subtle-dark">
                <span class="block text-4xl mb-2">📸</span>
                <p>Henüz gönderi yok veya yüklenemedi.</p>
              </div>
            </div>

             <!-- REELS TAB -->
            <div v-else-if="activeTab === 'reels'" class="animate-fade-in">
               <FeedGrid v-if="reels?.length" :posts="reels" />
               <div v-else class="py-20 text-center text-subtle-light dark:text-subtle-dark">
                  <span class="block text-4xl mb-2">🎬</span>
                  <p>Henüz Reels videosu yok veya yüklenemedi.</p>
               </div>
            </div>

             <!-- ETİKETLER TAB -->
            <div v-else-if="activeTab === 'tagged'" class="py-20 text-center text-subtle-light dark:text-subtle-dark animate-fade-in">
               <span class="block text-4xl mb-2">🏷️</span>
               <p>Henüz etiketlenmiş gönderi yok.</p>
            </div>

          </main>

          <!-- Simple Footer -->
          <footer class="py-8 text-center border-t border-subtle-light dark:border-subtle-dark mt-auto">
            <div class="flex flex-col gap-4">
              <button @click="scrollToTop" class="text-xs uppercase tracking-widest hover:text-primary transition-colors">
                Yukarı Dön
              </button>
              <p class="text-xs text-subtle-light dark:text-subtle-dark opacity-60">
                © {{ new Date().getFullYear() }} {{ profile?.name || profile?.username || 'Yoga Stüdyosu' }}. Tüm hakları saklıdır.
              </p>
            </div>
          </footer>

        </div>
      </div>
    </div>

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
const activeTab = ref('profile')

const tabs = [
  { id: 'posts', label: 'GÖNDERİLER' },
  { id: 'reels', label: 'REELS' },
  { id: 'tagged', label: 'ETİKETLER' },
  { id: 'profile', label: 'PROFIL' }
]

// Data Fetching
const { data: profile } = await useFetch('/api/instagram/profile')
const { data: storiesData } = await useFetch('/api/instagram/stories')
const { data: postsData } = await useFetch('/api/instagram/posts')

const stories = computed(() => storiesData.value?.data || [])
const allPosts = computed(() => postsData.value?.data || [])

// Filter functionality
const posts = computed(() => allPosts.value) // All posts for "GÖNDERİLER"
const reels = computed(() => allPosts.value.filter(p => p.media_type === 'VIDEO'))

// Note: Instagram Basic Display API does not natively support fetching "Tagged" posts via the 'me/nodes' endpoint easily without Business discovery.
// Assuming "Etiketler" might have been empty or static. Leaving as empty state for now unless data source is found.

const showStoryViewer = ref(false)
const initialStoryIndex = ref(0)

const openStory = (index) => {
  initialStoryIndex.value = index
  showStoryViewer.value = true
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
