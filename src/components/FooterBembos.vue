<template>
  <footer class="bg-white border-t border-gray-200 mt-12 pt-10 pb-8 text-sm text-gray-800">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <!-- Columna 1: Redes Sociales -->
        <div>
          <h3 class="font-bold text-lg mb-4 text-bembos-blue">Síguenos en</h3>
          <div class="flex gap-3">
            <!-- S6: Links de redes con tamaño táctil adecuado -->
            <a href="https://facebook.com/bembos" target="_blank" rel="noopener" class="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center hover:bg-bembos-blue hover:text-white transition" aria-label="Facebook">
              <Facebook class="w-5 h-5" />
            </a>
            <a href="https://instagram.com/bembos" target="_blank" rel="noopener" class="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center hover:bg-bembos-blue hover:text-white transition" aria-label="Instagram">
              <Instagram class="w-5 h-5" />
            </a>
            <a href="https://twitter.com/bembos" target="_blank" rel="noopener" class="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center hover:bg-bembos-blue hover:text-white transition" aria-label="Twitter">
              <Twitter class="w-5 h-5" />
            </a>
            <a href="https://tiktok.com/@bembos" target="_blank" rel="noopener" class="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center hover:bg-bembos-blue hover:text-white transition" aria-label="TikTok">
              <Music class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Columna 2: Acordeones (S9: aria-expanded y aria-controls) -->
        <div class="space-y-2">
          <div class="border-b border-gray-200 pb-2">
            <button 
              @click="toggle('productos')" 
              class="flex justify-between items-center w-full font-bold text-base py-3 text-left min-h-[44px]"
              :aria-expanded="abierto.productos"
              aria-controls="panel-productos"
            >
              Nuestros Productos
              <ChevronDown v-if="!abierto.productos" class="w-5 h-5" />
              <ChevronUp v-else class="w-5 h-5" />
            </button>
            <div v-if="abierto.productos" id="panel-productos" class="pl-2 py-2 space-y-2">
              <!-- S8: Enlaces funcionales o disabled -->
              <button disabled class="block text-gray-600 opacity-60 cursor-not-allowed">Hamburguesas</button>
              <button disabled class="block text-gray-600 opacity-60 cursor-not-allowed">Combos</button>
              <button disabled class="block text-gray-600 opacity-60 cursor-not-allowed">Promociones</button>
            </div>
          </div>

          <div class="border-b border-gray-200 pb-2">
            <button 
              @click="toggle('ayuda')" 
              class="flex justify-between items-center w-full font-bold text-base py-3 text-left min-h-[44px]"
              :aria-expanded="abierto.ayuda"
              aria-controls="panel-ayuda"
            >
              Ayuda
              <ChevronDown v-if="!abierto.ayuda" class="w-5 h-5" />
              <ChevronUp v-else class="w-5 h-5" />
            </button>
            <div v-if="abierto.ayuda" id="panel-ayuda" class="pl-2 py-2 space-y-2">
              <button disabled class="block text-gray-600 opacity-60 cursor-not-allowed">Preguntas Frecuentes</button>
              <button disabled class="block text-gray-600 opacity-60 cursor-not-allowed">Términos y Condiciones</button>
              <button disabled class="block text-gray-600 opacity-60 cursor-not-allowed">Política de Privacidad</button>
            </div>
          </div>
        </div>

        <!-- Columna 3: Libro de Reclamaciones (S7: text-blue-700) -->
        <div>
          <h3 class="font-bold text-lg mb-2">Libro de Reclamaciones</h3>
          <button @click="abrirReclamaciones" class="flex flex-col items-center justify-center group min-h-[44px]">
            <BookOpen class="w-16 h-16 text-blue-700 group-hover:text-blue-900 transition" />
            <span class="text-xs text-blue-700 font-bold underline mt-1 group-hover:text-blue-900">Libro de<br>Reclamaciones</span>
          </button>
        </div>

        <!-- Columna 4: Métodos de Pago y App -->
        <div>
          <h3 class="font-bold text-lg mb-2">Métodos de Pago</h3>
          <div class="flex flex-wrap gap-2 mb-6">
            <!-- S7: AMEX cambiado a text-blue-700 -->
            <div class="border border-gray-300 p-1 rounded bg-white"><span class="font-bold italic text-blue-800 text-xs">VISA</span></div>
            <div class="border border-gray-300 p-1 rounded bg-white"><span class="font-bold text-red-600 text-xs">MasterCard</span></div>
            <div class="border border-gray-300 p-1 rounded bg-white"><span class="font-bold text-blue-700 text-xs">AMEX</span></div>
            <div class="border border-gray-300 p-1 rounded bg-white"><span class="font-bold text-blue-700 text-xs">Diners</span></div>
          </div>

          <h3 class="font-bold text-lg mb-2">Bembos App</h3>
          <div class="flex flex-col gap-2">
            <a href="https://play.google.com/store/apps/details?id=pe.bembos.app" target="_blank" class="flex items-center gap-2 border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition w-fit min-h-[44px]">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" class="h-8" />
            </a>
            <a href="https://apps.apple.com/pe/app/bembos/id123456789" target="_blank" class="flex items-center gap-2 border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition w-fit min-h-[44px]">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" class="h-8" />
            </a>
          </div>
        </div>

      </div>

      <!-- S11: z-index arreglado -->
      <button @click="scrollToTop" class="fixed bottom-6 right-6 bg-bembos-blue text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-800 transition z-[60]" aria-label="Volver arriba">
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