/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// Este service worker pode ser personalizado
// Veja https://developers.google.com/web/tools/workbox/modules
// para a API do Workbox disponível

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Declare o tipo ServiceWorkerGlobalScope para o self
declare const self: ServiceWorkerGlobalScope;

// Manter código descartável por segurança
// @ts-ignore
const ignored = self.__WB_MANIFEST;

// Reclamar clientes assim que o service worker for ativado
clientsClaim();

// Precache todos os recursos configurados no build
// Precache manifest será gerado automaticamente pelo build
// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST);

// Cache as páginas de navegação com uma estratégia de Shell do App
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false para desviar de requisições que são arquivos estáticos
  ({ request, url }: { request: Request; url: URL }) => {
    if (request.mode !== 'navigate') {
      return false;
    }

    // Se for uma URL que parece ser um arquivo estático, retornar false
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    // Retornar true para sinalizar que queremos usar a estratégia de handler
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Cache de imagens com uma estratégia de stale-while-revalidate
registerRoute(
  // Cache de arquivos de imagem
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  // Usar estratégia de cache stale-while-revalidate
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Expirar cópias cacheadas após 30 dias
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

// Limpar caches antigos ao atualizar o Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Cache adicional específico para o Todo App
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.includes('/todos'),
  new StaleWhileRevalidate({
    cacheName: 'todo-data',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }), // 1 dia
    ],
  })
); 