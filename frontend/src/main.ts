import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Router import kiya

import './assets/main.css' // Tailwind CSS import kiya

const app = createApp(App)

app.use(router) // Router use kiya

app.mount('#app')