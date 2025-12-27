<template>
  <div class="min-h-screen bg-white text-gray-800">
    <!-- Header -->
    <header class="border-b border-gray-200 py-4 px-6">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        <span>Ana Sayfaya Dön</span>
      </NuxtLink>
    </header>

    <!-- Content -->
    <main class="max-w-3xl mx-auto px-6 py-12">
      <article class="prose prose-gray max-w-none">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Gizlilik Politikası</h1>
        <p class="text-gray-500 mb-8">Son Güncelleme: {{ lastUpdate }}</p>

        <h2 class="text-xl font-semibold mt-8 mb-4">1. Giriş</h2>
        <p>{{ siteName }} ("biz", "bizim"), gizliliğinize saygı duyar. Bu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde veya Instagram entegrasyonumuzu kullandığınızda bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.</p>

        <h2 class="text-xl font-semibold mt-8 mb-4">2. Topladığımız Bilgiler</h2>
        <p>Instagram Graph API aracılığıyla yalnızca halka açık veya izin verdiğiniz şu verileri işleriz:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Instagram Kullanıcı Adı ve Profil Resmi</li>
          <li>Paylaşılan Medyalar (Fotoğraf, Video) ve Açıklamalar (Captions)</li>
          <li>Gönderi Tarihleri ve Kalıcı Bağlantılar (Permalinks)</li>
        </ul>
        <p class="mt-4"><strong>Şifrelerinizi, kredi kartı bilgilerinizi veya özel mesajlarınızı (DM) asla kaydetmeyiz ve bunlara erişemeyiz.</strong></p>

        <h2 class="text-xl font-semibold mt-8 mb-4">3. Verilerin Kullanımı</h2>
        <p>Topladığımız verileri şu amaçlarla kullanırız:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>İçeriklerinizi web sitemizde vitrin (galeri) olarak sergilemek.</li>
          <li>Size özel teklifler sunmak (sadece izin verirseniz).</li>
          <li>Hizmet kalitemizi artırmak ve istatistiksel analiz yapmak.</li>
        </ul>

        <h2 class="text-xl font-semibold mt-8 mb-4">4. Veri Saklama ve Silme (Data Deletion)</h2>
        <p>Meta Platform Kuralları gereği, verileriniz üzerinde tam kontrol hakkına sahipsiniz.</p>
        <p class="mt-4">
          Eğer verilerinizin sistemimizden tamamen silinmesini istiyorsanız, lütfen 
          <a :href="`mailto:${contactEmail}?subject=Veri Silme Talebi`" class="text-blue-600 hover:underline">{{ contactEmail }}</a> 
          adresine <strong>"Veri Silme Talebi"</strong> başlıklı bir e-posta gönderin. 
          Talebiniz 24 saat içinde işleme alınacak ve tüm verileriniz sunucularımızdan kalıcı olarak silinecektir.
        </p>

        <h2 class="text-xl font-semibold mt-8 mb-4">5. Üçüncü Taraf Hizmetler</h2>
        <p>Bu site, verileri işlemek için Meta (Instagram) altyapısını kullanır. Instagram'ın kendi gizlilik politikasını incelemenizi öneririz:</p>
        <ul class="list-disc pl-6">
          <li><a href="https://www.instagram.com/legal/privacy/" target="_blank" class="text-blue-600 hover:underline">Instagram Gizlilik Politikası</a></li>
          <li><a href="https://www.facebook.com/policy.php" target="_blank" class="text-blue-600 hover:underline">Meta Gizlilik Politikası</a></li>
        </ul>

        <h2 class="text-xl font-semibold mt-8 mb-4">6. Çerezler (Cookies)</h2>
        <p>Web sitemiz, deneyiminizi geliştirmek ve analiz yapmak için çerezler kullanabilir. Çerezleri tarayıcınızdan devre dışı bırakabilirsiniz, ancak bu bazı özelliklerin çalışmamasına neden olabilir.</p>

        <h2 class="text-xl font-semibold mt-8 mb-4">7. İletişim</h2>
        <p>Gizlilik politikamızla ilgili sorularınız için bizimle iletişime geçin:</p>
        <p class="mt-2">
          <a :href="`mailto:${contactEmail}`" class="text-blue-600 hover:underline">{{ contactEmail }}</a>
        </p>
      </article>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 py-6 px-6 text-center text-gray-500 text-sm">
      <p>© {{ new Date().getFullYear() }} {{ siteName }}. Tüm hakları saklıdır.</p>
    </footer>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()

const siteName = config.public.businessName || 'Bumudurbu'
const contactEmail = 'info@bumudurbu.com'
const lastUpdate = new Date().toLocaleDateString('tr-TR')

// SEO - noindex for this page
useSeoMeta({
  title: `Gizlilik Politikası | ${siteName}`,
  robots: 'noindex, nofollow'
})

useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.prose h2 {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}
</style>
