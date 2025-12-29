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
              <label class="block text-sm text-earth-400 mb-2">Google Maps Embed Linki</label>
              <input v-model="formData.contact.googleMapsEmbed" type="text" placeholder="https://www.google.com/maps/embed?..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-500 focus:border-instagram focus:outline-none" />
            </div>
          </div>
        </section>

        <!-- Sosyal Medya -->
        <section class="p-6 rounded-xl bg-[#080707] border border-earth-700">
          <h2 class="text-lg font-semibold mb-4 text-earth-100">Sosyal Medya</h2>
          <p class="text-sm text-earth-500 mb-4">Boş bırakılan alanlar ön yüzde gösterilmez.</p>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm text-earth-400 mb-2">📸 Instagram</label>
              <input v-model="formData.social.instagram" type="url" placeholder="https://instagram.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">📘 Facebook</label>
              <input v-model="formData.social.facebook" type="url" placeholder="https://facebook.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">▶️ YouTube</label>
              <input v-model="formData.social.youtube" type="url" placeholder="https://youtube.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">🎵 TikTok</label>
              <input v-model="formData.social.tiktok" type="url" placeholder="https://tiktok.com/@..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">🐦 Twitter / X</label>
              <input v-model="formData.social.twitter" type="url" placeholder="https://twitter.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">💼 LinkedIn</label>
              <input v-model="formData.social.linkedin" type="url" placeholder="https://linkedin.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">📌 Pinterest</label>
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
              <label class="block text-sm text-earth-400 mb-2">🛒 Trendyol</label>
              <input v-model="formData.social.trendyol" type="url" placeholder="https://trendyol.com/magaza/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">🏪 Hepsiburada</label>
              <input v-model="formData.social.hepsiburada" type="url" placeholder="https://hepsiburada.com/magaza/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">🔢 N11</label>
              <input v-model="formData.social.n11" type="url" placeholder="https://n11.com/magaza/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">📦 Amazon Türkiye</label>
              <input v-model="formData.social.amazonTr" type="url" placeholder="https://amazon.com.tr/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">🌸 Çiçeksepeti</label>
              <input v-model="formData.social.ciceksepeti" type="url" placeholder="https://ciceksepeti.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">📋 Sahibinden</label>
              <input v-model="formData.social.sahibinden" type="url" placeholder="https://sahibinden.com/..." class="w-full px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white placeholder-earth-600 focus:border-instagram focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">🎨 Etsy</label>
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
              <label class="block text-sm text-earth-400 mb-2">🌙 Koyu Tema - Ana Renk</label>
              <p class="text-xs text-earth-600 mb-2">Body arka planı. Header/footer otomatik daha koyu.</p>
              <div class="flex gap-3">
                <input v-model="formData.appearance.darkBaseColor" type="color" class="w-14 h-12 rounded-lg cursor-pointer border-0" />
                <input v-model="formData.appearance.darkBaseColor" type="text" class="flex-1 px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white font-mono focus:border-instagram focus:outline-none" />
              </div>
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">☀️ Açık Tema - Ana Renk</label>
              <p class="text-xs text-earth-600 mb-2">Body arka planı. Diğer tonlar otomatik.</p>
              <div class="flex gap-3">
                <input v-model="formData.appearance.lightBaseColor" type="color" class="w-14 h-12 rounded-lg cursor-pointer border-0" />
                <input v-model="formData.appearance.lightBaseColor" type="text" class="flex-1 px-4 py-3 rounded-lg bg-earth-800 border border-earth-600 text-white font-mono focus:border-instagram focus:outline-none" />
              </div>
            </div>
            <div>
              <label class="block text-sm text-earth-400 mb-2">🎨 Vurgu Rengi</label>
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
    trendyol: '', hepsiburada: '', n11: '', amazonTr: '', ciceksepeti: '', sahibinden: '', etsy: ''
  },
  appearance: { darkBaseColor: '#1a222d', lightBaseColor: '#f6f3ef', logoUrl: '/logo.png', primaryColor: '#8134af' },
  business: { type: 'PRODUCT', profession: '' }
})

// Check localStorage for session on mount
onMounted(async () => {
  const savedAuth = localStorage.getItem('admin_auth')
  if (savedAuth) {
    password.value = savedAuth
    isAuthenticated.value = true
    await loadSettings()
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
</script>
