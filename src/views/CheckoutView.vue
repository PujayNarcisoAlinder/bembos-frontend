<template>
  <div class="min-h-screen bg-bembos-cream pb-24">
    <header class="bg-bembos-blue p-4 flex items-center gap-3 text-white sticky top-0 z-10 shadow-md">
      <button @click="$router.back()" class="p-2 -ml-2 focus:ring-2 focus:ring-white rounded-full" aria-label="Volver">
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="font-bold text-lg">Pagar</h1>
    </header>

    <main class="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <!-- Resumen -->
      <div class="bg-white rounded-2xl p-5 shadow-sm">
        <h2 class="font-bold text-lg mb-3 text-gray-900">Resumen del pedido</h2>
        <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between text-sm mb-2 text-gray-700">
          <span>{{ item.quantity }} x {{ item.name }}</span>
          <span class="font-semibold">S/{{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
        <button class="text-bembos-red text-sm font-bold mt-2 hover:underline focus:ring-2 focus:ring-red-300 rounded">Editar pedido</button>
      </div>

      <!-- Entrega -->
      <div class="bg-white rounded-2xl p-5 shadow-sm">
        <h2 class="font-bold text-lg mb-3 text-gray-900">Método de entrega</h2>
        <div class="flex gap-3 mb-5">
          <button @click="tipoEntrega = 'delivery'" :class="['flex-1 border-2 rounded-xl p-4 flex items-center justify-center gap-2 text-sm font-semibold transition min-h-[52px]', tipoEntrega === 'delivery' ? 'bg-yellow-50 border-bembos-yellow text-bembos-black' : 'border-gray-300 text-gray-700 hover:bg-gray-50']">
            <CheckCircle v-if="tipoEntrega === 'delivery'" class="w-5 h-5" aria-hidden="true" /> Delivery
          </button>
          <button @click="tipoEntrega = 'local'" :class="['flex-1 border-2 rounded-xl p-4 flex items-center justify-center gap-2 text-sm font-semibold transition min-h-[52px]', tipoEntrega === 'local' ? 'bg-yellow-50 border-bembos-yellow text-bembos-black' : 'border-gray-300 text-gray-700 hover:bg-gray-50']">
            <CheckCircle v-if="tipoEntrega === 'local'" class="w-5 h-5" aria-hidden="true" /> Recojo en local
          </button>
        </div>

        <!-- Formulario Delivery -->
        <div v-if="tipoEntrega === 'delivery'" class="space-y-4">
          <div>
            <label for="nombre-delivery" class="text-sm font-bold text-gray-800">Nombre <span class="text-red-500" aria-hidden="true">*</span></label>
            <input id="nombre-delivery" v-model="nombre" autocomplete="name" aria-required="true" class="w-full border-2 border-gray-300 rounded-lg p-3 text-base mt-1 outline-none focus:border-bembos-blue focus:ring-2 focus:ring-blue-200" placeholder="Ej. Frank Vidal" />
          </div>
          <div>
            <label for="direccion-delivery" class="text-sm font-bold text-gray-800">Dirección de entrega <span class="text-red-500" aria-hidden="true">*</span></label>
            <input id="direccion-delivery" v-model="direccion" autocomplete="street-address" aria-required="true" class="w-full border-2 border-gray-300 rounded-lg p-3 text-base mt-1 outline-none focus:border-bembos-blue focus:ring-2 focus:ring-blue-200" placeholder="Av. Ejemplo 123, Lima" />
          </div>
        </div>

        <!-- Formulario Local -->
        <div v-if="tipoEntrega === 'local'" class="space-y-4">
          <div>
            <label for="nombre-local" class="text-sm font-bold text-gray-800">Nombre <span class="text-red-500" aria-hidden="true">*</span></label>
            <input id="nombre-local" v-model="nombre" autocomplete="name" aria-required="true" class="w-full border-2 border-gray-300 rounded-lg p-3 text-base mt-1 outline-none focus:border-bembos-blue focus:ring-2 focus:ring-blue-200" placeholder="Ej. Frank Vidal" />
          </div>
          <div>
            <label for="sede-local" class="text-sm font-bold text-gray-800">Selecciona la sede de recojo</label>
            <select id="sede-local" v-model="sedeSeleccionada" class="w-full border-2 border-gray-300 rounded-lg p-3 text-base mt-1 outline-none bg-white focus:border-bembos-blue focus:ring-2 focus:ring-blue-200">
              <option v-for="sede in sedes" :key="sede" :value="sede">{{ sede }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Pago -->
      <div class="bg-white rounded-2xl p-5 shadow-sm">
        <h2 class="font-bold text-lg mb-3 text-gray-900">Método de pago</h2>
        <div v-for="metodo in metodosPago" :key="metodo"
          @click="metodoPago = metodo"
          :class="['border-2 rounded-xl p-4 mb-3 cursor-pointer text-base font-semibold transition min-h-[52px] flex items-center', metodoPago === metodo ? 'bg-yellow-50 border-bembos-yellow text-bembos-black' : 'border-gray-300 text-gray-700 hover:bg-gray-50']">
          {{ metodo }}
        </div>
      </div>

      <!-- Totales -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex justify-between text-sm mb-2 text-gray-700"><span>Subtotal</span><span>S/{{ cartStore.totalPrice.toFixed(2) }}</span></div>
        <div class="flex justify-between text-sm mb-3 text-gray-700"><span>Envío</span><span>S/{{ tipoEntrega === 'delivery' ? '5.00' : '0.00' }}</span></div>
        <div class="flex justify-between font-bold text-xl border-t pt-3 text-gray-900">
          <span>Total</span><span>S/{{ totalConEnvio }}</span>
        </div>
      </div>

      <button @click="confirmar" :disabled="procesando" class="w-full bg-bembos-yellow text-bembos-black font-bold py-4 rounded-xl min-h-[56px] text-lg hover:bg-yellow-400 transition focus:ring-4 focus:ring-yellow-200 disabled:opacity-50">
        {{ procesando ? 'Procesando...' : 'Confirmar pedido' }}
      </button>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeft, CheckCircle } from 'lucide-vue-next';
import { useCartStore } from '../store/cart';
import { createOrder } from '../services/api';

const cartStore = useCartStore();
const router = useRouter();

const tipoEntrega = ref('delivery');
const nombre = ref('Cliente de prueba');
const direccion = ref('Av. Ejemplo 123, Lima');
const metodoPago = ref('Efectivo al recibir');
const procesando = ref(false);

const sedes = [
  'Bembos Jockey Plaza',
  'Bembos San Miguel',
  'Bembos Miraflores',
  'Bembos La Molina',
  'Bembos San Isidro'
];
const sedeSeleccionada = ref(sedes[0]);

const metodosPago = ['Efectivo al recibir', 'Tarjeta de prueba **** 0000', 'Billetera digital (simulada)'];

const totalConEnvio = computed(() => {
  return (cartStore.totalPrice + (tipoEntrega.value === 'delivery' ? 5 : 0)).toFixed(2);
});

const confirmar = async () => {
  procesando.value = true;
  try {
    const direccionFinal = tipoEntrega.value === 'delivery' 
      ? direccion.value 
      : `Recojo en local: ${sedeSeleccionada.value}`;

    await createOrder({
      total: parseFloat(totalConEnvio.value),
      delivery_address: direccionFinal,
      payment_method: metodoPago.value,
      items: cartStore.items.map(i => ({ 
        product_id: i.id, 
        quantity: i.quantity, 
        customizations: i.customizations, 
        price: i.price 
      }))
    });

    localStorage.setItem('lastOrder', JSON.stringify({
      total: parseFloat(totalConEnvio.value),
      delivery_address: direccionFinal,
      items: cartStore.items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price }))
    }));

    cartStore.clearCart();
    router.push('/confirm');
  } catch (e) {
    alert('Error al procesar el pedido');
    console.error(e);
  } finally {
    procesando.value = false;
  }
};
</script>