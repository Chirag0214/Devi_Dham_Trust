<template>
  <div class="py-10 bg-gray-100 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Admin: Add New Gallery Item</h1>
      
      <PhotoUploader />
      
      <p class="mt-8 text-sm text-gray-600">
        Note: Upload ke baad photo automatic Gallery page ke slider mein dikh jaani chahiye. Agar nahi dikhti, toh Gallery page ko hard refresh (Ctrl+Shift+R) karein.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import the actual form logic component
import PhotoUploader from '@/components/PhotoUploader.vue'; 
</script>