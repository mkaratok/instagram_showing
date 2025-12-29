<template>
  <Head>
    <Title>{{ settings.siteName || profile?.name || profile?.username || 'Bumudurbu' }}</Title>
    <Meta name="description" :content="settings.seoDescription || 'Instagram Vitrini'" />
    <Link rel="preconnect" href="https://fonts.googleapis.com" />
    <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <Link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
    <Link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    <!-- Dynamic colors from admin settings -->
    <Style>
      :root {
        --primary-color: {{ settings.appearance?.primaryColor || '#8134af' }};
        --header-bg-dark: {{ settings.appearance?.darkMode?.headerBg || '#080707' }};
        --body-bg-dark: {{ settings.appearance?.darkMode?.bodyBg || '#1a222d' }};
      }
      html, body { background-color: {{ settings.appearance?.darkMode?.bodyBg || '#1a222d' }}; }
      html.light, html.light body { background-color: #f6f3ef; }
    </Style>
  </Head>
  
  <!-- Global JSON-LD Schema with dynamic sameAs from settings -->
  <script type="application/ld+json" v-html="organizationSchema"></script>
  
  <NuxtPage />
</template>

<script setup>
import { useSiteSettings } from '~/composables/useSiteSettings'

const { data: profile } = await useFetch('/api/instagram/profile')
const { settings, fetchSettings, getSameAsUrls } = useSiteSettings()

// Fetch settings on app init
await fetchSettings()

// Generate Organization schema with all social links
const organizationSchema = computed(() => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://bumudurbu.com'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.value.siteName,
    url: siteUrl,
    logo: `${siteUrl}${settings.value.appearance?.logoUrl || '/logo.png'}`,
    description: settings.value.seoDescription,
    telephone: settings.value.contact?.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.value.contact?.address,
      addressLocality: settings.value.contact?.city,
      addressCountry: 'TR'
    },
    // All social links from settings for GEO optimization
    sameAs: getSameAsUrls()
  }
  
  return JSON.stringify(schema)
})
</script>
