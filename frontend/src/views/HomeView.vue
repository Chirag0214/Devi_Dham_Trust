<template>
  <div class="relative bg-gray-50 text-gray-900 overflow-hidden">
    <!-- Animated background blobs -->
    <div aria-hidden="true" class="animated-bg pointer-events-none">
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
      <div class="bg-blob blob-3"></div>
    </div>
    <!-- Hero -->
  <section class="max-w-7xl mx-auto px-6 py-16 reveal-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <p class="text-sm font-semibold text-brand-600">Devi Dhaam Trust</p>
          <h1 class="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">Igniting Hope. Transforming Lives.</h1>
          <p class="mt-4 text-gray-700 text-lg max-w-xl">We work with marginalized communities to provide education, healthcare, and sustainable livelihoods so every person can reach their full potential.</p>

          <div class="mt-6 flex flex-wrap gap-3 items-center">
            <router-link to="/donate">
              <PrimaryButton class="pulse-cta">Donate for a Cause</PrimaryButton>
            </router-link>
            <router-link to="/about">
              <button class="px-4 py-2 border border-gray-200 rounded-md bg-white text-gray-800">Learn More</button>
            </router-link>
            <div class="ml-4 relative inline-flex">
              <div class="stat-badge animate-float px-3 py-1 bg-white rounded-full shadow">25+ yrs</div>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="rounded-xl overflow-hidden shadow-lg">
            <img ref="heroImg" src="/images/bg-image.avif" alt="volunteers" class="hero-img w-full h-64 object-cover sm:h-80 md:h-96" />
          </div>
          <div class="absolute -bottom-8 left-6 right-6">
            <div class="bg-white border rounded-xl p-4 shadow-md flex items-center gap-4">
              <div class="w-12 h-12 bg-brand-600 text-white rounded-lg flex items-center justify-center font-bold">25+</div>
              <div>
                <div class="text-sm font-semibold">Years of Service</div>
                <div class="text-xs text-gray-500">Building trust and lasting impact</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  <!-- Key pillars -->
  <section class="max-w-6xl mx-auto px-6 py-16 reveal-hidden">
      <h2 class="text-2xl font-bold mb-6">Our Guiding Mission</h2>
      <p class="text-gray-700 mb-8 max-w-2xl">We provide access to essential resources, foster sustainable livelihoods, and create opportunities that allow individuals and communities to thrive.</p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl p-6 shadow-sm tilt-card reveal-hidden relative card-sheen" @mousemove="e => handleTilt(e, $event.currentTarget)" @mouseleave="e => resetTilt($event.currentTarget)">
              <div class="bg-white rounded-xl p-6 shadow-sm tilt-card reveal-hidden relative card-sheen" @mousemove="onCardMouseMove" @mouseleave="onCardMouseLeave">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-brand-100 text-brand-600 rounded-lg">
              <!-- community icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold">Community Empowerment</h3>
              <p class="text-sm text-gray-600">Tools, training and support to help communities build resilient futures.</p>
            </div>
          </div>
        </div>

  <div class="bg-white rounded-xl p-6 shadow-sm tilt-card reveal-hidden" @mousemove="e => handleTilt(e, $event.currentTarget)" @mouseleave="e => resetTilt($event.currentTarget)">
        <div class="bg-white rounded-xl p-6 shadow-sm tilt-card reveal-hidden" @mousemove="onCardMouseMove" @mouseleave="onCardMouseLeave">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-brand-100 text-brand-600 rounded-lg">
              <!-- health icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m2 0a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold">Holistic Healthcare</h3>
              <p class="text-sm text-gray-600">Healthcare camps and preventive care to keep families healthy and productive.</p>
            </div>
          </div>
        </div>

  <div class="bg-white rounded-xl p-6 shadow-sm tilt-card reveal-hidden" @mousemove="e => handleTilt(e, $event.currentTarget)" @mouseleave="e => resetTilt($event.currentTarget)">
        <div class="bg-white rounded-xl p-6 shadow-sm tilt-card reveal-hidden" @mousemove="onCardMouseMove" @mouseleave="onCardMouseLeave">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-brand-100 text-brand-600 rounded-lg">
              <!-- education icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422A12.083 12.083 0 0119 21H5a12.083 12.083 0 00.84-10.422L12 14z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold">Transformative Education</h3>
              <p class="text-sm text-gray-600">Programs that focus on learning, leadership and lifelong growth.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  <!-- Initiatives grid -->
  <section class="max-w-6xl mx-auto px-6 py-12 reveal-hidden">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Impactful Initiatives</h2>
        <router-link to="/projects" class="text-sm text-brand-600 font-medium">See all projects →</router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="bg-white rounded-lg overflow-hidden shadow-sm tilt-card reveal-hidden relative card-sheen" @mousemove="e => handleTilt(e, $event.currentTarget)" @mouseleave="e => resetTilt($event.currentTarget)">
          <img src="/images/plantation.avif" alt="future leaders" class="w-full h-40 object-cover" />
          <div class="p-4">
            <h3 class="font-semibold">Future Leaders Program</h3>
            <p class="text-sm text-gray-600 mt-2">Education, mentorship and community support to help young people thrive.</p>
            <router-link to="/projects" class="text-brand-600 text-sm mt-3 inline-block">Learn more</router-link>
          </div>
        </div>

  <div class="bg-white rounded-lg overflow-hidden shadow-sm tilt-card reveal-hidden relative card-sheen" @mousemove="e => handleTilt(e, $event.currentTarget)" @mouseleave="e => resetTilt($event.currentTarget)">
          <img src="/images/plantation1.avif" alt="green earth" class="w-full h-40 object-cover" />
          <div class="p-4">
            <h3 class="font-semibold">Green Earth Initiative</h3>
            <p class="text-sm text-gray-600 mt-2">Tree plantations, sustainable agriculture and environmental education.</p>
            <router-link to="/projects" class="text-brand-600 text-sm mt-3 inline-block">Discover</router-link>
          </div>
        </div>

        <div class="bg-white rounded-lg overflow-hidden shadow-sm tilt-card reveal-hidden" @mousemove="e => handleTilt(e, $event.currentTarget)" @mouseleave="e => resetTilt($event.currentTarget)">
    <div class="bg-white rounded-lg overflow-hidden shadow-sm tilt-card reveal-hidden" @mousemove="onCardMouseMove" @mouseleave="onCardMouseLeave">
    <div class="bg-white rounded-lg overflow-hidden shadow-sm tilt-card reveal-hidden" @mousemove="onCardMouseMove" @mouseleave="onCardMouseLeave">
    <div class="bg-white rounded-lg overflow-hidden shadow-sm tilt-card reveal-hidden" @mousemove="onCardMouseMove" @mouseleave="onCardMouseLeave">
          <img src="/images/bg-image.avif" alt="health" class="w-full h-40 object-cover" />
          <div class="p-4">
            <h3 class="font-semibold">Project Health & Hope</h3>
            <p class="text-sm text-gray-600 mt-2">Medical camps and essential services for underserved areas.</p>
            <router-link to="/projects" class="text-brand-600 text-sm mt-3 inline-block">See impact</router-link>
          </div>
        </div>
      </div>
    </section>

  <!-- CTA band -->
  <section class="bg-gradient-to-r from-brand-600 to-brand-500 text-white py-12 reveal-hidden">
      <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 class="text-xl font-bold">Become a Beacon of Hope</h3>
          <p class="text-sm opacity-90">Volunteer, donate or spread the word — your contribution creates a ripple of positive change.</p>
        </div>

        <div class="flex gap-3">
          <router-link to="/join">
            <button class="px-5 py-2 bg-white text-brand-600 rounded-md font-semibold">Join Our Team</button>
          </router-link>
          <router-link to="/donate">
            <button class="px-5 py-2 bg-white/20 border border-white rounded-md text-white">Donate Now</button>
          </router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import SectionTitle from '@/components/SectionTitle.vue';

// Refs for tilt and reveal
const heroImg = ref<HTMLElement | null>(null);

function handleTilt(e: MouseEvent, el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left; // x position within the element.
  const y = e.clientY - rect.top;  // y position within the element.
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const dx = (x - cx) / cx;
  const dy = (y - cy) / cy;
  const rotateX = (dy * 8) * -1; // tilt intensity
  const rotateY = dx * 8;
  el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
}

function resetTilt(el: HTMLElement) {
  el.style.transform = '';
}

let observer: IntersectionObserver | null = null;

onMounted(() => {
  // Setup reveal on scroll with staggered delays
  let index = 0;
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        // set a small stagger based on index to create cascading entrances
        el.style.transitionDelay = `${(index % 6) * 80}ms`;
        el.classList.add('reveal-visible');
        observer?.unobserve(entry.target);
        index++;
      }
    });
  }, { threshold: 0.12 });

  // observe elements with reveal-hidden class
  document.querySelectorAll('.reveal-hidden').forEach(el => observer?.observe(el));

  // parallax on hero image
  const onHeroMove = (ev: MouseEvent) => {
    if (!heroImg.value) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const x = (ev.clientX - w / 2) / w;
    const y = (ev.clientY - h / 2) / h;
    heroImg.value.style.transform = `translate3d(${x * 20}px, ${y * 10}px, 0) scale(1.03)`;
  };

  window.addEventListener('mousemove', onHeroMove);

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', onHeroMove);
    observer?.disconnect();
  });
});
</script>

<style scoped>
.animated-bg { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
.bg-blob { position: absolute; filter: blur(40px) saturate(1.2) opacity(0.18); transform-origin: center; }
.blob-1 { width: 420px; height: 420px; background: radial-gradient(circle at 30% 30%, #3b82f6, #06b6d4); top: -80px; left: -120px; animation: floatA 10s ease-in-out infinite; }
.blob-2 { width: 360px; height: 360px; background: radial-gradient(circle at 20% 20%, #f97316, #f43f5e); bottom: -100px; right: -80px; animation: floatB 12s ease-in-out infinite; }
.blob-3 { width: 280px; height: 280px; background: radial-gradient(circle at 40% 40%, #10b981, #7c3aed); top: 180px; right: -60px; animation: floatC 14s ease-in-out infinite; }

@keyframes floatA { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(18px) rotate(6deg); } 100% { transform: translateY(0) rotate(0deg); } }
@keyframes floatB { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(-6deg); } 100% { transform: translateY(0) rotate(0deg); } }
@keyframes floatC { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(12px) rotate(4deg); } 100% { transform: translateY(0) rotate(0deg); } }

.reveal-hidden { opacity: 0; transform: translateY(16px) scale(0.995); transition: opacity 600ms ease, transform 700ms cubic-bezier(.2,.9,.3,1); }
.reveal-visible { opacity: 1; transform: translateY(0) scale(1); }

.tilt-card { transition: transform 300ms cubic-bezier(.2,.9,.3,1); will-change: transform; }
.hero-img { transition: transform 600ms cubic-bezier(.2,.9,.3,1); will-change: transform; }

.animated-bg .bg-blob { border-radius: 50%; }

</style>

<style scoped>
/* Sheen overlay on cards */
.card-sheen::after {
  content: '';
  position: absolute;
  left: -40%;
  top: -40%;
  width: 40%;
  height: 180%;
  background: linear-gradient(120deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.06) 100%);
  transform: rotate(25deg) translateX(-10%);
  transition: transform 900ms cubic-bezier(.2,.9,.3,1), opacity 900ms;
  opacity: 0;
}
.card-sheen:hover::after { transform: rotate(25deg) translateX(110%); opacity: 1; }

/* CTA pulse */
.pulse-cta { position: relative; }
.pulse-cta::before {
  content: '';
  position: absolute; inset: 0; border-radius: 8px;
  box-shadow: 0 8px 24px rgba(59,130,246,0.18);
  opacity: 0.85; transform: scale(1);
  transition: transform 600ms cubic-bezier(.2,.9,.3,1), opacity 600ms;
}
.pulse-cta:hover::before { transform: scale(1.06); opacity: 0.95; }
.pulse-cta:active::before { transform: scale(0.98); }

/* Floating stat badge */
.animate-float { animation: floatBadge 3.6s ease-in-out infinite; }
@keyframes floatBadge { 0% { transform: translateY(0); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0); } }

/* Subtle rotation for blobs */
.blob-1 { animation: floatA 10s ease-in-out infinite, rotateSlow 40s linear infinite; }
.blob-2 { animation: floatB 12s ease-in-out infinite, rotateSlow 50s linear infinite; }
.blob-3 { animation: floatC 14s ease-in-out infinite, rotateSlow 38s linear infinite; }
@keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

</style>