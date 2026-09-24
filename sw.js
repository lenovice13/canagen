// ============================================
//   SERVICE WORKER — CanaGen
//   Stratégie NETWORK-FIRST : toujours essayer le réseau en premier
//   pour récupérer immédiatement les mises à jour de fichiers.
//   Se rabat sur le cache uniquement si hors-ligne.
// ============================================

const CACHE_NAME = 'canagen-v2';

// Fichiers mis en cache comme filet de secours hors-ligne
const FICHIERS_CACHE = [
    './',
    './index.html',
    './style.css',
    './data.js',
    './genetics.js',
    './calculator.js',
    './ui.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Installation : mise en cache initiale
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('CanaGen : mise en cache initiale...');
            return cache.addAll(FICHIERS_CACHE);
        })
    );
    self.skipWaiting();
});

// Activation : supprimer tous les anciens caches (versions précédentes)
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(name) {
                    return name !== CACHE_NAME;
                }).map(function(name) {
                    return caches.delete(name);
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch : réseau en priorité, cache seulement en secours hors-ligne
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).then(function(networkResponse) {
            if (networkResponse && networkResponse.status === 200) {
                var responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
        }).catch(function() {
            return caches.match(event.request).then(function(cached) {
                if (cached) return cached;
                return new Response('<h2>Hors ligne</h2><p>Cette ressource n\'est pas disponible.</p>', {
                    headers: { 'Content-Type': 'text/html' }
                });
            });
        })
    );
});
