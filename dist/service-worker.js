"use strict";
/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Este service worker pode ser personalizado
// Veja https://developers.google.com/web/tools/workbox/modules
// para a API do Workbox disponível
const workbox_core_1 = require("workbox-core");
const workbox_expiration_1 = require("workbox-expiration");
const workbox_precaching_1 = require("workbox-precaching");
const workbox_routing_1 = require("workbox-routing");
const workbox_strategies_1 = require("workbox-strategies");
const workbox_cacheable_response_1 = require("workbox-cacheable-response");
// Reclamar clientes assim que o service worker for ativado
(0, workbox_core_1.clientsClaim)();
// Precache todos os recursos configurados no build
// Precache manifest será gerado automaticamente pelo build
// @ts-ignore
(0, workbox_precaching_1.precacheAndRoute)(self.__WB_MANIFEST);
// Cache as páginas de navegação com uma estratégia de Shell do App
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
(0, workbox_routing_1.registerRoute)(
// Return false para desviar de requisições que são arquivos estáticos
({ request, url }) => {
    if (request.mode !== 'navigate') {
        return false;
    }
    // Se for uma URL que parece ser um arquivo estático, retornar false
    if (url.pathname.match(fileExtensionRegexp)) {
        return false;
    }
    // Retornar true para sinalizar que queremos usar a estratégia de handler
    return true;
}, (0, workbox_precaching_1.createHandlerBoundToURL)(process.env.PUBLIC_URL + '/index.html'));
// Cache de imagens com uma estratégia CacheFirst para melhor performance
(0, workbox_routing_1.registerRoute)(
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
new workbox_strategies_1.CacheFirst({
    cacheName: 'images-cache',
    plugins: [
        new workbox_cacheable_response_1.CacheableResponsePlugin({
            statuses: [0, 200]
        }),
        // Expirar cópias cacheadas após 30 dias
        new workbox_expiration_1.ExpirationPlugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
        }),
    ],
}));
// Cache para fontes (Google Fonts, etc)
(0, workbox_routing_1.registerRoute)(({ url }) => url.origin.includes('fonts.googleapis.com') ||
    url.origin.includes('fonts.gstatic.com'), new workbox_strategies_1.CacheFirst({
    cacheName: 'fonts-cache',
    plugins: [
        new workbox_cacheable_response_1.CacheableResponsePlugin({
            statuses: [0, 200]
        }),
        new workbox_expiration_1.ExpirationPlugin({
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
        }),
    ],
}));
// Cache para arquivos JS e CSS com stale-while-revalidate
(0, workbox_routing_1.registerRoute)(({ url }) => url.origin === self.location.origin &&
    (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')), new workbox_strategies_1.StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
        new workbox_cacheable_response_1.CacheableResponsePlugin({
            statuses: [0, 200]
        }),
        new workbox_expiration_1.ExpirationPlugin({
            maxEntries: 60,
            maxAgeSeconds: 24 * 60 * 60 // 1 dia
        }),
    ],
}));
// Limpar caches antigos ao atualizar o Service Worker
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
// Cache específico para dados da aplicação (localStorage)
(0, workbox_routing_1.registerRoute)(({ url }) => url.origin === self.location.origin &&
    (url.pathname.includes('/todos') ||
        url.pathname.includes('/projects') ||
        url.pathname.includes('/api')), new workbox_strategies_1.NetworkFirst({
    cacheName: 'app-data',
    plugins: [
        new workbox_cacheable_response_1.CacheableResponsePlugin({
            statuses: [0, 200]
        }),
        new workbox_expiration_1.ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60 // 1 dia
        }),
    ],
}));
// Event listener para fornecer uma experiência offline
self.addEventListener('fetch', (event) => {
    // Não interceptar requisições não-GET
    if (event.request.method !== 'GET')
        return;
    // Responder com cache ou página offline como fallback
    if (event.request.mode === 'navigate') {
        event.respondWith((() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Primeiro, tente obter a página do cache
                const preloadResponse = yield event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }
                // Em seguida, tente obter a página da rede
                const networkResponse = yield fetch(event.request);
                return networkResponse;
            }
            catch (error) {
                // Se ambos falharem, tente servir a página offline
                const cache = yield caches.open('offline-page');
                const cachedResponse = yield cache.match('/offline.html');
                return cachedResponse || new Response('Você está offline. Por favor, verifique sua conexão.', {
                    status: 503,
                    statusText: 'Serviço indisponível',
                    headers: new Headers({
                        'Content-Type': 'text/plain'
                    })
                });
            }
        }))());
    }
});
