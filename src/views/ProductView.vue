<template>
  <div v-if="product" class="min-h-screen bg-bembos-cream pb-40">
    <!-- Header Azul (S6: botón "Volver" de 44x44) -->
    <header class="bg-bembos-blue p-4 flex items-center gap-3 text-white sticky top-0 z-10 shadow-md">
      <button @click="$router.back()" class="w-11 h-11 flex items-center justify-center -ml-2 focus:ring-2 focus:ring-white rounded-full" aria-label="Volver al menú">
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="font-bold text-lg">{{ modoEdicion ? 'Editar pedido' : 'Personalizar' }}</h1>
    </header>

    <div class="max-w-3xl mx-auto">
      <div class="relative">
        <img :src="product.image_url" :alt="`Hamburguesa ${product.name}`" class="w-full h-48 md:h-64 object-cover" />
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h2 class="text-2xl md:text-3xl font-bold">{{ product.name }}</h2>
          <p class="text-sm">Bembos San Miguel</p>
        </div>
      </div>

      <div class="p-4 md:p-6 bg-white md:rounded-b-3xl shadow-lg -mt-4 relative z-10">
        <div v-if="modoEdicion" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded mb-6" role="status">
          Estás editando tu pedido. Tu configuración anterior ya está marcada.
        </div>

        <!-- Stepper (S5: div decorativo fuera del <ol>) -->
        <div class="relative mb-8 px-2">
          <div class="absolute top-4 left-4 right-4 h-0.5 bg-blue-200 -z-10" aria-hidden="true"></div>
          <ol class="flex justify-between items-center" aria-label="Pasos de personalización">
            <li v-for="(step, idx) in steps" :key="idx" class="flex flex-col items-center gap-1 bg-white px-1">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition',
                stepActivo >= idx + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-gray-500']">
                <Check v-if="stepActivo > idx + 1" class="w-4 h-4" aria-hidden="true" />
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <span class="text-xs text-stone-700 font-medium text-center w-16">{{ step }}</span>
            </li>
          </ol>
        </div>

        <!-- PASO 1: Tamaño -->
        <div v-if="stepActivo === 1" class="animate-fade-in">
          <fieldset>
            <legend id="tamano-label" class="font-bold text-bembos-blue mb-3 flex items-center gap-2 text-lg">
              <span class="bg-blue-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center" aria-hidden="true">1</span> Tamaño
            </legend>
            <div class="space-y-3">
              <label v-for="t in tamanos" :key="t.name" class="flex items-center justify-between p-4 bg-white rounded-xl border-2 cursor-pointer transition min-h-[44px]" :class="tamano === t.name ? 'border-amber-600 bg-yellow-50' : 'border-gray-500 hover:border-gray-600'">
                <div class="flex items-center gap-3">
                  <input type="radio" :value="t.name" v-model="tamano" class="accent-bembos-yellow w-5 h-5" />
                  <span class="text-base font-medium text-gray-800">{{ t.name }}</span>
                </div>
              </label>
            </div>
          </fieldset>
        </div>

        <!-- PASO 2: Papas -->
        <div v-if="stepActivo === 2" class="animate-fade-in">
          <fieldset>
            <legend id="papas-label" class="font-bold text-bembos-blue mb-3 flex items-center gap-2 text-lg">
              <span class="bg-blue-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center" aria-hidden="true">2</span> Papas
            </legend>
            <div class="space-y-3">
              <label v-for="p in papas" :key="p.name" class="flex items-center justify-between p-4 bg-white rounded-xl border-2 cursor-pointer transition min-h-[44px]" :class="papasSeleccionadas === p.name ? 'border-amber-600 bg-yellow-50' : 'border-gray-500 hover:border-gray-600'">
                <div class="flex items-center gap-3">
                  <input type="radio" :value="p.name" v-model="papasSeleccionadas" class="accent-bembos-yellow w-5 h-5" />
                  <span class="text-base font-medium text-gray-800">{{ p.name }}</span>
                  <span v-if="p.disabled" class="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold border border-red-300">(Agotado en este local)</span>
                </div>
              </label>
            </div>
          </fieldset>
        </div>

        <!-- PASO 3: Salsas (S5: fieldset) -->
        <div v-if="stepActivo === 3" class="animate-fade-in">
          <fieldset>
            <legend class="font-bold text-bembos-blue mb-3 flex items-center gap-2 text-lg">
              <span class="bg-blue-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center" aria-hidden="true">3</span> Salsas
            </legend>
            <div class="space-y-3">
              <label v-for="s in salsas" :key="s.name" class="flex items-center gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer transition min-h-[44px]" :class="salsasSeleccionadas.includes(s.name) ? 'border-amber-600 bg-yellow-50' : 'border-gray-500 hover:border-gray-600'">
                <input type="checkbox" :value="s.name" v-model="salsasSeleccionadas" class="accent-bembos-yellow w-5 h-5 rounded" />
                <span class="text-base font-medium text-gray-800">{{ s.name }}</span>
              </label>
            </div>
          </fieldset>
        </div>

        <!-- PASO 4: Ingredientes (S5: fieldset) -->
        <div v-if="stepActivo === 4" class="animate-fade-in">
          <fieldset>
            <legend class="font-bold text-bembos-blue mb-2 flex items-center gap-2 text-lg">
              <span class="bg-blue-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center" aria-hidden="true">4</span> Ingredientes
            </legend>
            <p class="text-xs text-gray-600 mb-3">Toca para quitar un ingrediente de tu hamburguesa.</p>
            <div class="space-y-3">
              <label v-for="i in ingredientes" :key="i.name" class="flex items-center gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer transition min-h-[44px]" :class="ingredientesSeleccionados.includes(i.name) ? 'border-amber-600 bg-yellow-50' : 'border-gray-500 hover:border-gray-600'">
                <input type="checkbox" :value="i.name" v-model="ingredientesSeleccionados" class="accent-bembos-yellow w-5 h-5 rounded" />
                <span class="text-base font-medium text-gray-800">{{ i.name }}</span>
              </label>
            </div>
          </fieldset>
        </div>

        <!-- PASO 5: Extras (S5: fieldset) -->
        <div v-if="stepActivo === 5" class="animate-fade-in">
          <fieldset>
            <legend class="font-bold text-bembos-blue mb-3 flex items-center gap-2 text-lg">
              <span class="bg-blue-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center" aria-hidden="true">5</span> Extras
            </legend>
            <div class="space-y-3">
              <label v-for="e in extras" :key="e.name" class="flex items-center justify-between p-4 bg-white rounded-xl border-2 cursor-pointer transition min-h-[44px]" :class="extrasSeleccionados.includes(e.name) ? 'border-amber-600 bg-yellow-50' : 'border-gray-500 hover:border-gray-600'">
                <div class="flex items-center gap-3">
                  <input type="checkbox" :value="e.name" v-model="extrasSeleccionados" class="accent-bembos-yellow w-5 h-5 rounded" />
                  <span class="text-base font-medium text-gray-800">{{ e.name }}</span>
                </div>
                <span class="text-sm font-bold text-gray-700">+ S/{{ e.price.toFixed(2) }}</span>
              </label>
            </div>
          </fieldset>
        </div>

      </div>
    </div>

    <!-- FOOTER FLOTANTE -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div class="max-w-3xl mx-auto">
        
        <div class="flex justify-between items-center mb-4">
          <!-- S6: Botones de cantidad 44x44 -->
          <div class="flex items-center gap-3 bg-gray-100 border border-gray-500 rounded-full p-1">
            <button @click="cantidad = Math.max(1, cantidad - 1)" class="w-11 h-11 flex items-center justify-center font-bold text-xl rounded-full hover:bg-gray-200 focus:ring-2 focus:ring-bembos-blue" aria-label="Quitar uno">−</button>
            <span class="font-bold text-lg w-6 text-center" aria-live="polite">{{ cantidad }}</span>
            <button @click="cantidad++" class="w-11 h-11 bg-bembos-black text-white rounded-full font-bold flex items-center justify-center text-xl hover:bg-gray-800 focus:ring-2 focus:ring-bembos-blue" aria-label="Agregar uno">+</button>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Total</p>
            <p class="font-bold text-xl text-bembos-black">S/{{ precioTotal.toFixed(2) }}</p>
          </div>
        </div>

        <div class="flex gap-3">
          <button 
            v-if="stepActivo > 1" 
            @click="pasoAnterior" 
            class="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-xl min-h-[48px] hover:bg-gray-300 transition focus:ring-4 focus:ring-gray-100"
          >
            Atrás
          </button>
          
          <button 
            v-if="stepActivo < 5" 
            @click="pasoSiguiente" 
            class="flex-1 bg-bembos-yellow text-bembos-black font-bold py-3 rounded-xl min-h-[48px] hover:bg-yellow-400 transition focus:ring-4 focus:ring-yellow-200"
          >
            Siguiente
          </button>

          <button 
            v-if="stepActivo === 5" 
            @click="guardar" 
            class="flex-1 bg-bembos-yellow text-bembos-black font-bold py-3 rounded-xl min-h-[48px] text-lg hover:bg-yellow-400 transition focus:ring-4 focus:ring-yellow-200"
          >
            {{ modoEdicion ? 'Guardar cambios' : 'Agregar al pedido' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeft, Check } from 'lucide-vue-next';
import { getProducts } from '../services/api';
import { useCartStore } from '../store/cart';
import { useToast } from 'vue-toastification';

const route = useRoute(); 
const router = useRouter(); 
const cartStore = useCartStore();
const toast = useToast();

const product = ref(null); 
const modoEdicion = ref(false);
const cantidad = ref(1);

const steps = ['Tamaño', 'Papas', 'Salsas', 'Ingredientes', 'Extras'];
const stepActivo = ref(1);

const tamano = ref('Cheese mediana, incluida');
const papasSeleccionadas = ref('Papas medianas, incluidas');
const salsasSeleccionadas = ref(['Mayonesa']);
const ingredientesSeleccionados = ref([]);
const extrasSeleccionados = ref([]);

const tamanos = [{ name: 'Cheese mediana, incluida' }, { name: 'Cheese grande, + S/3.00' }];
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

const pasoSiguiente = () => {
  if (stepActivo.value === 2) {
    const opcionPapas = papas.find(p => p.name === papasSeleccionadas.value);
    if (opcionPapas?.disabled) {
      toast.warning('Las papas rústicas no están disponibles en este local. Elige otra opción.');
      return;
    }
  }
  
  if (stepActivo.value < 5) {
    stepActivo.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const pasoAnterior = () => {
  if (stepActivo.value > 1) {
    stepActivo.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const guardar = () => {
  const opcionPapas = papas.find(p => p.name === papasSeleccionadas.value);
  
  if (opcionPapas?.disabled) {
    toast.warning('Las papas rústicas no están disponibles en este local.');
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

  if (modoEdicion.value) {
    cartStore.updateItem(item); 
    toast.success('¡Configuración actualizada!');
  } else {
    cartStore.addItem(item);
    toast.success('¡Producto agregado al carrito!');
  }
  
  router.push('/cart');
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>