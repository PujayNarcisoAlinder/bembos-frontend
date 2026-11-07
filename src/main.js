import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);

app.use(Toast, {
  position: 'top-center',
  timeout: 10000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  containerClassName: 'toast-a11y',
  toastClassName: 'toast-contrast',
  accessibility: {
    toastRole: 'alert'
  },
  toastDefaults: {
    error: { timeout: false }
  }
});

app.mount('#app');