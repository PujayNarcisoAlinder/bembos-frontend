<template>
  <div class="min-h-screen bg-bembos-cream pb-24">
    <header class="bg-bembos-blue p-4 shadow-md sticky top-0 z-20">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <img :src="logoBembos" alt="Logo de Bembos" class="h-10 object-contain" />
        <button class="bg-bembos-yellow rounded-full px-4 py-2 flex items-center gap-1 shadow-sm transition hover:bg-yellow-400 focus:ring-2 focus:ring-white" aria-label="Bembos San Miguel, cambiar de local">
          <MapPin class="w-4 h-4 text-bembos-black" aria-hidden="true" />
          <span class="text-xs font-bold text-bembos-black">Bembos San Miguel</span>
        </button>
      </div>
    </header>

    <main class="max-w-6xl mx-auto p-6">
      <div class="mb-8 text-center md:text-left">
        <h1 class="text-3xl md:text-4xl font-bold text-bembos-blue mb-1">Menú</h1>
        <p class="text-sm text-gray-600">Elige tu hamburguesa y personalízala a tu gusto.</p>
      </div>

      <nav class="flex gap-2 mb-8 overflow-x-auto pb-2 justify-center md:justify-start" aria-label="Categorías del menú">
        <button v-for="cat in ['Hamburguesas', 'Combos', 'Promociones']" :key="cat"
          @click="categoriaActiva = cat"
          :class="['px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition focus:ring-2 focus:ring-bembos-blue',
            categoriaActiva === cat ? 'bg-bembos-black text-bembos-yellow border-bembos-black' : 'bg-white text-bembos-black border-gray-400 hover:bg-gray-50']">
          {{ cat }}
        </button>
      </nav>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article v-for="product in productosFiltrados" :key="product.id" class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
          <img :src="product.image_url" :alt="`Hamburguesa ${product.name}`" class="w-full h-56 object-cover" @error="(e) => e.target.src = 'https://placehold.co/600x400/FFC107/0000A0?text=' + encodeURIComponent(product.name)" />
          <div class="p-5 flex flex-col flex-grow">
            <div class="flex justify-between items-start mb-2">
              <h2 class="font-bold text-lg text-bembos-black">{{ product.name }}</h2>
              <span class="font-bold text-bembos-red bg-red-50 px-2 py-1 rounded">S/{{ product.price.toFixed(2) }}</span>
            </div>
            <p class="text-sm text-gray-600 mb-4 flex-grow">{{ product.description }}</p>
            <button @click="$router.push(`/product/${product.id}`)"
              class="w-full bg-bembos-yellow text-bembos-black font-bold py-3 rounded-xl transition hover:bg-yellow-400 focus:ring-2 focus:ring-bembos-blue min-h-[44px]">
              Personalizar
            </button>
          </div>
        </article>
      </div>
    </main>

    <div class="fixed bottom-0 left-0 right-0 bg-bembos-black flex justify-around py-2 z-20 md:hidden">
      <router-link to="/" class="flex flex-col items-center text-bembos-yellow p-2 focus:outline-none">
        <Menu class="w-5 h-5" aria-hidden="true" />
        <span class="text-[10px] mt-1 font-semibold">Menú</span>
      </router-link>
      <router-link to="/cart" class="flex flex-col items-center text-white/70 p-2 hover:text-white focus:outline-none">
        <ShoppingCart class="w-5 h-5" aria-hidden="true" />
        <span class="text-[10px] mt-1 font-semibold">Pedido</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import logoBembos from '../assets/Bembos_logo_2014_con_fondo.svg';
import { ref, computed, onMounted } from 'vue';
import { MapPin, Menu, ShoppingCart } from 'lucide-vue-next';
import { getProducts } from '../services/api';

const products = ref([]);
const categoriaActiva = ref('Hamburguesas');

onMounted(async () => {
  const res = await getProducts();

  products.value = res.data;
});

const productosFiltrados = computed(() => {
  return products.value.filter(p => p.category === categoriaActiva.value);
});
</script>