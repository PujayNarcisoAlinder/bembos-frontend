<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
    <HeaderBembos />

    <!-- BARRA SECUNDARIA -->
    <div class="bg-gray-100 border-b border-gray-200 py-1.5">
      <div class="max-w-7xl mx-auto px-4 flex justify-between items-center text-[11px] font-bold">
        <button class="bg-[#FFD200] text-blue-900 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-yellow-400 transition">
          <MapPin class="w-3 h-3"/> Comienza tu pedido: Elige tu dirección
        </button>
        <div class="hidden md:flex items-center gap-5 text-gray-600">
          <a href="#" class="flex items-center gap-1 hover:text-blue-800"><Heart class="w-3 h-3"/> Mis Favoritos</a>
          <a href="#" class="flex items-center gap-1 hover:text-blue-800"><Clock class="w-3 h-3"/> Sigue tu pedido</a>
          <a href="#" class="flex items-center gap-1 hover:text-blue-800"><MapPin class="w-3 h-3"/> ¿A qué local?</a>
        </div>
      </div>
    </div>

    <!-- CARRUSEL DE BANNERS (Corregido) -->
    <section class="relative w-full overflow-hidden bg-blue-900 h-[300px] md:h-[400px]">
      <div 
        class="flex transition-transform duration-500 ease-in-out h-full"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <!-- Banner 1: Dúo Sabroso -->
        <div class="min-w-full h-full bg-[#FFB6E1] flex items-center">
          <div class="max-w-7xl mx-auto px-4 w-full flex h-full">
            <!-- Mitad Izquierda: Texto -->
            <div class="w-1/2 flex flex-col justify-center z-10 pl-4 md:pl-10">
              <p class="text-red-600 font-handwriting text-3xl md:text-5xl mb-0 -rotate-6">Dúo</p>
              <h1 class="text-blue-700 font-black italic leading-none text-5xl md:text-8xl tracking-tighter" style="text-shadow: 2px 2px 0px #fff;">SABROSO</h1>
              <div class="mt-4 md:mt-6">
                <p class="text-blue-800 font-bold text-xs md:text-sm mb-1 hidden md:block">2 A Lo Pobre Reg.<br>2 Papas Reg.<br>2 Gaseosas Pers.</p>
                <p class="text-blue-900 font-black text-4xl md:text-6xl leading-none">S/28.90</p>
                <button @click="$router.push('/product/3')" class="mt-2 md:mt-4 bg-blue-700 text-white font-bold px-6 py-2 rounded hover:bg-blue-800 transition text-sm shadow-md">Compra Aquí</button>
              </div>
            </div>
            <!-- Mitad Derecha: Imagen -->
            <div class="w-1/2 flex justify-center items-center relative p-4">
              <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800" alt="Dúo Sabroso" class="h-[80%] md:h-[90%] object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>

        <!-- Banner 2: Descarga la App -->
        <div class="min-w-full h-full bg-blue-800 flex items-center">
          <div class="max-w-7xl mx-auto px-4 w-full flex h-full">
            <div class="w-1/2 flex flex-col justify-center z-10 pl-4 md:pl-10">
              <h1 class="text-white font-black italic leading-none text-5xl md:text-7xl tracking-tighter uppercase">¡Descarga<br>la App!</h1>
              <p class="text-[#FFB6E1] font-bold text-lg md:text-2xl mt-2 uppercase">Hamburguesa y papas gratis</p>
            </div>
            <div class="w-1/2 flex justify-center items-center p-4">
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600" alt="App" class="h-[80%] object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>

        <!-- Banner 3: Cyber Bembos -->
        <div class="min-w-full h-full bg-[#111] flex items-center">
          <div class="max-w-7xl mx-auto px-4 w-full flex h-full">
            <div class="w-1/2 flex flex-col justify-center z-10 pl-4 md:pl-10">
              <h1 class="text-[#00FF00] font-mono font-black italic leading-none text-4xl md:text-7xl">CYBER BEMBOS</h1>
              <p class="text-white mt-2 text-lg">Ofertas exclusivas online.</p>
            </div>
            <div class="w-1/2 flex justify-center items-center p-4">
              <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=600" alt="Cyber" class="h-[80%] object-contain" />
            </div>
          </div>
        </div>
      </div>

      <!-- Flechas -->
      <button @click="prevSlide" class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-blue-900 rounded-full w-8 h-8 flex items-center justify-center transition z-20">
        <ChevronLeft class="w-5 h-5"/>
      </button>
      <button @click="nextSlide" class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-blue-900 rounded-full w-8 h-8 flex items-center justify-center transition z-20">
        <ChevronRight class="w-5 h-5"/>
      </button>

      <!-- Dots -->
      <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
        <button v-for="(_, idx) in banners" :key="idx" @click="currentSlide = idx" :class="['w-2 h-2 rounded-full transition', currentSlide === idx ? 'bg-blue-900 w-4' : 'bg-white/70']"></button>
      </div>
    </section>

    <!-- CÁPSULAS DE CATEGORÍAS -->
    <section class="bg-white py-4 shadow-sm relative z-10">
      <div class="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-3">
        <button v-for="cat in categorias" :key="cat"
          @click="scrollToSection('hamburguesas')"
          class="px-5 py-1.5 border border-gray-300 rounded-full text-sm font-bold text-gray-800 hover:bg-gray-100 transition">
          {{ cat }}
        </button>
      </div>
    </section>

    <!-- SECCIÓN: PROMOCIONES (Diseño tipo captura) -->
    <section id="hamburguesas" class="max-w-7xl mx-auto px-4 py-8 w-full">
      <h2 class="font-bold text-lg text-gray-800 uppercase mb-4 border-l-4 border-red-600 pl-3">Promociones</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <article v-for="product in promociones" :key="product.id" class="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-lg transition relative group">
          <!-- Etiqueta CYBER -->
          <span class="absolute top-2 right-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded italic z-10">CYBER</span>
          
          <!-- Imagen grande -->
          <div class="w-full h-36 flex items-center justify-center mb-3 overflow-hidden">
            <img :src="product.image_url" :alt="product.name" class="h-full object-contain group-hover:scale-110 transition duration-300" @error="(e) => e.target.src = 'https://placehold.co/400x400/FFC107/0000A0?text=' + encodeURIComponent(product.name)" />
          </div>
          
          <!-- Título y descripción -->
          <h4 class="font-bold text-sm text-gray-900 leading-tight mb-1 h-10 overflow-hidden">{{ product.name }}</h4>
          <p class="text-[10px] text-gray-500 mb-2 line-clamp-2 h-8">{{ product.description }}</p>
          
          <!-- Precios y Botón -->
          <div class="mt-auto w-full flex flex-col items-center pt-2 border-t border-gray-100">
            <div class="flex items-center gap-2 mb-2">
              <span class="font-bold text-lg text-gray-900">S/{{ product.price.toFixed(2) }}</span>
              <span v-if="product.old_price" class="text-xs text-gray-400 line-through">S/{{ product.old_price.toFixed(2) }}</span>
              <span v-if="product.discount" class="bg-red-600 text-white text-[10px] font-bold px-1 rounded">{{ product.discount }}%</span>
            </div>
            <button @click="$router.push(`/product/${product.id}`)" class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
              <Plus class="w-5 h-5" />
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- SECCIÓN: LOS MÁS VENDIDOS (Carrusel) -->
    <section class="max-w-7xl mx-auto px-4 py-8 w-full mb-12">
      <div class="flex justify-between items-end mb-4">
        <h2 class="text-lg font-bold tracking-wide text-gray-800 uppercase">Los Más Vendidos</h2>
        <div class="flex gap-2">
          <button @click="scrollMasVendidos('left')" class="w-8 h-8 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center hover:bg-gray-200"><ChevronLeft class="w-4 h-4"/></button>
          <button @click="scrollMasVendidos('right')" class="w-8 h-8 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center hover:bg-gray-200"><ChevronRight class="w-4 h-4"/></button>
        </div>
      </div>
      
      <div ref="carouselMasVendidos" class="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth">
        <article v-for="product in masVendidos" :key="product.id" class="min-w-[220px] max-w-[220px] bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center text-center snap-start hover:shadow-md transition">
          
          <div class="w-full h-32 flex items-center justify-center mb-3 overflow-hidden">
            <img :src="product.image_url" :alt="product.name" class="h-full object-contain hover:scale-110 transition duration-300" @error="(e) => e.target.src = 'https://placehold.co/400x400/FFC107/0000A0?text=' + encodeURIComponent(product.name)" />
          </div>
          
          <h3 class="font-bold text-sm text-gray-900 leading-tight mb-1 h-10 overflow-hidden">{{ product.name }}</h3>
          <p class="text-[10px] text-gray-500 mb-2 line-clamp-2 h-8">{{ product.description }}</p>
          
          <div class="mt-auto w-full flex flex-col items-center pt-2 border-t border-gray-100">
            <div class="flex items-center justify-center gap-2 mb-2">
              <span class="font-bold text-lg">S/{{ product.price.toFixed(2) }}</span>
              <span v-if="product.old_price" class="text-xs text-gray-400 line-through">S/{{ product.old_price.toFixed(2) }}</span>
            </div>
            <button @click="$router.push(`/product/${product.id}`)" class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
              <Plus class="w-5 h-5" />
            </button>
          </div>
        </article>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { MapPin, Heart, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-vue-next';
import { getProducts } from '../services/api';
import HeaderBembos from '../components/HeaderBembos.vue';

const products = ref([]);
const carouselMasVendidos = ref(null);

const currentSlide = ref(0);
const banners = [1, 2, 3];
let autoSlideInterval;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % banners.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + banners.length) % banners.length;
};

onMounted(async () => {
  autoSlideInterval = setInterval(nextSlide, 5000);
  const res = await getProducts();
  products.value = res.data;
});

onUnmounted(() => {
  clearInterval(autoSlideInterval);
});

const categorias = ['Cyber Bembos', 'Las del Barrio', 'Promos Exclusivas', 'Combos', 'Hamburguesas', 'Loncherita por la Educación'];

const promociones = computed(() => products.value.filter(p => p.category === 'Recomendados').slice(0, 5));
const masVendidos = computed(() => products.value.filter(p => p.category === 'Más Vendidos'));

const scrollMasVendidos = (direction) => {
  const el = carouselMasVendidos.value;
  if (el) el.scrollBy({ left: direction === 'left' ? -240 : 240, behavior: 'smooth' });
};

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
.font-handwriting {
  font-family: 'Brush Script MT', cursive;
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>