<template>
  <div class="flex items-center gap-3 p-3 rounded-xl transition-colors" 
       :class="isDark ? 'bg-earth-800/50 border border-earth-700' : 'bg-gray-50 border border-gray-200'">
    
    <!-- Follower Count Badge -->
    <div class="flex items-center gap-2">
      <div class="w-10 h-10 rounded-full flex items-center justify-center"
           :class="isDark ? 'bg-instagram/20' : 'bg-purple-100'">
        <svg class="w-5 h-5" :class="isDark ? 'text-instagram' : 'text-purple-600'" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
      <div>
        <div class="text-lg font-bold" :class="isDark ? 'text-earth-100' : 'text-gray-900'">
          {{ formatNumber(followersCount) }}
        </div>
        <div class="text-xs" :class="isDark ? 'text-earth-400' : 'text-gray-500'">
          Takipçi
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="w-px h-10" :class="isDark ? 'bg-earth-700' : 'bg-gray-200'"></div>

    <!-- Account Age / Posts Badge -->
    <div class="flex items-center gap-2">
      <div class="w-10 h-10 rounded-full flex items-center justify-center"
           :class="isDark ? 'bg-green-500/20' : 'bg-green-100'">
        <svg class="w-5 h-5" :class="isDark ? 'text-green-400' : 'text-green-600'" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </div>
      <div>
        <div class="text-lg font-bold" :class="isDark ? 'text-earth-100' : 'text-gray-900'">
          {{ formatNumber(postsCount) }}
        </div>
        <div class="text-xs" :class="isDark ? 'text-earth-400' : 'text-gray-500'">
          Gönderi
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="w-px h-10" :class="isDark ? 'bg-earth-700' : 'bg-gray-200'"></div>

    <!-- Verified Badge -->
    <div class="flex items-center gap-2">
      <div class="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <div>
        <div class="text-sm font-semibold" :class="isDark ? 'text-earth-100' : 'text-gray-900'">
          Doğrulanmış
        </div>
        <div class="text-xs" :class="isDark ? 'text-earth-400' : 'text-gray-500'">
          İşletme Hesabı
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  followersCount: number
  postsCount: number
  isDark?: boolean
}>()

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>
