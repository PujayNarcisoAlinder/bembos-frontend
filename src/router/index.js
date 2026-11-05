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
});

export default router;