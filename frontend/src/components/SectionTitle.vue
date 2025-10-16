<template>
  <div class="text-center mb-12 min-w-0">
    <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight truncate">
      <slot></slot>
    </h2>
    <p v-if="subtitle" class="mt-3 text-lg section-subtle max-w-3xl mx-auto">
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