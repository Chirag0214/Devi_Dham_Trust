<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-8">
        <div class="max-w-7xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">Add New Gallery Item</h1>
            
            <PhotoUploader />
            
            <p class="mt-8 text-sm text-gray-600">
                Note: Upload ke baad photo automatic Gallery page ke slider mein dikh jaani chahiye. Agar nahi dikhti, toh Gallery page ko hard refresh (Ctrl+Shift+R) karein.
            </p>
        </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import auth from '@/stores/auth';
import { computed } from 'vue';
import PhotoUploader from '@/components/PhotoUploader.vue'; 

const user = auth;
const isAdmin = computed(() => {
  return !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org'));
});
</script>