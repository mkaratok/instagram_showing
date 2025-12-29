<template>
  <!-- Main Container with semantic structure -->
  <article 
    class="min-h-screen bg-background-light dark:bg-[#1a222d] flex items-center justify-center p-4" 
    itemscope 
    :itemtype="schemaType"
    @click="goHome"
  >
    
    <div v-if="post" class="relative flex flex-col md:flex-row w-full max-w-5xl h-auto max-h-[90vh] bg-background-light dark:bg-[#080707] rounded-xl shadow-2xl overflow-hidden font-display" @click.stop>
      
      <!-- Close Button -->
      <button @click="goHome" class="absolute top-4 right-4 z-10 text-text-light-primary dark:text-text-dark-primary hover:text-primary dark:hover:text-primary transition-colors bg-white/20 backdrop-blur-sm rounded-full p-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Image Container with semantic markup -->
      <figure class="w-full md:w-1/2 flex items-center justify-center bg-stone-200 dark:bg-stone-800 relative">
        <img 
          v-if="post.media_type !== 'VIDEO'" 
          :src="post.media_url" 
          :alt="enhancedContent?.aiTitle || post.caption?.slice(0, 100)" 
          itemprop="image"
          class="w-full h-full object-cover" 
        />
        <video 
          v-else 
          :src="post.media_url" 
          :poster="post.thumbnail_url" 
          controls 
          autoplay 
          class="w-full h-full object-cover"
        ></video>
      </figure>

      <!-- Content Container with semantic HTML -->
      <div class="w-full md:w-1/2 flex flex-col p-6 bg-background-light dark:bg-[#080707] overflow-y-auto">
        
        <!-- Profile Info Header -->
        <header class="flex items-center gap-4 border-b border-stone-200 dark:border-earth-700 pb-4 mb-4">
          <div 
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-stone-200 dark:border-earth-700" 
            :style="{ backgroundImage: `url('${profile?.profile_picture_url || '/default-avatar.png' }')` }"
          ></div>
          <div class="flex-1">
            <div class="text-base font-bold text-text-light-primary dark:text-white" itemprop="author" itemscope itemtype="https://schema.org/Person">
              <span itemprop="name">{{ post?.username || profile?.username || 'Instagram User' }}</span>
            </div>
            <time 
              :datetime="post.timestamp" 
              itemprop="datePublished"
              class="text-xs text-earth-500"
            >
              {{ formatDate(post.timestamp) }}
            </time>
          </div>
        </header>

        <!-- AI-Friendly Title -->
        <h1 
          v-if="enhancedContent?.aiTitle" 
          itemprop="headline"
          class="text-xl font-bold text-text-light-primary dark:text-white mb-4 leading-tight"
        >
          {{ enhancedContent.aiTitle }}
        </h1>

        <!-- Structured Content with Semantic Paragraphs -->
        <section class="flex-grow overflow-y-auto pr-2 custom-scrollbar mb-4" itemprop="articleBody">
          <template v-if="enhancedContent?.paragraphs?.length">
            <p 
              v-for="(paragraph, idx) in enhancedContent.paragraphs" 
              :key="idx"
              class="mb-3 text-text-light-primary dark:text-earth-200 text-sm leading-relaxed"
              :class="{ 'font-semibold': paragraph.importance === 'high' }"
            >
              <strong v-if="paragraph.type === 'price'" class="text-instagram">{{ paragraph.text }}</strong>
              <strong v-else-if="paragraph.type === 'contact'" class="text-green-500">{{ paragraph.text }}</strong>
              <span v-else>{{ paragraph.text }}</span>
            </p>
          </template>
          <p v-else class="text-text-light-primary dark:text-earth-200 text-sm leading-relaxed whitespace-pre-wrap">
            {{ post.caption }}
          </p>
        </section>

        <!-- FAQ Section (if available) -->
        <section 
          v-if="enhancedContent?.faq?.length" 
          class="mb-4 p-4 rounded-lg border"
          :class="isDark ? 'bg-earth-800/50 border-earth-700' : 'bg-gray-50 border-gray-200'"
          itemscope 
          itemtype="https://schema.org/FAQPage"
        >
          <h3 class="text-sm font-bold mb-3" :class="isDark ? 'text-earth-100' : 'text-gray-800'">
            Sık Sorulan Sorular
          </h3>
          <div 
            v-for="(item, idx) in enhancedContent.faq" 
            :key="idx"
            class="mb-2"
            itemscope 
            itemprop="mainEntity" 
            itemtype="https://schema.org/Question"
          >
            <dt class="font-medium text-sm" :class="isDark ? 'text-earth-200' : 'text-gray-700'" itemprop="name">
              {{ item.question }}
            </dt>
            <dd 
              class="text-xs mt-1 pl-3"
              :class="isDark ? 'text-earth-400' : 'text-gray-500'"
              itemscope 
              itemprop="acceptedAnswer" 
              itemtype="https://schema.org/Answer"
            >
              <span itemprop="text">{{ item.answer }}</span>
            </dd>
          </div>
        </section>

        <!-- Engagement Stats -->
        <div class="flex gap-6 py-3 border-y mb-4" :class="isDark ? 'border-earth-700' : 'border-gray-200'">
          <span class="flex items-center gap-2 text-sm" :class="isDark ? 'text-earth-300' : 'text-gray-600'">
            <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/>
            </svg>
            <span itemprop="interactionStatistic" itemscope itemtype="https://schema.org/InteractionCounter">
              <meta itemprop="interactionType" content="https://schema.org/LikeAction"/>
              <span itemprop="userInteractionCount">{{ post.like_count || 0 }}</span>
            </span>
            Beğeni
          </span>
          <span class="flex items-center gap-2 text-sm" :class="isDark ? 'text-earth-300' : 'text-gray-600'">
            <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clip-rule="evenodd"/>
            </svg>
            <span>{{ post.comments_count || 0 }}</span>
            Yorum
          </span>
        </div>

        <!-- Trust Badge -->
        <TrustBadge 
          v-if="profile" 
          :followers-count="profile.followers_count || 0"
          :posts-count="profile.media_count || 0"
          :is-dark="isDark"
          class="mb-4"
        />

        <!-- Keywords/Hashtags -->
        <div v-if="enhancedContent?.entities?.hashtags?.length" class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="tag in enhancedContent.entities.hashtags.slice(0, 8)" 
            :key="tag"
            class="text-xs px-2 py-1 rounded-full"
            :class="isDark ? 'bg-instagram/20 text-instagram' : 'bg-purple-100 text-purple-600'"
            itemprop="keywords"
          >
            {{ tag }}
          </span>
        </div>
        
        <!-- CTA Button -->
        <a 
          :href="post.permalink" 
          target="_blank" 
          rel="noopener"
          itemprop="url"
          class="block w-full text-center bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          Instagram'da Gör
        </a>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="!error" class="text-earth-400 animate-pulse">
      Yükleniyor...
    </div>

    <!-- Error State -->
    <div v-else class="text-red-400 text-center">
      <p>Gönderi bulunamadı.</p>
      <button @click="goHome" class="mt-4 text-earth-300 hover:text-white underline">Ana Sayfaya Dön</button>
    </div>

  </article>
</template>

<script setup lang="ts">
import { enhanceContentForGeo, type GeoEnhancedContent } from '../../server/utils/geoContentEnhancer'

const route = useRoute()
const router = useRouter()
const { isDark } = useTheme()

const { data: post, error } = await useFetch(`/api/instagram/post/${route.params.id}`)
const { data: profile } = await useFetch('/api/instagram/profile')

// Enhance content for GEO
const enhancedContent = computed<GeoEnhancedContent | null>(() => {
  if (!post.value?.caption) return null
  return enhanceContentForGeo(post.value.caption)
})

// Determine schema type
const schemaType = computed(() => {
  const type = enhancedContent.value?.recommendedSchema || 'Article'
  const schemaMap: Record<string, string> = {
    'Product': 'https://schema.org/Product',
    'Service': 'https://schema.org/Service',
    'Article': 'https://schema.org/Article'
  }
  return schemaMap[type] || 'https://schema.org/Article'
})

const goHome = () => {
  router.push('/')
}

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('tr-TR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// SEO Meta Tags with enhanced content
useSeoMeta({
  title: () => enhancedContent.value?.aiTitle 
    ? `${enhancedContent.value.aiTitle} - ${profile.value?.username || 'Bumudurbu'}`
    : post.value?.caption?.slice(0, 60) + '... - Bumudurbu',
  description: () => post.value?.caption?.slice(0, 160) || 'Instagram Gönderisi',
  ogTitle: () => enhancedContent.value?.aiTitle || post.value?.caption?.slice(0, 60),
  ogDescription: () => post.value?.caption?.slice(0, 200),
  ogImage: () => post.value?.media_url,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  articlePublishedTime: () => post.value?.timestamp,
  articleAuthor: () => profile.value?.username || 'Bumudurbu'
})

// Add JSON-LD Schema using useHead
const { getPostSchema, getOrganizationSchema, getFaqSchema } = useGeoSchema()

useHead(() => {
  if (!post.value) return {}
  
  const schemas = [
    getOrganizationSchema(),
    getPostSchema({
      post: post.value,
      enhanced: enhancedContent.value || undefined,
      profile: profile.value
    })
  ]
  
  // Add FAQ schema if available
  if (enhancedContent.value?.faq?.length) {
    const faqSchema = getFaqSchema(enhancedContent.value)
    if (faqSchema) schemas.push(faqSchema)
  }
  
  return {
    script: schemas.map(schema => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schema)
    }))
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #8A8178;
  border-radius: 4px;
}
</style>
