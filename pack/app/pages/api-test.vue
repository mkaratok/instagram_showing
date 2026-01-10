<template>
  <div class="min-h-screen bg-white p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Instagram API Durum Kontrolü</h1>
      <p class="text-gray-500 text-sm mb-6">Bu sayfa gizlidir. API bağlantılarını test eder.</p>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
        <p class="mt-4 text-gray-600">Kontrol ediliyor...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-700">Hata oluştu: {{ error }}</p>
      </div>

      <!-- Results Table -->
      <div v-else class="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
        <table class="w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700">Kontrol Noktası</th>
              <th class="text-center px-4 py-3 text-sm font-semibold text-gray-700 w-20">Durum</th>
              <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700">Detay / Hata Mesajı</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(check, index) in results" 
              :key="index"
              class="border-t border-gray-200"
            >
              <td class="px-4 py-3 text-sm text-gray-800 font-medium">{{ check.name }}</td>
              <td class="px-4 py-3 text-center">
                <span v-if="check.status === 'ok'" class="text-green-500 text-xl">✅</span>
                <span v-else-if="check.status === 'warning'" class="text-yellow-500 text-xl">⚠️</span>
                <span v-else class="text-red-500 text-xl">❌</span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ check.detail }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Timestamp -->
      <p v-if="timestamp" class="text-xs text-gray-400 mt-4 text-right">
        Son kontrol: {{ timestamp }}
      </p>

      <!-- Refresh Button -->
      <button 
        @click="runCheck" 
        :disabled="loading"
        class="mt-6 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
      >
        Yeniden Kontrol Et
      </button>
    </div>
  </div>
</template>

<script setup>
// Hidden page - no SEO
useSeoMeta({
  robots: 'noindex, nofollow'
})

const loading = ref(true)
const error = ref(null)
const results = ref([])
const timestamp = ref('')

async function runCheck() {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch('/api/health-check')
    results.value = response.results
    timestamp.value = new Date(response.timestamp).toLocaleString('tr-TR')
  } catch (e) {
    error.value = e.message || 'API çağrısı başarısız'
  } finally {
    loading.value = false
  }
}

// Run check on mount
onMounted(() => {
  runCheck()
})
</script>
