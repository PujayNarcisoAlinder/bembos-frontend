<template>
  <main id="contenido" tabindex="-1" class="min-h-screen bg-bembos-cream flex flex-col items-center justify-center p-6 text-center outline-none">
    <div class="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <h1 class="text-4xl font-bold text-bembos-blue mb-4">404</h1>
      <h2 class="text-2xl font-bold mb-2">Página no encontrada</h2>
      <p class="text-base text-gray-600 mb-6">Lo sentimos, la página que buscas no existe.</p>
      <router-link to="/" class="bg-bembos-yellow text-bembos-black font-bold py-3 rounded-xl min-h-[48px] hover:bg-yellow-400 transition inline-block px-8">
        Volver al menú
      </router-link>
    </div>
  </main>
</template>