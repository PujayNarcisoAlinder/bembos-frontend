<template>
  <footer class="bg-white border-t border-gray-200 mt-12 pt-10 pb-8 text-sm text-gray-800">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <!-- Columna 1: Redes Sociales -->
        <div>
          <h3 class="font-bold text-lg mb-4 text-bembos-blue">Síguenos en</h3>
          <div class="flex gap-3">
            <a href="https://facebook.com/bembos" target="_blank" rel="noopener" class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-bembos-blue hover:text-white transition" aria-label="Facebook">
              <Facebook class="w-5 h-5" />
            </a>
            <a href="https://instagram.com/bembos" target="_blank" rel="noopener" class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-bembos-blue hover:text-white transition" aria-label="Instagram">
              <Instagram class="w-5 h-5" />
            </a>
            <a href="https://twitter.com/bembos" target="_blank" rel="noopener" class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-bembos-blue hover:text-white transition" aria-label="Twitter">
              <Twitter class="w-5 h-5" />
            </a>
            <a href="https://tiktok.com/@bembos" target="_blank" rel="noopener" class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-bembos-blue hover:text-white transition" aria-label="TikTok">
              <Music class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Columna 2: Acordeones -->
        <div class="space-y-2">
          <div class="border-b border-gray-200 pb-2">
            <button @click="toggle('productos')" class="flex justify-between items-center w-full font-bold text-base py-2 text-left">
              Nuestros Productos
              <ChevronDown v-if="!abierto.productos" class="w-5 h-5" />
              <ChevronUp v-else class="w-5 h-5" />
            </button>
            <div v-if="abierto.productos" class="pl-2 py-2 space-y-1 text-gray-600">
              <a href="#" class="block hover:text-bembos-orange">Hamburguesas</a>
              <a href="#" class="block hover:text-bembos-orange">Combos</a>
              <a href="#" class="block hover:text-bembos-orange">Promociones</a>
            </div>
          </div>

          <div class="border-b border-gray-200 pb-2">
            <button @click="toggle('ayuda')" class="flex justify-between items-center w-full font-bold text-base py-2 text-left">
              Ayuda
              <ChevronDown v-if="!abierto.ayuda" class="w-5 h-5" />
              <ChevronUp v-else class="w-5 h-5" />
            </button>
            <div v-if="abierto.ayuda" class="pl-2 py-2 space-y-1 text-gray-600">
              <a href="#" class="block hover:text-bembos-orange">Preguntas Frecuentes</a>
              <a href="#" class="block hover:text-bembos-orange">Términos y Condiciones</a>
              <a href="#" class="block hover:text-bembos-orange">Política de Privacidad</a>
            </div>
          </div>
        </div>

        <!-- Columna 3: Libro de Reclamaciones -->
        <div>
          <h3 class="font-bold text-lg mb-2">Libro de Reclamaciones</h3>
          <button @click="abrirReclamaciones" class="flex flex-col items-center justify-center group">
            <BookOpen class="w-16 h-16 text-blue-400 group-hover:text-blue-600 transition" />
            <span class="text-xs text-blue-500 font-bold underline mt-1">Libro de<br>Reclamaciones</span>
          </button>
        </div>

        <!-- Columna 4: Métodos de Pago y App -->
        <div>
          <h3 class="font-bold text-lg mb-2">Métodos de Pago</h3>
          <div class="flex flex-wrap gap-2 mb-6">
            <div class="border border-gray-300 p-1 rounded bg-white"><span class="font-bold italic text-blue-800 text-xs">VISA</span></div>
            <div class="border border-gray-300 p-1 rounded bg-white"><span class="font-bold text-red-600 text-xs">MasterCard</span></div>
            <div class="border border-gray-300 p-1 rounded bg-white"><span class="font-bold text-blue-500 text-xs">AMEX</span></div>
            <div class="border border-gray-300 p-1 rounded bg-white"><span class="font-bold text-blue-700 text-xs">Diners</span></div>
          </div>

          <h3 class="font-bold text-lg mb-2">Bembos App</h3>
          <div class="flex flex-col gap-2">
            <a href="https://play.google.com/store/apps/details?id=pe.bembos.app" target="_blank" class="flex items-center gap-2 border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition w-fit">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" class="h-8" />
            </a>
            <a href="https://apps.apple.com/pe/app/bembos/id123456789" target="_blank" class="flex items-center gap-2 border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition w-fit">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" class="h-8" />
            </a>
          </div>
        </div>

      </div>

      <!-- Botón flotante "Subir" -->
      <button @click="scrollToTop" class="fixed bottom-20 right-6 bg-bembos-blue text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-800 transition z-50" aria-label="Volver arriba">
        <ArrowUp class="w-6 h-6" />
      </button>

      <div class="mt-12 text-center text-xs text-gray-500 border-t border-gray-200 pt-6">
        © 2024 Todos los derechos reservados.
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import { Facebook, Instagram, Twitter, Music, ChevronDown, ChevronUp, BookOpen, ArrowUp } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';

const toast = useToast();

const abierto = ref({
  productos: false,
  ayuda: false
});

const toggle = (seccion) => {
  abierto.value[seccion] = !abierto.value[seccion];
};

const abrirReclamaciones = () => {
  toast.info('Aquí se abriría el Libro de Reclamaciones virtual.', { timeout: 4000 });
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>