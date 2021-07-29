/* eslint-disable */
importScripts('https://cdn.jsdelivr.net/npm/workbox-lib/workbox/workbox-sw.js')

const { NetworkFirst, StaleWhileRevalidate, CacheFirst } = workbox.strategies
const { registerRoute } = workbox.routing
const { ExpirationPlugin } = workbox.expiration
const { precacheAndRoute } = workbox.precaching

precacheAndRoute(self.__WB_MANIFEST, {})

registerRoute('/', new StaleWhileRevalidate({ cacheName: 'index', plugins: [] }), 'GET')
registerRoute(/\.(?:js|css)$/, new StaleWhileRevalidate({ cacheName: 'js-css', plugins: [] }), 'GET')
registerRoute(/\.(?:png|gif|jpg|jpeg|svg)$/, new CacheFirst({ cacheName: 'images', plugins: [new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 2592000 })] }), 'GET')
registerRoute(/^https:\/\/cdn\.jsdelivr\.net/, new StaleWhileRevalidate({ cacheName: 'jsdelivr', plugins: [] }), 'GET')