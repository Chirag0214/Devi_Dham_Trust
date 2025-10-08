<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-8">
      <h1 class="text-2xl font-bold mb-6">Your Certificate</h1>

      <section class="bg-white p-6 rounded-lg shadow">
        <p class="text-gray-600 mb-4">This is where the user's certificate will be shown. Replace this placeholder with actual certificate rendering or a file download link.</p>
        <div class="flex items-center space-x-3">
          <button class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700">View Certificate</button>
          <button class="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700">Download Certificate</button>
        </div>
      </section>
    </main>
  </div>
</template>


<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import auth from '@/stores/auth';
import Sidebar from '@/components/Sidebar.vue';

const user = auth;
const route = useRoute();

const isAdmin = computed(() => {
  return !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org'));
});

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/');
};
</script>

<style scoped>
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
