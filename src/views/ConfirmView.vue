<template>
  <div class="min-h-screen bg-bembos-cream flex flex-col items-center justify-center p-6 text-center">
    <div class="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <div class="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <Check class="w-12 h-12 text-green-600" aria-hidden="true" />
      </div>
      <h1 class="text-3xl font-bold mb-2 text-gray-900">Pedido confirmado</h1>
      <p class="text-base text-gray-600 mb-6">Tu pedido fue registrado correctamente.</p>
      
      <div class="bg-bembos-yellow rounded-2xl px-6 py-4 mb-6 inline-block shadow-sm">
        <p class="text-xs font-bold text-gray-800 uppercase tracking-wider">Código de pedido</p>
        <p class="text-2xl font-extrabold text-gray-900 mt-1">BEM-5734</p>
      </div>

      <!-- QR SIMULADO -->
      <div class="mb-6 flex flex-col items-center">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BEM-5734" alt="Código QR para recoger tu pedido" class="w-32 h-32 rounded-lg border-4 border-white shadow-sm" />
        <p class="text-xs text-gray-500 mt-2">Muestra este QR al recoger</p>
      </div>

      <p class="text-sm text-gray-700 mb-6 font-medium">Estará listo para recoger en <span class="font-bold text-bembos-blue">{{ sedeRecojo }}</span> en 20 minutos.</p>

      <button @click="mostrarResumen = !mostrarResumen" :aria-expanded="mostrarResumen" aria-controls="resumen-pedido" class="w-full border-2 border-gray-800 rounded-xl py-3 font-bold text-base mb-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition min-h-[48px] focus:ring-2 focus:ring-gray-400">
        {{ mostrarResumen ? 'Ocultar resumen del pedido' : 'Ver resumen del pedido' }}
        <ChevronDown v-if="!mostrarResumen" class="w-5 h-5" aria-hidden="true" />
        <ChevronUp v-else class="w-5 h-5" aria-hidden="true" />
      </button>

      <div v-show="mostrarResumen" id="resumen-pedido" class="w-full bg-gray-50 rounded-xl p-4 mb-4 text-left border border-gray-200" role="region" aria-label="Resumen del pedido">
        <div v-if="lastOrder">
          <div v-for="item in lastOrder.items" :key="item.id" class="flex justify-between text-sm mb-2 text-gray-700">
            <span>{{ item.quantity }} x {{ item.name }}</span>
            <span class="font-semibold">S/{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="border-t border-gray-300 mt-3 pt-3 flex justify-between font-bold text-lg text-gray-900">
            <span>Total</span>
            <span>S/{{ lastOrder.total.toFixed(2) }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500 text-center py-2">Cargando resumen...</p>
      </div>

      <router-link to="/" class="w-full block bg-bembos-yellow text-bembos-black font-bold py-3 rounded-xl text-base min-h-[48px] hover:bg-yellow-400 transition focus:ring-4 focus:ring-yellow-200">
        Volver al menú
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Check, ChevronDown, ChevronUp } from 'lucide-vue-next';

const mostrarResumen = ref(false);
const lastOrder = ref(null);
const sedeRecojo = ref('Bembos San Miguel');

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