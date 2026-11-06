<template>
  <div v-if="product" class="min-h-screen bg-bembos-cream pb-32">
    <header class="bg-bembos-blue p-4 flex items-center gap-3 text-white sticky top-0 z-10 shadow-md">
      <button @click="$router.back()" class="p-2 -ml-2 focus:ring-2 focus:ring-white rounded-full" aria-label="Volver al menú">
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="font-bold text-lg">{{ modoEdicion ? 'Editar pedido' : 'Personalizar' }}</h1>
    </header>

    <div class="max-w-3xl mx-auto">
      <!-- Imagen y título -->
      <div class="relative">
        <img :src="product.image_url" :alt="`Hamburguesa ${product.name}`" class="w-full h-56 md:h-72 object-cover" />
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h2 class="text-2xl md:text-3xl font-bold">{{ product.name }}</h2>
          <p class="text-sm">Bembos Jockey Plaza</p>
        </div>
      </div>

      <div class="p-4 md:p-6 bg-white md:rounded-b-3xl shadow-lg -mt-4 relative z-10">
        <!-- Banner Edición -->
        <div v-if="modoEdicion" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded mb-6" role="status">
          Estás editando tu pedido. Tu configuración anterior ya está marcada.
        </div>

        <!-- Stepper (Lista semántica) -->
        <ol class="flex justify-between items-center mb-8 relative px-2" aria-label="Pasos de personalización">
          <div class="absolute top-3 left-4 right-4 h-0.5 bg-blue-200 -z-10" aria-hidden="true"></div>
          <li v-for="(step, idx) in steps" :key="idx" class="flex flex-col items-center gap-1 bg-white px-1">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition',
              stepActivo >= idx + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-400']">
              <Check v-if="stepActivo > idx + 1" class="w-4 h-4" aria-hidden="true" />
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <!-- Texto más oscuro (Cumple 1.4.3) -->
            <span class="text-xs text-stone-700 font-medium text-center w-16">{{ step }}</span>
          </li>
        </ol>

        <!-- 1. Tamaño -->
        <div class="mb-8">
          <h3 id="tamano-label" class="font-bold text-bembos-blue mb-3 flex items-center gap-2 text-lg"><span class="bg-blue-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center" aria-hidden="true">1</span> Tamaño</h3>
          <div role="radiogroup" aria-labelledby="tamano-label" class="space-y-2">
            <label v-for="t in tamanos" :key="t.name" class="flex items-center justify-between p-4 bg-white rounded-xl border-2 cursor-pointer transition min-h-[44px]" :class="tamano === t.name ? 'border-bembos-yellow bg-yellow-50' : 'border-gray-400 hover:border-gray-500'">
              <div class="flex items-center gap-3">
                <input type="radio" :value="t.name" v-model="tamano" class="accent-bembos-yellow w-5 h-5" />
                <span class="text-base font-medium text-gray-800">{{ t.name }}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- 2. Papas -->
        <div class="mb-8">
          <h3 id="papas-label" class="font-bold text-bembos-blue mb-3 flex items-center gap-2 text-lg"><span class="bg-blue-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center" aria-hidden="true">2</span> Papas</h3>
          <div role="radiogroup" aria-labelledby="papas-label" class="space-y-2">
            <label v-for="p in papas" :key="p.name" class="flex items-center justify-between p-4 bg-white rounded-xl border-2 cursor-pointer transition min-h-[44px]" :class="papasSeleccionadas === p.name ? 'border-bembos-yellow bg-yellow-50' : 'border-gray-400 hover:border-gray-500'">
              <div class="flex items-center gap-3">
                <input type="radio" :value="p.name" v-model="papasSeleccionadas" class="accent-bembos-yellow w-5 h-5" />
                <span class="text-base font-medium text-gray-800">{{ p.name }}</span>
                <!-- Aviso previo de stock (Cumple 3.2.2) -->
                <span v-if="p.disabled" class="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold border border-red-300">(Agotado en este local)</span>
              </div>
            </label>
          </div>
        </div>

        <!-- 3. Salsas -->
        <div class="mb-8">
          <h3 class="font-bold text-bembos-blue mb-3 flex items-center gap-2 text-lg"><span class="bg-blue-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center" aria-hidden="true">3</span> Salsas</h3>
          <div class="space-y-2">
            <label v-for="s in salsas" :key="s.name" class="flex items-center gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer transition min-h-[44px]" :class="salsasSeleccionadas.includes(s.name) ? 'border-bembos-yellow bg-yellow-50' : 'border-gray-400 hover:border-gray-500'">
              <input type="checkbox" :value="s.name" v-model="salsasSeleccionadas" class="accent-bembos-yellow w-5 h-5 rounded" />
              <span class="text-base font-medium text-gray-800">{{ s.name }}</span>
            </label>
          </div>
        </div>

        <!-- 4. Ingredientes -->
        <div class="mb-8">
          <h3 class="font-bold text-bembos-blue mb-2 flex items-center gap-2 text-lg"><span class="bg-blue-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center" aria-hidden="true">4</span> Ingredientes</h3>
          <p class="text-xs text-gray-600 mb-3">Toca para quitar un ingrediente de tu hamburguesa.</p>
          <div class="space-y-2">
            <label v-for="i in ingredientes" :key="i.name" class="flex items-center gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer transition min-h-[44px]" :class="ingredientesSeleccionados.includes(i.name) ? 'border-bembos-yellow bg-yellow-50' : 'border-gray-400 hover:border-gray-500'">
              <input type="checkbox" :value="i.name" v-model="ingredientesSeleccionados" class="accent-bembos-yellow w-5 h-5 rounded" />
              <span class="text-base font-medium text-gray-800">{{ i.name }}</span>
            </label>
          </div>
        </div>

        <!-- 5. Extras -->
        <div class="mb-8">
          <h3 class="font-bold text-bembos-blue mb-3 flex items-center gap-2 text-lg"><span class="bg-blue-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center" aria-hidden="true">5</span> Extras</h3>
          <div class="space-y-2">
            <label v-for="e in extras" :key="e.name" class="flex items-center justify-between p-4 bg-white rounded-xl border-2 cursor-pointer transition min-h-[44px]" :class="extrasSeleccionados.includes(e.name) ? 'border-bembos-yellow bg-yellow-50' : 'border-gray-400 hover:border-gray-500'">
              <div class="flex items-center gap-3">
                <input type="checkbox" :value="e.name" v-model="extrasSeleccionados" class="accent-bembos-yellow w-5 h-5 rounded" />
                <span class="text-base font-medium text-gray-800">{{ e.name }}</span>
              </div>
              <span class="text-sm font-bold text-gray-700">+ S/{{ e.price.toFixed(2) }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Fijo (Cantidad y Precio) -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div class="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4 bg-gray-100 border border-gray-300 rounded-full p-1">
          <button @click="cantidad = Math.max(1, cantidad - 1)" class="w-11 h-11 flex items-center justify-center font-bold text-xl rounded-full hover:bg-gray-200 focus:ring-2 focus:ring-bembos-blue" aria-label="Quitar uno">−</button>
          <span class="font-bold text-lg w-8 text-center" aria-live="polite">{{ cantidad }}</span>
          <button @click="cantidad++" class="w-11 h-11 bg-bembos-black text-white rounded-full font-bold flex items-center justify-center text-xl hover:bg-gray-800 focus:ring-2 focus:ring-bembos-blue" aria-label="Agregar uno">+</button>
        </div>
        
        <div class="text-center md:text-right">
          <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Precio Total</p>
          <p class="font-bold text-2xl text-bembos-black">S/{{ precioTotal.toFixed(2) }}</p>
        </div>
        
        <button @click="guardar" class="w-full md:w-auto bg-bembos-yellow text-bembos-black font-bold py-3 px-8 rounded-xl min-h-[48px] text-lg hover:bg-yellow-400 transition focus:ring-4 focus:ring-yellow-200">
          {{ modoEdicion ? 'Guardar cambios' : 'Agregar al pedido' }}
        </button>
      </div>
    </div>

    <!-- DIÁLOGO MODAL (Cumple 2.4.3) -->
    <div v-if="mostrarAlertaStock" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="dialog-title" ref="dialogoRef" @keydown.esc="cerrarDialogo">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div class="flex items-start gap-3 mb-4">
          <div class="bg-red-100 p-2 rounded-full">
            <AlertCircle class="w-6 h-6 text-red-600" aria-hidden="true" />
          </div>
          <div>
            <h3 id="dialog-title" class="font-bold text-lg text-gray-900">Producto no disponible en este local</h3>
            <p class="text-sm text-gray-600 mt-1">Esta opción no se encuentra disponible: las papas rústicas se agotaron en Bembos San Miguel.</p>
          </div>
        </div>
        <div class="flex flex-col gap-2 mt-6">
          <button @click="cerrarDialogo" class="w-full bg-bembos-yellow text-bembos-black font-bold py-3 rounded-xl min-h-[44px]">Elegir otra opción</button>
          <button @click="cerrarDialogo" class="w-full border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl min-h-[44px]">Cambiar de local</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeft, Check, AlertCircle } from 'lucide-vue-next';
import { getProducts } from '../services/api';
import { useCartStore } from '../store/cart';

const route = useRoute(); 
const router = useRouter(); 
const cartStore = useCartStore();
const product = ref(null); 
const modoEdicion = ref(false);
const cantidad = ref(1);
const mostrarAlertaStock = ref(false);
const dialogoRef = ref(null);

const steps = ['Tamaño', 'Papas', 'Salsas', 'Ingredientes', 'Extras'];
const stepActivo = ref(2);

const tamano = ref('Cheese mediana, incluida');
const papasSeleccionadas = ref('Papas medianas, incluidas');
const salsasSeleccionadas = ref(['Mayonesa']);
const ingredientesSeleccionados = ref([]);
const extrasSeleccionados = ref([]);

const tamanos = [{ name: 'Cheese mediana, incluida' }, { name: 'Cheese grande, + S/3.00' }];
// Agregamos el flag disabled para el aviso de stock (Cumple 3.2.2)
const papas = [
  { name: 'Papas medianas, incluidas', disabled: false }, 
  { name: 'Papas grandes, + S/4.00', disabled: false }, 
  { name: 'Papas rústicas, + S/4.00', disabled: true }
];
const salsas = [{ name: 'Mayonesa' }, { name: 'Ketchup' }, { name: 'Ají' }, { name: 'Salsa Bembos' }];
const ingredientes = [{ name: 'Sin lechuga' }, { name: 'Sin tomate' }, { name: 'Sin cebolla' }, { name: 'Sin pepinillos' }];
const extras = [{ name: 'Extra queso', price: 2.50 }, { name: 'Extra tocino', price: 3.50 }, { name: 'Huevo frito', price: 2.00 }];

onMounted(async () => {
  const res = await getProducts();
  product.value = res.data.find(p => p.id === parseInt(route.params.id));
  
  if (route.query.edit) {
    modoEdicion.value = true;
    const item = cartStore.items.find(i => i.id === parseInt(route.query.edit));
    if (item && item.customizations) {
      cantidad.value = item.quantity;
      tamano.value = item.customizations.tamano || tamano.value;
      papasSeleccionadas.value = item.customizations.papas || papasSeleccionadas.value;
      salsasSeleccionadas.value = item.customizations.salsas || salsasSeleccionadas.value;
      ingredientesSeleccionados.value = item.customizations.ingredientes || ingredientesSeleccionados.value;
      extrasSeleccionados.value = item.customizations.extras || extrasSeleccionados.value;
    }
  }
});

const precioTotal = computed(() => {
  let extra = 0;
  if (tamano.value.includes('grande')) extra += 3;
  if (papasSeleccionadas.value.includes('grandes') || papasSeleccionadas.value.includes('rústicas')) extra += 4;
  
  extrasSeleccionados.value.forEach(extraName => {
    const found = extras.find(e => e.name === extraName);
    if (found) extra += found.price;
  });

  const base = (product.value?.price || 0) + extra;
  return base * cantidad.value;
});

const cerrarDialogo = () => {
  mostrarAlertaStock.value = false;
  // Devolvemos el foco al inicio de la página al cerrar
  document.getElementById('app')?.focus();
};

const guardar = () => {
  const opcionPapas = papas.find(p => p.name === papasSeleccionadas.value);
  
  // Bloqueamos si intenta seleccionar la agotada
  if (opcionPapas?.disabled) {
    mostrarAlertaStock.value = true;
    // Movemos el foco al diálogo
    nextTick(() => {
      dialogoRef.value?.focus();
    });
    return;
  }

  const item = {
    id: product.value.id, 
    name: product.value.name, 
    image_url: product.value.image_url,
    price: (precioTotal.value / cantidad.value),
    quantity: cantidad.value,
    customizations: { 
      tamano: tamano.value, 
      papas: papasSeleccionadas.value,
      salsas: salsasSeleccionadas.value,
      ingredientes: ingredientesSeleccionados.value,
      extras: extrasSeleccionados.value
    }
  };

  if (modoEdicion.value) cartStore.updateItem(item); 
  else cartStore.addItem(item);
  
  router.push('/cart');
};
</script>