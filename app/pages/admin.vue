<template>
  <div class="min-h-screen bg-[#1a222d] text-white">
    <!-- Login Mode -->
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-screen p-4">
      <div class="w-full max-w-md p-8 rounded-2xl bg-[#080707] border border-earth-700 shadow-2xl">
        <h1 class="text-2xl font-bold text-center mb-6">
          <span class="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </span>
        </h1>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm text-earth-400 mb-2">Şifre</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="Admin şifresini girin"
              class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-500 focus:border-instagram focus:outline-none transition-colors"
              :class="{ 'border-red-500': loginError }"
            />
            <p v-if="loginError" class="text-red-400 text-sm mt-2">{{ loginError }}</p>
          </div>
          
          <button 
            type="submit"
            class="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity"
          >
            Giriş Yap
          </button>
        </form>
        
        <NuxtLink to="/" class="block mt-6 text-center text-earth-500 hover:text-earth-300 text-sm">
          ← Ana Sayfaya Dön
        </NuxtLink>
      </div>
    </div>

    <!-- Form Mode -->
    <div v-else class="max-w-4xl mx-auto p-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">
          <span class="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Site Ayarları
          </span>
        </h1>
        <div class="flex gap-3">
          <NuxtLink to="/" class="px-4 py-2 rounded-lg bg-earth-800 text-earth-300 hover:bg-earth-700 transition-colors text-sm">
            Siteyi Gör
          </NuxtLink>
          <button @click="handleLogout" class="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm">
            Çıkış
          </button>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="saveMessage" class="mb-6 p-4 rounded-lg" :class="saveSuccess ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
        {{ saveMessage }}
      </div>

      <!-- Settings Form -->
      <form @submit.prevent="handleSave" class="space-y-8">
        
        <!-- Genel Bilgiler -->
        <section class="p-6 rounded-xl bg-[#080707] border border-earth-700">
          <h2 class="text-lg font-semibold mb-4 text-earth-100">Genel Bilgiler</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-earth-400 mb-2">Site Adı</label>
              <input v-model="formData.siteName" type="text" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">Slogan</label>
              <input v-model="formData.slogan" type="text" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm text-earth-400 mb-2">SEO Açıklaması</label>
              <textarea v-model="formData.seoDescription" rows="3" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none resize-none"></textarea>
            </div>
          </div>
        </section>

        <!-- Instagram Ayarları -->
        <section v-if="instagramConfig" class="p-6 rounded-xl bg-[#080707] border border-earth-700">
          <h2 class="text-lg font-semibold mb-4 text-earth-100 flex items-center gap-2">
            <svg class="w-5 h-5 text-instagram" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2z"/></svg>
            Instagram Ayarlari
          </h2>
          <div class="space-y-4">
            <div class="p-4 rounded-lg bg-earth-800/50 border border-earth-600">
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-earth-400 mb-2">Access Token</label>
                  <input v-model="instagramConfig.accessToken" type="password" placeholder="EAAI..." class="w-full px-4 py-3 rounded-lg bg-earth-900 border border-earth-600 text-white focus:border-instagram focus:outline-none font-mono text-sm" />
                  <p class="text-xs text-earth-500 mt-1">Facebook Developer token</p>
                </div>
                <div>
                  <label class="block text-sm text-earth-400 mb-2">Business Account ID</label>
                  <input v-model="instagramConfig.businessId" type="text" placeholder="17841400000000000" class="w-full px-4 py-3 rounded-lg bg-earth-900 border border-earth-600 text-white focus:border-instagram focus:outline-none font-mono text-sm" />
                  <p class="text-xs text-earth-500 mt-1">Instagram Business hesap ID</p>
                </div>
              </div>
              
              <!-- Test Connection Button -->
              <div class="mt-4 flex items-center gap-4">
                <button type="button" @click="testInstagramConnection" 
                        :disabled="instagramTesting"
                        class="px-4 py-2 rounded-lg bg-instagram text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                  {{ instagramTesting ? 'Test Ediliyor...' : 'Baglanti Test Et' }}
                </button>
                <span v-if="instagramTestResult" class="text-sm" :class="instagramTestResult.success ? 'text-green-400' : 'text-red-400'">
                  {{ instagramTestResult.message }}
                </span>
              </div>
            </div>
            
            <!-- Feature Toggles -->
            <div v-if="instagramConfig.features" class="grid md:grid-cols-3 gap-4">
              <label class="flex items-center gap-3 p-3 rounded-lg bg-earth-800/50 border border-earth-600 cursor-pointer hover:border-earth-500 transition-colors">
                <input type="checkbox" v-model="instagramConfig.features.showReels" class="w-4 h-4 accent-instagram" />
                <span class="text-sm text-earth-200">Reels Goster</span>
              </label>
              <label class="flex items-center gap-3 p-3 rounded-lg bg-earth-800/50 border border-earth-600 cursor-pointer hover:border-earth-500 transition-colors">
                <input type="checkbox" v-model="instagramConfig.features.showStories" class="w-4 h-4 accent-instagram" />
                <span class="text-sm text-earth-200">Hikayeler Goster</span>
              </label>
              <label class="flex items-center gap-3 p-3 rounded-lg bg-earth-800/50 border border-earth-600 cursor-pointer hover:border-earth-500 transition-colors">
                <input type="checkbox" v-model="instagramConfig.features.showMentions" class="w-4 h-4 accent-instagram" />
                <span class="text-sm text-earth-200">Etiketler Goster</span>
              </label>
            </div>
            
            <!-- Save Instagram Config Button -->
            <button type="button" @click="saveInstagramConfig" 
                    :disabled="instagramSaving"
                    class="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {{ instagramSaving ? 'Kaydediliyor...' : 'Instagram Ayarlarini Kaydet' }}
            </button>
          </div>
        </section>

        <!-- İletişim Bilgileri -->
        <section class="p-6 rounded-xl bg-[#080707] border border-earth-700">
          <h2 class="text-lg font-semibold mb-4 text-earth-100">İletişim Bilgileri</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-earth-400 mb-2">Telefon</label>
              <input v-model="formData.contact.phone" type="text" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">WhatsApp No (ülke kodu ile)</label>
              <input v-model="formData.contact.whatsapp" type="text" placeholder="905354326668" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-500 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">Şehir</label>
              <input v-model="formData.contact.city" type="text" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm text-earth-400 mb-2">Adres</label>
              <textarea v-model="formData.contact.address" rows="2" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none resize-none"></textarea>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm text-earth-400 mb-2">Google Maps Embed Kodu</label>
              <textarea 
                v-model="formData.contact.googleMapsEmbed" 
                rows="3" 
                placeholder='Google Maps\'tan kopyaladığınız <iframe src="..."></iframe> kodunun tamamını yapıştırın'
                class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-500 focus:border-instagram focus:outline-none text-xs font-mono resize-none"
                @paste="handleMapsPaste"
              ></textarea>
              <p class="text-xs text-earth-600 mt-2 flex items-center gap-1"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>Google Maps → Paylaş → Harita yerleştir → HTML kodunu kopyalayıp yapıştırın</p>
            </div>
          </div>
        </section>

        <!-- Sosyal Medya -->
        <section class="p-6 rounded-xl bg-[#080707] border border-earth-700">
          <h2 class="text-lg font-semibold mb-4 text-earth-100">Sosyal Medya</h2>
          <p class="text-sm text-earth-500 mb-4">Boş bırakılan alanlar ön yüzde gösterilmez.</p>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/></svg>Instagram</label>
              <input v-model="formData.social.instagram" type="url" placeholder="https://instagram.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>Facebook</label>
              <input v-model="formData.social.facebook" type="url" placeholder="https://facebook.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>YouTube</label>
              <input v-model="formData.social.youtube" type="url" placeholder="https://youtube.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>TikTok</label>
              <input v-model="formData.social.tiktok" type="url" placeholder="https://tiktok.com/@..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>Twitter / X</label>
              <input v-model="formData.social.twitter" type="url" placeholder="https://twitter.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>LinkedIn</label>
              <input v-model="formData.social.linkedin" type="url" placeholder="https://linkedin.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>Pinterest</label>
              <input v-model="formData.social.pinterest" type="url" placeholder="https://pinterest.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
          </div>
        </section>

        <!-- Pazaryerleri -->
        <section class="p-6 rounded-xl bg-[#080707] border border-earth-700">
          <h2 class="text-lg font-semibold mb-4 text-earth-100">Pazaryerleri</h2>
          <p class="text-sm text-earth-500 mb-4">E-ticaret mağaza linklerinizi ekleyin. Boş bırakılan alanlar ön yüzde gösterilmez.</p>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>Trendyol</label>
              <input v-model="formData.social.trendyol" type="url" placeholder="https://trendyol.com/magaza/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/></svg>Hepsiburada</label>
              <input v-model="formData.social.hepsiburada" type="url" placeholder="https://hepsiburada.com/magaza/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h4v10H9V9H7V7zm6 0h4v2h-2v8h-2V7z"/></svg>N11</label>
              <input v-model="formData.social.n11" type="url" placeholder="https://n11.com/magaza/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6H4l-1 14h18L20 6zM4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm4 9h8v2H8v-2zm0-3h8v2H8v-2z"/></svg>PTT AVM</label>
              <input v-model="formData.social.pttavm" type="url" placeholder="https://pttavm.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.57c-.074-.074-.1-.13-.1-.166l-.004-.05z"/></svg>Amazon TR</label>
              <input v-model="formData.social.amazonTr" type="url" placeholder="https://amazon.com.tr/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-3a7 7 0 110-14 7 7 0 010 14z"/></svg>Çiçeksepeti</label>
              <input v-model="formData.social.ciceksepeti" type="url" placeholder="https://ciceksepeti.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/></svg>Sahibinden</label>
              <input v-model="formData.social.sahibinden" type="url" placeholder="https://sahibinden.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.559 4.252c0-.14.175-.245.35-.245h8.047c.154 0 .315.063.315.21l.21 2.017c0 .147-.203.252-.357.252h-.07c-.322-1.26-.98-1.778-3.15-1.778h-1.414c-.378 0-.49.105-.49.448v5.445c0 .343.133.462.525.462h1.064c1.61 0 1.946-.448 2.17-1.61h.14c.126 0 .252.077.252.231v3.556c0 .154-.126.231-.252.231h-.14c-.224-1.162-.56-1.61-2.156-1.61h-1.078c-.392 0-.525.119-.525.462v4.584c0 1.232.644 1.456 2.45 1.456h.77c2.17 0 2.8-.518 3.44-2.03h.14c.154 0 .28.14.28.294l-.35 2.506c0 .126-.175.19-.329.19H9.051c-.154 0-.35-.063-.35-.246v-.091c1.05-.315 1.246-.462 1.246-1.869V6.121c0-1.428-.196-1.554-1.246-1.869v-.091z"/></svg>Etsy</label>
              <input v-model="formData.social.etsy" type="url" placeholder="https://etsy.com/shop/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
          </div>
        </section>

        <!-- Görünüm -->
        <section class="p-6 rounded-xl bg-[#080707] border border-earth-700">
          <h2 class="text-lg font-semibold mb-4 text-earth-100">Görünüm Ayarları</h2>
          <p class="text-sm text-earth-500 mb-4">Sadece temel renkleri seçin, sistem geri kalan tüm tonları otomatik oluşturur.</p>
          <div class="grid md:grid-cols-3 gap-6">
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>Koyu Tema - Ana Renk</label>
              <p class="text-xs text-earth-600 mb-2">Body arka planı. Header/footer otomatik daha koyu.</p>
              <div class="flex gap-3">
                <input v-model="formData.appearance.darkBaseColor" type="color" class="w-14 h-12 rounded-lg cursor-pointer border-0" />
                <input v-model="formData.appearance.darkBaseColor" type="text" class="flex-1 px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white font-mono focus:border-instagram focus:outline-none" />
              </div>
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>Açık Tema - Ana Renk</label>
              <p class="text-xs text-earth-600 mb-2">Body arka planı. Diğer tonlar otomatik.</p>
              <div class="flex gap-3">
                <input v-model="formData.appearance.lightBaseColor" type="color" class="w-14 h-12 rounded-lg cursor-pointer border-0" />
                <input v-model="formData.appearance.lightBaseColor" type="text" class="flex-1 px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white font-mono focus:border-instagram focus:outline-none" />
              </div>
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm text-earth-400 mb-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5 0-.16-.08-.28-.14-.35-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"/><circle cx="6.5" cy="11.5" r="1.5"/><circle cx="9.5" cy="7.5" r="1.5"/><circle cx="14.5" cy="7.5" r="1.5"/><circle cx="17.5" cy="11.5" r="1.5"/></svg>Vurgu Rengi</label>
              <p class="text-xs text-earth-600 mb-2">Butonlar, linkler için accent rengi.</p>
              <div class="flex gap-3">
                <input v-model="formData.appearance.primaryColor" type="color" class="w-14 h-12 rounded-lg cursor-pointer border-0" />
                <input v-model="formData.appearance.primaryColor" type="text" class="flex-1 px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white font-mono focus:border-instagram focus:outline-none" />
              </div>
            </div>
          </div>
          <div class="mt-6">
            <label class="block text-sm text-earth-400 mb-2">Logo URL</label>
            <input v-model="formData.appearance.logoUrl" type="text" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none" />
          </div>
        </section>

        <!-- İşletme Türü -->
        <section class="p-6 rounded-xl bg-[#080707] border border-earth-700">
          <h2 class="text-lg font-semibold mb-4 text-earth-100">İşletme Bilgileri</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-earth-400 mb-2">İşletme Türü</label>
              <select v-model="formData.business.type" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none">
                <option value="PRODUCT">Ürün Satışı</option>
                <option value="SERVICE">Hizmet</option>
                <option value="RESTAURANT">Restoran / Kafe</option>
                <option value="LOCAL_BUSINESS">Yerel İşletme</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">Meslek / Sektör</label>
              <input v-model="formData.business.profession" type="text" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none" />
            </div>
          </div>
        </section>

        <!-- Profil İçerikleri - Hakkımda -->
        <section class="p-6 rounded-xl bg-[#080707] border border-earth-700">
          <h2 class="text-lg font-semibold mb-4 text-earth-100">Profil - Hakkımda</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-earth-400 mb-2">Başlık</label>
              <input v-model="formData.profile.aboutTitle" type="text" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">Açıklama Metni</label>
              <textarea v-model="formData.profile.aboutText" rows="4" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none resize-none"></textarea>
            </div>
          </div>
        </section>

        <!-- Profil İçerikleri - Sertifikalar -->
        <section class="p-6 rounded-xl bg-[#080707] border border-earth-700">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-earth-100">Profil - Sertifikalar</h2>
            <button type="button" @click="addCertificate" class="px-3 py-1 text-sm bg-earth-700 text-earth-200 rounded-lg hover:bg-earth-600 transition-colors">+ Ekle</button>
          </div>
          <div>
            <label class="block text-sm text-earth-400 mb-2">Bölüm Başlığı</label>
            <input v-model="formData.profile.certificatesTitle" type="text" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none mb-4" />
          </div>
          <div class="space-y-4">
            <div v-for="(cert, index) in formData.profile.certificates" :key="index" class="p-4 rounded-lg bg-earth-800 border border-earth-700">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-earth-300 font-medium">Sertifika {{ index + 1 }}</span>
                <button type="button" @click="removeCertificate(index)" class="text-red-400 hover:text-red-300 text-sm">Sil</button>
              </div>
              <div class="space-y-3">
                <input v-model="cert.title" type="text" placeholder="Başlık" class="w-full px-3 py-2 rounded-lg bg-earth-900 border border-earth-600 text-white text-sm focus:border-instagram focus:outline-none" />
                <textarea v-model="cert.description" rows="2" placeholder="Açıklama" class="w-full px-3 py-2 rounded-lg bg-earth-900 border border-earth-600 text-white text-sm focus:border-instagram focus:outline-none resize-none"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- Profil İçerikleri - Hizmetler -->
        <section class="p-6 rounded-xl bg-[#080707] border border-earth-700">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-earth-100">Profil - Hizmetler</h2>
            <button type="button" @click="addService" class="px-3 py-1 text-sm bg-earth-700 text-earth-200 rounded-lg hover:bg-earth-600 transition-colors">+ Ekle</button>
          </div>
          <div>
            <label class="block text-sm text-earth-400 mb-2">Bölüm Başlığı</label>
            <input v-model="formData.profile.servicesTitle" type="text" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none mb-4" />
          </div>
          <div class="space-y-4">
            <div v-for="(service, index) in formData.profile.services" :key="index" class="p-4 rounded-lg bg-earth-800 border border-earth-700">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-earth-300 font-medium">Hizmet {{ index + 1 }}</span>
                <button type="button" @click="removeService(index)" class="text-red-400 hover:text-red-300 text-sm">Sil</button>
              </div>
              <div class="grid md:grid-cols-2 gap-3">
                <input v-model="service.title" type="text" placeholder="Hizmet Adı" class="w-full px-3 py-2 rounded-lg bg-earth-900 border border-earth-600 text-white text-sm focus:border-instagram focus:outline-none" />
                <input v-model="service.price" type="text" placeholder="Fiyat (örn: 500₺ veya Ücretsiz)" class="w-full px-3 py-2 rounded-lg bg-earth-900 border border-earth-600 text-white text-sm focus:border-instagram focus:outline-none" />
                <textarea v-model="service.description" rows="2" placeholder="Hizmet açıklaması" class="md:col-span-2 w-full px-3 py-2 rounded-lg bg-earth-900 border border-earth-600 text-white text-sm focus:border-instagram focus:outline-none resize-none"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- Profil İçerikleri - CTA -->
        <section class="p-6 rounded-xl bg-[#080707] border border-earth-700">
          <h2 class="text-lg font-semibold mb-4 text-earth-100">Profil - İletişim Butonu (CTA)</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-earth-400 mb-2">Buton Üstü Açıklama</label>
              <input v-model="formData.profile.ctaDescription" type="text" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">Buton Metni</label>
              <input v-model="formData.profile.ctaText" type="text" class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white focus:border-instagram focus:outline-none" />
            </div>
          </div>
        </section>

        <!-- Save Button -->
        <div class="flex justify-end">
          <button 
            type="submit"
            :disabled="saving"
            class="px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteSettings, type SiteSettings } from '~/composables/useSiteSettings'

// SEO - noindex for admin page
useSeoMeta({
  robots: 'noindex, nofollow'
})

const { settings, fetchSettings, saveSettings } = useSiteSettings()

// Auth state
const isAuthenticated = ref(false)
const password = ref('')
const loginError = ref('')

// Form state
const saving = ref(false)

// Instagram config state
const instagramConfig = ref({
  accessToken: '',
  businessId: '',
  features: {
    showReels: true,
    showStories: true,
    showMentions: true
  }
})
const instagramTesting = ref(false)
const instagramSaving = ref(false)
const instagramTestResult = ref<{ success: boolean; message: string } | null>(null)
const saveMessage = ref('')
const saveSuccess = ref(false)

// Deep copy of settings for form
const formData = ref<SiteSettings>({
  siteName: '',
  slogan: '',
  seoDescription: '',
  contact: { phone: '', whatsapp: '', address: '', city: '', googleMapsEmbed: '', email: '' },
  social: { 
    instagram: '', facebook: '', youtube: '', tiktok: '', twitter: '', linkedin: '', pinterest: '',
    trendyol: '', hepsiburada: '', n11: '', pttavm: '', amazonTr: '', ciceksepeti: '', sahibinden: '', etsy: ''
  },
  appearance: { darkBaseColor: '#1a222d', lightBaseColor: '#f6f3ef', logoUrl: '/logo.png', primaryColor: '#8134af' },
  business: { type: 'PRODUCT', profession: '' },
  profile: {
    aboutTitle: 'Hakkımda',
    aboutText: '',
    certificatesTitle: 'Sertifikalar',
    certificates: [],
    servicesTitle: 'Hizmetlerimiz',
    services: [],
    ctaDescription: '',
    ctaText: 'WhatsApp ile İletişime Geç'
  }
})

// Check localStorage for session on mount
onMounted(async () => {
  const savedAuth = localStorage.getItem('admin_auth')
  if (savedAuth) {
    password.value = savedAuth
    isAuthenticated.value = true
    await loadSettings()
    try {
      await loadInstagramConfig()
    } catch (e) {
      console.error('Failed to load Instagram config:', e)
    }
  }
})

// Load settings from API
async function loadSettings() {
  await fetchSettings()
  // Deep copy settings to formData
  formData.value = JSON.parse(JSON.stringify(settings.value))
}

// Handle login
async function handleLogin() {
  loginError.value = ''
  
  if (!password.value) {
    loginError.value = 'Şifre giriniz'
    return
  }
  
  // Try to save with the password to verify it
  try {
    const response = await $fetch('/api/settings', {
      method: 'POST',
      headers: { 'x-admin-password': password.value },
      body: settings.value
    })
    
    // Password is correct
    localStorage.setItem('admin_auth', password.value)
    isAuthenticated.value = true
    await loadSettings()
  } catch (e: any) {
    loginError.value = 'Şifre hatalı'
  }
}

// Handle logout
function handleLogout() {
  localStorage.removeItem('admin_auth')
  isAuthenticated.value = false
  password.value = ''
}

// Handle save
async function handleSave() {
  saving.value = true
  saveMessage.value = ''
  
  const storedPassword = localStorage.getItem('admin_auth') || password.value
  const result = await saveSettings(formData.value, storedPassword)
  
  saveSuccess.value = result.success
  saveMessage.value = result.message
  saving.value = false
  
  // Clear message after 3 seconds
  setTimeout(() => {
    saveMessage.value = ''
  }, 3000)
}

// Handle Google Maps paste - extract src from iframe code
function handleMapsPaste(event: ClipboardEvent) {
  const pastedText = event.clipboardData?.getData('text') || ''
  
  // If it contains iframe, extract the src
  if (pastedText.includes('<iframe') && pastedText.includes('src="')) {
    event.preventDefault()
    const srcMatch = pastedText.match(/src="([^"]+)"/)
    if (srcMatch && srcMatch[1]) {
      formData.value.contact.googleMapsEmbed = srcMatch[1]
    }
  }
}

// Certificate management
function addCertificate() {
  formData.value.profile.certificates.push({ title: '', description: '' })
}

function removeCertificate(index: number) {
  formData.value.profile.certificates.splice(index, 1)
}

// Service management
function addService() {
  formData.value.profile.services.push({ title: '', description: '', price: '' })
}

function removeService(index: number) {
  formData.value.profile.services.splice(index, 1)
}

// Instagram config functions
async function loadInstagramConfig() {
  try {
    const config = await $fetch('/api/config') as any
    if (config) {
      const token = config.instagram?.accessToken || ''
      instagramConfig.value = {
        accessToken: config.instagram?.hasToken && token ? '****' + token.slice(-4) : '',
        businessId: config.instagram?.businessId || '',
        features: config.features || { showReels: true, showStories: true, showMentions: true }
      }
    }
  } catch (error) {
    console.error('Failed to load Instagram config:', error)
  }
}

async function testInstagramConnection() {
  if (!instagramConfig.value.businessId) {
    instagramTestResult.value = { success: false, message: 'Business Account ID gerekli' }
    return
  }
  
  // If token starts with ****, we can't test with masked token
  if (instagramConfig.value.accessToken.startsWith('****')) {
    instagramTestResult.value = { success: false, message: 'Yeni token girin test için' }
    return
  }
  
  if (!instagramConfig.value.accessToken) {
    instagramTestResult.value = { success: false, message: 'Access Token gerekli' }
    return
  }
  
  instagramTesting.value = true
  instagramTestResult.value = null
  
  try {
    const url = `https://graph.facebook.com/v18.0/${instagramConfig.value.businessId}`
    const response = await $fetch(url, {
      query: {
        fields: 'username',
        access_token: instagramConfig.value.accessToken
      }
    })
    instagramTestResult.value = { 
      success: true, 
      message: `Bağlantı başarılı: @${(response as any).username}` 
    }
  } catch (error: any) {
    instagramTestResult.value = { 
      success: false, 
      message: `Hata: ${error.message || 'Baglanti basarisiz'}` 
    }
  } finally {
    instagramTesting.value = false
  }
}

async function saveInstagramConfig() {
  instagramSaving.value = true
  instagramTestResult.value = null
  
  try {
    await $fetch('/api/config', {
      method: 'POST',
      headers: {
        'x-admin-password': password.value
      },
      body: {
        instagram: {
          accessToken: instagramConfig.value.accessToken,
          businessId: instagramConfig.value.businessId
        },
        features: instagramConfig.value.features
      }
    })
    instagramTestResult.value = { success: true, message: 'Instagram ayarlari kaydedildi' }
    
    // Reload config to get masked token
    await loadInstagramConfig()
  } catch (error: any) {
    instagramTestResult.value = { 
      success: false, 
      message: `Kaydetme hatasi: ${error.data?.message || error.message}` 
    }
  } finally {
    instagramSaving.value = false
  }
}
</script>
