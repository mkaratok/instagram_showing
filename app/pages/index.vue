<template>
  <div class="min-h-screen font-sans transition-colors duration-300" :class="isDark ? 'bg-[#1a222d] text-earth-100' : 'bg-background-light text-text-light'">
    <Preloader :loading="pending" />

    <!-- Compact Header -->
    <header class="border-b transition-colors" :class="isDark ? 'bg-[#080707] border-earth-800' : 'bg-white border-gray-200'">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <div class="flex items-center gap-3">
          <!-- Profile Picture with Story Ring -->
          <div class="cursor-pointer relative shrink-0" @click="stories?.length ? openStory(0) : null">
            <!-- Instagram Gradient Ring - Always show for visual, click works when stories exist -->
            <div 
              class="absolute -inset-1 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
              :class="stories?.length ? 'opacity-100 animate-pulse' : 'opacity-30'"
            ></div>
            <img 
              :src="profile?.profile_picture_url || '/default-avatar.png'" 
              :alt="profile?.username"
              class="relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 transition-colors"
              :class="isDark ? 'border-earth-950' : 'border-white'"
            />
          </div>

          <!-- Username (immediately after PP, centered together) -->
          <div class="flex items-center">
            <a :href="`https://www.instagram.com/${profile?.username || 'arzuozen'}/`" target="_blank" class="hover:text-instagram transition-colors">
              <h1 class="text-2xl md:text-3xl font-semibold">{{ profile?.username || 'arzuozen' }}</h1>
            </a>
          </div>

          <!-- Spacer to push stats right -->
          <div class="flex-1"></div>

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
    <nav class="sticky top-0 z-30 backdrop-blur-sm border-b transition-colors" :class="isDark ? 'bg-[#1a222d]/95 border-earth-600/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]' : 'bg-white/95 border-gray-200'">
      <div class="max-w-4xl mx-auto flex justify-center gap-2 md:gap-8">
        <button 
          v-for="tab in ['GÖNDERİLER', 'REELS', 'ETİKETLER', 'PROFİL']" 
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
      <div v-if="activeTab === 'GÖNDERİLER'" class="animate-fade-in mt-6 py-4">
        <FeedGrid :posts="sortedPosts" @open="openModal" />
      </div>

      <!-- Reels Grid -->
      <div v-else-if="activeTab === 'REELS'" class="animate-fade-in mt-6 py-4">
        <FeedGrid :posts="reelsPosts" @open="openModal" />
        <div v-if="reelsPosts.length === 0" class="py-20 text-center" :class="isDark ? 'text-earth-600' : 'text-gray-400'">
          Henüz Reels videosu bulunmuyor.
        </div>
      </div>

      <!-- Hizmetler Tab -->
      <div v-else-if="activeTab === 'HİZMETLER'" class="px-4 py-12 animate-fade-in">
        <!-- Hero Section -->
        <div class="text-center mb-12">
          <span class="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4"
                :class="isDark ? 'bg-instagram/20 text-instagram' : 'bg-purple-100 text-purple-600'">
            Profesyonel Yoga Eğitimi
          </span>
          <h2 class="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            Hizmetlerimiz
          </h2>
          <p class="max-w-xl mx-auto" :class="isDark ? 'text-earth-400' : 'text-gray-500'">
            Beden ve zihin dengenizi bulmanız için size özel hazırlanmış yoga programları
          </p>
        </div>

        <!-- Services Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(service, index) in services" :key="index" 
               class="group relative p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden"
               :class="isDark ? 'bg-gradient-to-br from-earth-800 to-earth-900 border border-earth-700' : 'bg-white shadow-lg border border-gray-100'">
            
            <!-- Gradient Overlay on Hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="relative z-10">
              <!-- Icon -->
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                   :class="isDark ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30' : 'bg-gradient-to-br from-purple-100 to-pink-100'">
                <component :is="service.icon" class="w-7 h-7" :class="isDark ? 'text-purple-300' : 'text-purple-600'" />
              </div>
              
              <!-- Content -->
              <h3 class="font-bold text-lg mb-2 group-hover:text-instagram transition-colors">{{ service.title }}</h3>
              <p class="text-sm leading-relaxed mb-4" :class="isDark ? 'text-earth-400' : 'text-gray-600'">
                {{ service.description }}
              </p>
              
              <!-- Price Tag -->
              <div class="flex items-center justify-between">
                <span class="font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {{ service.price }}
                </span>
                <span class="text-xs px-3 py-1 rounded-full transition-colors"
                      :class="isDark ? 'bg-earth-700 text-earth-300' : 'bg-gray-100 text-gray-500'">
                  {{ service.duration || 'Detay için iletişime geçin' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="mt-12 text-center">
          <p class="mb-4" :class="isDark ? 'text-earth-400' : 'text-gray-500'">{{ settings.profile?.ctaDescription || 'Hizmetlerimiz hakkında detaylı bilgi almak için' }}</p>
          <a :href="'https://wa.me/' + (settings.contact?.whatsapp || '905354326668')" target="_blank"
             class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
            {{ settings.profile?.ctaText || 'WhatsApp ile İletişime Geç' }}
          </a>
        </div>
      </div>

      <!-- Tagged Grid -->
      <div v-else-if="activeTab === 'ETİKETLER'" class="animate-fade-in mt-6 py-4">
        <FeedGrid :posts="taggedPosts" @open="openModal" />
        <div v-if="taggedPosts.length === 0" class="py-20 text-center" :class="isDark ? 'text-earth-600' : 'text-gray-400'">
          Henüz etiketlenmiş gönderi yok.
        </div>
      </div>

      <!-- Profile Tab -->
      <div v-else-if="activeTab === 'PROFİL'" class="px-4 py-8 sm:px-8 space-y-12 animate-fade-in">
        <!-- Hakkimda -->
        <div class="grid md:grid-cols-2 gap-12">
          <div>
            <h2 class="text-xl font-bold mb-4 uppercase tracking-widest">{{ settings.profile?.aboutTitle || 'Hakkımda' }}</h2>
            <div class="text-sm leading-relaxed space-y-4" :class="isDark ? 'text-earth-300' : 'text-gray-600'">
              <p>{{ settings.profile?.aboutText || 'Profil açıklaması henüz eklenmemiş.' }}</p>
            </div>
          </div>
          
          <!-- Sertifikalar -->
          <div v-if="settings.profile?.certificates?.length > 0">
            <h2 class="text-xl font-bold mb-4 uppercase tracking-widest">{{ settings.profile?.certificatesTitle || 'Sertifikalar' }}</h2>
            <div class="space-y-6">
              <div v-for="(cert, index) in settings.profile.certificates" :key="index">
                <h3 class="font-bold text-sm mb-1">{{ cert.title }}</h3>
                <p class="text-xs" :class="isDark ? 'text-earth-400' : 'text-gray-500'">{{ cert.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Hizmetlerimiz Section (inside Profile) -->
        <section class="pt-8 border-t" :class="isDark ? 'border-earth-800' : 'border-gray-200'">
          <h2 class="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">{{ settings.profile?.servicesTitle || 'Hizmetlerimiz' }}</h2>
          <div class="grid grid-cols-3 gap-4">
            <a v-for="(service, index) in profileServices" :key="index" 
               :href="'https://wa.me/' + (settings.contact?.whatsapp || '905354326668') + '?text=' + encodeURIComponent(service.title + ' hakkında bilgi almak istiyorum')"
               target="_blank"
               class="group relative aspect-square p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden cursor-pointer flex flex-col justify-between"
               :class="isDark ? 'bg-gradient-to-br from-earth-800 to-earth-900 border border-earth-700 hover:border-purple-500/50' : 'bg-white shadow-md border border-gray-100 hover:border-purple-300'">
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div class="relative z-10 flex-1 flex flex-col">
                <!-- Title -->
                <h3 class="font-bold text-base mb-2 group-hover:text-instagram transition-colors">{{ service.title }}</h3>
                <!-- Description -->
                <p class="text-xs leading-relaxed flex-1" :class="isDark ? 'text-earth-400' : 'text-gray-600'">{{ service.description }}</p>
              </div>
              
              <!-- Price at bottom -->
              <div class="relative z-10 mt-4 pt-3 border-t" :class="isDark ? 'border-earth-700' : 'border-gray-200'">
                <span class="font-bold text-sm bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{{ service.price }}</span>
                <span class="block text-[10px] mt-1 opacity-60">Bilgi almak için tıklayın</span>
              </div>
            </a>
          </div>
        </section>

        <!-- Contact Section -->
        <section class="pt-8">
          <!-- Section Separator -->
          <div class="h-px mb-8" :class="isDark ? 'bg-gradient-to-r from-transparent via-earth-700 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'"></div>
          
          <h2 class="text-2xl font-bold mb-6">İletişim</h2>
          
          <div class="grid md:grid-cols-2 gap-8 items-start">
            <!-- Left Column: Info -->
            <div class="space-y-6">
              <!-- Company Name -->
              <div>
                <h3 class="text-xl font-bold mb-1">{{ settings.siteName || 'arzuozen' }}</h3>
                <p class="text-sm" :class="isDark ? 'text-earth-400' : 'text-gray-500'">{{ settings.slogan || 'Instagram Vitrini' }}</p>
              </div>
              
              <!-- Contact Details -->
              <div class="space-y-3 text-sm">
                <a v-if="settings.contact?.whatsapp" :href="`https://wa.me/${settings.contact.whatsapp}`" target="_blank" class="flex items-center gap-3 hover:opacity-70 transition-opacity">
                  <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  <span>{{ settings.contact.phone || '+90 535 432 66 68' }}</span>
                </a>
                <div v-if="settings.contact?.address" class="flex items-start gap-3">
                  <svg class="w-5 h-5 mt-0.5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11a3 3 0 110-6 3 3 0 010 6z"/></svg>
                  <span :class="isDark ? 'text-earth-300' : 'text-gray-700'">{{ settings.contact.address }}</span>
                </div>
              </div>
              
              <!-- Social Links -->
              <div>
                <h4 class="text-sm font-medium mb-4" :class="isDark ? 'text-earth-400' : 'text-gray-500'">Bizi Takip Edin</h4>
                <SocialLinksGrid :isDark="isDark" />
              </div>
            </div>
            
            <!-- Right Column: Map -->
            <div v-if="mapEmbedUrl" class="h-72 rounded-xl overflow-hidden shadow-lg" :class="isDark ? 'bg-earth-800' : 'bg-gray-200'">
              <iframe 
                class="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                :src="mapEmbedUrl" 
                allowfullscreen 
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
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
          :href="`https://www.instagram.com/${profile?.username || 'arzuozen'}/`" 
          target="_blank"
          class="flex items-center justify-center gap-2 w-32 py-2.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white text-sm font-medium rounded-lg transition-all hover:opacity-90"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
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
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>WhatsApp</span>
        </a>
      </div>
    </footer>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedPost" class="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 backdrop-blur-sm" :class="isDark ? 'bg-black/70' : 'bg-black/40'" @click="selectedPost = null">
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

<script setup lang="ts">
import { useSiteSettings } from '~/composables/useSiteSettings'

// Site Settings
const { settings } = useSiteSettings()

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

// Extract Google Maps embed URL from settings (handles both full iframe and just URL)
const mapEmbedUrl = computed(() => {
  const stored = settings.value.contact?.googleMapsEmbed || ''
  if (!stored) return ''
  // If it contains iframe, extract src
  if (stored.includes('<iframe') && stored.includes('src="')) {
    const match = stored.match(/src="([^"]+)"/)
    return match ? match[1] : ''
  }
  // Otherwise return as is (direct URL)
  return stored
})

// Services Data (Hardcoded)
// SVG Icon Components for Services
const IconYoga = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313-12.454z"/><circle cx="12" cy="8" r="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v4m-3 6l3-4l3 4"/></svg>`
}
const IconGroup = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/></svg>`
}
const IconSunrise = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/></svg>`
}
const IconHome = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>`
}
const IconTarget = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"/></svg>`
}
const IconBook = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"/></svg>`
}
const IconMeditation = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="6" r="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v2m0 0c-2 0-4 2-4 4v2m4-6c2 0 4 2 4 4v2m-8 0h8m-6 0v2m4-2v2"/></svg>`
}
const IconPrivate = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>`
}
const IconRetreat = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 1 0 6.712 14.496m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"/></svg>`
}

const services = ref([
  {
    icon: IconYoga,
    title: 'Bireysel Yoga Dersi',
    description: 'Kişiye özel hazırlanmış yoga programı ile beden ve zihin dengenizi bulun. Seviyenize uygun asanalar ve nefes teknikleri.',
    price: '₺500 / Seans',
    duration: '60 dakika'
  },
  {
    icon: IconGroup,
    title: 'Grup Yoga Dersi',
    description: 'Haftada 3 gün düzenlenen grup derslerimizde birlikte pratik yapın. Maksimum 10 kişilik gruplar.',
    price: '₺1.200 / Aylık',
    duration: 'Hafta 3 gün'
  },
  {
    icon: IconSunrise,
    title: 'Sabah Meditasyonu',
    description: 'Güne pozitif enerji ile başlayın. 30 dakikalık rehberli meditasyon seansları.',
    price: '₺200 / Seans',
    duration: '30 dakika'
  },
  {
    icon: IconHome,
    title: 'Online Yoga',
    description: 'Evinizin konforunda canlı yoga dersleri. Zoom üzerinden interaktif seanslar.',
    price: '₺800 / Aylık',
    duration: 'Sınırsız erişim'
  },
  {
    icon: IconTarget,
    title: 'Kurumsal Yoga',
    description: 'Şirketiniz için özel yoga programları. Çalışan motivasyonu ve stres yönetimi.',
    price: 'Teklif Alın',
    duration: 'Özel planlama'
  },
  {
    icon: IconBook,
    title: 'Yoga Eğitmenlik Kursu',
    description: '200 saatlik sertifikalı yoga eğitmenlik programı. Uluslararası geçerli YA sertifikası.',
    price: '₺15.000',
    duration: '200 saat'
  }
])

// Icon mapping for dynamic service icons from settings
const iconMap: Record<string, any> = {
  yoga: IconYoga,
  group: IconGroup,
  sunrise: IconSunrise,
  meditation: IconMeditation,
  private: IconPrivate,
  retreat: IconRetreat,
  home: IconHome,
  target: IconTarget,
  book: IconBook
}

// Get icon component from string name
function getServiceIcon(iconName: string) {
  return iconMap[iconName] || IconYoga
}

// Dynamic services from settings (fallback to hardcoded)
const profileServices = computed(() => {
  if (settings.value.profile?.services?.length > 0) {
    return settings.value.profile.services
  }
  return services.value
})

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
  transition: opacity 0.25s ease, backdrop-filter 0.25s ease;
}
.modal-enter-active > *,
.modal-leave-active > * {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > *,
.modal-leave-to > * {
  transform: scale(0.95);
  opacity: 0;
}
</style>
