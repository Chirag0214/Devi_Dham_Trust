<template>
  <router-link
    v-if="to"
    :to="to"
    class="btn-primary"
  >
    <slot></slot>
  </router-link>
  <button
    v-else
    class="btn-primary"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  to: {
    type: String,
    required: false,
    default: null,
  },
});
</script>