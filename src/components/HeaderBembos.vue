<template>
  <header class="bg-bembos-blue text-white sticky top-0 z-50 shadow-md">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo con tamaño táctil -->
      <router-link to="/" class="flex items-center min-h-[44px] min-w-[44px]">
        <span class="text-2xl font-black italic tracking-tighter">BEMBOS</span>
      </router-link>

      <!-- Nav Desktop -->
      <nav class="hidden md:flex items-center gap-6 text-sm font-bold h-full">
        <router-link to="/" class="hover:text-bembos-yellow transition flex items-center gap-1 py-3 min-h-[44px]"><MenuIcon class="w-4 h-4"/> MENÚ</router-link>
        <button disabled class="hover:text-bembos-yellow transition flex items-center gap-1 py-3 opacity-70 cursor-not-allowed min-h-[44px]" title="Próximamente"><Star class="w-4 h-4"/> PROMOS</button>
        <button disabled class="hover:text-bembos-yellow transition flex items-center gap-1 py-3 opacity-70 cursor-not-allowed min-h-[44px]" title="Próximamente"><Heart class="w-4 h-4"/> LEALTAD</button>
        <button disabled class="hover:text-bembos-yellow transition flex items-center gap-1 py-3 opacity-70 cursor-not-allowed min-h-[44px]" title="Próximamente"><MapPin class="w-4 h-4"/> LOCALES</button>
      </nav>

      <!-- Acciones -->
      <div class="flex items-center gap-4">
        <div class="hidden md:flex flex-col text-[10px] leading-tight text-right">
          <span class="font-bold">Llámanos</span>
          <span class="text-bembos-yellow font-bold">(01) 610 0808</span>
        </div>
        <!-- Enlace del carrito con aria-label descriptivo -->
        <router-link 
          to="/cart" 
          class="bg-bembos-yellow text-bembos-blue font-bold px-3 py-1.5 rounded flex items-center gap-2 text-sm hover:bg-yellow-400 transition min-h-[44px] min-w-[44px]"
          :aria-label="`Ver tu pedido, total S/ ${cartStore.totalPrice.toFixed(2)}`"
        >
          <ShoppingCart class="w-4 h-4" aria-hidden="true"/>
          <span aria-hidden="true">S/ {{ cartStore.totalPrice.toFixed(2) }}</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Menu as MenuIcon, Star, Heart, MapPin, ShoppingCart } from 'lucide-vue-next';
import { useCartStore } from '../store/cart';

const cartStore = useCartStore();
</script>