<template>
  <div class="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
    <div class="layout-container flex h-full grow flex-col">
      <div class="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
        <div class="layout-content-container flex flex-col w-full max-w-7xl flex-1">
          <!-- Header -->
          <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-subtle-light dark:border-subtle-dark px-2 sm:px-6 py-4 mb-6">
            <NuxtLink to="/" class="flex items-center gap-3 text-text-light dark:text-text-dark">
              <div class="relative size-10">
                <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 animate-spin-slow"></div>
                <div class="absolute inset-[2px] rounded-full bg-background-light dark:bg-background-dark"></div>
                <img v-if="profile?.profile_picture_url" :src="profile.profile_picture_url" :alt="profile.username" class="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full object-cover" />
                <div v-else class="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full bg-gray-300 dark:bg-gray-700"></div>
              </div>
            </NuxtLink>
            <nav class="hidden md:flex flex-1 justify-end gap-8">
              <div class="flex items-center gap-9">
                <NuxtLink class="text-sm font-medium hover:text-primary transition-colors" to="/profile">Profil</NuxtLink>
                <NuxtLink class="text-sm font-bold text-primary transition-colors" to="/contact">İletişim</NuxtLink>
              </div>
            </nav>
            <button class="md:hidden p-2">
              <span class="material-symbols-outlined text-text-light dark:text-text-dark">menu</span>
            </button>
          </header>
          <main class="px-2 sm:px-4 flex-1">
            <div class="flex flex-col gap-12 lg:gap-20">
              <div class="text-center px-4">
                <h1 class="text-4xl sm:text-5xl font-bold tracking-tighter text-text-light dark:text-text-dark">Bize Ulaşın</h1>
                <p class="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-subtle-light dark:text-subtle-dark">Sorularınız, önerileriniz veya ders kayıtları için aşağıdaki formu doldurabilir veya iletişim bilgilerimizden bize ulaşabilirsiniz.</p>
              </div>
              <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
                <div class="lg:col-span-3">
                  <form action="#" class="space-y-6" method="POST">
                    <div>
                      <label class="text-sm font-medium text-text-light dark:text-text-dark" for="full-name">Adınız Soyadınız</label>
                      <input class="mt-2 block w-full rounded-md border-subtle-light dark:border-subtle-dark bg-accent-light dark:bg-accent-dark shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-text-light dark:text-text-dark placeholder:text-subtle-light dark:placeholder:text-subtle-dark" id="full-name" name="full-name" placeholder="Adınız ve soyadınız" required type="text"/>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-text-light dark:text-text-dark" for="email">E-posta Adresiniz</label>
                      <input class="mt-2 block w-full rounded-md border-subtle-light dark:border-subtle-dark bg-accent-light dark:bg-accent-dark shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-text-light dark:text-text-dark placeholder:text-subtle-light dark:placeholder:text-subtle-dark" id="email" name="email" placeholder="ornek@mail.com" required type="email"/>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-text-light dark:text-text-dark" for="message">Mesajınız</label>
                      <textarea class="mt-2 block w-full rounded-md border-subtle-light dark:border-subtle-dark bg-accent-light dark:bg-accent-dark shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-text-light dark:text-text-dark placeholder:text-subtle-light dark:placeholder:text-subtle-dark" id="message" name="message" placeholder="Mesajınızı buraya yazın..." required rows="6"></textarea>
                    </div>
                    <div>
                      <button class="w-full flex items-center justify-center rounded-full h-12 px-6 bg-primary text-text-on-primary text-base font-bold leading-normal tracking-wide shadow-lg hover:bg-opacity-90 transition-colors" type="submit">Gönder</button>
                    </div>
                  </form>
                </div>
                <div class="lg:col-span-2">
                  <div class="bg-pastel-green/40 dark:bg-accent-dark/60 p-8 rounded-lg space-y-8 h-full flex flex-col justify-between">
                    <div class="space-y-6">
                      <div class="flex items-start gap-4">
                        <div class="flex-shrink-0 size-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                          <span class="material-symbols-outlined">location_on</span>
                        </div>
                        <div>
                          <h3 class="font-semibold text-text-light dark:text-text-dark">Stüdyo Adresi</h3>
                          <p class="text-subtle-light dark:text-subtle-dark">Doğa Mah. Huzur Sk. No:12/3, Yoga Apt. Çankaya/Ankara</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-4">
                        <div class="flex-shrink-0 size-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                          <span class="material-symbols-outlined">phone</span>
                        </div>
                        <div>
                          <h3 class="font-semibold text-text-light dark:text-text-dark">Telefon</h3>
                          <p class="text-subtle-light dark:text-subtle-dark">+90 555 123 45 67</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-4">
                        <div class="flex-shrink-0 size-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                          <span class="material-symbols-outlined">email</span>
                        </div>
                        <div>
                          <h3 class="font-semibold text-text-light dark:text-text-dark">E-posta</h3>
                          <p class="text-subtle-light dark:text-subtle-dark">info@arzuozenyoga.com</p>
                        </div>
                      </div>
                    </div>
                    <div class="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden hidden lg:block">
                      <img alt="Harita üzerinde stüdyo konumu" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRNRgYbfKap0QpHmntdIJ4gAPsBk4E91dKDqAXp_mPXHcoe9Vw-XbjlD4ImUiiJIt2t6E_WKLDTkh8_miD8d21ZoAyrn4mAgkPPS9w83KLCJW1pZNLk8_HvUv_QBmVkV0wKU8_-ThyNSZF05r9cmC1wi7qJAVCYbpdy0VYK5gEmnG__SY94JTxKcB9qvlniJIIkFq8BK3SP8FAqEfWNvSpg78bx-3ejknL1K4hRBsMVoRSJ4jmP8vI7EbsPY1KwQtYeGSafKWjYAqQ"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <footer class="flex flex-col gap-8 px-5 py-12 text-center mt-16 border-t border-solid border-subtle-light dark:border-subtle-dark">
            <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <a class="text-sm font-medium hover:text-primary transition-colors" href="#">Gizlilik Politikası</a>
              <a class="text-sm font-medium hover:text-primary transition-colors" href="#">Kullanım Şartları</a>
              <a class="text-sm font-medium hover:text-primary transition-colors" href="#">İletişim</a>
            </div>
            <div class="flex flex-wrap justify-center gap-6">
              <a class="text-text-light dark:text-text-dark hover:text-primary transition-colors" href="#">
                <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path clip-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.155 0 2.748-.012 3.088-.06 4.155-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.155.06-2.748 0-3.088-.012-4.155-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.155 0-2.748.012-3.088.06-4.155.049 1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.148 2 12.575 2h.09zM12 4.869c-2.029 0-3.555 1.526-3.555 3.42 0 1.895 1.526 3.42 3.555 3.42 2.029 0 3.555-1.525 3.555-3.42 0-1.894-1.526-3.42-3.555-3.42zM12 15.355c-3.138 0-5.685-2.5-5.685-5.685S8.862 3.985 12 3.985s5.685 2.5 5.685 5.685S15.138 15.355 12 15.355z" fill-rule="evenodd"/></svg>
              </a>
              <a class="text-text-light dark:text-text-dark hover:text-primary transition-colors" href="#">
                <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path clip-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fill-rule="evenodd"/></svg>
              </a>
              <a class="text-text-light dark:text-text-dark hover:text-primary transition-colors" href="#">
                <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path clip-rule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.78 22 12 22 12s0 3.22-.42 4.814a2.506 2.506 0 0 1-1.768 1.768c-1.594.42-7.812.42-7.812.42s-6.218 0-7.812-.42a2.506 2.506 0 0 1-1.768-1.768C2 15.22 2 12 2 12s0-3.22.42-4.814a2.506 2.506 0 0 1 1.768-1.768C5.782 5 12 5 12 5s6.218 0 7.812.418ZM15.194 12 10 15V9l5.194 3Z" fill-rule="evenodd"/></svg>
              </a>
            </div>
            <p class="text-sm text-subtle-light dark:text-subtle-dark">© 2024 Arzu Özen Yoga Stüdyosu. Tüm hakı

saklıdır.</p>
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
/* Custom styles for contact page */
</style>
