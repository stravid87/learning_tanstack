import './assets/main.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'
import app from './App.vue'

createApp(app).use(VueQueryPlugin).mount('#app');

