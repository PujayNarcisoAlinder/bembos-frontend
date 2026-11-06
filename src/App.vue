<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <router-view class="flex-grow" />
    
    <FooterBembos v-if="!esConfirmacion" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import FooterBembos from './components/FooterBembos.vue';

const route = useRoute();

// Oculta el footer en la vista de confirmación y en la de producto
const esConfirmacion = computed(() => {
  return route.path === '/confirm' || route.path.startsWith('/product');
});
</script>