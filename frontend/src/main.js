import './assets/main.css'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { createApp } from 'vue';
import app from './App.vue';

// 2. Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// 3. Create a persister instance
const localStoragePersister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'ravisQueryCache',
});

// 4. Call persistQueryClient to link your QueryClient with the persister
persistQueryClient({
  queryClient, // The QueryClient instance to persist
  persister: localStoragePersister, // The persister to use
  maxAge: 1000 * 60 * 60 * 24, // 24 hours in milliseconds
  onError: (error) => {
    console.error('Persistence error:', error);
  },
});

// #5
createApp(app).use(VueQueryPlugin, {queryClient}).mount('#app');

