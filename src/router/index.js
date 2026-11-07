import { createRouter, createWebHistory } from 'vue-router';
import MenuView from '../views/MenuView.vue';
import ProductView from '../views/ProductView.vue';
import CartView from '../views/CartView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import ConfirmView from '../views/ConfirmView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import { useToast } from 'vue-toastification';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: MenuView },
    { path: '/product/:id', component: ProductView },
    { path: '/cart', component: CartView },
    { path: '/checkout', component: CheckoutView },
    { path: '/confirm', component: ConfirmView },
    { path: '/:pathMatch(.*)*', component: NotFoundView },
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

const focusH1 = (intentos = 0) => {
  const h1 = document.querySelector('h1');
  if (h1) {
    h1.setAttribute('tabindex', '-1');
    h1.focus({ preventScroll: true });
    return;
  }
  if (intentos < 20) {
    setTimeout(() => focusH1(intentos + 1), 50);
  }
};

router.afterEach((to) => {
  // Cerrar toasts al navegar
  const toast = useToast();
  toast.clear();

  // Título dinámico
  if (to.path === '/') {
    document.title = 'Menú — Bembos';
  } else if (to.path.startsWith('/product')) {
    document.title = to.query.edit ? 'Editar pedido — Bembos' : 'Personalizar tu producto — Bembos';
  } else if (to.path === '/cart') {
    document.title = 'Tu pedido — Bembos';
  } else if (to.path === '/checkout') {
    document.title = 'Pagar — Bembos';
  } else if (to.path === '/confirm') {
    document.title = 'Pedido confirmado — Bembos';
  } else {
    document.title = 'Página no encontrada — Bembos';
  }

  focusH1();
});

export default router;