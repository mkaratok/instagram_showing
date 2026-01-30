<template>
  <div class="min-h-screen bg-background-light dark:bg-earth-900 text-text-light dark:text-earth-100 font-sans">
    
    <!-- Local SEO Header -->
    <header class="py-12 px-4 text-center border-b border-subtle-light dark:border-earth-800">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">
        {{ locationName }} Yoga & Wellness
      </h1>
      <p class="text-subtle-light dark:text-earth-400 max-w-2xl mx-auto">
        {{ locationDescription }}
      </p>
    </header>

    <!-- Main Content - Reuse Instagram Feed -->
    <main class="max-w-6xl mx-auto py-8">
      <div class="text-center mb-8">
        <h2 class="text-xl font-semibold mb-2">Son Paylaşımlarımız</h2>
        <p class="text-sm text-subtle-light dark:text-earth-500">Instagram'dan en güncel içerikler</p>
      </div>
      
      <FeedGrid v-if="posts?.length" :posts="posts" @open="openModal" />
      
      <div v-else class="text-center py-20 text-earth-500">
        Yükleniyor...
      </div>
    </main>

    <!-- Local Business Info -->
    <section class="bg-earth-800 text-earth-100 py-12 px-4">
      <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">{{ locationName }} Şubemiz</h3>
          <div class="space-y-3 text-sm">
            <p class="flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">location_on</span>
              {{ config.public.businessAddress }}
            </p>
            <p class="flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">call</span>
              {{ config.public.businessPhone }}
            </p>
          </div>
        </div>
        <div class="h-48 bg-earth-700 rounded-lg overflow-hidden">
          <iframe 
            class="w-full h-full border-0"
            :src="mapEmbedUrl"
            loading="lazy"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <!-- PostModal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedPost" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click="selectedPost = null">
          <PostModal :post="selectedPost" :profile="profile" @close="selectedPost = null" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()

// Get location from URL param
const ilce = route.params.ilce

// Location data mapping
const locations = {
  altinordu: { name: 'Altınordu', description: 'Ordu Altınordu ilçesinde yoga ve wellness hizmetleri.' },
  fatsa: { name: 'Fatsa', description: 'Ordu Fatsa ilçesinde yoga ve wellness hizmetleri.' },
  unye: { name: 'Ünye', description: 'Ordu Ünye ilçesinde yoga ve wellness hizmetleri.' },
  persembe: { name: 'Perşembe', description: 'Ordu Perşembe ilçesinde yoga ve wellness hizmetleri.' },
  ulubey: { name: 'Ulubey', description: 'Ordu Ulubey ilçesinde yoga ve wellness hizmetleri.' }
}

const locationData = locations[ilce] || { name: 'Ordu', description: 'Ordu bölgesinde yoga ve wellness hizmetleri.' }
const locationName = `Ordu ${locationData.name}`
const locationDescription = locationData.description

// Map embed URL
const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.5!2d${config.public.businessLongitude}!3d${config.public.businessLatitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zT3JkdQ!5e0!3m2!1str!2str`

// Fetch data
const { data: instagramData } = await useFetch('/api/instagram')
const { data: profile } = await useFetch('/api/instagram/profile')

const posts = computed(() => instagramData.value?.data || [])

// Modal state
const selectedPost = ref(null)

const openModal = (post) => {
  selectedPost.value = post
}

// Dynamic SEO Meta
useSeoMeta({
  title: `${locationName} Yoga Stüdyosu | arzuozen`,
  description: locationDescription,
  ogTitle: `${locationName} Yoga Stüdyosu`,
  ogDescription: locationDescription,
  ogType: 'website'
})

// Schema.org for Local Business
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: `arzuozen - ${locationName}`,
        description: locationDescription,
        address: {
          '@type': 'PostalAddress',
          streetAddress: config.public.businessAddress,
          addressLocality: locationData.name,
          addressRegion: 'Ordu',
          addressCountry: 'TR'
        },
        telephone: config.public.businessPhone,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: config.public.businessLatitude,
          longitude: config.public.businessLongitude
        },
        sameAs: [config.public.instagramUrl, config.public.facebookUrl]
      })
    }
  ]
})
</script>
