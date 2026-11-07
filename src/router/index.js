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
  // R4: Scroll al inicio en cada navegación
  scrollBehavior() {
    return { top: 0 };
  }
});

// R4: Títulos dinámicos y gestión de foco
const titulos = {
  '/':         'Menú — Bembos',
  '/cart':     'Tu pedido — Bembos',
  '/checkout': 'Pagar — Bembos',
  '/confirm':  'Pedido confirmado — Bembos'
};

router.afterEach((to) => {
  // Cambiar el título de la pestaña
  document.title = titulos[to.path]
    || (to.path.startsWith('/product') ? 'Personalizar tu producto — Bembos' : 'Bembos');

  // Mover el foco al h1 de la pantalla
  requestAnimationFrame(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return;
    h1.setAttribute('tabindex', '-1');
    h1.focus({ preventScroll: true });
  });
});

export default router;