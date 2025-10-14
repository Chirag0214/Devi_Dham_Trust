<template>
  <div aria-hidden="true" class="animated-bg pointer-events-none">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>
  </div>
</template>

<script setup lang="ts">
// Presentational component for shared animated blobs

</script>

<style>
/* Make these styles global so the fixed background sits behind app content and animations run */
.animated-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.animated-bg .bg-blob { position: absolute; filter: blur(48px) saturate(1.2); opacity: 0.55; transform: translateZ(0); will-change: transform, opacity; border-radius: 50%; }
.animated-bg .blob-1 { width: 520px; height: 520px; left: -8%; top: -12%; background: radial-gradient(circle at 30% 30%, #10b981f2, #10b981a6 40%, #14b8a60d 70%); animation: blobMove1 14s ease-in-out infinite; }
.animated-bg .blob-2 { width: 420px; height: 420px; right: -6%; bottom: -8%; background: radial-gradient(circle at 70% 30%, #0ea5e9f2, #0ea5e98c 40%, #38bdf808 70%); animation: blobMove2 18s ease-in-out infinite; }
.animated-bg .blob-3 { width: 360px; height: 360px; left: 30%; bottom: -16%; background: radial-gradient(circle at 20% 80%, #ec4899e0, #ec489973 40%, #f9731605 70%); animation: blobMove3 20s ease-in-out infinite; }

@keyframes blobMove1 { 0% { transform: translateZ(0) scale(1);} 50% { transform: translate3d(28px,18px,0) scale(1.06);} to { transform: translateZ(0) scale(1);} }
@keyframes blobMove2 { 0% { transform: translateZ(0) scale(1);} 50% { transform: translate3d(-36px,-10px,0) scale(1.04);} to { transform: translateZ(0) scale(1);} }
@keyframes blobMove3 { 0% { transform: translateZ(0) scale(1);} 50% { transform: translate3d(-18px,28px,0) scale(1.05);} to { transform: translateZ(0) scale(1);} }

@media (prefers-reduced-motion: reduce) { .animated-bg .bg-blob { animation: none; opacity: 0.36; } }

/* Hide on coarse touch devices to reduce visual noise */
@media (hover: none) and (pointer: coarse) { .animated-bg { display: none; } }

</style>
