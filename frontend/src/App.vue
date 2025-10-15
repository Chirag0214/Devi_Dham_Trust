<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-50 font-sans antialiased text-gray-800 relative">
    <AnimatedBackground />
    <div class="relative z-10 w-full">
      <TheHeader />

      <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
      
      <TheFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import AnimatedBackground from '@/components/AnimatedBackground.vue';
</script>

<style>
/* Basic transition for pages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>