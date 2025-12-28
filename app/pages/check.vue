<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800">🔧 Yönetim Paneli</h1>
        <p class="text-gray-500 text-sm">Sistem durumu, API kontrolleri ve teşhis araçları</p>
      </div>

      <!-- Quick Links -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <a href="/" class="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 transition">
          <span class="text-2xl">🏠</span>
          <h3 class="font-semibold mt-2">Ana Sayfa</h3>
          <p class="text-gray-500 text-sm">Siteyi görüntüle</p>
        </a>
        <a href="/privacy-policy" class="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 transition">
          <span class="text-2xl">📜</span>
          <h3 class="font-semibold mt-2">Gizlilik Politikası</h3>
          <p class="text-gray-500 text-sm">Meta onayı için gerekli</p>
        </a>
        <a href="/api-test" class="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 transition">
          <span class="text-2xl">🩺</span>
          <h3 class="font-semibold mt-2">API Durumu</h3>
          <p class="text-gray-500 text-sm">Token ve izin kontrolü</p>
        </a>
      </div>

      <!-- API Endpoints Section -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">📡 API Endpoint'leri</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <code class="text-sm text-blue-600">/api/instagram/profile</code>
              <p class="text-xs text-gray-500">Profil bilgileri (takipçi, gönderi sayısı)</p>
            </div>
            <a href="/api/instagram/profile" target="_blank" class="text-blue-500 text-sm hover:underline">Test →</a>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <code class="text-sm text-blue-600">/api/instagram</code>
              <p class="text-xs text-gray-500">Tüm postlar (feed)</p>
            </div>
            <a href="/api/instagram" target="_blank" class="text-blue-500 text-sm hover:underline">Test →</a>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <code class="text-sm text-blue-600">/api/health-check</code>
              <p class="text-xs text-gray-500">Kapsamlı API sağlık kontrolü</p>
            </div>
            <a href="/api/health-check" target="_blank" class="text-blue-500 text-sm hover:underline">Test →</a>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <code class="text-sm text-blue-600">/api/cache/status</code>
              <p class="text-xs text-gray-500">Cache durumu</p>
            </div>
            <a href="/api/cache/status" target="_blank" class="text-blue-500 text-sm hover:underline">Test →</a>
          </div>
        </div>
      </div>

      <!-- Debug Tools Section -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">🔍 Teşhis Araçları</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200">
            <div>
              <code class="text-sm text-yellow-700">/api/debug/find-accounts</code>
              <p class="text-xs text-gray-600">Facebook Sayfaları ve Instagram bağlantılarını keşfet</p>
            </div>
            <a href="/api/debug/find-accounts" target="_blank" class="text-yellow-600 text-sm hover:underline font-medium">Çalıştır →</a>
          </div>
        </div>
      </div>

      <!-- Find Accounts Result -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold mb-4">📋 Facebook Sayfa Keşfi</h2>
        
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
          <p class="mt-2 text-gray-500 text-sm">Hesaplar aranıyor...</p>
        </div>

        <div v-else-if="findError" class="bg-red-50 border border-red-200 rounded p-4">
          <p class="text-red-700 font-medium">{{ findError }}</p>
          <p v-if="findSuggestion" class="text-red-600 text-sm mt-1">{{ findSuggestion }}</p>
        </div>

        <div v-else>
          <!-- Token Info -->
          <div v-if="tokenInfo" class="mb-4 p-3 bg-blue-50 rounded text-sm">
            <p><strong>Token Türü:</strong> {{ tokenInfo.type }}</p>
            <p><strong>Geçerli:</strong> {{ tokenInfo.isValid ? '✅ Evet' : '❌ Hayır' }}</p>
            <p><strong>Bitiş:</strong> {{ tokenInfo.expiresAt }}</p>
            <p><strong>İzinler:</strong> {{ tokenInfo.scopes?.join(', ') || '-' }}</p>
          </div>

          <!-- Accounts Table -->
          <table v-if="accounts.length" class="w-full text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="text-left px-3 py-2">Sayfa Adı</th>
                <th class="text-left px-3 py-2">Facebook ID</th>
                <th class="text-left px-3 py-2">Instagram ID</th>
                <th class="text-left px-3 py-2">Durum</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="acc in accounts" :key="acc.facebookPageId" class="border-t">
                <td class="px-3 py-2 font-medium">{{ acc.sayfaAdi }}</td>
                <td class="px-3 py-2 font-mono text-xs">{{ acc.facebookPageId }}</td>
                <td class="px-3 py-2 font-mono text-xs">{{ acc.instagramBusinessId }}</td>
                <td class="px-3 py-2">{{ acc.durum }}</td>
              </tr>
            </tbody>
          </table>

          <p v-else class="text-gray-500 text-center py-4">Hesap bulunamadı</p>
        </div>

        <button 
          @click="findAccounts" 
          :disabled="loading"
          class="mt-4 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Yeniden Tara
        </button>
      </div>

      <!-- Footer -->
      <p class="text-xs text-gray-400 mt-8 text-center">
        Bu sayfa gizlidir. Sadece yöneticiler erişebilir.
      </p>
    </div>
  </div>
</template>

<script setup>
// Hidden page - no SEO
useSeoMeta({
  robots: 'noindex, nofollow'
})

const loading = ref(true)
const findError = ref(null)
const findSuggestion = ref(null)
const tokenInfo = ref(null)
const accounts = ref([])

async function findAccounts() {
  loading.value = true
  findError.value = null
  findSuggestion.value = null
  
  try {
    const response = await $fetch('/api/debug/find-accounts')
    
    if (response.error) {
      findError.value = response.error
      findSuggestion.value = response.suggestion
    }
    
    tokenInfo.value = response.tokenInfo
    accounts.value = response.accounts || []
  } catch (e) {
    findError.value = e.message || 'API çağrısı başarısız'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  findAccounts()
})
</script>
