<template>
  <aside class="w-64 bg-white border-r p-6">
    <div class="mb-6">
      <h3 class="text-lg font-semibold">{{ isAdmin ? 'Admin' : 'User' }}</h3>
      <div class="mt-2 text-gray-700 font-medium">{{ user?.name || (isAdmin ? 'Admin' : 'Guest') }}</div>
      <div class="text-sm text-gray-500">{{ user?.email }}</div>
    </div>

    <nav class="space-y-2">
      <router-link v-if="!isAdmin" :class="linkClass('/dashboard')" to="/dashboard">Dashboard</router-link>
      <router-link v-if="!isAdmin" :class="linkClass('/certificate')" to="/certificate">Certificate</router-link>
      <router-link :class="linkClass('/profile')" to="/profile">Profile</router-link>

      <router-link v-if="isAdmin" :class="linkClass('/admin')" to="/admin">Overview</router-link>
      <router-link v-if="isAdmin" :class="linkClass('/admin/users')" to="/admin/users">Users</router-link>
      <router-link v-if="isAdmin" :class="linkClass('/admin/donations')" to="/admin/donations">Donations</router-link>
      
      <router-link v-if="isAdmin" :class="linkClass('/admin/add-gallery')" to="/admin/add-gallery">Add Gallery Photo</router-link>

      <slot />
    </nav>
  </aside>
</template>

<script setup lang="ts">
// ... rest of the script (no changes needed) ...
import { useRoute } from 'vue-router';
import type { PropType } from 'vue';

const props = defineProps({
  user: { type: Object as PropType<any>, default: null },
  isAdmin: { type: Boolean, default: false },
});

const route = useRoute();

function linkClass(path: string) {
  return ['block px-3 py-2 rounded hover:bg-gray-100', isActive(path) ? 'active-link' : ''];
}

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/');
}
</script>

<style scoped>
/* ... rest of the styles (no changes needed) ... */
.active-link {
  position: relative;
}
.active-link::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 6px;
  height: 3px;
  background: linear-gradient(90deg,#6366f1,#10b981);
  border-radius: 2px;
  transform-origin: left center;
  animation: underline 0.4s ease forwards;
}

@keyframes underline {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
</style>