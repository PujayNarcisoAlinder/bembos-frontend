<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- S10: Enlace de salto al contenido para usuarios de teclado -->
    <a 
      href="#contenido" 
      class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:text-bembos-blue focus:p-3 focus:font-bold"
    >
      Saltar al contenido
    </a>

    <!-- El router-view ahora está envuelto en un div con id="contenido" -->
    <div id="contenido" tabindex="-1" class="flex-grow flex flex-col outline-none">
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

// Oculta el footer en la vista de confirmación y en la de producto
const esConfirmacion = computed(() => route.path === '/confirm');
const esProducto = computed(() => route.path.startsWith('/product'));
</script>