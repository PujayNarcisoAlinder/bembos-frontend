<template>
  <div class="min-h-screen bg-white font-sans text-gray-900">
    <!-- HEADER AZUL OSCURO (Web Oficial) -->
    <header class="bg-bembos-blue text-white sticky top-0 z-50 shadow-md">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <!-- Logo simulado -->
        <div class="flex items-center">
          <span class="text-2xl font-black italic tracking-tighter">BEMBOS</span>
        </div>

        <!-- Navegación Desktop -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-bold">
          <a href="#" class="hover:text-bembos-yellow transition flex items-center gap-1"><MenuIcon class="w-4 h-4"/> MENÚ</a>
          <a href="#" class="hover:text-bembos-yellow transition flex items-center gap-1"><Star class="w-4 h-4"/> PROMOS EXCLUSIVAS</a>
          <a href="#" class="hover:text-bembos-yellow transition flex items-center gap-1"><Heart class="w-4 h-4"/> PROGRAMA LEALTAD</a>
          <a href="#" class="hover:text-bembos-yellow transition flex items-center gap-1"><MapPin class="w-4 h-4"/> LOCALES</a>
        </nav>

        <!-- Acciones Derecha -->
        <div class="flex items-center gap-4">
          <button class="hidden md:block hover:text-bembos-yellow"><Search class="w-5 h-5"/></button>
          <div class="hidden md:flex flex-col text-[10px] leading-tight text-right">
            <span class="font-bold">Llámanos</span>
            <span class="text-bembos-yellow font-bold">(01) 610 0808</span>
          </div>
          <div class="flex items-center gap-2 border-l border-white/30 pl-4 ml-2">
            <User class="w-5 h-5"/>
            <div class="hidden md:flex flex-col text-[10px] leading-tight">
              <span>Hola,</span>
              <span class="font-bold">Inicia Sesión</span>
            </div>
          </div>
          <button class="bg-bembos-yellow text-bembos-blue font-bold px-3 py-1.5 rounded flex items-center gap-2 text-sm hover:bg-yellow-400 transition">
            <ShoppingCart class="w-4 h-4"/>
            <span>S/ {{ cartStore.totalPrice.toFixed(2) }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      <!-- SECCIÓN: RECOMENDADOS PARA TI -->
      <section>
        <div class="flex justify-between items-end mb-4">
          <h2 class="text-lg font-bold tracking-wide text-gray-800 uppercase">Recomendados para ti</h2>
          <div class="flex gap-2">
            <button class="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50"><ChevronLeft class="w-4 h-4"/></button>
            <button class="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50"><ChevronRight class="w-4 h-4"/></button>
          </div>
        </div>
        
        <!-- Carrusel Horizontal -->
        <div class="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
          <article v-for="product in recomendados" :key="product.id" class="min-w-[240px] max-w-[240px] bg-white rounded-lg border border-gray-100 shadow-sm snap-start flex flex-col group">
            <div class="p-4 flex justify-center h-40">
              <img :src="product.image_url" :alt="product.name" class="h-full object-contain" />
            </div>
            <div class="px-4 pb-4 flex flex-col flex-grow">
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-bold text-sm text-gray-900 leading-tight flex-1">{{ product.name }}</h3>
                <Heart class="w-4 h-4 text-red-500 cursor-pointer flex-shrink-0" />
              </div>
              <p class="text-[11px] text-gray-500 leading-snug mb-3 line-clamp-2">{{ product.description }}</p>
              
              <div class="mt-auto flex justify-between items-center">
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-lg">S/{{ product.price.toFixed(2) }}</span>
                    <span v-if="product.old_price" class="text-xs text-gray-400 line-through">S/{{ product.old_price.toFixed(2) }}</span>
                    <span v-if="product.discount" class="bg-red-600 text-white text-[10px] font-bold px-1 rounded">{{ product.discount }}%</span>
                  </div>
                </div>
                <button @click="$router.push(`/product/${product.id}`)" class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                  <Plus class="w-5 h-5" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- SECCIÓN: LOS MÁS VENDIDOS -->
      <section>
        <div class="flex justify-between items-end mb-4">
          <h2 class="text-lg font-bold tracking-wide text-gray-800 uppercase">Los más vendidos</h2>
          <div class="flex gap-2">
            <button class="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50"><ChevronLeft class="w-4 h-4"/></button>
            <button class="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50"><ChevronRight class="w-4 h-4"/></button>
          </div>
        </div>
        
        <!-- Carrusel Horizontal -->
        <div class="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
          <article v-for="product in masVendidos" :key="product.id" class="min-w-[240px] max-w-[240px] bg-white rounded-lg border border-gray-100 shadow-sm snap-start flex flex-col group">
            <div class="p-4 flex justify-center h-40">
              <img :src="product.image_url" :alt="product.name" class="h-full object-contain" />
            </div>
            <div class="px-4 pb-4 flex flex-col flex-grow">
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-bold text-sm text-gray-900 leading-tight flex-1">{{ product.name }}</h3>
                <Heart class="w-4 h-4 text-red-500 cursor-pointer flex-shrink-0" />
              </div>
              <p class="text-[11px] text-gray-500 leading-snug mb-3 line-clamp-2">{{ product.description }}</p>
              
              <div class="mt-auto flex justify-between items-center">
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-lg">S/{{ product.price.toFixed(2) }}</span>
                    <span v-if="product.old_price" class="text-xs text-gray-400 line-through">S/{{ product.old_price.toFixed(2) }}</span>
                    <span v-if="product.discount" class="bg-red-600 text-white text-[10px] font-bold px-1 rounded">{{ product.discount }}%</span>
                  </div>
                </div>
                <button @click="$router.push(`/product/${product.id}`)" class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                  <Plus class="w-5 h-5" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Menu as MenuIcon, Star, Heart, MapPin, Search, User, ShoppingCart, ChevronLeft, ChevronRight, Plus } from 'lucide-vue-next';
import { getProducts } from '../services/api';
import { useCartStore } from '../store/cart';

const cartStore = useCartStore();
const products = ref([]);

onMounted(async () => {
  const res = await getProducts();
  products.value = res.data;
});

const recomendados = computed(() => products.value.filter(p => p.category === 'Recomendados'));
const masVendidos = computed(() => products.value.filter(p => p.category === 'Más Vendidos'));
</script>

<style scoped>
/* Ocultar scrollbar pero mantener funcionalidad */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>