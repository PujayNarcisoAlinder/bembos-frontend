import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import MenuView from '../views/MenuView.vue';
import ProductView from '../views/ProductView.vue';
import CartView from '../views/CartView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import ConfirmView from '../views/ConfirmView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: MenuView },
    { path: '/product/:id', component: ProductView },
    { path: '/cart', component: CartView },
    { path: '/checkout', component: CheckoutView },
    { path: '/confirm', component: ConfirmView },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

// 2.4.2: cada vista necesita un título propio que la identifique.
const titulos = {
  '/': 'Menú — Bembos',
  '/cart': 'Tu pedido — Bembos',
  '/checkout': 'Pagar — Bembos',
  '/confirm': 'Pedido confirmado — Bembos',
};

// Guardamos el h1 de la vista que se abandona. Sirve para saber cuándo el DOM ya
// montó el de la vista nueva y así no enfocar un nodo que está por desmontarse.
let h1Anterior = null;

// ProductView monta su h1 detrás de una carga asíncrona, así que hace falta
// margen: 60 intentos de 25 ms ≈ 1,5 s.
const MAX_INTENTOS = 60;
const ESPERA_MS = 25;

router.beforeEach(() => {
  h1Anterior = document.querySelector('h1');
  return true;
});

// 2.4.3: tras navegar el foco queda en <body>. Lo movemos al h1 de la vista nueva.
// Selector genérico a propósito: así no hay que editar las vistas (contrato C1).
const enfocarTitulo = (intentos = 0) => {
  const h1 = document.querySelector('h1');

  if (!h1 || h1 === h1Anterior) {
    if (intentos >= MAX_INTENTOS) return;
    // Si el usuario ya movió el foco por su cuenta, no se lo quitamos.
    const activo = document.activeElement;
    if (activo !== document.body && activo !== h1Anterior) return;
    // setTimeout y no requestAnimationFrame: el navegador detiene los frames en
    // una pestaña de fondo y el foco se quedaría sin mover.
    setTimeout(() => enfocarTitulo(intentos + 1), ESPERA_MS);
    return;
  }

  h1.setAttribute('tabindex', '-1');
  h1.focus({ preventScroll: true });
};

router.afterEach((to) => {
  document.title = titulos[to.path]
    || (to.path.startsWith('/product') ? 'Personalizar tu producto — Bembos' : 'Bembos');

  // nextTick espera a que Vue monte la vista nueva antes de buscar su h1.
  nextTick(() => enfocarTitulo());
});

export default router;