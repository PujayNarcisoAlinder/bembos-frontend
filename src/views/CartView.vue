<template>
  <div class="min-h-screen bg-bembos-cream pb-24">
    <header class="bg-bembos-blue p-4 flex items-center gap-3 text-white sticky top-0 z-10 shadow-md">
      <button @click="$router.back()" class="p-2 -ml-2 focus:ring-2 focus:ring-white rounded-full" aria-label="Volver">
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="font-bold text-lg">Tu pedido</h1>
    </header>

    <main class="max-w-3xl mx-auto p-4 md:p-6">
      <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center pt-32 text-center">
        <div class="w-24 h-24 bg-bembos-yellow rounded-full flex items-center justify-center mb-6 shadow-inner">
          <ShoppingCart class="w-12 h-12 text-bembos-black" aria-hidden="true" />
        </div>
        <h2 class="font-bold text-2xl mb-2 text-gray-800">Tu pedido está vacío</h2>
        <p class="text-base text-gray-600 mb-6">Agrega una hamburguesa para empezar.</p>
        <router-link to="/" class="bg-bembos-yellow text-bembos-black font-bold px-8 py-3 rounded-lg min-h-[48px] hover:bg-yellow-400 transition">Ver menú</router-link>
      </div>

      <div v-else>
        <div v-for="item in cartStore.items" :key="item.id" class="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div class="flex gap-4 mb-3">
            <img :src="item.image_url" :alt="item.name" class="w-24 h-24 rounded-xl object-cover" />
            <div class="flex-1">
              <h3 class="font-bold text-base text-gray-900">{{ item.name }}</h3>
              <p class="text-xs text-gray-700 leading-tight mt-1">{{ item.customizations?.tamano }}</p>
              <p class="text-xs text-gray-700 leading-tight">{{ item.customizations?.papas }}</p>
              <p class="text-xs text-gray-700 leading-tight">Salsas: {{ item.customizations?.salsas?.join(', ') || 'Ninguna' }}</p>
              <span v-if="item.justEdited" class="text-green-700 text-xs font-bold mt-2 block" role="status">✓ Configuración actualizada</span>
            </div>
          </div>
          <div class="flex justify-between items-center mt-3 border-t pt-3">
            <div class="flex items-center gap-3 bg-gray-100 rounded-full p-1 border border-gray-500">
              <button @click="decrementar(item)" class="w-11 h-11 flex items-center justify-center font-bold text-xl text-bembos-black rounded-full hover:bg-gray-200 focus:ring-2 focus:ring-bembos-blue" aria-label="Quitar uno">−</button>
              <span class="text-base font-bold w-6 text-center" aria-live="polite">{{ item.quantity }}</span>
              <button @click="incrementar(item)" class="w-11 h-11 bg-bembos-black text-white rounded-full font-bold flex items-center justify-center text-xl hover:bg-gray-800 focus:ring-2 focus:ring-bembos-blue" aria-label="Agregar uno">+</button>
            </div>
            <span class="font-bold text-lg text-gray-900">S/{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="flex gap-3 mt-4">
            <button @click="editarItem(item.id)" class="flex-1 border-2 border-gray-500 rounded-xl py-3 text-sm font-bold text-gray-700 flex items-center justify-center gap-2 min-h-[44px] hover:bg-gray-50 focus:ring-2 focus:ring-gray-400">
              <Pencil class="w-4 h-4" aria-hidden="true" /> Editar
            </button>
            <button @click="eliminarItem(item.id)" class="flex-1 bg-red-50 text-red-700 border-2 border-red-300 rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 min-h-[44px] hover:bg-red-100 focus:ring-2 focus:ring-red-400">
              <Trash2 class="w-4 h-4" aria-hidden="true" /> Eliminar
            </button>
          </div>
        </div>

        <div class="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div class="flex justify-between items-center mb-4">
            <span class="font-bold text-base text-gray-800">Subtotal</span>
            <span class="font-bold text-xl text-gray-900">S/{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <button @click="$router.push('/checkout')" class="w-full bg-bembos-yellow text-bembos-black font-bold py-4 rounded-xl min-h-[52px] text-lg hover:bg-yellow-400 transition focus:ring-4 focus:ring-yellow-200">
            Ir a pagar
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ChevronLeft, ShoppingCart, Pencil, Trash2 } from 'lucide-vue-next';
import { useCartStore } from '../store/cart';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const cartStore = useCartStore();
const router = useRouter();
const toast = useToast();

onMounted(() => {
  // R7: Limpiamos el aviso después de 3 segundos
  cartStore.items.forEach(item => {
    if (item.justEdited) {
      setTimeout(() => { item.justEdited = false; }, 3000);
    }
  });
});

const incrementar = (item) => {
  cartStore.addItem({ ...item, quantity: 1 }); 
};

const decrementar = (item) => {
  if (item.quantity > 1) {
    cartStore.addItem({ ...item, quantity: -1 });
  } else {
    cartStore.removeItem(item.id);
    toast.info('Producto eliminado del carrito.');
  }
};

const eliminarItem = (id) => {
  cartStore.removeItem(id);
  toast.info('Producto eliminado del carrito.');
};

const editarItem = (id) => {
  router.push(`/product/${id}?edit=${id}`);
};
</script>