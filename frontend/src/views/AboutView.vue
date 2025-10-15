<template>
  <div class="relative text-gray-900 overflow-hidden">
  <!-- Animated background (shared component) -->
  <AnimatedBackground :soften="true" :greenAlpha="0.35" />
    <div class="relative z-10">
  <!-- Hero (simpler, neutral) -->
  <section class="py-20 md:py-28 overflow-hidden">
      <div class="container mx-auto px-4 text-center stagger-parent animate-on-scroll">
        <div class="max-w-3xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight text-gray-900 stagger-child">About Devi Dhamm Trust</h1>
          <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed stagger-child">Empowering underprivileged children and communities through education, healthcare, and sustainable development. Join us in creating measurable impact and long-term change.</p>

          <div class="mt-8 flex items-center justify-center gap-4 stagger-child">
            <router-link to="/donate" class="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-brand-700 transition-colors duration-300 shadow-md float">
              <HeartIcon class="inline-block h-4 w-4 text-white" />
              Donate
            </router-link>
            <router-link to="/contact" class="inline-flex items-center gap-2 border border-brand-200 text-brand-700 font-semibold py-3 px-6 rounded-full hover:bg-brand-50 transition-colors duration-300">
              <HandRaisedIcon class="inline-block h-4 w-4 text-brand-600" />
              Contact
            </router-link>
          </div>

          <!-- Quick stats chips (muted) -->
          <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center stagger-child">
            <div class="bg-white rounded-xl px-6 py-3 text-left shadow-sm border border-gray-100 stagger-child">
              <div class="text-sm text-gray-500">Years of Service</div>
              <div class="text-2xl font-bold text-gray-900">10+</div>
            </div>
            <div class="bg-white rounded-xl px-6 py-3 text-left shadow-sm border border-gray-100 stagger-child">
              <div class="text-sm text-gray-500">Communities Reached</div>
              <div class="text-2xl font-bold text-gray-900">40+</div>
            </div>
            <div class="bg-white rounded-xl px-6 py-3 text-left shadow-sm border border-gray-100 stagger-child">
              <div class="text-sm text-gray-500">Volunteers</div>
              <div class="text-2xl font-bold text-gray-900">200+</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our story (timeline) -->
  <section class="py-16 sm:py-24">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8 animate-on-scroll">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800">Our Story</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">From a small seed of an idea to a growing tree of impact.</p>
        </div>

        <div class="relative stagger-parent">
          <div class="absolute left-1/2 h-full border-l-2 border-gray-100 hidden md:block"></div>

          <div class="mb-8 flex justify-between items-center w-full right-timeline animate-on-scroll stagger-parent">
            <div class="order-1 md:w-5/12"></div>
            <div class="z-10 flex items-center order-1 bg-brand-600 shadow w-14 h-14 rounded-full ring-4 ring-brand-50 stagger-child">
              <h1 class="mx-auto font-semibold text-lg text-white">2015</h1>
            </div>
            <div class="order-1 bg-white rounded-lg shadow w-full md:w-5/12 px-6 py-4 border border-gray-100 stagger-child">
              <h3 class="font-bold text-gray-800 text-xl">The Beginning</h3>
              <p class="text-sm leading-snug tracking-wide text-gray-600">Started by local volunteers, Devi Dhamm Trust began as a small education initiative to support children in our community.</p>
            </div>
          </div>

          <div class="mb-8 flex justify-between flex-row-reverse items-center w-full left-timeline animate-on-scroll stagger-parent">
            <div class="order-1 md:w-5/12"></div>
            <div class="z-10 flex items-center order-1 bg-brand-600 shadow w-14 h-14 rounded-full ring-4 ring-brand-50 stagger-child">
              <h1 class="mx-auto text-white font-semibold text-lg">2018</h1>
            </div>
            <div class="order-1 bg-white rounded-lg shadow w-full md:w-5/12 px-6 py-4 border border-gray-100 stagger-child">
              <h3 class="font-bold text-gray-800 text-xl">Expanding Horizons</h3>
              <p class="text-sm leading-snug tracking-wide text-gray-600">We expanded our programs to include health camps and environmental initiatives, reaching more families and creating a wider impact.</p>
            </div>
          </div>

          <div class="mb-8 flex justify-between items-center w-full right-timeline animate-on-scroll stagger-parent">
            <div class="order-1 md:w-5/12"></div>
            <div class="z-10 flex items-center order-1 bg-brand-600 shadow w-14 h-14 rounded-full ring-4 ring-brand-50 stagger-child">
              <h1 class="mx-auto font-semibold text-lg text-white">Today</h1>
            </div>
            <div class="order-1 bg-white rounded-lg shadow w-full md:w-5/12 px-6 py-4 border border-gray-100 stagger-child">
              <h3 class="font-bold text-gray-800 text-xl">A Growing Movement</h3>
              <p class="text-sm leading-snug tracking-wide text-gray-600">With the help of our donors and volunteers, we continue to scale our work, keeping the community at the heart of everything we do.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission / Vision -->
  <section class="py-16 sm:py-24">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="p-8 bg-white rounded-lg shadow-sm border border-gray-100 animate-on-scroll">
            <div class="flex items-center mb-4">
              <TagIcon class="text-brand-600 mr-4 h-8 w-8" />
              <h3 class="text-2xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p class="text-gray-600">To empower underprivileged children and communities with holistic education, essential life skills, and access to opportunities, enabling them to realize their full potential and contribute to a more equitable society.</p>
          </div>
          <div class="p-8 bg-white rounded-lg shadow-sm border border-gray-100 animate-on-scroll">
            <div class="flex items-center mb-4">
              <EyeIcon class="text-brand-500 mr-4 h-8 w-8" />
              <h3 class="text-2xl font-bold text-gray-900">Our Vision</h3>
            </div>
            <p class="text-gray-600">We envision a world where every child has the chance to thrive. We focus on creating sustainable programs in education, health, and community awareness, all driven by compassion, transparency, and active community participation.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact counters -->
  <section class="py-16 sm:py-24">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8 animate-on-scroll">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800">Our Impact in Numbers</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Every number tells a story of a life changed.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div v-for="c in counters" :key="c.id" class="p-6 bg-gray-50 rounded-lg animate-on-scroll">
            <div class="text-5xl md:text-6xl font-extrabold text-brand-600 counter" :data-target="c.value">0</div>
            <div class="mt-2 text-lg font-medium text-gray-500 uppercase tracking-wider">{{ c.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core values -->
  <section class="py-16 sm:py-24">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8 animate-on-scroll">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800">Our Core Values</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">The principles that guide our every action.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div class="p-6 bg-white rounded-lg shadow-sm animate-on-scroll">
              <HeartIcon class="text-red-500 mb-4 h-8 w-8 mx-auto" />
            <h4 class="text-xl font-semibold text-gray-900 mb-2">Compassion</h4>
            <p class="text-gray-600">We approach our work with empathy and a deep sense of care for the communities we serve.</p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow-sm animate-on-scroll">
              <ShieldCheckIcon class="text-brand-500 mb-4 h-8 w-8 mx-auto" />
            <h4 class="text-xl font-semibold text-gray-900 mb-2">Integrity</h4>
            <p class="text-gray-600">We are committed to transparency and accountability in all our actions and use of resources.</p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow-sm animate-on-scroll">
              <LightBulbIcon class="text-yellow-400 mb-4 h-8 w-8 mx-auto" />
            <h4 class="text-xl font-semibold text-gray-900 mb-2">Empowerment</h4>
            <p class="text-gray-600">We believe in providing tools and knowledge to help individuals build their own futures.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
  <section class="py-16 sm:py-24">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8 animate-on-scroll">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800">Meet Our Team</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">The dedicated individuals behind our mission.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="m in team" :key="m.id" @click="openMember(m)" class="group bg-white rounded-xl shadow p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer animate-on-scroll">
            <img :src="m.img" :alt="m.name" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-sm border-2 border-gray-50 transition-all duration-300" />
            <h4 class="text-xl font-semibold text-gray-900">{{ m.name }}</h4>
            <div class="mt-2">
              <span class="inline-block bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1 rounded-full">{{ m.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>

  <Transition name="modal-fade">
      <div v-if="selectedMember" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" @click.self="closeMember">
        <div class="relative bg-white rounded-xl shadow-2xl max-w-xl w-full p-8 z-10 m-4 transform transition-all" :class="selectedMember ? 'scale-100' : 'scale-95'">
          <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition" @click="closeMember" aria-label="Close modal">
            <XMarkIcon class="h-5 w-5" />
          </button>
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img :src="selectedMember.img" :alt="selectedMember.name" class="w-36 h-36 rounded-full object-cover border-4 border-gray-100 shadow-md" />
            <div class="text-center sm:text-left">
              <h3 class="text-2xl font-bold text-gray-900">{{ selectedMember.name }}</h3>
              <p class="text-gray-700 font-semibold">{{ selectedMember.role }}</p>
              <p class="mt-4 text-gray-700 leading-relaxed">{{ selectedMember.bio }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { HeartIcon, EyeIcon, ShieldCheckIcon, LightBulbIcon, XMarkIcon, HandRaisedIcon } from '@heroicons/vue/24/solid';
import { TagIcon } from '@heroicons/vue/24/outline';
import AnimatedBackground from '@/components/AnimatedBackground.vue';

// Team members data
const team = ref([
  { id: 1, name: 'Mrs. Radha Sharma', role: 'Founder', img: '/images/gallery/image1.jpg', bio: 'Dedicated to empowering society through education and compassion. With over 20 years of experience in social work, Radha founded the trust to create lasting change.' },
  { id: 2, name: 'Mr. Alok Singh', role: 'President', img: '/images/gallery/image2.jpg', bio: 'An experienced social worker committed to driving change at the grassroots level. Alok manages our day-to-day operations and community outreach.' },
  { id: 3, name: 'Ms. Sunita Verma', role: 'Programs Coordinator', img: '/images/gallery/image3.jpg', bio: 'Sunita coordinates our field activities and logistics, ensuring our programs run smoothly and effectively reach those in need.' },
  { id: 4, name: 'Mr. Rakesh Kumar', role: 'Lead Volunteer', img: '/images/gallery/image1.jpg', bio: 'Rakesh is a passionate volunteer who leads our outreach and community engagement programs, inspiring others to join our cause.' },
]);

// Modal state
const selectedMember = ref<any>(null);
const openMember = (m: any) => (selectedMember.value = m);
const closeMember = () => (selectedMember.value = null);

// Simple impact counters
const counters = ref([
  { id: 'c1', label: 'Children Educated', value: 1240 },
  { id: 'c2', label: 'Health Camps Held', value: 48 },
  { id: 'c3', label: 'Trees Planted', value: 3200 },
]);

// Counter animation logic
const animateCounters = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const target = +el.getAttribute('data-target')!;
        el.innerText = '0';
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;

        const counter = setInterval(() => {
          frame++;
          const progress = frame / totalFrames;
          const currentCount = Math.round(target * progress);
          el.innerText = currentCount.toLocaleString();

          if (frame === totalFrames) {
            clearInterval(counter);
            el.innerText = target.toLocaleString(); // Ensure it ends on the exact number
          }
        }, frameDuration);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => {
    observer.observe(el);
  });
};

// Scroll-triggered reveal for general elements
let scrollObserver: IntersectionObserver | null = null;

const observeScrollElements = () => {
  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        el.classList.add('in-view');

        // Handle stagger parents: add delay vars to children
        if (el.classList.contains('stagger-parent')) {
          const children = Array.from(el.querySelectorAll('.stagger-child')) as HTMLElement[];
          children.forEach((child, idx) => {
            // small delay per child
            const delay = (idx * 80); // ms
            child.style.setProperty('--enter-delay', `${delay}ms`);
            child.style.transitionDelay = `${delay}ms`;
          });
        }

        scrollObserver?.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  // Observe both animate-on-scroll and stagger-parent containers
  document.querySelectorAll('.animate-on-scroll, .stagger-parent').forEach(el => {
    scrollObserver?.observe(el);
  });
};

// Fallback: check elements already in viewport and apply in-view + stagger delays
const applyInViewIfVisible = () => {
  const els = Array.from(document.querySelectorAll('.animate-on-scroll, .stagger-parent')) as HTMLElement[];
  els.forEach(el => {
    try {
      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < (window.innerHeight * 0.9) && rect.bottom > 0;
      if (inViewport) {
        el.classList.add('in-view');
        if (el.classList.contains('stagger-parent')) {
          const children = Array.from(el.querySelectorAll('.stagger-child')) as HTMLElement[];
          children.forEach((child, idx) => {
            const delay = (idx * 80);
            child.style.setProperty('--enter-delay', `${delay}ms`);
            child.style.transitionDelay = `${delay}ms`;
          });
        }
      }
    } catch (e) {
      // ignore
    }
  });
};

onMounted(() => {
  animateCounters();
  observeScrollElements();
  // ensure elements already visible get revealed
  applyInViewIfVisible();
  setTimeout(applyInViewIfVisible, 300);
  window.addEventListener('keydown', handleEsc);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc);
  if (scrollObserver) {
    scrollObserver.disconnect();
    scrollObserver = null;
  }
});

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && selectedMember.value) {
    closeMember();
  }
};
</script>

<style scoped>
/* Modal */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: transform 0.25s ease;
}

.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
  transform: scale(0.96) translateY(-8px);
}

/* Timeline styling */
.right-timeline::before {
  content: '';
  position: absolute;
  width: 50%;
  left: 0;
  top: 1.5rem;
  border-top: 2px dashed #f3f4f6; /* muted */
}

.left-timeline::before {
  content: '';
  position: absolute;
  width: 50%;
  right: 0;
  top: 1.5rem;
  border-top: 2px dashed #f3f4f6; /* muted */
}

@media (max-width: 767px) {
  .right-timeline::before,
  .left-timeline::before {
    display: none;
  }

  .right-timeline,
  .left-timeline {
    justify-content: center;
  }

  .right-timeline .order-1,
  .left-timeline .order-1 {
    width: 100%;
  }

  .right-timeline .z-10,
  .left-timeline .z-10 {
    display: none;
  }
}

/* Scroll animations (subtle fade-up) */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children use a CSS variable set by JS */
.stagger-child {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: var(--enter-delay, 0ms);
}

.stagger-parent.in-view .stagger-child {
  opacity: 1;
  transform: translateY(0);
}

/* Floating CTA */
.float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}

/* subtle pulse on hover for primary CTA */
.float:hover {
  animation: none;
  transform: translateY(-4px) scale(1.01);
}

/* Page background animated blobs */

/* Animated blobs (copied from HomeView) */
.animated-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.bg-blob { position: absolute; filter: blur(40px) saturate(1.2) opacity(0.18); transform-origin: center; }
.blob-1 { width: 420px; height: 420px; background: radial-gradient(circle at 30% 30%, #3b82f6, #06b6d4); top: -80px; left: -120px; animation: floatA 10s ease-in-out infinite; }
.blob-2 { width: 360px; height: 360px; background: radial-gradient(circle at 20% 20%, #f97316, #f43f5e); bottom: -100px; right: -80px; animation: floatB 12s ease-in-out infinite; }
.blob-3 { width: 280px; height: 280px; background: radial-gradient(circle at 40% 40%, #10b981, #7c3aed); top: 180px; right: -60px; animation: floatC 14s ease-in-out infinite; }

@keyframes floatA { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(18px) rotate(6deg); } 100% { transform: translateY(0) rotate(0deg); } }
@keyframes floatB { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(-6deg); } 100% { transform: translateY(0) rotate(0deg); } }
@keyframes floatC { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(12px) rotate(4deg); } 100% { transform: translateY(0) rotate(0deg); } }

.reveal-hidden { opacity: 0; transform: translateY(16px) scale(0.995); transition: opacity 600ms ease, transform 700ms cubic-bezier(.2,.9,.3,1); }
.reveal-visible { opacity: 1; transform: translateY(0) scale(1); }

.animated-bg .bg-blob { border-radius: 50%; }

/* Subtle rotation for blobs */
.blob-1 { animation: floatA 10s ease-in-out infinite, rotateSlow 40s linear infinite; }
.blob-2 { animation: floatB 12s ease-in-out infinite, rotateSlow 50s linear infinite; }
.blob-3 { animation: floatC 14s ease-in-out infinite, rotateSlow 38s linear infinite; }
@keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* Counters appear slightly bolder */
.counter {
  font-variant-numeric: tabular-nums;
}

</style>