<template>
  <div aria-hidden="true" :class="['animated-bg pointer-events-none', { 'force-show-mobile': props.forceShowOnMobile }]" :style="bgVars">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Allow parent views to ask for a softer (lighter) color treatment, optionally override green alpha,
// and optionally force the animated background to show on small / coarse-pointer devices.
const props = defineProps<{ soften?: boolean; greenAlpha?: number; forceShowOnMobile?: boolean }>();

const blob1 = computed(() => {
  // allow explicit numeric override for green alpha (0..1)
  const explicit = typeof props.greenAlpha === 'number' ? props.greenAlpha : undefined;
  if (props.soften) {
    // slightly lighter but still very visible: raise green luminance and keep strong alpha
    const a1 = explicit ?? 0.82; // a touch lower than before so it's lighter but visible
    const a2 = Math.max(0, (explicit ? Math.max(0, explicit - 0.10) : 0.68));
    // lighter, fresher green tones
    return `radial-gradient(circle at 30% 30%, rgba(38,160,110,${a1}), rgba(34,145,100,${a2}) 40%, rgba(34,160,110,0.10) 70%)`;
  }
  // non-soft mode: lighter vivid-green with high visibility
  return 'radial-gradient(circle at 30% 30%, rgba(40,170,120,0.96), rgba(34,145,100,0.86) 40%, rgba(34,160,110,0.12) 70%)';
});

const blob2 = computed(() => {
  if (props.soften) {
    // slightly darker blue and higher opacity
    return 'radial-gradient(circle at 70% 30%, rgba(12,140,198,0.68), rgba(12,140,198,0.46) 40%, rgba(48,160,210,0.03) 70%)';
  }
  return 'radial-gradient(circle at 70% 30%, rgba(12,140,198,0.98), rgba(12,140,198,0.68) 40%, rgba(48,160,210,0.05) 70%)';
});

const blob3 = computed(() => {
  // slightly darker pink/purple tones and stronger mid alpha
  return 'radial-gradient(circle at 20% 80%, rgba(200,61,130,0.92), rgba(200,61,130,0.60) 40%, rgba(240,100,20,0.04) 70%)';
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
.animated-bg .bg-blob { position: absolute; filter: blur(48px) saturate(1.3); opacity: 0.68; transform: translateZ(0); will-change: transform, opacity; border-radius: 50%; }
.animated-bg .blob-1 { opacity: 0.88; }
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

<style>
/* Opt-in override: when parent explicitly requests, show the animated background on small/coarse devices.
   This uses higher-specificity rules and !important to counter the global small-screen hide rules. */
@media (hover: none) and (pointer: coarse) {
  .animated-bg.force-show-mobile { display: block !important; }
  .animated-bg.force-show-mobile .bg-blob { display: block !important; opacity: 0.72; }
}

@media (max-width: 767px) {
  .animated-bg.force-show-mobile .bg-blob { display: block !important; }
}

</style>
