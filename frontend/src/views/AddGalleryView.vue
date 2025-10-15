<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Add New Gallery Item</h1>
            <p class="text-sm text-gray-500 mt-1">Upload photos to showcase the trust's recent events and activities.</p>
          </div>
                  </div>

        <div class="flex justify-center">
          <section class="w-full lg:w-2/3">
            <div class="glass-card p-6 card-hover transition-transform duration-300">
              <h2 class="text-xl font-semibold mb-4">Upload Photos</h2>
              <transition name="fade-up" appear>
                <div>
                  <PhotoUploader />
                </div>
              </transition>
            </div>
          </section>
        </div>
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