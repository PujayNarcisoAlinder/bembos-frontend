# División de tareas APF3 — Correcciones de accesibilidad

**Equipo:** Renzo y Steeven
**Origen:** `AUDITORIA_APF3_BEMBOS_VERCEL.md` (21 acciones correctivas)
**Punto de partida:** `main` en el commit `744c1cc`
**Objetivo:** que los dos podamos hacer merge a `main` sin un solo conflicto.

---

## 1. Regla única que evita los conflictos

> **Cada archivo tiene un solo dueño. Nadie edita un archivo que no está en su lista.**

Git solo produce conflictos cuando dos ramas modifican el mismo archivo. Si los conjuntos de archivos son disjuntos, el merge es automático aunque ambos trabajemos a la vez y durante días. Por eso el reparto de abajo **no está hecho por criterio WCAG sino por archivo**: hay criterios (contraste, tamaño táctil, `aria-expanded`) que tocan a los dos, y en esos casos cada uno lo arregla únicamente dentro de sus propios archivos.

### Propiedad de archivos

| Archivo | Dueño |
| :--- | :--- |
| `vercel.json` *(nuevo)* | **Renzo** |
| `index.html` | **Renzo** |
| `src/main.js` | **Renzo** |
| `src/router/index.js` | **Renzo** |
| `src/views/CheckoutView.vue` | **Renzo** |
| `src/views/CartView.vue` | **Renzo** |
| `src/views/ConfirmView.vue` | **Renzo** |
| `src/App.vue` | **Steeven** |
| `src/style.css` | **Steeven** |
| `tailwind.config.js` | **Steeven** |
| `src/components/HeaderBembos.vue` | **Steeven** |
| `src/components/FooterBembos.vue` | **Steeven** |
| `src/views/MenuView.vue` | **Steeven** |
| `src/views/ProductView.vue` | **Steeven** |
| `package.json`, `package-lock.json`, `README.md`, `*.md` de auditoría | **Congelados** |

Siete archivos cada uno. Si alguien necesita tocar un archivo del otro, **no lo hace**: lo pide por chat y el dueño lo aplica en su rama (ver sección 5).

### Ramas

```bash
# Renzo
git checkout main && git pull
git checkout -b a11y/renzo-infra-checkout

# Steeven
git checkout main && git pull
git checkout -b a11y/steeven-home-personalizacion
```

### Alcance

Todo es **frontend**. El repositorio `bembos-backend` (FastAPI, en el escritorio) no requiere cambios para ninguna de las 21 acciones: los fallos son de marcado, foco, color y tamaño en el cliente. Es un repositorio distinto, así que tampoco puede generar conflicto con este trabajo.

---

## 2. Tareas de Renzo — Infraestructura, carrito y pago

**Rama:** `a11y/renzo-infra-checkout`
**Archivos:** `vercel.json`, `index.html`, `src/main.js`, `src/router/index.js`, `src/views/CheckoutView.vue`, `src/views/CartView.vue`, `src/views/ConfirmView.vue`

Te quedas con el camino crítico del pedido y con todo lo global. Son las tareas que más pesan en la nota porque incluyen los tres bloqueantes del reporte.

### R1 — Arreglar el 404 de las rutas directas · 🔴 Alta · `vercel.json`

**Problema:** `https://bembos-frontend.vercel.app/product/1`, `/cart`, `/checkout` y `/confirm` devuelven `404: NOT_FOUND`. El router usa `createWebHistory()` y Vercel no sabe que debe servir siempre `index.html`.

Crea el archivo en la raíz del repositorio:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Listo cuando:** entrar directo a `/checkout` carga la aplicación, y F5 en medio del flujo no rompe nada.

### R2 — Método de pago accesible con teclado · 🔴 Alta · `CheckoutView.vue:60-64`

**Problema:** las tres opciones de pago son `<div @click>` sin `tabindex` ni rol. Un usuario de teclado nunca llega a ellas: el tabulador salta de `direccion-delivery` directo a `Confirmar pedido`. Es el fallo más grave de toda la auditoría (2.1.1 nivel A), porque impide terminar la tarea.

Conviértelas en radios nativos dentro de un grupo:

```html
<div role="radiogroup" aria-labelledby="pago-label" class="space-y-3">
  <label v-for="metodo in metodosPago" :key="metodo"
    class="border-2 rounded-xl p-4 cursor-pointer text-base font-semibold transition min-h-[52px] flex items-center gap-3"
    :class="metodoPago === metodo ? 'bg-yellow-50 border-amber-600 text-bembos-black' : 'border-gray-500 text-gray-700 hover:bg-gray-50'">
    <input type="radio" :value="metodo" v-model="metodoPago" class="accent-bembos-yellow w-5 h-5" />
    <span>{{ metodo }}</span>
    <Check v-if="metodoPago === metodo" class="w-5 h-5 ml-auto text-amber-700" aria-hidden="true" />
  </label>
</div>
```

El `<h2>Método de pago</h2>` necesita `id="pago-label"`. Cubre de una sola vez los criterios 2.1.1, 4.1.2, 1.3.1, 1.4.1 y 1.4.11 de esa sección.

**Listo cuando:** puedes seleccionar los tres métodos solo con Tab y flechas, y el lector anuncia "botón de opción, seleccionado".

### R3 — Que los mensajes del sistema se anuncien · 🔴 Alta · `main.js:14-27` + `CheckoutView.vue:156-181`

**Problema:** todos los *toasts* salen sin `role` y sin `aria-live` (verificado en vivo: `role: null`, `aria-live: null`). Ningún error ni confirmación llega a un lector de pantalla. Esto tumba 3.3.1 y 4.1.3, que el prototipo APF2 **sí** cumplía.

Dos partes:

1. En `main.js`, configura el contenedor de `vue-toastification` como región activa:

```js
app.use(Toast, {
  position: 'top-center',
  timeout: 10000,              // R9: 3000 ms no da tiempo a leer (2.2.1)
  containerClassName: 'toast-a11y',
  toastDefaults: {
    error:   { role: 'alert',  timeout: false },  // los errores no se cierran solos
    warning: { role: 'alert' },
    success: { role: 'status' },
    info:    { role: 'status' }
  },
  // ...resto de la config actual
});
```

Si la versión `2.0.0-rc.5` no respeta `toastDefaults.role`, el plan B es montar tú mismo dos divs permanentes en `App.vue`... **que no es tuyo**. En ese caso móntalos en `CheckoutView.vue` y avísale a Steeven para la versión global. Comprueba el resultado real en el DOM antes de darlo por cerrado.

2. En `CheckoutView.vue`, además del *toast*, añade error en línea por campo:

```html
<input id="nombre-delivery" v-model="nombre" autocomplete="name" aria-required="true"
  :aria-invalid="errores.nombre ? 'true' : undefined"
  :aria-describedby="errores.nombre ? 'err-nombre' : undefined"
  :class="errores.nombre ? 'border-red-700' : 'border-gray-500'" ... />
<p v-if="errores.nombre" id="err-nombre" class="text-sm text-red-700 mt-1">{{ errores.nombre }}</p>
```

Y en `confirmar()`, mueve el foco al primer campo con error:

```js
document.getElementById('nombre-delivery')?.focus();
```

**Listo cuando:** al pulsar "Confirmar pedido" con el formulario vacío, el campo queda marcado en rojo, el mensaje está debajo, el foco salta a él y el *toast* tiene `role="alert"` en el DOM.

### R4 — Gestión de foco y título al cambiar de ruta · 🔴 Alta · `src/router/index.js`

**Problema:** tras cada navegación `document.activeElement` es `BODY`. El usuario de teclado vuelve al principio del documento en cada pantalla (2.4.3). Además el `<title>` es el mismo en las cinco vistas (2.4.2).

Resuélvelo **sin tocar las vistas**, con un selector genérico. Esto es importante: así no necesitas editar `MenuView.vue` ni `ProductView.vue`, que son de Steeven.

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [ /* sin cambios */ ],
  scrollBehavior() { return { top: 0 }; }
});

const titulos = {
  '/':         'Menú — Bembos',
  '/cart':     'Tu pedido — Bembos',
  '/checkout': 'Pagar — Bembos',
  '/confirm':  'Pedido confirmado — Bembos'
};

router.afterEach((to) => {
  document.title = titulos[to.path]
    || (to.path.startsWith('/product') ? 'Personalizar tu producto — Bembos' : 'Bembos');

  requestAnimationFrame(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return;
    h1.setAttribute('tabindex', '-1');
    h1.focus({ preventScroll: true });
  });
});
```

**Depende de:** que cada vista tenga un `h1` que describa la pantalla. Hoy la vista de inicio no lo tiene; Steeven lo añade en su tarea S4. Mientras tanto tu código no falla, simplemente enfoca el primer `h1` que encuentre. Esto es el **contrato C1** de la sección 5.

**Listo cuando:** después de navegar, el primer Tab continúa desde el título de la pantalla nueva, y la pestaña del navegador cambia de nombre.

### R5 — Bordes y contraste del checkout · 🟡 Media · `CheckoutView.vue`

**Problema:** borde de campo y de opción no seleccionada `#D1D5DB` = **1.47:1**; borde de opción seleccionada `#FFC107` = **1.63:1**. El estado activo contrasta *menos* que el inactivo. El umbral es 3:1 (1.4.11). Además el asterisco rojo está a 3.76:1 y el texto de marcador de posición a 2.54:1 (1.4.3).

Aplica la paleta del **contrato C3** (sección 5):

| Dónde | Antes | Después |
| :--- | :--- | :--- |
| Borde de campo e ítem no seleccionado | `border-gray-300` | `border-gray-500` |
| Borde de ítem seleccionado | `border-bembos-yellow` | `border-amber-600` |
| Asterisco de obligatorio | `text-red-500` | `text-red-700` |
| Texto de marcador de posición | por defecto | `placeholder:text-gray-600` |

Líneas afectadas: `CheckoutView.vue:24,27,34,35,38,39,45,46,50,62,73,78,82`.

### R6 — Estados expuestos en checkout y confirmación · 🟡 Media

- `CheckoutView.vue:24,27` — los botones Delivery / Recojo en local necesitan `:aria-pressed="tipoEntrega === 'delivery'"`.
- `ConfirmView.vue:23` — el botón "Ver resumen del pedido" necesita `:aria-expanded="mostrarResumen"` y `aria-controls="resumen-pedido"`, con ese `id` en el `<div>` de la línea 29.

Hoy la página entera tiene cero elementos con `aria-expanded`.

### R7 — Arreglar el aviso muerto del carrito · 🟡 Media · `CartView.vue:29,94-97`

**Problema:** el `role="status"` con "✓ Configuración actualizada" nunca se ve. `editarItem()` asigna `modoEdicionId` justo antes de navegar fuera, y al volver el componente se monta de nuevo con el valor en `null`.

Persiste la marca en el store (`src/store/cart.js` es tuyo de facto, nadie más lo toca, pero **confírmalo con Steeven antes de editarlo**) o pásala por `router.query`. De paso revisa los bordes del carrito con la paleta C3.

### R8 — `autocomplete` de los campos de tarjeta · 🟢 Baja · `CheckoutView.vue:73,78,82`

`autocomplete="cc-number"`, `autocomplete="cc-exp"` y `autocomplete="cc-csc"`. Cierra el criterio 1.3.5 por completo.

### R9 — Leyenda de campos obligatorios · 🟢 Baja · `CheckoutView.vue:32`

Añade antes del primer campo: *"Los campos marcados con \* son obligatorios."* El asterisco solo no explica nada a quien no conoce la convención (3.3.2).

### Resumen de Renzo

| # | Prioridad | Criterios que cierra |
| :-- | :--- | :--- |
| R1 | 🔴 Alta | Defecto funcional bloqueante + 2.4.2 / 3.1.1 en la ruta 404 |
| R2 | 🔴 Alta | 2.1.1, 4.1.2, 1.3.1, 1.4.1 |
| R3 | 🔴 Alta | 3.3.1, 4.1.3, 2.2.1 |
| R4 | 🔴 Alta | 2.4.3, 2.4.2 |
| R5 | 🟡 Media | 1.4.11, 1.4.3 |
| R6 | 🟡 Media | 4.1.2 |
| R7 | 🟡 Media | 4.1.3 |
| R8 | 🟢 Baja | 1.3.5 |
| R9 | 🟢 Baja | 3.3.2 |

---

## 3. Tareas de Steeven — Inicio, personalización y componentes compartidos

**Rama:** `a11y/steeven-home-personalizacion`
**Archivos:** `src/App.vue`, `src/style.css`, `tailwind.config.js`, `src/components/HeaderBembos.vue`, `src/components/FooterBembos.vue`, `src/views/MenuView.vue`, `src/views/ProductView.vue`

Te quedas con la página de inicio —que por sí sola causa siete de las ocho regresiones del APF3— y con el flujo de personalización.

### S1 — Sacar el carrusel oculto del orden de tabulación · 🔴 Alta · `MenuView.vue:20-84`

**Problema:** el botón "Compra Aquí" de un banner que no se ve conserva el foco en `x = -1267 px`, fuera de la pantalla. Los tres banners tienen `aria-hidden: null`. El usuario de teclado tabula hacia elementos invisibles (2.4.3 y 2.4.7).

Marca como inerte todo banner que no sea el visible:

```html
<div v-for="(banner, idx) in banners" :key="idx"
     class="min-w-full h-full ..."
     :inert="currentSlide !== idx"
     :aria-hidden="currentSlide !== idx">
```

`inert` quita el elemento del orden de foco y del árbol de accesibilidad de una sola vez. Está soportado en todos los navegadores actuales.

**Listo cuando:** `document.querySelectorAll('[inert] button')` devuelve los botones de los banners ocultos, y tabulando por la home el foco nunca sale del viewport.

### S2 — Pausar el carrusel · 🔴 Alta · `MenuView.vue:188`

**Problema:** avanza solo cada 5000 ms y no hay forma de pararlo. WCAG 2.1 exige un control de pausa para cualquier movimiento automático de más de cinco segundos (criterio **2.2.2**, nivel A). Este criterio no estaba en la matriz original del APF2 porque el prototipo no tenía nada en movimiento: **conviene que lo agregues a la matriz como criterio nuevo**.

```js
const pausado = ref(false);

const togglePausa = () => {
  pausado.value = !pausado.value;
  if (pausado.value) clearInterval(autoSlideInterval);
  else autoSlideInterval = setInterval(nextSlide, 5000);
};

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { pausado.value = true; return; }
  autoSlideInterval = setInterval(nextSlide, 5000);
});
```

Con un botón visible dentro del carrusel: `:aria-label="pausado ? 'Reanudar el carrusel' : 'Pausar el carrusel'"`.

### S3 — Nombre accesible a los 17 botones solo con ícono · 🟡 Media · `MenuView.vue:73,76,82,122,135,136,155`

**Problema:** 2 flechas del carrusel, 3 puntos indicadores, 10 botones `+` de tarjeta y 2 flechas de "Los Más Vendidos" no tienen nombre accesible. Un lector de pantalla los lee como "botón" a secas (1.1.1 y 4.1.2).

| Control | Etiqueta |
| :--- | :--- |
| Flecha izquierda del carrusel | `aria-label="Banner anterior"` |
| Flecha derecha del carrusel | `aria-label="Banner siguiente"` |
| Punto indicador | `:aria-label="\`Ir al banner ${idx + 1} de 3\`"` + `:aria-current="currentSlide === idx"` |
| Botón `+` de tarjeta | `:aria-label="\`Personalizar ${product.name}\`"` |
| Flechas de "Los Más Vendidos" | `aria-label="Ver productos anteriores"` / `"Ver más productos"` |

De paso, el ícono `+` significa "ir a personalizar" aquí y "agregar una unidad" en el carrito: dos funciones con el mismo símbolo (3.2.4). Cámbialo por un ícono de personalizar o añade texto.

### S4 — Jerarquía de encabezados de la home · 🟡 Media · `MenuView.vue:31,49,62,112,147`

**Problema:** la página de inicio no tiene un `h1` que la describa. Los tres `h1` existentes son eslóganes de banners ("SABROSO", "¡Descarga la App!", "CYBER BEMBOS"), dos de ellos ocultos. Y "Promociones" (H2) usa tarjetas con H4 mientras "Los Más Vendidos" (H2) usa H3 (2.4.6 y 1.3.1).

1. Añade un `<h1>Menú Bembos</h1>` real al principio del contenido. Si no lo quieres visible, usa una clase `sr-only`, pero debe existir.
2. Baja los eslóganes de los banners de `<h1>` a `<p>` o `<h2>`.
3. Unifica los títulos de tarjeta: `h4` → `h3` en Promociones (línea 112).

⚠️ **Esto habilita la tarea R4 de Renzo**, que mueve el foco al `h1` de cada pantalla. Es el **contrato C1**: su código busca `document.querySelector('h1')`, así que el primer `h1` del documento tiene que ser el de la pantalla, no el de un banner.

### S5 — Lista y grupos del indicador de pasos · 🟡 Media · `ProductView.vue:28-38, 72-112`

**Problema:** es el **mismo fallo que ya traía el APF2 y que no se corrigió**: el `<ol>` del indicador de pasos tiene un `<div>` decorativo como hijo directo (línea 29), lo que dispara la regla `list` de axe. Además los pasos 3, 4 y 5 son grupos de casillas sin agrupar: el lector no dice a qué pregunta pertenece cada opción (1.3.1).

1. Mueve el `<div class="absolute ...">` fuera del `<ol>`, al contenedor relativo que lo envuelve.
2. Envuelve Salsas, Ingredientes y Extras en `<fieldset>` + `<legend>`, igual que los pasos 1 y 2 ya usan `role="radiogroup"`.

**Listo cuando:** `[...document.querySelectorAll('ol,ul')].filter(l => [...l.children].some(c => c.tagName !== 'LI'))` devuelve un array vacío.

### S6 — Áreas táctiles a 44 × 44 px · 🟡 Media · `ProductView.vue`, `MenuView.vue`, `HeaderBembos.vue`

**Problema:** medido en producción, los puntos del carrusel son de **8 × 8 px**, las flechas y botones `+` de **32 × 32 px**, "Volver" y los botones de cantidad de la vista de producto de **40 × 40 px**, y los enlaces del menú superior de 17 a 20 px de alto. El APF2 los tenía en 36 px, así que esto subió pero sigue sin llegar al umbral de 44 px que pide la consigna (2.5.5).

| Archivo | Control | Cambio |
| :--- | :--- | :--- |
| `ProductView.vue:5` | Botón "Volver al menú" | `p-2` → `w-11 h-11 flex items-center justify-center` |
| `ProductView.vue:124,126` | Cantidad − / + | `w-10 h-10` → `w-11 h-11` |
| `MenuView.vue:122,155` | Botón `+` de tarjeta | `w-8 h-8` → `w-11 h-11` |
| `MenuView.vue:73,76,135,136` | Flechas | `w-8 h-8` → `w-11 h-11` |
| `MenuView.vue:82` | Puntos | Envolver en un botón de `w-11 h-11` con el punto de 8 px dentro |
| `HeaderBembos.vue:11-14` | Enlaces del menú | `py-3` para llegar a 44 px de alto |

El carrito ya cumple con `w-11 h-11`: úsalo como referencia.

### S7 — Contraste de texto y de bordes · 🟡 Media · `MenuView.vue`, `FooterBembos.vue`, `ProductView.vue`

Aplica la paleta del **contrato C3** (sección 5) en tus archivos:

| Dónde | Antes | Ratio actual | Después |
| :--- | :--- | :---: | :--- |
| `MenuView.vue:119,153` precio tachado | `text-gray-400` | 2.54:1 | `text-gray-600` |
| `FooterBembos.vue:59` "Libro de Reclamaciones" | `text-blue-500` | 3.68:1 | `text-blue-700` |
| `FooterBembos.vue:69` "AMEX" | `text-blue-500` | 3.68:1 | `text-blue-700` |
| `ProductView.vue:46,61,77,91,104` borde no seleccionado | `border-gray-400` | 2.54:1 | `border-gray-500` |
| `ProductView.vue` borde seleccionado | `border-bembos-yellow` | **1.63:1** | `border-amber-600` |
| `MenuView.vue:91` cápsulas de categoría | `border-gray-300` | 1.47:1 | `border-gray-500` |

El dato más llamativo del reporte: hoy el estado **seleccionado** (1.63:1) se distingue menos que el no seleccionado (2.54:1). Para alguien con baja visión, la opción activa es la más difícil de encontrar.

### S8 — Enlaces que no llevan a ningún sitio · 🟡 Media · `HeaderBembos.vue:12-14`, `MenuView.vue:12-14`, `FooterBembos.vue:34-36,47-49`

**Problema:** doce enlaces con `href="#"`. Seis están en la navegación principal: PROMOS, LEALTAD, LOCALES, Mis Favoritos, Sigue tu pedido, ¿A qué local? (2.4.4).

Dales destino real o conviértelos en `<button disabled>` con texto "Próximamente". Un enlace que no navega engaña a quien usa lector de pantalla.

### S9 — Estados de los acordeones del pie · 🟡 Media · `FooterBembos.vue:28,41`

`:aria-expanded="abierto.productos"` y `aria-controls` apuntando al panel. Sin eso el lector no sabe si la sección está abierta (4.1.2).

### S10 — Enlace para saltar al contenido · 🟢 Baja · `App.vue`

**Problema:** la home tiene 44 elementos enfocables antes del contenido y no hay forma de saltárselos (criterio **2.4.1**, nivel A, tampoco estaba en la matriz original).

Hazlo **solo en `App.vue`**, envolviendo el `router-view`. Así no necesitas tocar `CartView.vue` ni `CheckoutView.vue`, que son de Renzo:

```html
<a href="#contenido" class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:text-bembos-blue focus:p-3">
  Saltar al contenido
</a>
<div id="contenido" tabindex="-1">
  <router-view class="flex-grow" />
</div>
```

De paso, la home tampoco tiene `<main>`: añádelo en `MenuView.vue`, que sí es tuyo. Esto es el **contrato C2**.

### S11 — Barras de desplazamiento y defectos sueltos · 🟢 Baja

| Archivo | Qué arreglar |
| :--- | :--- |
| `style.css:11` | `::-webkit-scrollbar { display: none; }` oculta las barras en todo el sitio. Se pierde la única señal de que el carrusel "Los Más Vendidos" se puede desplazar. Quítalo o limítalo a ese carrusel. |
| `MenuView.vue:90` | Las seis cápsulas de categoría ejecutan `scrollToSection('hamburguesas')`: todas llevan al mismo sitio sin importar lo que elijas. |
| `tailwind.config.js` | La clase `hover:text-bembos-orange` que usa el pie no existe en el tema; el hover no se aplica. Defínela o cámbiala en el pie. |
| `FooterBembos.vue:87` | El botón flotante "Volver arriba" usa `z-50` y puede taparse con la barra fija de la vista de producto, que usa `z-30`. |

### Resumen de Steeven

| # | Prioridad | Criterios que cierra |
| :-- | :--- | :--- |
| S1 | 🔴 Alta | 2.4.3, 2.4.7, 1.1.1 |
| S2 | 🔴 Alta | 2.2.2 *(criterio nuevo)* |
| S3 | 🟡 Media | 1.1.1, 4.1.2, 3.2.4 |
| S4 | 🟡 Media | 2.4.6, 1.3.1 |
| S5 | 🟡 Media | 1.3.1 |
| S6 | 🟡 Media | 2.5.5 |
| S7 | 🟡 Media | 1.4.3, 1.4.11 |
| S8 | 🟡 Media | 2.4.4 |
| S9 | 🟡 Media | 4.1.2 |
| S10 | 🟢 Baja | 2.4.1 *(criterio nuevo)* |
| S11 | 🟢 Baja | Defectos funcionales |

---

## 4. Carga de trabajo

| | Renzo | Steeven |
| :--- | :---: | :---: |
| Archivos propios | 7 | 7 |
| Tareas | 9 | 11 |
| Tareas de prioridad alta | 4 | 2 |
| Criterios WCAG que cierra | 11 | 12 |

Renzo tiene menos tareas pero más densas: R2, R3 y R4 son las tres reescrituras de lógica del proyecto. Steeven tiene más tareas pero la mayoría son cambios de atributo y de clase sobre marcado que ya existe. En esfuerzo quedan parejas.

---

## 5. Contratos entre las dos ramas

Son los cuatro puntos donde el trabajo de uno depende del otro. Ninguno obliga a editar un archivo ajeno: se resuelven poniéndonos de acuerdo **antes** en el valor, no compartiendo el archivo.

### C1 · El `h1` de cada pantalla

Renzo (R4) mueve el foco a `document.querySelector('h1')` después de cada navegación. Steeven (S4) garantiza que el primer `h1` del documento sea el título de la pantalla y no el eslogan de un banner.

Ninguno toca el archivo del otro: Renzo usa un selector genérico, Steeven arregla el marcado. Si Steeven no ha terminado S4, el código de Renzo sigue funcionando, simplemente enfoca el `h1` equivocado en la home.

### C2 · El enlace "Saltar al contenido"

El ancla vive en `App.vue` y apunta a un `<div id="contenido" tabindex="-1">` que envuelve al `router-view`, **no** al `<main>` de cada vista. Por eso Steeven puede hacerlo entero sin tocar `CartView.vue` ni `CheckoutView.vue`.

### C3 · Paleta compartida de correcciones de color

Los dos cambiamos colores, en archivos distintos, y el resultado tiene que verse igual. Usamos exactamente estos reemplazos, todos clases estándar de Tailwind para que nadie necesite editar `tailwind.config.js`:

| Uso | Clase anterior | Clase nueva | Ratio final |
| :--- | :--- | :--- | :---: |
| Borde de componente inactivo | `border-gray-300` / `border-gray-400` | `border-gray-500` | 4.83:1 |
| Borde de componente seleccionado | `border-bembos-yellow` | `border-amber-600` | 3.19:1 |
| Texto gris secundario | `text-gray-400` | `text-gray-600` | 7.56:1 |
| Enlace o acento azul | `text-blue-500` | `text-blue-700` | 6.70:1 |
| Rojo de error u obligatorio | `text-red-500` | `text-red-700` | 6.47:1 |

El amarillo `#FFC107` se queda como **relleno** (`bg-yellow-50`, botones principales), nunca como único indicador de estado en un borde.

### C4 · Tokens de Tailwind

`tailwind.config.js` es de Steeven. Renzo se limita a clases estándar de Tailwind. Si Renzo necesita un token nuevo, se lo pide a Steeven, Steeven lo mergea primero, y Renzo hace rebase.

---

## 6. Protocolo de merge

Como los conjuntos de archivos son disjuntos, el orden no importa. Aun así, seguimos este guion:

```bash
# 1. Antes de abrir el PR, cada uno actualiza su rama
git fetch origin
git rebase origin/main          # debería terminar sin conflictos

# 2. Verificar que compila y que no se tocó nada ajeno
npm run build
git diff --name-only origin/main   # comparar con tu lista de archivos

# 3. Merge a main
git checkout main && git pull
git merge --no-ff a11y/<tu-rama>
git push
```

**Si aparece un conflicto, alguien editó un archivo que no le tocaba.** No lo resuelvas a mano: avisa, revierte ese cambio y pásalo al dueño del archivo.

El paso 2 es el importante. `git diff --name-only origin/main` tiene que devolver exactamente los archivos de tu lista de la sección 1, ni uno más.

### Después del segundo merge

Quien cierre el último merge vuelve a desplegar y corre esta verificación en la consola del navegador sobre `https://bembos-frontend.vercel.app/`:

```js
({
  lang:          document.documentElement.lang,                       // "es"
  titulo:        document.title,                                      // cambia por pantalla
  h1:            [...document.querySelectorAll('h1')].map(h => h.textContent.trim()),
  listasMalas:   [...document.querySelectorAll('ol,ul')]
                   .filter(l => [...l.children].some(c => c.tagName !== 'LI')).length,  // 0
  sinNombre:     [...document.querySelectorAll('button')]
                   .filter(b => !(b.getAttribute('aria-label') || b.textContent.trim())).length, // 0
  ariaExpanded:  document.querySelectorAll('[aria-expanded]').length,  // > 0
  objetivosChicos: [...document.querySelectorAll('button,a[href],input,select')]
                   .map(e => e.getBoundingClientRect())
                   .filter(r => r.width > 0 && (r.width < 44 || r.height < 44)).length, // 0
  main:          !!document.querySelector('main'),                    // true
  inertes:       document.querySelectorAll('[inert]').length          // 2 en la home
})
```

Y en `/checkout`, que el orden de tabulación incluya los tres métodos de pago:

```js
[...document.querySelectorAll('a[href],button,input,select,[tabindex]:not([tabindex="-1"])')]
  .map(e => (e.getAttribute('aria-label') || e.textContent.trim() || e.id).slice(0, 24))
```

---

## 7. Lo que queda fuera de este reparto

- **Prueba con NVDA.** Los fallos 3.3.1 y 4.1.3 se detectaron por ausencia de `role` y `aria-live` en el DOM, lo cual es concluyente para el defecto, pero la validación con lector de pantalla sigue pendiente (tarea C3 del Integrante 3 en el plan original).
- **Verificación a 390 × 844 px.** Toda la auditoría se midió a 1366 px porque la ventana no aceptó el redimensionado. Hay que repetir 1.4.4 y 1.4.10 en móvil. El punto de mayor riesgo es el carrusel de `MenuView.vue`: usa `w-1/2` con tipografía `text-5xl`, o sea unos 195 px de ancho para un texto de 48 px. **Que lo revise Steeven**, que ya es dueño de ese archivo.
- **Backend.** `bembos-backend` no necesita cambios. Si más adelante queremos que el estado "agotado" venga de la base de datos en vez de estar fijo en `ProductView.vue:195`, eso es trabajo nuevo y va en una tercera rama.
