<template>
  <div class="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
    <div class="layout-container flex h-full grow flex-col">
      <div class="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
        <div class="layout-content-container flex flex-col w-full max-w-7xl flex-1">
          <!-- Header -->
          <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-subtle-light dark:border-subtle-dark px-2 sm:px-6 py-4 mb-6">
            <NuxtLink to="/" class="flex items-center gap-3 text-foreground dark:text-foreground-dark">
              <div class="relative size-10">
                <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 animate-spin-slow"></div>
                <div class="absolute inset-[2px] rounded-full bg-background-light dark:bg-background-dark"></div>
                <img v-if="profile?.profile_picture_url" :src="profile.profile_picture_url" :alt="profile.username" class="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full object-cover" />
                <div v-else class="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full bg-gray-300 dark:bg-gray-700"></div>
              </div>
            </NuxtLink>
            <nav class="hidden md:flex flex-1 justify-end gap-8">
              <div class="flex items-center gap-9">
                <a class="text-sm font-medium hover:text-primary transition-colors" href="/profile">Profil</a>
                <a class="text-sm font-medium hover:text-primary transition-colors" href="/contact">İletişim</a>
              </div>
            </nav>
            <button class="md:hidden p-2">
              <span class="material-symbols-outlined text-foreground dark:text-foreground-dark">menu</span>
            </button>
          </header>
          <!-- Main Content -->
          <main class="px-2 sm:px-4 flex-1">
            <div class="flex flex-col gap-12 lg:gap-20">
              <div class="text-center px-4">
                <h1 class="text-4xl sm:text-5xl font-bold tracking-tighter text-foreground dark:text-foreground-dark">Profilim</h1>
                <p class="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-subtle-light dark:text-subtle-dark">Arzu Özen Yoga Stüdyosu hakkında daha fazla bilgi.</p>
              </div>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                <div class="space-y-6">
                  <h2 class="text-2xl font-bold tracking-tight">Kişisel Bilgiler</h2>
                  <p class="text-text-light dark:text-text-dark">Buraya kişisel bilgiler, eğitim geçmişi ve yoga yolculuğu eklenebilir.</p>
                </div>
                <div class="space-y-6">
                  <h2 class="text-2xl font-bold tracking-tight">Sertifikalar</h2>
                  <p class="text-text-light dark:text-text-dark">Yoga eğitmenliği sertifikaları ve diğer ilgili belgeler burada listelenebilir.</p>
                </div>
              </div>
            </div>
          </main>
<!-- Contact Section -->
<section class="px-2 sm:px-4 py-12 bg-background-light dark:bg-background-dark">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-8 text-foreground dark:text-foreground-dark">İletişim</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Social Media -->
      <div class="flex flex-col items-center space-y-4">
        <p class="text-center text-subtle-light dark:text-subtle-dark">Bizi sosyal medyada takip edin</p>
        <div class="flex space-x-4">
          <a href="#" class="text-2xl hover:text-primary transition-colors" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M22.675 0h-21.35C.595 0 0 .593 0 1.326v21.348C0 23.406.595 24 1.326 24h11.495v-9.294H9.691V11.01h3.13V8.413c0-3.1 1.894-4.788 4.658-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.31h3.587l-.467 3.696h-3.12V24h6.116c.73 0 1.325-.594 1.325-1.326V1.326C24 .593 23.405 0 22.675 0z"/></svg>
          </a>
          <a href="#" class="text-2xl hover:text-primary transition-colors" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.428.403a4.92 4.92 0 011.71 1.01 4.92 4.92 0 011.01 1.71c.163.458.349 1.258.403 2.428.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.428a4.92 4.92 0 01-1.01 1.71 4.92 4.92 0 01-1.71 1.01c-.458.163-1.258.349-2.428.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.428-.403a4.92 4.92 0 01-1.71-1.01 4.92 4.92 0 01-1.01-1.71c-.163-.458-.349-1.258-.403-2.428-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.428a4.92 4.92 0 011.01-1.71 4.92 4.92 0 011.71-1.01c.458-.163 1.258-.349 2.428-.403 1.266-.058 1.646-.07 4.85-.07zm0-2.163C8.735 0 8.332.012 7.052.07 5.777.127 4.822.332 4.07.66c-.78.34-1.44.795-2.1 1.456C1.31 2.777.855 3.437.515 4.217c-.328.752-.533 1.707-.59 2.982C-.012 8.332 0 8.735 0 12c0 3.265.012 3.668.07 4.948.057 1.275.262 2.23.59 2.982.34.78.795 1.44 1.456 2.1.66.66 1.32 1.115 2.1 1.456.752.328 1.707.533 2.982.59C8.332 23.988 8.735 24 12 24s3.668-.012 4.948-.07c1.275-.057 2.23-.262 2.982-.59.78-.34 1.44-.795 2.1-1.456.66-.66 1.115-1.32 1.456-2.1.328-.752.533-1.707.59-2.982.058-1.28.07-1.683.07-4.948s-.012-3.668-.07-4.948c-.057-1.275-.262-2.23-.59-2.982a4.92 4.92 0 00-1.456-2.1 4.92 4.92 0 00-2.1-1.456c-.752-.328-1.707-.533-2.982-.59C15.668.012 15.265 0 12 0z"/><path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>
          </a>
          <a href="#" class="text-2xl hover:text-primary transition-colors" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.608 1.794-1.574 2.163-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.087-.205-7.713-2.165-10.141-5.144-.424.724-.666 1.562-.666 2.457 0 1.697.862 3.197 2.173 4.077-.8-.026-1.555-.245-2.21-.614v.062c0 2.376 1.693 4.356 3.946 4.803-.413.112-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.376 4.6 3.416-1.68 1.319-3.809 2.107-6.102 2.107-.395 0-.779-.023-1.158-.067 2.179 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.496 14-13.986 0-.21 0-.423-.015-.634.962-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg>
          </a>
        </div>
        <!-- Map -->
        <div class="w-full h-48 mt-4">
          <iframe class="w-full h-full rounded-lg border-0" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.123456789!2d28.9740!3d41.0151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab123456789ab%3A0xabcdef1234567890!2sArzu%20%C3%96zen%20Yoga%20St%C3%BCdyosu!5e0!3m2!1sen!2str!4v1722748800000" allowfullscreen loading="lazy"></iframe>
        </div>
      </div>
      <!-- Contact Form -->
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-subtle-light dark:text-subtle-dark">İsim</label>
          <input type="text" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-primary focus:border-primary"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-subtle-light dark:text-subtle-dark">E-posta</label>
          <input type="email" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-primary focus:border-primary"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-subtle-light dark:text-subtle-dark">Mesaj</label>
          <textarea rows="4" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-primary focus:border-primary"></textarea>
        </div>
        <button type="submit" class="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">Gönder</button>
      </form>
    </div>
  </div>
</section>
          <!-- Footer -->
          <footer class="flex flex-col gap-8 px-5 py-12 text-center mt-10 border-t border-solid border-subtle-light dark:border-subtle-dark">
            <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <a class="text-sm font-medium hover:text-primary transition-colors" href="#">Gizlilik Politikası</a>
              <a class="text-sm font-medium hover:text-primary transition-colors" href="#">Kullanım Şartları</a>
              <a class="text-sm font-medium hover:text-primary transition-colors" href="/contact">İletişim</a>
              <a class="text-sm font-medium hover:text-primary transition-colors" href="/profile">Profil</a>
            </div>
            <p class="text-sm text-subtle-light dark:text-subtle-dark">© 2026 Arzu Özen Yoga Stüdyosu. Tüm hakları saklıdır.</p>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Fetch Instagram profile data
const { data: profile } = await useFetch('/api/instagram/profile')
</script>

<style scoped>
/* Use existing Tailwind utilities */
</style>
