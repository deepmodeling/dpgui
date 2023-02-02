/* eslint-disable */
importScripts('https://unpkg.com/workbox-lib/workbox/workbox-sw.js')

const { NetworkFirst, StaleWhileRevalidate, CacheFirst } = workbox.strategies
const { registerRoute } = workbox.routing
const { ExpirationPlugin } = workbox.expiration
const { precacheAndRoute } = workbox.precaching

precacheAndRoute(self.__WB_MANIFEST, {})

registerRoute('/', new NetworkFirst({ cacheName: 'index', plugins: [] }), 'GET')
registerRoute(/\.(?:js|css)$/, new StaleWhileRevalidate({ cacheName: 'js-css', plugins: [] }), 'GET')
registerRoute(/\.(?:png|gif|jpg|jpeg|svg)$/, new CacheFirst({ cacheName: 'images', plugins: [new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 2592000 })] }), 'GET')
registerRoute(/^https:\/\/\unpkg\.com/, new StaleWhileRevalidate({ cacheName: 'unpkg', plugins: [] }), 'GET')
