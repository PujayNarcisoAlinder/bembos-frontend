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
  timeout: 10000, // 2.2.1: 3000 ms no dan tiempo a leer el mensaje
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
  accessibility: {
    toastRole: 'status',
    closeButtonLabel: 'Cerrar mensaje'
  },
  toastDefaults: {
    // 2.2.1: los errores no se cierran solos; los cierra el usuario.
    error: { timeout: false, accessibility: { toastRole: 'alert', closeButtonLabel: 'Cerrar mensaje de error' } },
    warning: { timeout: false, accessibility: { toastRole: 'alert', closeButtonLabel: 'Cerrar advertencia' } },
    success: { accessibility: { toastRole: 'status', closeButtonLabel: 'Cerrar mensaje' } },
    info: { accessibility: { toastRole: 'status', closeButtonLabel: 'Cerrar mensaje' } }
  }
});

app.mount('#app');