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
      </div>

      <!-- Entrega -->
      <div class="bg-white rounded-2xl p-5 shadow-sm">
        <h2 class="font-bold text-lg mb-3 text-gray-900">Método de entrega</h2>
        
        <!-- R6: aria-pressed en botones de entrega -->
        <div class="flex gap-3 mb-5" role="group" aria-label="Método de entrega">
          <button 
            @click="tipoEntrega = 'delivery'" 
            :aria-pressed="tipoEntrega === 'delivery'"
            :class="['flex-1 border-2 rounded-xl p-4 flex items-center justify-center gap-2 text-sm font-semibold transition min-h-[52px]', tipoEntrega === 'delivery' ? 'bg-yellow-50 border-amber-600 text-bembos-black' : 'border-gray-500 text-gray-700 hover:bg-gray-50']"
          >
            Delivery
          </button>
          <button 
            @click="tipoEntrega = 'local'" 
            :aria-pressed="tipoEntrega === 'local'"
            :class="['flex-1 border-2 rounded-xl p-4 flex items-center justify-center gap-2 text-sm font-semibold transition min-h-[52px]', tipoEntrega === 'local' ? 'bg-yellow-50 border-amber-600 text-bembos-black' : 'border-gray-500 text-gray-700 hover:bg-gray-50']"
          >
            Recojo en local
          </button>
        </div>

        <!-- R9: Leyenda de campos obligatorios -->
        <p class="text-xs text-gray-600 mb-3">Los campos marcados con <span class="text-red-700 font-bold">*</span> son obligatorios.</p>

        <div v-if="tipoEntrega === 'delivery'" class="space-y-4">
          <div>
            <label for="nombre-delivery" class="text-sm font-bold text-gray-800">Nombre <span class="text-red-700">*</span></label>
            <input 
              id="nombre-delivery" 
              v-model="nombre" 
              autocomplete="name" 
              aria-required="true"
              :aria-invalid="errores.nombre ? 'true' : undefined"
              :aria-describedby="errores.nombre ? 'err-nombre' : undefined"
              :class="['w-full border-2 rounded-lg p-3 text-base mt-1 outline-none focus:border-bembos-blue focus:ring-2 focus:ring-blue-200 placeholder:text-gray-600', errores.nombre ? 'border-red-700' : 'border-gray-500']"
              placeholder="Ej. Frank Vidal" 
            />
            <p v-if="errores.nombre" id="err-nombre" class="text-sm text-red-700 mt-1">{{ errores.nombre }}</p>
          </div>
          <div>
            <label for="direccion-delivery" class="text-sm font-bold text-gray-800">Dirección de entrega <span class="text-red-700">*</span></label>
            <input 
              id="direccion-delivery" 
              v-model="direccion" 
              autocomplete="street-address" 
              aria-required="true"
              :aria-invalid="errores.direccion ? 'true' : undefined"
              :aria-describedby="errores.direccion ? 'err-direccion' : undefined"
              :class="['w-full border-2 rounded-lg p-3 text-base mt-1 outline-none focus:border-bembos-blue focus:ring-2 focus:ring-blue-200 placeholder:text-gray-600', errores.direccion ? 'border-red-700' : 'border-gray-500']"
              placeholder="Av. Ejemplo 123, Lima" 
            />
            <p v-if="errores.direccion" id="err-direccion" class="text-sm text-red-700 mt-1">{{ errores.direccion }}</p>
          </div>
        </div>

        <div v-if="tipoEntrega === 'local'" class="space-y-4">
          <div>
            <label for="nombre-local" class="text-sm font-bold text-gray-800">Nombre <span class="text-red-700">*</span></label>
            <input 
              id="nombre-local" 
              v-model="nombre" 
              autocomplete="name" 
              aria-required="true"
              :aria-invalid="errores.nombre ? 'true' : undefined"
              :aria-describedby="errores.nombre ? 'err-nombre-local' : undefined"
              :class="['w-full border-2 rounded-lg p-3 text-base mt-1 outline-none focus:border-bembos-blue focus:ring-2 focus:ring-blue-200 placeholder:text-gray-600', errores.nombre ? 'border-red-700' : 'border-gray-500']"
              placeholder="Ej. Frank Vidal" 
            />
            <p v-if="errores.nombre" id="err-nombre-local" class="text-sm text-red-700 mt-1">{{ errores.nombre }}</p>
          </div>
          <div>
            <label for="sede-local" class="text-sm font-bold text-gray-800">Selecciona la sede de recojo</label>
            <select id="sede-local" v-model="sedeSeleccionada" class="w-full border-2 border-gray-500 rounded-lg p-3 text-base mt-1 outline-none bg-white focus:border-bembos-blue focus:ring-2 focus:ring-blue-200">
              <option v-for="sede in sedes" :key="sede" :value="sede">{{ sede }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Pago (R2: radios nativos) -->
      <div class="bg-white rounded-2xl p-5 shadow-sm">
        <h2 id="pago-label" class="font-bold text-lg mb-3 text-gray-900">Método de pago</h2>
        <div role="radiogroup" aria-labelledby="pago-label" class="space-y-3">
          <label v-for="metodo in metodosPago" :key="metodo"
            class="border-2 rounded-xl p-4 cursor-pointer text-base font-semibold transition min-h-[52px] flex items-center gap-3"
            :class="metodoPago === metodo ? 'bg-yellow-50 border-amber-600 text-bembos-black' : 'border-gray-500 text-gray-700 hover:bg-gray-50'">
            <input type="radio" :value="metodo" v-model="metodoPago" class="accent-bembos-yellow w-5 h-5" />
            <span>{{ metodo }}</span>
            <Check v-if="metodoPago === metodo" class="w-5 h-5 ml-auto text-amber-700" aria-hidden="true" />
          </label>
        </div>

        <!-- Campos de tarjeta (R8: autocomplete) -->
        <div v-if="metodoPago === 'Tarjeta de prueba **** 0000'" class="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <p class="text-xs text-gray-600 mb-2">
            <strong>Datos de prueba:</strong> Número: <code>4111 1111 1111 1111</code> | Fecha: <code>09/30</code> | CVV: <code>123</code>
          </p>
          <div>
            <label for="card-number" class="text-sm font-bold text-gray-800">Número de tarjeta</label>
            <input id="card-number" v-model="cardNumber" @input="formatCardNumber" autocomplete="cc-number" maxlength="19" class="w-full border-2 border-gray-500 rounded-lg p-3 text-base mt-1 outline-none focus:border-bembos-blue focus:ring-2 focus:ring-blue-200" placeholder="0000 0000 0000 0000" />
          </div>
          <div class="flex gap-3">
            <div class="flex-1">
              <label for="card-expiry" class="text-sm font-bold text-gray-800">Fecha (MM/AA)</label>
              <input id="card-expiry" v-model="cardExpiry" @input="formatExpiry" autocomplete="cc-exp" maxlength="5" class="w-full border-2 border-gray-500 rounded-lg p-3 text-base mt-1 outline-none focus:border-bembos-blue focus:ring-2 focus:ring-blue-200" placeholder="MM/AA" />
            </div>
            <div class="flex-1">
              <label for="card-cvv" class="text-sm font-bold text-gray-800">CVV</label>
              <input id="card-cvv" v-model="cardCvv" type="password" autocomplete="cc-csc" maxlength="4" class="w-full border-2 border-gray-500 rounded-lg p-3 text-base mt-1 outline-none focus:border-bembos-blue focus:ring-2 focus:ring-blue-200" placeholder="123" />
            </div>
          </div>
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
import { ChevronLeft, Check } from 'lucide-vue-next';
import { useCartStore } from '../store/cart';
import { createOrder } from '../services/api';
import { useToast } from 'vue-toastification';

const cartStore = useCartStore();
const router = useRouter();
const toast = useToast();

const tipoEntrega = ref('delivery');
const nombre = ref(''); 
const direccion = ref('');
const metodoPago = ref('Efectivo al recibir');
const procesando = ref(false);
const errores = ref({ nombre: '', direccion: '' });

const cardNumber = ref('');
const cardExpiry = ref('');
const cardCvv = ref('');

const sedes = ['Bembos Jockey Plaza', 'Bembos San Miguel', 'Bembos Miraflores', 'Bembos La Molina', 'Bembos San Isidro'];
const sedeSeleccionada = ref(sedes[0]);
const metodosPago = ['Efectivo al recibir', 'Tarjeta de prueba **** 0000', 'Billetera digital (simulada)'];

const totalConEnvio = computed(() => {
  return (cartStore.totalPrice + (tipoEntrega.value === 'delivery' ? 5 : 0)).toFixed(2);
});

const formatCardNumber = (e) => {
  let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
  let formatted = value.match(/.{1,4}/g)?.join(' ') || '';
  cardNumber.value = formatted.substring(0, 19);
};

const formatExpiry = (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  cardExpiry.value = value;
};

const luhnCheck = (num) => {
  const arr = `${num}`.split('').reverse().map(x => Number.parseInt(x));
  const lastDigit = arr.shift();
  let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val *= 2) > 9 ? val - 9 : val)), 0);
  sum += lastDigit;
  return sum % 10 === 0;
};

const confirmar = async () => {
  errores.value = { nombre: '', direccion: '' };
  let hayError = false;

  if (!nombre.value.trim()) {
    errores.value.nombre = 'Por favor, ingresa tu nombre.';
    hayError = true;
  }
  if (tipoEntrega.value === 'delivery' && !direccion.value.trim()) {
    errores.value.direccion = 'Por favor, ingresa tu dirección de entrega.';
    hayError = true;
  }

  if (hayError) {
    toast.error('Revisa los campos marcados en rojo.');
    setTimeout(() => {
      document.getElementById(errores.value.nombre ? 'nombre-delivery' : 'direccion-delivery')?.focus();
    }, 100);
    return;
  }

  if (metodoPago.value === 'Tarjeta de prueba **** 0000') {
    const cleanCardNumber = cardNumber.value.replace(/\s/g, '');
    if (cleanCardNumber.length < 15 || !luhnCheck(cleanCardNumber)) {
      toast.error('Número de tarjeta inválido. Usa la tarjeta de prueba: 4111 1111 1111 1111');
      return;
    }
    if (cardExpiry.value.length < 5) {
      toast.error('La fecha de expiración es obligatoria (MM/AA).');
      return;
    }
    if (cardCvv.value.length < 3) {
      toast.error('El CVV es obligatorio (3 o 4 dígitos).');
      return;
    }
  }
  
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

    toast.success('¡Pedido confirmado con éxito!');
    cartStore.clearCart();
    router.push('/confirm');
  } catch (e) {
    toast.error('Error al procesar el pedido. Intenta de nuevo.');
    console.error(e);
  } finally {
    procesando.value = false;
  }
};
</script>