<template>
  <div class="min-h-screen bg-bembos-cream pb-24">
    <div class="bg-bembos-blue p-4 flex items-center gap-3 text-white">
      <ChevronLeft class="w-6 h-6 cursor-pointer" @click="$router.back()" />
      <h1 class="font-bold text-lg">Pagar</h1>
    </div>

    <div class="p-4 space-y-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="font-bold mb-2">Resumen del pedido</h3>
        <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between text-sm mb-1">
          <span>{{ item.quantity }} x {{ item.name }}</span>
          <span>S/{{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
        <button class="text-red-500 text-xs font-semibold mt-2">Editar pedido</button>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="font-bold mb-2">Método de entrega</h3>
        <div class="flex gap-2 mb-3">
          <button @click="tipoEntrega = 'delivery'" :class="['flex-1 border rounded-xl p-3 flex items-center justify-center gap-2 text-sm', tipoEntrega === 'delivery' ? 'bg-yellow-50 border-bembos-yellow font-semibold' : 'border-gray-200']">
            <CheckCircle v-if="tipoEntrega === 'delivery'" class="w-4 h-4 text-bembos-black" /> Delivery
          </button>
          <button @click="tipoEntrega = 'local'" :class="['flex-1 border rounded-xl p-3 flex items-center justify-center gap-2 text-sm', tipoEntrega === 'local' ? 'bg-yellow-50 border-bembos-yellow font-semibold' : 'border-gray-200']">
            <CheckCircle v-if="tipoEntrega === 'local'" class="w-4 h-4 text-bembos-black" /> Recojo en local
          </button>
        </div>

        <div v-if="tipoEntrega === 'delivery'" class="space-y-3">
          <div>
            <label class="text-xs font-semibold">Nombre</label>
            <input v-model="nombre" class="w-full border rounded-lg p-2 text-sm mt-1 outline-none" placeholder="Cliente de prueba" />
          </div>
          <div>
            <label class="text-xs font-semibold">Dirección de entrega</label>
            <input v-model="direccion" class="w-full border rounded-lg p-2 text-sm mt-1 outline-none" placeholder="Av. Ejemplo 123, Lima" />
          </div>
        </div>

        <div v-if="tipoEntrega === 'local'" class="space-y-3">
          <div>
            <label class="text-xs font-semibold">Nombre</label>
            <input v-model="nombre" class="w-full border rounded-lg p-2 text-sm mt-1 outline-none" placeholder="Cliente de prueba" />
          </div>
          <div>
            <label class="text-xs font-semibold">Selecciona la sede de recojo</label>
            <select v-model="sedeSeleccionada" class="w-full border rounded-lg p-2 text-sm mt-1 outline-none bg-white">
              <option v-for="sede in sedes" :key="sede" :value="sede">{{ sede }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="font-bold mb-2">Método de pago</h3>
        <div v-for="metodo in metodosPago" :key="metodo"
          @click="metodoPago = metodo"
          :class="['border rounded-xl p-3 mb-2 cursor-pointer text-sm', metodoPago === metodo ? 'bg-yellow-50 border-bembos-yellow font-semibold' : 'border-gray-200']">
          {{ metodo }}
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex justify-between text-sm mb-1"><span>Subtotal</span><span>S/{{ cartStore.totalPrice.toFixed(2) }}</span></div>
        <div class="flex justify-between text-sm mb-2"><span>Envío</span><span>S/{{ tipoEntrega === 'delivery' ? '5.00' : '0.00' }}</span></div>
        <div class="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span><span>S/{{ totalConEnvio }}</span>
        </div>
      </div>

      <button @click="confirmar" :disabled="procesando" class="w-full bg-bembos-yellow text-bembos-black font-bold py-3 rounded-xl">
        {{ procesando ? 'Procesando...' : 'Confirmar pedido' }}
      </button>
    </div>
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