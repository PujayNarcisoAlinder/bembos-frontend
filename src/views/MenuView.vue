<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <HeaderBembos />

    <main class="flex-grow max-w-7xl mx-auto px-4 py-8 space-y-12 w-full">
      
      <!-- SECCIÓN: RECOMENDADOS -->
      <section>
        <div class="flex justify-between items-end mb-4">
          <h2 class="text-lg font-bold tracking-wide text-gray-800 uppercase">Recomendados para ti</h2>
          <div class="flex gap-2">
            <button @click="scrollRecomendados('left')" class="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50"><ChevronLeft class="w-4 h-4"/></button>
            <button @click="scrollRecomendados('right')" class="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50"><ChevronRight class="w-4 h-4"/></button>
          </div>
        </div>
        
        <div ref="carouselRecomendados" class="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth">
          <article v-for="product in recomendados" :key="product.id" class="min-w-[240px] max-w-[240px] bg-white rounded-lg border border-gray-100 shadow-sm snap-start flex flex-col group">
            <div class="p-4 flex justify-center h-40">
              <img :src="product.image_url" :alt="product.name" class="h-full object-contain" @error="(e) => e.target.src = 'https://placehold.co/400x400/FFC107/0000A0?text=' + encodeURIComponent(product.name)" />
            </div>
            <div class="px-4 pb-4 flex flex-col flex-grow">
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-bold text-sm text-gray-900 leading-tight flex-1">{{ product.name }}</h3>
                <button @click="toggleFavorito(product.id)" aria-label="Agregar a favoritos">
                  <Heart :class="['w-4 h-4', favoritos.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400']" />
                </button>
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
                <button @click="$router.push(`/product/${product.id}`)" class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition" aria-label="Personalizar">
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
            <button @click="scrollMasVendidos('left')" class="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50"><ChevronLeft class="w-4 h-4"/></button>
            <button @click="scrollMasVendidos('right')" class="w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50"><ChevronRight class="w-4 h-4"/></button>
          </div>
        </div>
        
        <div ref="carouselMasVendidos" class="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth">
          <article v-for="product in masVendidos" :key="product.id" class="min-w-[240px] max-w-[240px] bg-white rounded-lg border border-gray-100 shadow-sm snap-start flex flex-col group">
            <div class="p-4 flex justify-center h-40">
              <img :src="product.image_url" :alt="product.name" class="h-full object-contain" @error="(e) => e.target.src = 'https://placehold.co/400x400/FFC107/0000A0?text=' + encodeURIComponent(product.name)" />
            </div>
            <div class="px-4 pb-4 flex flex-col flex-grow">
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-bold text-sm text-gray-900 leading-tight flex-1">{{ product.name }}</h3>
                <button @click="toggleFavorito(product.id)" aria-label="Agregar a favoritos">
                  <Heart :class="['w-4 h-4', favoritos.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400']" />
                </button>
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
                <button @click="$router.push(`/product/${product.id}`)" class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition" aria-label="Personalizar">
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
import { ChevronLeft, ChevronRight, Plus, Heart } from 'lucide-vue-next';
import { getProducts } from '../services/api';
import { useCartStore } from '../store/cart';
import HeaderBembos from '../components/HeaderBembos.vue';

const cartStore = useCartStore();
const products = ref([]);
const favoritos = ref([]);

const carouselRecomendados = ref(null);
const carouselMasVendidos = ref(null);

onMounted(async () => {
  const res = await getProducts();
  products.value = res.data;
});

const recomendados = computed(() => products.value.filter(p => p.category === 'Recomendados'));
const masVendidos = computed(() => products.value.filter(p => p.category === 'Más Vendidos'));

// Funciones de scroll para los carruseles
const scrollRecomendados = (direction) => {
  const el = carouselRecomendados.value;
  if (el) el.scrollBy({ left: direction === 'left' ? -260 : 260, behavior: 'smooth' });
};

const scrollMasVendidos = (direction) => {
  const el = carouselMasVendidos.value;
  if (el) el.scrollBy({ left: direction === 'left' ? -260 : 260, behavior: 'smooth' });
};

// Función de favorito funcional (guarda en memoria)
const toggleFavorito = (id) => {
  const index = favoritos.value.indexOf(id);
  if (index === -1) {
    favoritos.value.push(id);
  } else {
    favoritos.value.splice(index, 1);
  }
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>