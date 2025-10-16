<template>
  <component :is="to ? 'router-link' : 'div'" :to="to || undefined" class="block">
    <div class="rounded-lg shadow p-5 text-white hover:opacity-95 transition cursor-pointer" :style="cardStyle">
      <div class="flex items-start justify-between min-w-0">
        <div class="min-w-0">
          <div class="text-sm opacity-90 truncate">{{ title }}</div>
          <div class="text-2xl font-bold mt-2 truncate">{{ displayValue }}</div>
          <div class="text-xs opacity-80 mt-1 truncate">{{ subtitle }}</div>
        </div>
        <div class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
          <slot name="icon">
            <!-- default icon circle -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
            </svg>
          </slot>
        </div>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toRef } from 'vue';
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  colorFrom: { type: String, default: '#6366f1' },
  colorTo: { type: String, default: '#10b981' },
  to: { type: [String, Object] as any, default: null },
});

const valueRef = toRef(props, 'value');

const displayValue = computed(() => valueRef.value ?? '0');

const cardStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.colorFrom}, ${props.colorTo})`
}));
</script>

<style scoped>
.rounded-lg { border-radius: 0.75rem; }
</style>
