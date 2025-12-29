<template>
  <Head>
    <Title>{{ settings.siteName || profile?.name || profile?.username || 'Bumudurbu' }}</Title>
    <Meta name="description" :content="settings.seoDescription || 'Instagram Vitrini'" />
    <Link rel="preconnect" href="https://fonts.googleapis.com" />
    <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <Link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
    <Link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    <!-- Auto-generated color palette from single base colors -->
    <Style v-html="dynamicStyles"></Style>
  </Head>
  
  <!-- Global JSON-LD Schema with dynamic sameAs from settings -->
  <component :is="'script'" type="application/ld+json" v-html="organizationSchema"></component>
  
  <NuxtPage />
</template>

<script setup>
import { useSiteSettings } from '~/composables/useSiteSettings'
import { generateCssVariables } from '~/composables/useColorPalette'

const { data: profile } = await useFetch('/api/instagram/profile')
const { settings, fetchSettings, getSameAsUrls } = useSiteSettings()

// Fetch settings on app init
await fetchSettings()

// Generate CSS variables from base colors
const dynamicStyles = computed(() => {
  const darkBase = settings.value.appearance?.darkBaseColor || '#1a222d'
  const lightBase = settings.value.appearance?.lightBaseColor || '#f6f3ef'
  return generateCssVariables(darkBase, lightBase)
})

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
