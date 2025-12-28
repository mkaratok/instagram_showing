<template>
  <div class="min-h-screen font-sans transition-colors duration-300" :class="isDark ? 'bg-earth-900 text-earth-100' : 'bg-background-light text-text-light'">
    <Preloader :loading="pending" />

    <!-- Compact Header -->
    <header class="border-b transition-colors" :class="isDark ? 'bg-earth-950 border-earth-800' : 'bg-white border-gray-200'">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <div class="flex items-center gap-6">
          <!-- Profile Picture with Story Ring -->
          <div class="cursor-pointer relative shrink-0" @click="stories?.length ? openStory(0) : null">
            <!-- Instagram Gradient Ring - Only when stories exist -->
            <div 
              v-if="stories?.length" 
              class="absolute -inset-1 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
            ></div>
            <img 
              :src="profile?.profile_picture_url || '/default-avatar.png'" 
              :alt="profile?.username"
              class="relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 transition-colors"
              :class="isDark ? 'border-earth-950' : 'border-white'"
            />
          </div>

          <!-- Username (centered next to PP) -->
          <div class="flex-1 flex items-center justify-center">
            <a :href="`https://www.instagram.com/${profile?.username || 'bumudurbu'}/`" target="_blank" class="hover:text-instagram transition-colors">
              <h1 class="text-2xl md:text-3xl font-semibold">{{ profile?.username || 'bumudurbu' }}</h1>
            </a>
          </div>

          <!-- Stats (right aligned) -->
          <div class="hidden sm:flex items-center gap-6 shrink-0">
            <div class="text-center">
              <span class="block text-lg font-bold"><CountUp :to="profile?.media_count || 0" /></span>
              <span class="text-xs uppercase tracking-wide" :class="isDark ? 'text-earth-500' : 'text-gray-500'">Gönderi</span>
            </div>
            <div class="text-center">
              <span class="block text-lg font-bold"><CountUp :to="profile?.followers_count || 0" /></span>
              <span class="text-xs uppercase tracking-wide" :class="isDark ? 'text-earth-500' : 'text-gray-500'">Takipçi</span>
            </div>
            <div class="text-center">
              <span class="block text-lg font-bold"><CountUp :to="profile?.follows_count || 0" /></span>
              <span class="text-xs uppercase tracking-wide" :class="isDark ? 'text-earth-500' : 'text-gray-500'">Takip</span>
            </div>
          </div>
        </div>

        <!-- Mobile Stats -->
        <div class="flex sm:hidden justify-around mt-4 pt-4 border-t" :class="isDark ? 'border-earth-800' : 'border-gray-200'">
          <div class="text-center">
            <span class="block text-lg font-bold"><CountUp :to="profile?.media_count || 0" /></span>
            <span class="text-xs uppercase" :class="isDark ? 'text-earth-500' : 'text-gray-500'">Gönderi</span>
          </div>
          <div class="text-center">
            <span class="block text-lg font-bold"><CountUp :to="profile?.followers_count || 0" /></span>
            <span class="text-xs uppercase" :class="isDark ? 'text-earth-500' : 'text-gray-500'">Takipçi</span>
          </div>
          <div class="text-center">
            <span class="block text-lg font-bold"><CountUp :to="profile?.follows_count || 0" /></span>
            <span class="text-xs uppercase" :class="isDark ? 'text-earth-500' : 'text-gray-500'">Takip</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Tab Navigation -->
    <nav class="sticky top-0 z-30 backdrop-blur-sm border-b transition-colors" :class="isDark ? 'bg-earth-900/95 border-earth-800' : 'bg-white/95 border-gray-200'">
      <div class="max-w-4xl mx-auto flex justify-center gap-2 md:gap-8">
        <button 
          v-for="tab in ['GÖNDERİLER', 'REELS', 'HİZMETLER', 'ETİKETLER', 'PROFİL']" 
          :key="tab"
          @click="handleTabClick(tab)"
          class="px-3 md:px-4 py-3 text-xs md:text-sm font-medium tracking-wider transition-colors relative"
          :class="activeTab === tab 
            ? (isDark ? 'text-earth-100' : 'text-gray-900')
            : (isDark ? 'text-earth-500 hover:text-earth-300' : 'text-gray-400 hover:text-gray-600')"
        >
          {{ tab }}
          <span 
            v-if="activeTab === tab" 
            class="absolute bottom-0 left-1 right-1 h-0.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full"
          ></span>
        </button>
      </div>
    </nav>

    <!-- Content Area (Original Style) -->
    <main class="max-w-4xl mx-auto pb-24">
      
      <!-- Posts Grid (Original) -->
      <div v-if="activeTab === 'GÖNDERİLER'" class="animate-fade-in">
        <FeedGrid :posts="sortedPosts" @open="openModal" />
      </div>

      <!-- Reels Grid -->
      <div v-else-if="activeTab === 'REELS'" class="animate-fade-in">
        <FeedGrid :posts="reelsPosts" @open="openModal" />
        <div v-if="reelsPosts.length === 0" class="py-20 text-center" :class="isDark ? 'text-earth-600' : 'text-gray-400'">
          Henüz Reels videosu bulunmuyor.
        </div>
      </div>

      <!-- Hizmetler Tab -->
      <div v-else-if="activeTab === 'HİZMETLER'" class="px-4 py-8 animate-fade-in">
        <h2 class="text-2xl font-bold mb-8 text-center">Hizmetlerimiz</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="(service, index) in services" :key="index" 
               class="p-6 rounded-xl transition-colors"
               :class="isDark ? 'bg-earth-800' : 'bg-white shadow-sm border border-gray-100'">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                   :class="isDark ? 'bg-instagram/20 text-instagram' : 'bg-purple-100 text-purple-600'">
                <span class="text-2xl">{{ service.icon }}</span>
              </div>
              <div>
                <h3 class="font-bold text-lg mb-2">{{ service.title }}</h3>
                <p class="text-sm leading-relaxed" :class="isDark ? 'text-earth-400' : 'text-gray-600'">
                  {{ service.description }}
                </p>
                <p class="mt-3 font-semibold text-instagram">{{ service.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tagged Grid -->
      <div v-else-if="activeTab === 'ETİKETLER'" class="animate-fade-in">
        <div class="grid grid-cols-3 gap-1 md:gap-4 px-4">
          <div 
            v-for="post in taggedPosts" 
            :key="post.id" 
            class="aspect-square relative group cursor-pointer overflow-hidden"
            :class="isDark ? 'bg-earth-800' : 'bg-gray-200'"
            @click="openModal(post)"
          >
            <img :src="post.thumbnail_url || post.media_url" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
          </div>
        </div>
        <div v-if="taggedPosts.length === 0" class="py-20 text-center" :class="isDark ? 'text-earth-600' : 'text-gray-400'">
          Henüz etiketlenmiş gönderi yok.
        </div>
      </div>

      <!-- Profile Tab -->
      <div v-else-if="activeTab === 'PROFİL'" class="px-4 py-8 sm:px-8 space-y-12 animate-fade-in">
        <!-- Hakkimda -->
        <div class="grid md:grid-cols-2 gap-12">
          <div>
            <h2 class="text-xl font-bold mb-4 uppercase tracking-widest">Hakkımda</h2>
            <div class="text-sm leading-relaxed space-y-4" :class="isDark ? 'text-earth-300' : 'text-gray-600'">
              <p>Yaygın inanışın aksine, Lorem Ipsum rastgele bir metin değildir. Kökleri MÖ 45 yılına ait klasik bir Latin edebiyatı eserine dayanmaktadır.</p>
              <p>1500'lerden beri kullanılan standart Lorem Ipsum metni, ilgilenenler için aşağıda yeniden üretilmiştir.</p>
            </div>
          </div>
          
          <!-- Sertifikalar -->
          <div>
            <h2 class="text-xl font-bold mb-4 uppercase tracking-widest">Sertifikalar</h2>
            <div class="space-y-6">
              <div v-for="i in 3" :key="i">
                <h3 class="font-bold text-sm mb-1">{{ i }}. SERTİFİKA:</h3>
                <p class="text-xs" :class="isDark ? 'text-earth-400' : 'text-gray-500'">Yaygın inanışın aksine, Lorem Ipsum rastgele bir metin değildir. Kökleri MÖ 45.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <section class="pt-8 border-t" :class="isDark ? 'border-earth-800' : 'border-gray-200'">
          <h2 class="text-2xl font-bold mb-6">İletişim</h2>
          <div class="grid md:grid-cols-2 gap-8 items-start">
            <div class="space-y-4 text-sm font-medium">
              <a :href="`https://instagram.com/${profile?.username || 'bumudurbu'}`" target="_blank" class="flex items-center gap-3 hover:opacity-70 transition-opacity">
                <svg class="w-5 h-5 text-instagram" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/></svg>
                <span>@{{ profile?.username || 'bumudurbu' }}</span>
              </a>
              <a href="https://wa.me/905354326668" target="_blank" class="flex items-center gap-3 hover:opacity-70 transition-opacity">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                <span>+90 535 432 66 68</span>
              </a>
              <a href="https://www.google.com/maps/search/?api=1&query=Şarkiye+Mah.+Ordu" target="_blank" class="flex items-center gap-3 hover:opacity-70 transition-opacity">
                <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11a3 3 0 110-6 3 3 0 010 6z"/></svg>
                <span>Şarkiye Mah. Altınordu / Ordu</span>
              </a>
            </div>
            <div class="h-64 rounded-lg overflow-hidden" :class="isDark ? 'bg-earth-800' : 'bg-gray-200'">
              <iframe 
                class="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.5!2d37.8783!3d40.9857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zT3JkdQ!5e0!3m2!1str!2str" 
                allowfullscreen 
                loading="lazy">
              </iframe>
            </div>
          </div>
        </section>
      </div>

      <div v-if="activeTab !== 'ETİKETLER' && activeTab !== 'PROFİL' && activeTab !== 'HİZMETLER'" class="flex justify-center mt-8 mb-12 text-xs" :class="isDark ? 'text-earth-500' : 'text-gray-400'">
        <span class="opacity-50">Tüm gönderiler yüklendi.</span>
      </div>
    </main>

    <!-- Fixed Bottom Footer (Symmetric) -->
    <footer class="fixed bottom-0 left-0 right-0 border-t z-40 transition-colors" :class="isDark ? 'bg-earth-950 border-earth-800' : 'bg-white border-gray-200 shadow-lg'">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <!-- Instagram Button (same width as WhatsApp) -->
        <a 
          :href="`https://www.instagram.com/${profile?.username || 'bumudurbu'}/`" 
          target="_blank"
          class="flex items-center justify-center gap-2 w-32 py-2.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white text-sm font-medium rounded-lg transition-all hover:opacity-90"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/></svg>
          <span>Instagram</span>
        </a>

        <!-- Center Buttons (Location + Theme) - Midpoint = Page Center -->
        <div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
          <!-- Location Button -->
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Şarkiye+Mah.+Ordu" 
            target="_blank"
            class="p-2.5 rounded-full transition-colors"
            :class="isDark ? 'text-earth-400 hover:text-red-400 hover:bg-white/10' : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'"
            title="Konum"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11a3 3 0 110-6 3 3 0 010 6z"/></svg>
          </a>

          <!-- Theme Toggle -->
          <button 
            @click="toggleTheme"
            class="p-2.5 rounded-full transition-colors"
            :class="isDark ? 'text-earth-400 hover:text-yellow-400 hover:bg-white/10' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
            :title="isDark ? 'Aydınlık Mod' : 'Karanlık Mod'"
          >
            <!-- Sun Icon -->
            <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <!-- Moon Icon -->
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
            </svg>
          </button>
        </div>

        <!-- WhatsApp Button (same width as Instagram) -->
        <a 
          href="https://wa.me/905354326668" 
          target="_blank"
          class="flex items-center justify-center gap-2 w-32 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
          <span>WhatsApp</span>
        </a>
      </div>
    </footer>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedPost" class="fixed inset-0 z-50 flex items-center justify-center p-4" :class="isDark ? 'bg-black/80' : 'bg-black/50'" @click="selectedPost = null">
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
// Data Fetching
const { data: profile, pending: profileLoading } = await useFetch('/api/instagram/profile')
const { data: instagramData, pending: postsLoading } = await useFetch('/api/instagram')
const { data: storiesData } = await useFetch('/api/instagram/stories')
const { data: mentionsData } = await useFetch('/api/instagram/mentions')

const posts = computed(() => instagramData.value?.data || [])
const stories = computed(() => storiesData.value?.data || [])
const pending = computed(() => profileLoading.value || postsLoading.value)

const sortedPosts = computed(() => posts.value)
const reelsPosts = computed(() => posts.value.filter(p => p.media_product_type === 'REELS'))
const taggedPosts = computed(() => mentionsData.value?.data || [])

// Services Data (Hardcoded)
const services = ref([
  {
    icon: '🧘',
    title: 'Bireysel Yoga Dersi',
    description: 'Kişiye özel hazırlanmış yoga programı ile beden ve zihin dengenizi bulun. Seviyenize uygun asanalar ve nefes teknikleri.',
    price: '₺500 / Seans'
  },
  {
    icon: '👥',
    title: 'Grup Yoga Dersi',
    description: 'Haftada 3 gün düzenlenen grup derslerimizde birlikte pratik yapın. Maksimum 10 kişilik gruplar.',
    price: '₺1.200 / Aylık'
  },
  {
    icon: '🌅',
    title: 'Sabah Meditasyonu',
    description: 'Güne pozitif enerji ile başlayın. 30 dakikalık rehberli meditasyon seansları.',
    price: '₺200 / Seans'
  },
  {
    icon: '🏠',
    title: 'Online Yoga',
    description: 'Evinizin konforunda canlı yoga dersleri. Zoom üzerinden interaktif seanslar.',
    price: '₺800 / Aylık'
  },
  {
    icon: '🎯',
    title: 'Kurumsal Yoga',
    description: 'Şirketiniz için özel yoga programları. Çalışan motivasyonu ve stres yönetimi.',
    price: 'Teklif Alın'
  },
  {
    icon: '📚',
    title: 'Yoga Eğitmenlik Kursu',
    description: '200 saatlik sertifikalı yoga eğitmenlik programı. Uluslararası geçerli YA sertifikası.',
    price: '₺15.000 / Program'
  }
])

// UI State
const activeTab = ref('GÖNDERİLER')
const { isDark, toggleTheme, initTheme } = useTheme()

// Handle tab click (navigate if needed)
function handleTabClick(tab) {
  activeTab.value = tab
}

// Modal & Story Logic
const selectedPost = ref(null)
const showStoryViewer = ref(false)
const initialStoryIndex = ref(0)

function openModal(post) {
  selectedPost.value = post
}

function openStory(index) {
  initialStoryIndex.value = index
  showStoryViewer.value = true
}

onMounted(() => {
  initTheme()
})
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
