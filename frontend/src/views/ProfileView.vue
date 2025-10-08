<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-8 max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">My Profile</h1>

      <section class="bg-white p-6 rounded shadow mb-6">
        <label class="block mb-2 font-medium">Full name</label>
        <input v-model="form.name" class="w-full border px-3 py-2 rounded" />

        <label class="block mt-4 mb-2 font-medium">Email</label>
        <input v-model="form.email" class="w-full border px-3 py-2 rounded" />

        <label class="block mt-4 mb-2 font-medium">Phone</label>
        <input v-model="form.phone" class="w-full border px-3 py-2 rounded" />

        <div class="mt-4 flex space-x-3">
          <button @click="save" class="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
          <button @click="cancel" class="px-4 py-2 border rounded">Cancel</button>
        </div>
      </section>

      <section class="bg-white p-6 rounded shadow">
        <h2 class="font-medium mb-3">Change Password</h2>
        <label class="block mb-2">Current password</label>
        <input v-model="pw.current" type="password" class="w-full border px-3 py-2 rounded" />
        <label class="block mt-4 mb-2">New password</label>
        <input v-model="pw.new" type="password" class="w-full border px-3 py-2 rounded" />
        <div class="mt-4">
          <button @click="changePassword" class="px-4 py-2 bg-green-600 text-white rounded">Change password</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import auth, { setAuth } from '@/stores/auth';
import Sidebar from '@/components/Sidebar.vue';

const user = auth;
const route = useRoute();

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/');
};

const isAdmin = computed(() => {
  return !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org'));
});

const form = reactive({ name: user.value?.name || '', email: user.value?.email || '', phone: '' });
const pw = reactive({ current: '', new: '' });

function save() {
  // update auth store
  const updated = { ...(user.value || {}), name: form.name, email: form.email };
  setAuth(updated as any);
  alert('Profile saved (mock)');
}

function cancel() {
  form.name = user.value?.name || '';
  form.email = user.value?.email || '';
}

function changePassword() {
  // mock only
  if (!pw.current || !pw.new) {
    alert('Provide current and new password');
    return;
  }
  alert('Password changed (mock)');
  pw.current = '';
  pw.new = '';
}
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
*** End Patch
