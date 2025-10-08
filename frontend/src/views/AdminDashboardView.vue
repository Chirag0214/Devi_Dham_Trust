<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-8">
      <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <section class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Overview</h2>
        <p class="text-gray-600">This is a simple admin dashboard. You can extend it to manage users, donations and projects.</p>

        <div class="mt-6 grid grid-cols-3 gap-4">
          <div class="p-4 border rounded">
            <div class="text-sm text-gray-500">Total Users</div>
            <div class="text-2xl font-bold">{{ totalUsers }}</div>
          </div>
          <div class="p-4 border rounded">
            <div class="text-sm text-gray-500">Total Donations</div>
            <div class="text-2xl font-bold">{{ totalDonations }}</div>
          </div>
          <div class="p-4 border rounded">
            <div class="text-sm text-gray-500">Total Amount</div>
            <div class="text-2xl font-bold">₹{{ totalAmount }}</div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import auth from '@/stores/auth';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';

const route = useRoute();

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/');
};

const user = auth;
const isAdmin = computed(() => {
  return !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org'));
});
const totalUsers = ref(0);
const totalDonations = ref(0);
const totalAmount = ref(0);

onMounted(() => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    totalUsers.value = users.length;
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    totalDonations.value = donations.length;
    totalAmount.value = donations.reduce((s: number, d: any) => s + Number(d.amount || 0), 0);
  } catch (e) {
    // ignore
  }
});
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
