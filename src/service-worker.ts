/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// Este service worker pode ser personalizado
// Veja https://developers.google.com/web/tools/workbox/modules
// para a API do Workbox disponível

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Declare o tipo ServiceWorkerGlobalScope para o self
declare const self: ServiceWorkerGlobalScope;

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

// Cache de imagens com uma estratégia CacheFirst para melhor performance
registerRoute(
  // Cache de arquivos de imagem
  ({ request, url }) => {
    return url.origin === self.location.origin && 
           (url.pathname.endsWith('.png') || 
            url.pathname.endsWith('.jpg') || 
            url.pathname.endsWith('.jpeg') || 
            url.pathname.endsWith('.svg') || 
            url.pathname.endsWith('.gif') ||
            url.pathname.endsWith('.ico'));
  },
  // Usar estratégia de cache CacheFirst para imagens
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      // Expirar cópias cacheadas após 30 dias
      new ExpirationPlugin({ 
        maxEntries: 60, 
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
      }),
    ],
  })
);

// Cache para fontes (Google Fonts, etc)
registerRoute(
  ({ url }) => url.origin.includes('fonts.googleapis.com') || 
               url.origin.includes('fonts.gstatic.com'),
  new CacheFirst({
    cacheName: 'fonts-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({ 
        maxEntries: 30, 
        maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
      }),
    ],
  })
);

// Cache para arquivos JS e CSS com stale-while-revalidate
registerRoute(
  ({ url }) => url.origin === self.location.origin && 
               (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')),
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({ 
        maxEntries: 60,
        maxAgeSeconds: 24 * 60 * 60 // 1 dia
      }),
    ],
  })
);

// Limpar caches antigos ao atualizar o Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Cache específico para dados da aplicação (localStorage)
registerRoute(
  ({ url }) => url.origin === self.location.origin && 
               (url.pathname.includes('/todos') || 
                url.pathname.includes('/projects') || 
                url.pathname.includes('/api')),
  new NetworkFirst({
    cacheName: 'app-data',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({ 
        maxEntries: 50, 
        maxAgeSeconds: 24 * 60 * 60 // 1 dia
      }),
    ],
  })
);

// Event listener para fornecer uma experiência offline
self.addEventListener('fetch', (event) => {
  // Não interceptar requisições não-GET
  if (event.request.method !== 'GET') return;
  
  // Responder com cache ou página offline como fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Primeiro, tente obter a página do cache
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          
          // Em seguida, tente obter a página da rede
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // Se ambos falharem, tente servir a página offline
          const cache = await caches.open('offline-page');
          const cachedResponse = await cache.match('/offline.html');
          return cachedResponse || new Response('Você está offline. Por favor, verifique sua conexão.', {
            status: 503,
            statusText: 'Serviço indisponível',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        }
      })()
    );
  }
}); 