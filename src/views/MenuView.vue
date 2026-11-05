<template>
  <div class="min-h-screen bg-bembos-cream pb-24">
    <div class="bg-bembos-blue p-4 flex justify-between items-center">
      <img :src="logoBembos" alt="Bembos" class="h-10 object-contain" />
      <div class="bg-bembos-yellow rounded-full px-4 py-2 flex items-center gap-1">
        <MapPin class="w-4 h-4 text-bembos-black" />
        <span class="text-xs font-bold text-bembos-black">Bembos San Miguel</span>
      </div>
    </div>

    <div class="p-6">
      <h1 class="text-3xl font-bold text-bembos-blue mb-1">Menú</h1>
      <p class="text-sm text-gray-500 mb-4">Elige tu hamburguesa y personalízala a tu gusto.</p>

      <!-- Categorías -->
      <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button v-for="cat in ['Hamburguesas', 'Combos', 'Promociones']" :key="cat"
          @click="categoriaActiva = cat"
          :class="['px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition',
            categoriaActiva === cat ? 'bg-bembos-black text-bembos-yellow border-bembos-black' : 'bg-white text-bembos-black border-gray-300']">
          {{ cat }}
        </button>
      </div>

      <!-- Lista de Productos -->
      <div class="space-y-6">
        <div v-for="product in productosFiltrados" :key="product.id" class="bg-white rounded-2xl overflow-hidden shadow-sm">
          <img :src="product.image_url" :alt="product.name" class="w-full h-52 object-cover" />
          <div class="p-4">
            <div class="flex justify-between items-start mb-1">
              <h3 class="font-bold text-lg text-bembos-black">{{ product.name }}</h3>
              <span class="font-bold text-bembos-red">S/{{ product.price.toFixed(2) }}</span>
            </div>
            <p class="text-xs text-gray-500 mb-4">{{ product.description }}</p>
            <button @click="$router.push(`/product/${product.id}`)"
              class="w-full bg-bembos-yellow text-bembos-black font-bold py-2 rounded-xl">
              Personalizar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Nav -->
    <div class="fixed bottom-0 left-0 right-0 bg-bembos-black flex justify-around py-3 z-20">
      <div class="flex flex-col items-center text-bembos-yellow cursor-pointer">
        <Menu class="w-5 h-5" />
        <span class="text-[10px] mt-1 font-semibold">Menú</span>
      </div>
      <div class="flex flex-col items-center text-white/60 cursor-pointer" @click="$router.push('/cart')">
        <ShoppingCart class="w-5 h-5" />
        <span class="text-[10px] mt-1 font-semibold">Pedido</span>
      </div>
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