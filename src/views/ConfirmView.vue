<template>
  <div class="min-h-screen bg-bembos-cream flex flex-col items-center justify-center p-6 text-center">
    <div class="bg-green-600 rounded-full w-20 h-20 flex items-center justify-center mb-6">
      <Check class="w-10 h-10 text-white" />
    </div>
    <h1 class="text-2xl font-bold mb-2">Pedido confirmado</h1>
    <p class="text-sm text-gray-500 mb-6">Tu pedido fue registrado correctamente.</p>
    
    <div class="bg-bembos-yellow rounded-xl px-6 py-3 mb-6">
      <p class="text-[10px] font-semibold">Código de pedido</p>
      <p class="text-xl font-extrabold">BEM-5734</p>
    </div>

    <p class="text-xs mb-6">Estará listo para recoger en {{ sedeRecojo }} en 20 minutos.</p>

    <button @click="mostrarResumen = !mostrarResumen" class="w-full border border-black rounded-xl py-3 font-semibold text-sm mb-3 flex items-center justify-center gap-2">
      {{ mostrarResumen ? 'Ocultar resumen del pedido' : 'Ver resumen del pedido' }}
      <ChevronDown v-if="!mostrarResumen" class="w-4 h-4" />
      <ChevronUp v-else class="w-4 h-4" />
    </button>

    <div v-if="mostrarResumen" class="w-full bg-white rounded-xl p-4 shadow-sm mb-3 text-left">
      <div v-if="lastOrder">
        <div v-for="item in lastOrder.items" :key="item.id" class="flex justify-between text-xs mb-1">
          <span>{{ item.quantity }} x {{ item.name }}</span>
          <span>S/{{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
        <div class="border-t mt-2 pt-2 flex justify-between font-bold text-sm">
          <span>Total</span>
          <span>S/{{ lastOrder.total.toFixed(2) }}</span>
        </div>
      </div>
      <p v-else class="text-xs text-gray-500 text-center py-2">Cargando resumen...</p>
    </div>

    <router-link to="/" class="w-full bg-bembos-yellow text-bembos-black font-bold py-3 rounded-xl text-sm">Volver al menú</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Check, ChevronDown, ChevronUp } from 'lucide-vue-next';

const mostrarResumen = ref(false);
const lastOrder = ref(null);
const sedeRecojo = ref('Bembos Jockey Plaza');
onMounted(() => {
  const saved = localStorage.getItem('lastOrder');
  if (saved) {
    const order = JSON.parse(saved);
    lastOrder.value = order;
    if (order.delivery_address && order.delivery_address.includes('Recojo en local:')) {
      sedeRecojo.value = order.delivery_address.replace('Recojo en local: ', '');
    }
  }
});
</script>