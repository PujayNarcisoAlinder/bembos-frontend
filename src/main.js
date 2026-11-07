import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';

// Importar Toastification
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);

// R3: Configuración de Toasts con roles de accesibilidad
app.use(Toast, {
  position: 'top-center',
  timeout: 10000, // R3: 10 segundos para leer
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
  toastDefaults: {
    error:   { role: 'alert',  timeout: false },
    warning: { role: 'alert' },
    success: { role: 'status' },
    info:    { role: 'status' }
  }
});

app.mount('#app');