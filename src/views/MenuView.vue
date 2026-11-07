<template>
  <div class="min-h-screen bg-[#f8f9fa] font-sans text-gray-900 flex flex-col">
    <HeaderBembos />

    <!-- Contenido principal envuelto en <main> (Contrato C2) -->
    <main class="flex-grow">
      
      <!-- BARRA SECUNDARIA -->
      <div class="bg-gray-100 border-b border-gray-200 py-1.5">
        <div class="max-w-7xl mx-auto px-4 flex justify-between items-center text-[11px] font-bold">
          <button class="bg-[#FFD200] text-blue-900 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-yellow-400 transition min-h-[32px]">
            <MapPin class="w-3 h-3"/> Comienza tu pedido: Elige tu dirección
          </button>
          <div class="hidden md:flex items-center gap-5 text-gray-600">
            <!-- S8: Botones disabled en lugar de href="#" -->
            <button disabled class="flex items-center gap-1 opacity-60 cursor-not-allowed"><Heart class="w-3 h-3"/> Mis Favoritos</button>
            <button disabled class="flex items-center gap-1 opacity-60 cursor-not-allowed"><Clock class="w-3 h-3"/> Sigue tu pedido</button>
            <button disabled class="flex items-center gap-1 opacity-60 cursor-not-allowed"><MapPin class="w-3 h-3"/> ¿A qué local?</button>
          </div>
        </div>
      </div>

      <!-- S4: H1 principal oculto para lectores -->
      <h1 class="sr-only">Menú Bembos</h1>

      <!-- CARRUSEL DE BANNERS (S1: inert, S2: Pausa) -->
      <section class="relative w-full overflow-hidden bg-blue-900 h-[280px] md:h-[360px]" aria-roledescription="carrusel" aria-label="Promociones destacadas">
        <div 
          class="flex transition-transform duration-500 ease-in-out h-full"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <!-- Banner 1 -->
          <!-- S1: :inert y :aria-hidden -->
          <div 
            v-for="(banner, idx) in banners" 
            :key="idx"
            class="min-w-full h-full flex items-center relative"
            :class="banner.bgClass"
            :inert="currentSlide !== idx"
            :aria-hidden="currentSlide !== idx"
          >
            <div class="max-w-7xl mx-auto px-4 w-full flex h-full">
              <div class="w-1/2 flex flex-col justify-center z-10 pl-4 md:pl-10">
                <!-- S4: Cambiamos h1 por p -->
                <p :class="banner.sloganClass">{{ banner.slogan }}</p>
                <p :class="banner.titleClass" style="text-shadow: 2px 2px 0px #fff;">{{ banner.title }}</p>
                <div class="mt-4 md:mt-6">
                  <p class="text-blue-800 font-bold text-xs md:text-sm mb-1 hidden md:block" v-html="banner.desc"></p>
                  <p class="text-blue-900 font-black text-4xl md:text-6xl leading-none">{{ banner.price }}</p>
                  <button @click="$router.push(banner.link)" class="mt-2 md:mt-4 bg-blue-700 text-white font-bold px-6 py-2 rounded hover:bg-blue-800 transition text-sm shadow-md min-h-[44px]">{{ banner.btnText }}</button>
                </div>
              </div>
              <div class="w-1/2 flex justify-center items-center relative p-4">
                <img :src="banner.img" :alt="banner.title" class="h-[80%] md:h-[90%] object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>

        <!-- S3 y S6: Flechas con aria-label y tamaño 44x44 -->
        <button @click="prevSlide" class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-blue-900 rounded-full w-11 h-11 flex items-center justify-center transition z-20" aria-label="Banner anterior">
          <ChevronLeft class="w-6 h-6"/>
        </button>
        <button @click="nextSlide" class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-blue-900 rounded-full w-11 h-11 flex items-center justify-center transition z-20" aria-label="Banner siguiente">
          <ChevronRight class="w-6 h-6"/>
        </button>

        <!-- S2: Botón de pausa -->
        <button @click="togglePausa" class="absolute bottom-3 right-4 bg-white/80 text-blue-900 rounded-full px-3 py-1 text-xs font-bold z-20 min-h-[32px]" :aria-label="pausado ? 'Reanudar el carrusel' : 'Pausar el carrusel'">
          {{ pausado ? '▶ Reanudar' : '⏸ Pausar' }}
        </button>

        <!-- S3 y S6: Dots indicadores con aria-label y 44x44 de área táctil -->
        <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
          <button 
            v-for="(_, idx) in banners" 
            :key="idx" 
            @click="currentSlide = idx" 
            class="w-11 h-11 flex items-center justify-center"
            :aria-label="`Ir al banner ${idx + 1} de ${banners.length}`"
            :aria-current="currentSlide === idx"
          >
            <span :class="['block rounded-full transition', currentSlide === idx ? 'bg-blue-900 w-4 h-2' : 'bg-white/70 w-2 h-2']"></span>
          </button>
        </div>
      </section>

      <!-- CÁPSULAS DE CATEGORÍAS (S7: borde gris-500, S11: cada una lleva a un ancla real o hace scroll) -->
      <section class="bg-white py-4 shadow-sm relative z-10">
        <div class="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-3">
          <button v-for="cat in categorias" :key="cat.name"
            @click="scrollToSection(cat.section)"
            class="px-5 py-1.5 border border-gray-500 rounded-full text-sm font-bold text-gray-800 hover:bg-gray-100 transition">
            {{ cat.name }}
          </button>
        </div>
      </section>

      <!-- SECCIÓN: PROMOCIONES -->
      <section id="hamburguesas" class="max-w-7xl mx-auto px-4 py-8 w-full">
        <h2 class="font-bold text-lg text-gray-800 uppercase mb-4 border-l-4 border-red-600 pl-3">Promociones</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <article v-for="product in promociones" :key="product.id" class="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-lg transition relative group">
            <span class="absolute top-2 right-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded italic z-10">CYBER</span>
            
            <div class="w-full h-36 flex items-center justify-center mb-3 overflow-hidden">
              <img :src="product.image_url" :alt="product.name" class="h-full object-contain group-hover:scale-110 transition duration-300" @error="(e) => e.target.src = 'https://placehold.co/400x400/FFC107/0000A0?text=' + encodeURIComponent(product.name)" />
            </div>
            
            <!-- S4: h4 cambiado a h3 -->
            <h3 class="font-bold text-sm text-gray-900 leading-tight mb-1 h-10 overflow-hidden">{{ product.name }}</h3>
            <p class="text-[10px] text-gray-500 mb-2 line-clamp-2 h-8">{{ product.description }}</p>
            
            <div class="mt-auto w-full flex flex-col items-center pt-2 border-t border-gray-100">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-bold text-lg text-gray-900">S/{{ product.price.toFixed(2) }}</span>
                <!-- S7: Precio tachado más oscuro -->
                <span v-if="product.old_price" class="text-xs text-gray-600 line-through">S/{{ product.old_price.toFixed(2) }}</span>
                <span v-if="product.discount" class="bg-red-600 text-white text-[10px] font-bold px-1 rounded">{{ product.discount }}%</span>
              </div>
              <!-- S3: aria-label en el botón + y S6: tamaño 44x44 -->
              <button 
                @click="$router.push(`/product/${product.id}`)" 
                class="bg-blue-600 text-white w-11 h-11 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
                :aria-label="`Personalizar ${product.name}`"
              >
                <Plus class="w-6 h-6" />
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- SECCIÓN: LOS MÁS VENDIDOS -->
      <section id="mas-vendidos" class="max-w-7xl mx-auto px-4 py-8 w-full mb-12">
        <div class="flex justify-between items-end mb-4">
          <h2 class="text-lg font-bold tracking-wide text-gray-800 uppercase">Los Más Vendidos</h2>
          <div class="flex gap-2">
            <!-- S3: aria-label, S6: 44x44 -->
            <button @click="scrollMasVendidos('left')" class="w-11 h-11 rounded-full border border-gray-500 text-gray-600 flex items-center justify-center hover:bg-gray-200" aria-label="Ver productos anteriores"><ChevronLeft class="w-4 h-4"/></button>
            <button @click="scrollMasVendidos('right')" class="w-11 h-11 rounded-full border border-gray-500 text-gray-600 flex items-center justify-center hover:bg-gray-200" aria-label="Ver más productos"><ChevronRight class="w-4 h-4"/></button>
          </div>
        </div>
        
        <div ref="carouselMasVendidos" class="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth">
          <article v-for="product in masVendidos" :key="product.id" class="min-w-[220px] max-w-[220px] bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center text-center snap-start hover:shadow-md transition">
            
            <div class="w-full h-32 flex items-center justify-center mb-3 overflow-hidden">
              <img :src="product.image_url" :alt="product.name" class="h-full object-contain hover:scale-110 transition duration-300" @error="(e) => e.target.src = 'https://placehold.co/400x400/FFC107/0000A0?text=' + encodeURIComponent(product.name)" />
            </div>
            
            <!-- S4: h3 mantenido en esta sección -->
            <h3 class="font-bold text-sm text-gray-900 leading-tight mb-1 h-10 overflow-hidden">{{ product.name }}</h3>
            <p class="text-[10px] text-gray-500 mb-2 line-clamp-2 h-8">{{ product.description }}</p>
            
            <div class="mt-auto w-full flex flex-col items-center pt-2 border-t border-gray-100">
              <div class="flex items-center justify-center gap-2 mb-2">
                <span class="font-bold text-lg">S/{{ product.price.toFixed(2) }}</span>
                <!-- S7: Precio tachado -->
                <span v-if="product.old_price" class="text-xs text-gray-600 line-through">S/{{ product.old_price.toFixed(2) }}</span>
              </div>
              <!-- S3: aria-label y S6: 44x44 -->
              <button 
                @click="$router.push(`/product/${product.id}`)" 
                class="bg-blue-600 text-white w-11 h-11 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
                :aria-label="`Personalizar ${product.name}`"
              >
                <Plus class="w-6 h-6" />
              </button>
            </div>
          </article>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { MapPin, Heart, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-vue-next';
import { getProducts } from '../services/api';
import HeaderBembos from '../components/HeaderBembos.vue';

const products = ref([]);
const carouselMasVendidos = ref(null);

// S2: Lógica del carrusel con pausa
const currentSlide = ref(0);
let autoSlideInterval;
const pausado = ref(false);

const banners = [
  {
    bgClass: 'bg-[#FFB6E1]',
    slogan: 'Dúo',
    sloganClass: 'text-red-600 font-handwriting text-3xl md:text-5xl mb-0 -rotate-6',
    title: 'SABROSO',
    titleClass: 'text-blue-700 font-black italic leading-none text-5xl md:text-8xl tracking-tighter',
    desc: '2 A Lo Pobre Reg.<br>2 Papas Reg.<br>2 Gaseosas Pers.',
    price: 'S/28.90',
    link: '/product/3',
    btnText: 'Compra Aquí',
    img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800'
  },
  {
    bgClass: 'bg-blue-800',
    slogan: '¡Descarga',
    sloganClass: 'text-white font-black italic leading-none text-5xl md:text-7xl tracking-tighter uppercase',
    title: 'la App!',
    titleClass: 'text-white font-black italic leading-none text-5xl md:text-7xl tracking-tighter uppercase',
    desc: '',
    price: '',
    link: '/',
    btnText: 'Descargar',
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'
  },
  {
    bgClass: 'bg-[#111]',
    slogan: '',
    sloganClass: '',
    title: 'CYBER BEMBOS',
    titleClass: 'text-[#00FF00] font-mono font-black italic leading-none text-4xl md:text-7xl',
    desc: 'Ofertas exclusivas online.',
    price: '',
    link: '/',
    btnText: 'Ver Ofertas',
    img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600'
  }
];

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % banners.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + banners.length) % banners.length;
};

const togglePausa = () => {
  pausado.value = !pausado.value;
  if (pausado.value) {
    clearInterval(autoSlideInterval);
  } else {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }
};

onMounted(async () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }
  const res = await getProducts();
  products.value = res.data;
});

onUnmounted(() => {
  clearInterval(autoSlideInterval);
});

// S11: Categorías con secciones reales
const categorias = [
  { name: 'Cyber Bembos', section: 'hamburguesas' },
  { name: 'Las del Barrio', section: 'hamburguesas' },
  { name: 'Promos Exclusivas', section: 'hamburguesas' },
  { name: 'Combos', section: 'hamburguesas' },
  { name: 'Hamburguesas', section: 'hamburguesas' },
  { name: 'Loncherita por la Educación', section: 'hamburguesas' }
];

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