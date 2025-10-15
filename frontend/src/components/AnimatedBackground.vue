<template>
  <div aria-hidden="true" class="animated-bg pointer-events-none" :style="bgVars">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Allow parent views to ask for a softer (lighter) color treatment and optionally override green alpha
const props = defineProps<{ soften?: boolean; greenAlpha?: number }>();

const blob1 = computed(() => {
  // allow explicit numeric override for green alpha (0..1)
  const explicit = typeof props.greenAlpha === 'number' ? props.greenAlpha : undefined;
  if (props.soften) {
    const a1 = explicit ?? 0.55;
    const a2 = Math.max(0, (explicit ? explicit - 0.2 : 0.35));
    return `radial-gradient(circle at 30% 30%, rgba(16,185,129,${a1}), rgba(16,185,129,${a2}) 40%, rgba(20,184,166,0.03) 70%)`;
  }
  return 'radial-gradient(circle at 30% 30%, rgba(16,185,129,0.95), rgba(16,185,129,0.65) 40%, rgba(20,184,166,0.05) 70%)';
});

const blob2 = computed(() => {
  if (props.soften) {
    return 'radial-gradient(circle at 70% 30%, rgba(14,165,233,0.55), rgba(14,165,233,0.32) 40%, rgba(56,189,248,0.02) 70%)';
  }
  return 'radial-gradient(circle at 70% 30%, rgba(14,165,233,0.95), rgba(14,165,233,0.55) 40%, rgba(56,189,248,0.03) 70%)';
});

const blob3 = computed(() => {
  // keep pink/purple as-is for now
  return 'radial-gradient(circle at 20% 80%, rgba(236,72,153,0.88), rgba(236,72,153,0.45) 40%, rgba(249,115,22,0.03) 70%)';
});

const bgVars = computed(() => ({
  '--blob-1': blob1.value,
  '--blob-2': blob2.value,
  '--blob-3': blob3.value,
} as Record<string, string>));

</script>

<style>
/* Make these styles global so the fixed background sits behind app content and animations run */
.animated-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.animated-bg .bg-blob { position: absolute; filter: blur(48px) saturate(1.2); opacity: 0.55; transform: translateZ(0); will-change: transform, opacity; border-radius: 50%; }
.animated-bg .blob-1 { width: 520px; height: 520px; left: -8%; top: -12%; background: var(--blob-1); animation: blobMove1 14s ease-in-out infinite; }
.animated-bg .blob-2 { width: 420px; height: 420px; right: -6%; bottom: -8%; background: var(--blob-2); animation: blobMove2 18s ease-in-out infinite; }
.animated-bg .blob-3 { width: 360px; height: 360px; left: 30%; bottom: -16%; background: var(--blob-3); animation: blobMove3 20s ease-in-out infinite; }

@keyframes blobMove1 { 0% { transform: translateZ(0) scale(1);} 50% { transform: translate3d(28px,18px,0) scale(1.06);} to { transform: translateZ(0) scale(1);} }
@keyframes blobMove2 { 0% { transform: translateZ(0) scale(1);} 50% { transform: translate3d(-36px,-10px,0) scale(1.04);} to { transform: translateZ(0) scale(1);} }
@keyframes blobMove3 { 0% { transform: translateZ(0) scale(1);} 50% { transform: translate3d(-18px,28px,0) scale(1.05);} to { transform: translateZ(0) scale(1);} }

@media (prefers-reduced-motion: reduce) { .animated-bg .bg-blob { animation: none; opacity: 0.36; } }

/* Hide on coarse touch devices to reduce visual noise */
@media (hover: none) and (pointer: coarse) { .animated-bg { display: none; } }

</style>
