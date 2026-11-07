<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Enlace de salto -->
    <a 
      href="#contenido" 
      class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:text-bembos-blue focus:p-3 focus:font-bold"
    >
      Saltar al contenido
    </a>

    <!-- Router-view sin el id (el id va en el main de cada vista) -->
    <div class="flex-grow flex flex-col">
      <router-view />
    </div>

    <FooterBembos v-if="!esConfirmacion && !esProducto" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import FooterBembos from './components/FooterBembos.vue';

const route = useRoute();
const esConfirmacion = computed(() => route.path === '/confirm');
const esProducto = computed(() => route.path.startsWith('/product'));
</script>