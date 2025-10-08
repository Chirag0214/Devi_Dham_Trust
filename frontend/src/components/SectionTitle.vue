<template>
  <div class="text-center mb-12">
    <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
      <slot></slot>
    </h2>
    <p v-if="subtitle" class="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  subtitle: {
    type: String,
    required: false,
    default: null,
  },
});
</script>