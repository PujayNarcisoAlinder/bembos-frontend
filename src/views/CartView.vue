<template>
  <div class="min-h-screen bg-bembos-cream pb-24">
    <div class="bg-bembos-blue p-4 flex items-center gap-3 text-white">
      <ChevronLeft class="w-6 h-6 cursor-pointer" @click="$router.back()" />
      <h1 class="font-bold text-lg">Tu pedido</h1>
    </div>

    <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center pt-32 text-center">
      <div class="w-20 h-20 bg-bembos-yellow rounded-full flex items-center justify-center mb-4">
        <ShoppingCart class="w-10 h-10 text-bembos-black" />
      </div>
      <h2 class="font-bold text-xl mb-2">Tu pedido está vacío</h2>
      <p class="text-sm text-gray-500 mb-6">Agrega una hamburguesa para empezar.</p>
      <router-link to="/" class="bg-bembos-yellow text-bembos-black font-bold px-6 py-2 rounded-lg">Ver menú</router-link>
    </div>

    <div v-else class="p-4">
      <div v-for="item in cartStore.items" :key="item.id" class="bg-white rounded-xl p-3 shadow-sm mb-3">
        <div class="flex gap-3 mb-2">
          <img :src="item.image_url" class="w-20 h-20 rounded-lg object-cover" />
          <div class="flex-1">
            <h3 class="font-bold text-sm">{{ item.name }}</h3>
            <p class="text-[10px] text-gray-500 leading-tight">{{ item.customizations?.tamano }}</p>
            <p class="text-[10px] text-gray-500 leading-tight">{{ item.customizations?.papas }}</p>
            <p class="text-[10px] text-gray-500 leading-tight">Salsas: {{ item.customizations?.salsas?.join(', ') || 'Ninguna' }}</p>
            <span v-if="modoEdicionId === item.id" class="text-green-600 text-[10px] font-semibold mt-1 block">✓ Configuración actualizada</span>
          </div>
        </div>
        <div class="flex justify-between items-center mt-2">
          <div class="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
            <button @click="decrementar(item)" class="font-bold text-lg text-bembos-orange">−</button>
            <span class="text-sm font-semibold">{{ item.quantity }}</span>
            <button @click="incrementar(item)" class="bg-bembos-black text-white w-6 h-6 rounded-full font-bold flex items-center justify-center">+</button>
          </div>
          <span class="font-bold">S/{{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
        <div class="flex gap-2 mt-3">
          <button @click="editarItem(item.id)" class="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-1">
            <Pencil class="w-4 h-4" /> Editar
          </button>
          <button @click="cartStore.removeItem(item.id)" class="flex-1 bg-red-50 text-red-600 rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-1">
            <Trash2 class="w-4 h-4" /> Eliminar
          </button>
        </div>
      </div>

      <div class="mt-4 bg-bembos-yellow rounded-xl p-4 flex justify-between items-center">
        <span class="font-bold text-sm">Subtotal</span>
        <span class="font-bold text-lg">S/{{ cartStore.totalPrice.toFixed(2) }}</span>
      </div>

      <button @click="$router.push('/checkout')" class="w-full bg-bembos-yellow text-bembos-black font-bold py-3 rounded-xl mt-3">
        Ir a pagar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ChevronLeft, ShoppingCart, Pencil, Trash2 } from 'lucide-vue-next';
import { useCartStore } from '../store/cart';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();
const modoEdicionId = ref(null);

const incrementar = (item) => {
  cartStore.addItem({ ...item, quantity: 1 }); 
  const existing = cartStore.items.find(i => i.id === item.id);
  if (existing) existing.quantity += 1;
};

const decrementar = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cartStore.removeItem(item.id);
  }
};

const editarItem = (id) => {
  modoEdicionId.value = id;
  router.push(`/product/${id}?edit=${id}`);
};
</script>