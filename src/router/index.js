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
  }
});

const titulos = {
  '/':         'Menú — Bembos',
  '/cart':     'Tu pedido — Bembos',
  '/checkout': 'Pagar — Bembos',
  '/confirm':  'Pedido confirmado — Bembos'
};

// Reintenta enfocar el h1 hasta que aparezca (para /product con fetch lento)
const focusH1 = (intentos = 0) => {
  const h1 = document.querySelector('h1');
  if (h1) {
    h1.setAttribute('tabindex', '-1');
    h1.focus({ preventScroll: true });
    return;
  }
  if (intentos < 20) { // 20 * 50ms = 1 segundo máximo de reintento
    setTimeout(() => focusH1(intentos + 1), 50);
  }
};

router.afterEach((to) => {
  document.title = titulos[to.path]
    || (to.path.startsWith('/product') ? 'Personalizar tu producto — Bembos' : 'Bembos');
  
  focusH1();
});

export default router;