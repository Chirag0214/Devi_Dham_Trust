<template>
  <header class="bg-white shadow-elevate sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

      <router-link to="/"
        class="flex items-center pr-3 text-2xl font-bold text-brand-600 hover:text-brand-700 transition duration-150 -ml-2 cursor-pointer">
        <img src="/images/temple.jpg" alt="logo" class="h-9 w-9 rounded-md object-cover shadow-elevate mr-2" />
        <span class="leading-tight">Devi Dhaam Trust</span>
      </router-link>

      <nav class="hidden md:flex items-center space-x-6 md:space-x-7">
        <router-link
          :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/') ? 'nav-active' : '']"
          to="/">Home</router-link>

        <!-- About with hover dropdown -->
        <div class="relative" ref="aboutMenuRef">
          <button
            @mouseenter="aboutOpen = true"
            @mouseleave="aboutOpen = false"
            @focus="aboutOpen = true"
            @blur="aboutOpen = false"
            @click.prevent
            class="flex items-center text-gray-600 hover:text-brand-600 transition duration-150 font-medium focus:outline-none"
            aria-haspopup="true"
            :aria-expanded="aboutOpen"
            type="button">
            <span>About Us</span>
            <svg xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 text-gray-500 ml-1 caret', aboutOpen ? 'open' : '']" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- show on hover/focus; keep using transition classes already defined -->
          <transition name="dropdown">
            <div v-if="aboutOpen"
              @mouseenter="aboutOpen = true"
              @mouseleave="aboutOpen = false"
              class="absolute left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-xl py-2 z-50 ring-1 ring-black ring-opacity-5"
              role="menu" aria-label="About menu">
              <div class="flex items-center space-x-1 px-2 whitespace-nowrap">
                <router-link
                  to="/about"
                  @click="aboutOpen = false"
                  :class="[ 'px-4 py-2 text-sm rounded-md transition-colors duration-150', isActive('/about') ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-brand-50 hover:text-brand-700']"
                  role="menuitem">About</router-link>

                <router-link
                  to="/projects"
                  @click="aboutOpen = false"
                  :class="[ 'px-4 py-2 text-sm rounded-md transition-colors duration-150', isActive('/projects') ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-brand-50 hover:text-brand-700']"
                  role="menuitem">Our Work</router-link>

                <router-link
                  to="/certifications"
                  @click="aboutOpen = false"
                  :class="[ 'px-4 py-2 text-sm rounded-md transition-colors duration-150', isActive('/certifications') ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-brand-50 hover:text-brand-700']"
                  role="menuitem">Certificates</router-link>

                <router-link
                  to="/gallery"
                  @click="aboutOpen = false"
                  :class="[ 'px-4 py-2 text-sm rounded-md transition-colors duration-150', isActive('/gallery') ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-brand-50 hover:text-brand-700']"
                  role="menuitem">Gallery</router-link>
              </div>
            </div>
          </transition>
        </div>

        <router-link
          :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/projects') ? 'nav-active' : '']"
          to="/projects" class="sr-only">Projects (link)</router-link>
        <router-link
          :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/certifications') ? 'nav-active' : '']"
          to="/certifications" class="sr-only">Certificates (link)</router-link>
        <router-link
          :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/gallery') ? 'nav-active' : '']"
          to="/gallery" class="sr-only">Gallery (link)</router-link>

        <router-link
          :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/contact') ? 'nav-active' : '']"
          to="/contact">Contact</router-link>

        <!-- Show Dashboard link when a non-admin user is logged in. Admin users are redirected to /admin and don't need the Dashboard nav item. -->
        <router-link v-if="user && !(user.role === 'admin' || user.email === 'admin@devidhaam.org')"
          :class="['text-gray-600  hover:text-brand-600 transition duration-150 font-medium', isActive('/dashboard') ? 'nav-active' : '']"
          :to="'/dashboard'">
          Dashboard
        </router-link>
      </nav>

      <div class="flex items-center space-x-3">
        <template v-if="user">
          <!-- User menu: clickable name opens dropdown with Dashboard and Logout -->
          <div class="relative" ref="userMenuRef" @mouseenter="userMenuOpen = true" @mouseleave="userMenuOpen = false">
            <button @click="toggleUserMenu"
              class="flex items-center text-gray-700 font-medium mr-2 hidden sm:inline-flex space-x-2 focus:outline-none hover:bg-gray-50 px-2 py-1 rounded-md"
              :aria-expanded="userMenuOpen" aria-haspopup="true" type="button">
              <!-- avatar -->
              <div class="h-7 w-7 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-sm font-semibold mr-1 shadow-sm">
                {{ displayInitial }}
              </div>
              <span class="select-none">Hi, {{ user?.name || user?.email || (user?.role === 'admin' ? 'Admin' : '') }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 text-gray-500 caret', userMenuOpen ? 'open' : '']" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Dropdown -->
            <transition name="dropdown">
              <div v-if="userMenuOpen"
                @mouseenter="userMenuOpen = true"
                @mouseleave="userMenuOpen = false"
                class="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-xl py-2 z-50 ring-1 ring-black ring-opacity-5"
                role="menu" aria-label="User menu">
                <div class="flex items-center flex-col px-2 space-y-1">
                  <router-link :to="(user.role === 'admin' || user.email === 'admin@devidhaam.org') ? '/admin' : '/dashboard'"
                    @click="userMenuOpen = false"
                    :class="[ 'w-full text-left px-4 py-2 text-sm rounded-md transition-colors duration-150', (user.role === 'admin' || user.email === 'admin@devidhaam.org') ? (isActive('/admin') || isActive('/dashboard') ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-brand-50 hover:text-brand-700') : (isActive('/dashboard') ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-brand-50 hover:text-brand-700') ]"
                    role="menuitem">Dashboard</router-link>

                  <button @click="() => { userMenuOpen = false; handleLogout(); }" class="w-full text-left px-4 py-2 text-sm rounded-md transition-colors duration-150 text-red-600 hover:bg-red-50" role="menuitem">Logout</button>
                </div>
              </div>
            </transition>
          </div>
        </template> 
        <template v-else>
          <router-link
            :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/login') ? 'nav-active' : '']"
            to="/login">Login</router-link>
            <i>/</i>
          <router-link
            :class="['text-gray-600 hover:text-brand-600 transition duration-150 font-medium', isActive('/signup') ? 'nav-active' : '']"
            to="/signup">Register</router-link>
        </template>

        <PrimaryButton to="/donate">🤝 Donate</PrimaryButton>

        <!-- Mobile menu button -->
        <button @click="mobileOpen = !mobileOpen" aria-label="Toggle menu"
          class="md:hidden ml-2 p-2 rounded-md text-gray-600 hover:text-brand-600 hover:bg-gray-100 transition">
          <svg v-if="!mobileOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile nav -->
    <div v-show="mobileOpen" class="md:hidden px-4 pb-4">
      <div class="flex flex-col space-y-2">
        <router-link @click.native="mobileOpen = false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50"
          to="/">Home</router-link>
        <router-link @click.native="mobileOpen = false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50"
          to="/about">About</router-link>
        <router-link @click.native="mobileOpen = false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50"
          to="/projects">Our Work</router-link>
        <router-link @click.native="mobileOpen = false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50"
          to="/certifications">Certificates</router-link>
        <router-link @click.native="mobileOpen = false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50"
          to="/gallery">Gallery</router-link>
        <router-link @click.native="mobileOpen = false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50"
          to="/contact">Contact</router-link>

        <!-- mobile auth links when not logged in -->
        <template v-if="!user">
          <router-link @click.native="mobileOpen = false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50" to="/login">Login</router-link>
          <router-link @click.native="mobileOpen = false" class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50" to="/signup">Register</router-link>
        </template>

        <!-- mobile dashboard link for non-admin users only -->
        <router-link v-if="user && !(user.role === 'admin' || user.email === 'admin@devidhaam.org')" @click.native="mobileOpen = false"
          class="py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50"
          :to="'/dashboard'">Dashboard</router-link>
      </div>
    </div>

    <!-- Logout toast -->
    <div v-if="showToast"
      class="fixed right-6 top-20 bg-white border border-gray-200 shadow-lg px-5 py-3 rounded-lg toast-slide">
      <div class="flex items-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <div class="font-medium text-gray-900">You have been logged out</div>
          <div class="text-sm text-gray-600">Thanks for visiting — see you soon!</div>
        </div>
      </div>
    </div>

    <!-- Short action toast (login/signup) -->
    <div v-if="showActionToast"
      class="fixed right-6 top-20 bg-brand-600 text-white shadow-lg px-4 py-2 rounded-md action-toast">
      <div class="text-sm font-medium">Welcome!</div>
    </div>
  </header>
</template>
<script setup lang="ts">
import PrimaryButton from './PrimaryButton.vue';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import auth, { clearAuth } from '@/stores/auth';

const user = auth; // reactive shared auth
const router = useRouter();
const route = useRoute();
const mobileOpen = ref(false);
// User menu state
const userMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);
// About dropdown state
const aboutOpen = ref(false);
const aboutMenuRef = ref<HTMLElement | null>(null);
// (removed auth dropdown state)

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

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const displayInitial = computed(() => {
  const current = (user && (user as any).value) || null;
  const name = current?.name || current?.email || '';
  if (!name) return '';
  const first = String(name).trim().charAt(0).toUpperCase();
  return first;
});

const handleLogout = () => {
  // close menu immediately and perform logout flow
  userMenuOpen.value = false;
  logout();
};

// close menus when clicking outside or pressing Escape
const onDocumentClick = (e: MouseEvent) => {
  const target = e.target as Node | null;
  // close user menu if click outside
  if (userMenuRef.value && target && !userMenuRef.value.contains(target)) {
    userMenuOpen.value = false;
  }
  // close about dropdown if click outside
  if (aboutMenuRef.value && target && !aboutMenuRef.value.contains(target)) {
    aboutOpen.value = false;
  }
};

const onDocumentKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    userMenuOpen.value = false;
    aboutOpen.value = false;
    // auth dropdown removed
  }
};

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onDocumentKey);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  document.removeEventListener('keydown', onDocumentKey);
});

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
  0% {
    opacity: 0;
    transform: translateY(-10px) translateX(10px) scale(0.98);
  }

  10% {
    opacity: 1;
    transform: translateY(0) translateX(0) scale(1);
  }

  90% {
    opacity: 1;
    transform: translateY(0) translateX(0) scale(1);
  }

  100% {
    opacity: 0;
    transform: translateY(-10px) translateX(10px) scale(0.98);
  }
}

.action-toast {
  animation: actionPop 1s ease forwards;
}

@keyframes actionPop {
  0% {
    transform: translateY(-8px) scale(0.96);
    opacity: 0;
  }

  20% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  80% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  100% {
    transform: translateY(-8px) scale(0.96);
    opacity: 0;
  }
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
  background: linear-gradient(90deg, #fb923c, #f97316);
  transform-origin: left center;
  animation: navUnderline 0.35s ease forwards;
}

/* Dropdown animation */
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
.dropdown-enter-active {
  transition: opacity 160ms ease, transform 160ms ease;
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
.dropdown-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
}

/* caret rotation when open */
.caret {
  transition: transform 160ms ease;
}
.caret.open {
  transform: rotate(180deg);
}

@keyframes navUnderline {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}

/* Accessibility: don't show the browser focus rectangle when links/buttons are clicked by mouse,
   but keep a visible indicator for keyboard users. Uses :focus-visible so keyboard users still see focus.
*/
a:focus:not(:focus-visible),
button:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
}

/* Provide a clear keyboard focus ring for accessibility */
a:focus-visible,
button:focus-visible {
  outline: 3px solid rgba(99,102,241,0.18); /* subtle soft ring */
  outline-offset: 2px;
}
</style>