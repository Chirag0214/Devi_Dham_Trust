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

<style scoped>
.animated-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.bg-blob { position: absolute; filter: blur(40px) saturate(1.2) opacity(0.18); transform-origin: center; }
.blob-1 { width: 420px; height: 420px; background: radial-gradient(circle at 30% 30%, #3b82f6, #06b6d4); top: -80px; left: -120px; }
.blob-2 { width: 360px; height: 360px; background: radial-gradient(circle at 20% 20%, #f97316, #f43f5e); bottom: -100px; right: -80px; }
.blob-3 { width: 280px; height: 280px; background: radial-gradient(circle at 40% 40%, #10b981, #7c3aed); top: 180px; right: -60px; }

@keyframes floatA { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(18px) rotate(6deg); } 100% { transform: translateY(0) rotate(0deg); } }
@keyframes floatB { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(-6deg); } 100% { transform: translateY(0) rotate(0deg); } }
@keyframes floatC { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(12px) rotate(4deg); } 100% { transform: translateY(0) rotate(0deg); } }

.blob-1 { animation: floatA 10s ease-in-out infinite, rotateSlow 40s linear infinite; }
.blob-2 { animation: floatB 12s ease-in-out infinite, rotateSlow 50s linear infinite; }
.blob-3 { animation: floatC 14s ease-in-out infinite, rotateSlow 38s linear infinite; }
@keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* Hide on coarse touch devices to reduce visual noise */
@media (hover: none) and (pointer: coarse) { .animated-bg { display: none; } }

</style>
