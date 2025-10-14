<template>
  <header class="bg-white shadow-elevate sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

      <router-link to="/" class="flex items-center space-x-3 text-2xl font-bold text-brand-600 hover:text-brand-700 transition duration-150">
        <img src="/images/plantation.avif" alt="logo" class="h-9 w-9 rounded-md object-cover shadow-elevate" />
        <span class="leading-tight">Devi Dhaam Trust</span>
      </router-link>

      <nav class="hidden md:flex items-center space-x-6 md:space-x-8">
        <router-link :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/') ? 'nav-active' : '']" to="/">Home</router-link>
        <router-link :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/about') ? 'nav-active' : '']" to="/about">About Us</router-link>
    <router-link :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/projects') ? 'nav-active' : '']" to="/projects">Our Work</router-link>
  <router-link :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/certifications') ? 'nav-active' : '']" to="/certifications">Certificates</router-link>
  <router-link :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/gallery') ? 'nav-active' : '']" to="/gallery">Gallery</router-link>
  <router-link :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/contact') ? 'nav-active' : '']" to="/contact">Contact</router-link>

        <!-- Show Dashboard link when user is logged in. Admins go to /admin, others to /dashboard -->
        <router-link
          v-if="user"
          :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/dashboard') ? 'nav-active' : '']"
          :to="(user.role === 'admin' || user.email === 'admin@devidhaam.org') ? '/admin' : '/dashboard'"
        >
          Dashboard
        </router-link>
      </nav>

      <div class="flex items-center space-x-3">
        <template v-if="user">
          <!-- If user.name is missing (common for admin seed accounts), fall back to email or 'Admin' -->
          <div class="text-gray-700 font-medium mr-2 hidden sm:block">Hi, {{ user?.name || user?.email || (user?.role === 'admin' ? 'Admin' : '') }}</div>
          <button @click="logout" class="text-sm text-red-600 hover:text-red-700 font-medium py-1 px-2 rounded-md hover:bg-red-50 transition">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="text-gray-600 font-medium py-2 px-3 rounded-md hover:bg-gray-100 transition duration-150">Login</router-link>
        </template>

        <PrimaryButton to="/donate">🤝 Donate</PrimaryButton>

        <!-- Mobile menu button -->
        <button @click="mobileOpen = !mobileOpen" aria-label="Toggle menu" class="md:hidden ml-2 p-2 rounded-md text-gray-600 hover:text-brand-600 hover:bg-gray-100 transition">
          <svg v-if="!mobileOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile nav -->
    <div v-show="mobileOpen" class="md:hidden px-4 pb-4">
      <div class="flex flex-col space-y-2">
        <router-link @click.native="mobileOpen=false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50" to="/">Home</router-link>
  <router-link @click.native="mobileOpen=false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50" to="/about">About</router-link>
        <router-link @click.native="mobileOpen=false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50" to="/projects">Our Work</router-link>
        <router-link @click.native="mobileOpen=false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50" to="/certifications">Certificates</router-link>
  <router-link @click.native="mobileOpen=false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50" to="/gallery">Gallery</router-link>
  <router-link @click.native="mobileOpen=false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50" to="/contact">Contact</router-link>
  
  <!-- mobile dashboard link -->
  <router-link v-if="user" @click.native="mobileOpen=false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50" :to="(user.role === 'admin' || user.email === 'admin@devidhaam.org') ? '/admin' : '/dashboard'">Dashboard</router-link>
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
    <div v-if="showActionToast" class="fixed right-6 top-20 bg-brand-600 text-white shadow-lg px-4 py-2 rounded-md action-toast">
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
const mobileOpen = ref(false);

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
  background: linear-gradient(90deg,#fb923c,#f97316);
  transform-origin: left center;
  animation: navUnderline 0.35s ease forwards;
}

@keyframes navUnderline {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
</style>