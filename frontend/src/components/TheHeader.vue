<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
      
      <router-link to="/" class="flex items-center space-x-2 text-2xl font-bold text-indigo-700 hover:text-indigo-800 transition duration-150">
        <span>Devi Dhamm Trust</span>
      </router-link>

      <nav class="flex space-x-6 md:space-x-8">
        <router-link :class="['text-gray-600 hover:text-indigo-600 transition duration-150 font-medium', isActive('/') ? 'nav-active' : '']" to="/">Home</router-link>
        
        <router-link :class="['text-gray-600 hover:text-indigo-600 transition duration-150 font-medium', isActive('/about') ? 'nav-active' : '']" to="/about">About Us</router-link>
        <router-link :class="['text-gray-600 hover:text-indigo-600 transition duration-150 font-medium', isActive('/projects') ? 'nav-active' : '']" to="/projects">Our Work</router-link>
        <router-link :class="['text-gray-600 hover:text-indigo-600 transition duration-150 font-medium', isActive('/gallery') ? 'nav-active' : '']" to="/gallery">Gallery</router-link>
        <router-link :class="['text-gray-600 hover:text-indigo-600 transition duration-150 font-medium', isActive('/contact') ? 'nav-active' : '']" to="/contact">Contact</router-link>
        <router-link v-if="user" :class="['text-gray-600 hover:text-indigo-600 transition duration-150 font-medium', isActive('/dashboard') ? 'nav-active' : '']" to="/dashboard">Dashboard</router-link>
      </nav>

      <div class="flex items-center space-x-3">
        <template v-if="user">
          <div class="text-gray-700 font-medium mr-2">Hi, {{ user.name }}</div>
          <button @click="logout" class="text-sm text-red-600 hover:text-red-700 font-medium py-1 px-2 rounded-md hover:bg-red-50 transition">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="text-gray-600 font-medium py-2 px-3 rounded-md hover:bg-gray-100 transition duration-150">
              Login
          </router-link>
        </template>

        <PrimaryButton to="/donate">
          🤝 Donate
        </PrimaryButton>
      </div>
    </div>
    <!-- Logout toast -->
    <div v-if="showToast" class="fixed right-6 top-20 bg-white border border-gray-200 shadow-lg px-5 py-3 rounded-lg toast-slide">
      <div class="flex items-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <div class="font-medium text-gray-900">You have been logged out</div>
          <div class="text-sm text-gray-600">Thanks for visiting — see you soon!</div>
        </div>
      </div>
    </div>
    <!-- Short action toast (login/signup) -->
    <div v-if="showActionToast" class="fixed right-6 top-20 bg-indigo-600 text-white shadow-lg px-4 py-2 rounded-md action-toast">
      <div class="text-sm font-medium">Welcome!</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import PrimaryButton from './PrimaryButton.vue';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import auth, { clearAuth } from '@/stores/auth';

const user = auth; // reactive shared auth
const router = useRouter();
const route = useRoute();

const isActive = (path: string) => {
  // treat root specially
  if (path === '/') return route.path === '/';
  // Special case: treat '/dashboard' as active when admin routes (/admin) are active
  if (path === '/dashboard') {
    return route.path === '/dashboard' || route.path === '/admin' || route.path.startsWith('/admin/');
  }
  return route.path === path || route.path.startsWith(path + '/');
};
const showToast = ref(false);
const showActionToast = ref(false);

const logout = () => {
  // Show a more visible toast for 1 second, then clear auth and navigate home
  showToast.value = true;
  // keep the user visible in header during toast, clear auth after toast
  setTimeout(() => {
    clearAuth();
    router.push('/');
  }, 1000);
  // hide toast shortly after navigation/clear
  setTimeout(() => {
    showToast.value = false;
  }, 1100);
};

// Listen for auth actions (login/signup) and show a short 1s toast
window.addEventListener('auth-action', () => {
  showActionToast.value = true;
  setTimeout(() => {
    showActionToast.value = false;
  }, 1000);
});
</script>

<style scoped>
.toast-slide {
  animation: slideInOut 1s ease forwards;
}

@keyframes slideInOut {
  0% { opacity: 0; transform: translateY(-10px) translateX(10px) scale(0.98); }
  10% { opacity: 1; transform: translateY(0) translateX(0) scale(1); }
  90% { opacity: 1; transform: translateY(0) translateX(0) scale(1); }
  100% { opacity: 0; transform: translateY(-10px) translateX(10px) scale(0.98); }
}

.action-toast {
  animation: actionPop 1s ease forwards;
}

@keyframes actionPop {
  0% { transform: translateY(-8px) scale(0.96); opacity: 0; }
  20% { transform: translateY(0) scale(1); opacity: 1; }
  80% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-8px) scale(0.96); opacity: 0; }
}

.nav-active {
  position: relative;
}
.nav-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -8px;
  height: 3px;
  background: linear-gradient(90deg,#6366f1,#06b6d4);
  transform-origin: left center;
  animation: navUnderline 0.35s ease forwards;
}

@keyframes navUnderline {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
</style>