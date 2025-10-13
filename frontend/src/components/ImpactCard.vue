<template>
  <div class="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition duration-300 ease-in-out">
  <p class="text-5xl font-extrabold text-orange-600 mb-2">{{ title }}</p>
    <p class="text-lg font-medium text-gray-700">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
</script>