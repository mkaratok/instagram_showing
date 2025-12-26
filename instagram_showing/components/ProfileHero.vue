<template>
  <header class="relative w-full max-w-5xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center text-center z-10">
    
    <!-- Profile Image with Animated Ring -->
    <div class="relative group cursor-pointer mb-8">
      <!-- Animated Gradient Ring -->
      <div class="absolute -inset-1 rounded-full bg-gradient-to-tr from-rose-500 via-fuchsia-500 to-indigo-500 opacity-75 group-hover:opacity-100 blur transition-opacity duration-500 animate-pulse-slow"></div>
      
      <div class="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-neutral-950">
        <NuxtImg
          v-if="profile?.profile_picture_url"
          :src="profile.profile_picture_url"
          :alt="profile.username"
          class="w-full h-full rounded-full object-cover border-2 border-neutral-800 group-hover:border-transparent transition-colors duration-300"
          placeholder
        />
        <div v-else class="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500">
          <Icon name="heroicons:user" class="w-12 h-12" />
        </div>
      </div>
      
      <!-- Username Badge -->
      <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-neutral-900/80 backdrop-blur-md border border-white/10 px-4 py-1 rounded-full text-sm font-semibold text-white shadow-xl whitespace-nowrap">
        @{{ profile?.username }}
      </div>
    </div>

    <!-- Stats Row -->
    <div class="flex items-center gap-8 md:gap-16 mb-8 text-neutral-300">
      <div class="flex flex-col items-center group">
        <span class="text-2xl font-bold text-white group-hover:text-rose-500 transition-colors">{{ profile?.media_count || 0 }}</span>
        <span class="text-xs uppercase tracking-widest opacity-60">Gönderi</span>
      </div>
      <div class="flex flex-col items-center group">
        <span class="text-2xl font-bold text-white group-hover:text-fuchsia-500 transition-colors">{{ profile?.followers_count || '23K' }}</span> <!-- Fallback or API field -->
        <span class="text-xs uppercase tracking-widest opacity-60">Takipçi</span>
      </div>
      <div class="flex flex-col items-center group">
        <span class="text-2xl font-bold text-white group-hover:text-indigo-500 transition-colors">{{ profile?.follows_count || '412' }}</span>
        <span class="text-xs uppercase tracking-widest opacity-60">Takip</span>
      </div>
    </div>

    <!-- Bio Section -->
    <div class="max-w-xl mx-auto mb-8 space-y-4">
      <h1 class="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
        {{ profile?.username }}
      </h1>
      <p class="text-neutral-400 leading-relaxed text-sm md:text-base whitespace-pre-line">
        {{ profile?.biography || 'Yoga Eğitmeni & Wellness Koçu.\nDoğa ile iç içe, ruhunuzu dinlendirin.' }}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap items-center justify-center gap-4">
      <a 
        :href="`https://ig.me/m/${profile?.username}`" 
        target="_blank"
        class="group relative inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
      >
        <span class="absolute inset-0 bg-gradient-to-r from-rose-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity"></span>
        <Icon name="uil:message" class="w-5 h-5 relative z-10" />
        <span class="relative z-10">Mesaj At</span>
      </a>

      <a 
        v-if="profile?.website" 
        :href="profile.website" 
        target="_blank"
        class="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-all hover:scale-105 active:scale-95"
      >
        <Icon name="heroicons:link" class="w-5 h-5" />
        <span>Website</span>
      </a>
    </div>

    <!-- Stories Placeholder -->
    <div class="mt-12 w-full max-w-3xl overflow-x-auto no-scrollbar py-4 border-t border-white/5">
      <div class="flex gap-6 justify-center min-w-max px-4">
        <div v-for="i in 5" :key="i" class="flex flex-col items-center gap-2 cursor-pointer group">
          <div class="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-neutral-700 to-neutral-800 group-hover:from-rose-500 group-hover:to-indigo-500 transition-colors duration-300">
             <div class="w-full h-full rounded-full bg-neutral-900 border-2 border-black flex items-center justify-center overflow-hidden">
                <Icon name="heroicons:sparkles" class="w-6 h-6 text-neutral-600 group-hover:text-white transition-colors" />
             </div>
          </div>
          <span class="text-[10px] text-neutral-500 group-hover:text-neutral-300 uppercase tracking-wide">Story {{i}}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { InstagramProfile } from '~/types'

defineProps<{
  profile: InstagramProfile
}>()
</script>
