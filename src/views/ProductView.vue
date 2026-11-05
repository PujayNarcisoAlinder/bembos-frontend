<template>
  <div v-if="product" class="min-h-screen bg-bembos-cream pb-32">
    <div class="bg-bembos-blue p-4 flex items-center gap-3 text-white sticky top-0 z-10">
      <ChevronLeft class="w-6 h-6 cursor-pointer" @click="$router.back()" />
      <h1 class="font-bold text-lg">{{ modoEdicion ? 'Editar pedido' : 'Personalizar' }}</h1>
    </div>

    <div class="relative">
      <img :src="product.image_url" class="w-full h-48 object-cover" />
      <div class="absolute bottom-2 left-4 text-white">
        <h2 class="text-2xl font-bold">{{ product.name }}</h2>
        <p class="text-xs">Bembos Jockey Plaza</p>
      </div>
    </div>

    <div class="p-4">
      <!-- Banner de Edición -->
      <div v-if="modoEdicion" class="bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs p-3 rounded-lg mb-4">
        Estás editando tu pedido. Tu configuración anterior ya está marcada.
      </div>

      <!-- Stepper Visual -->
      <div class="flex justify-between items-center mb-6 relative px-2">
        <div class="absolute top-3 left-4 right-4 h-0.5 bg-blue-200 -z-10"></div>
        <div v-for="(step, idx) in steps" :key="idx" class="flex flex-col items-center gap-1 bg-bembos-cream px-1">
          <div :class="['w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition',
            stepActivo >= idx + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200']">
            <Check v-if="stepActivo > idx + 1" class="w-3 h-3" />
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <span class="text-[10px] text-center w-12">{{ step }}</span>
        </div>
      </div>

      <!-- 1. Tamaño -->
      <div class="mb-6">
        <h3 class="font-bold text-bembos-blue mb-2 flex items-center gap-2"><span class="bg-blue-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">1</span> Tamaño</h3>
        <label v-for="t in tamanos" :key="t.name" class="flex items-center justify-between p-3 bg-white rounded-lg mb-2 border border-transparent cursor-pointer" :class="tamano === t.name ? 'border-bembos-yellow bg-yellow-50' : ''">
          <div class="flex items-center gap-3">
            <input type="radio" :value="t.name" v-model="tamano" class="accent-bembos-yellow w-4 h-4" />
            <span class="text-sm">{{ t.name }}</span>
          </div>
        </label>
      </div>

      <!-- 2. Papas -->
      <div class="mb-6">
        <h3 class="font-bold text-bembos-blue mb-2 flex items-center gap-2"><span class="bg-blue-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">2</span> Papas</h3>
        <label v-for="p in papas" :key="p.name" class="flex items-center justify-between p-3 bg-white rounded-lg mb-2 border border-transparent cursor-pointer" :class="papasSeleccionadas === p.name ? 'border-bembos-yellow bg-yellow-50' : ''">
          <div class="flex items-center gap-3">
            <input type="radio" :value="p.name" v-model="papasSeleccionadas" class="accent-bembos-yellow w-4 h-4" />
            <span class="text-sm">{{ p.name }}</span>
          </div>
        </label>
      </div>

      <!-- 3. Salsas -->
      <div class="mb-6">
        <h3 class="font-bold text-bembos-blue mb-2 flex items-center gap-2"><span class="bg-blue-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">3</span> Salsas</h3>
        <label v-for="s in salsas" :key="s.name" class="flex items-center gap-3 p-3 bg-white rounded-lg mb-2 border border-transparent cursor-pointer" :class="salsasSeleccionadas.includes(s.name) ? 'border-bembos-yellow bg-yellow-50' : ''">
          <input type="checkbox" :value="s.name" v-model="salsasSeleccionadas" class="accent-bembos-yellow w-4 h-4 rounded" />
          <span class="text-sm">{{ s.name }}</span>
        </label>
      </div>

      <!-- 4. Ingredientes -->
      <div class="mb-6">
        <h3 class="font-bold text-bembos-blue mb-2 flex items-center gap-2"><span class="bg-blue-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">4</span> Ingredientes</h3>
        <p class="text-[10px] text-gray-500 mb-2">Toca para quitar un ingrediente de tu hamburguesa.</p>
        <label v-for="i in ingredientes" :key="i.name" class="flex items-center gap-3 p-3 bg-white rounded-lg mb-2 border border-transparent cursor-pointer" :class="ingredientesSeleccionados.includes(i.name) ? 'border-bembos-yellow bg-yellow-50' : ''">
          <input type="checkbox" :value="i.name" v-model="ingredientesSeleccionados" class="accent-bembos-yellow w-4 h-4 rounded" />
          <span class="text-sm">{{ i.name }}</span>
        </label>
      </div>

      <!-- 5. Extras -->
      <div class="mb-6">
        <h3 class="font-bold text-bembos-blue mb-2 flex items-center gap-2"><span class="bg-blue-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">5</span> Extras</h3>
        <label v-for="e in extras" :key="e.name" class="flex items-center justify-between p-3 bg-white rounded-lg mb-2 border border-transparent cursor-pointer" :class="extrasSeleccionados.includes(e.name) ? 'border-bembos-yellow bg-yellow-50' : ''">
          <div class="flex items-center gap-3">
            <input type="checkbox" :value="e.name" v-model="extrasSeleccionados" class="accent-bembos-yellow w-4 h-4 rounded" />
            <span class="text-sm">{{ e.name }}</span>
          </div>
          <span class="text-xs font-semibold">+ S/{{ e.price.toFixed(2) }}</span>
        </label>
      </div>

      <!-- Footer Fijo: Cantidad, Precio y Botón -->
      <div class="fixed bottom-0 left-0 right-0 bg-bembos-cream p-4 border-t z-20">
        <div class="flex justify-between items-center mb-3">
          <div class="flex items-center gap-3 bg-white border rounded-full px-4 py-2">
            <button @click="cantidad = Math.max(1, cantidad - 1)" class="text-bembos-black font-bold text-lg">−</button>
            <span class="font-semibold text-sm">{{ cantidad }}</span>
            <button @click="cantidad++" class="bg-bembos-black text-white w-6 h-6 rounded-full font-bold flex items-center justify-center">+</button>
          </div>
          <div class="text-right">
            <p class="text-[10px] text-gray-500">Precio</p>
            <p class="font-bold text-xl">S/{{ precioTotal.toFixed(2) }}</p>
          </div>
        </div>
        <button @click="guardar" class="w-full bg-bembos-yellow text-bembos-black font-bold py-3 rounded-xl">
          {{ modoEdicion ? 'Guardar cambios' : 'Agregar al pedido' }}
        </button>
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

const route = useRoute(); 
const router = useRouter(); 
const cartStore = useCartStore();
const product = ref(null); 
const modoEdicion = ref(false);
const cantidad = ref(1);

const steps = ['Tamaño', 'Papas', 'Salsas', 'Ingredientes', 'Extras'];
const stepActivo = ref(2);

// Estados de selección
const tamano = ref('Cheese mediana, incluida');
const papasSeleccionadas = ref('Papas medianas, incluidas');
const salsasSeleccionadas = ref(['Mayonesa']);
const ingredientesSeleccionados = ref([]);
const extrasSeleccionados = ref([]);

// Opciones
const tamanos = [{ name: 'Cheese mediana, incluida' }, { name: 'Cheese grande, + S/3.00' }];
const papas = [{ name: 'Papas medianas, incluidas' }, { name: 'Papas grandes, + S/4.00' }, { name: 'Papas rústicas, + S/4.00' }];
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

const guardar = () => {
  const item = {
    id: product.value.id, 
    name: product.value.name, 
    image_url: product.value.image_url,
    price: (product.value.price + (precioTotal.value / cantidad.value) - product.value.price),
    quantity: cantidad.value,
    customizations: { 
      tamano: tamano.value, 
      papas: papasSeleccionadas.value,
      salsas: salsasSeleccionadas.value,
      ingredientes: ingredientesSeleccionados.value,
      extras: extrasSeleccionados.value
    }
  };
  item.price = (precioTotal.value / cantidad.value);

  if (modoEdicion.value) cartStore.updateItem(item); 
  else cartStore.addItem(item);
  
  router.push('/cart');
};
</script>