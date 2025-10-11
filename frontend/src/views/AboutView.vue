<template>
  <div class="bg-gray-50">
    <section class="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-20 md:py-28">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">About Devi Dhamm Trust</h1>
        <p class="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto">
          Empowering underprivileged children and communities through education, healthcare, and sustainable
          development. Join us in creating a brighter future.
        </p>
        <div class="mt-10 flex justify-center gap-4">
          <router-link to="/donate"
            class="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300">
            <i class="fas fa-heart mr-2"></i>Donate Now
          </router-link>
          <router-link to="/contact"
            class="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-indigo-600 transition-colors duration-300">
            <i class="fas fa-hands-helping mr-2"></i>Get Involved
          </router-link>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-24 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800">Our Story</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">From a small seed of an idea to a growing tree of
            impact.</p>
        </div>
        <div class="relative">
          <div class="absolute left-1/2 h-full border-l-2 border-gray-200 hidden md:block"></div>

          <div class="mb-8 flex justify-between items-center w-full right-timeline">
            <div class="order-1 md:w-5/12"></div>
            <div class="z-10 flex items-center order-1 bg-indigo-500 shadow-xl w-12 h-12 rounded-full">
              <h1 class="mx-auto font-semibold text-lg text-white">2015</h1>
            </div>
            <div class="order-1 bg-indigo-100 rounded-lg shadow-xl w-full md:w-5/12 px-6 py-4">
              <h3 class="font-bold text-gray-800 text-xl">The Beginning</h3>
              <p class="text-sm leading-snug tracking-wide text-gray-600 text-opacity-100">Started by local volunteers,
                Devi Dhamm Trust began as a small education initiative to support children in our community.</p>
            </div>
          </div>

          <div class="mb-8 flex justify-between flex-row-reverse items-center w-full left-timeline">
            <div class="order-1 md:w-5/12"></div>
            <div class="z-10 flex items-center order-1 bg-purple-500 shadow-xl w-12 h-12 rounded-full">
              <h1 class="mx-auto text-white font-semibold text-lg">2018</h1>
            </div>
            <div class="order-1 bg-purple-100 rounded-lg shadow-xl w-full md:w-5/12 px-6 py-4">
              <h3 class="font-bold text-gray-800 text-xl">Expanding Horizons</h3>
              <p class="text-sm leading-snug tracking-wide text-gray-600 text-opacity-100">We expanded our programs to
                include health camps and environmental initiatives, reaching more families and creating a wider impact.
              </p>
            </div>
          </div>

          <div class="mb-8 flex justify-between items-center w-full right-timeline">
            <div class="order-1 md:w-5/12"></div>
            <div class="z-10 flex items-center order-1 bg-indigo-500 shadow-xl w-12 h-12 rounded-full">
              <h1 class="mx-auto font-semibold text-lg text-white">Today</h1>
            </div>
            <div class="order-1 bg-indigo-100 rounded-lg shadow-xl w-full md:w-5/12 px-6 py-4">
              <h3 class="font-bold text-gray-800 text-xl">A Growing Movement</h3>
              <p class="text-sm leading-snug tracking-wide text-gray-600 text-opacity-100">With the help of our donors
                and volunteers, we continue to scale our work, keeping the community at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-24 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="p-8 bg-white rounded-lg shadow-lg">
            <div class="flex items-center mb-4">
              <i class="fas fa-bullseye text-4xl text-indigo-600 mr-4"></i>
              <h3 class="text-3xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p class="text-lg text-gray-600">To empower underprivileged children and communities with holistic
              education, essential life skills, and access to opportunities, enabling them to realize their full
              potential and contribute to a more equitable society.</p>
          </div>
          <div class="p-8 bg-white rounded-lg shadow-lg">
            <div class="flex items-center mb-4">
              <i class="fas fa-eye text-4xl text-purple-600 mr-4"></i>
              <h3 class="text-3xl font-bold text-gray-900">Our Vision</h3>
            </div>
            <p class="text-lg text-gray-600">We envision a world where every child has the chance to thrive. We focus on
              creating sustainable programs in education, health, and community awareness, all driven by compassion,
              transparency, and active community participation.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-20 bg-indigo-700 text-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold">Our Impact in Numbers</h2>
          <p class="mt-4 text-lg text-indigo-200 max-w-2xl mx-auto">Every number tells a story of a life changed.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div v-for="c in counters" :key="c.id" class="p-6">
            <div class="text-5xl md:text-6xl font-extrabold text-white" :data-target="c.value">0</div>
            <div class="mt-2 text-lg font-medium text-indigo-200 uppercase tracking-wider">{{ c.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-24 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800">Our Core Values</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">The principles that guide our every action.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div class="p-6 bg-gray-50 rounded-lg shadow-sm">
            <i class="fas fa-heart text-4xl text-red-500 mb-4"></i>
            <h4 class="text-xl font-semibold text-gray-900 mb-2">Compassion</h4>
            <p class="text-gray-600">We approach our work with empathy and a deep sense of care for the communities we
              serve.</p>
          </div>
          <div class="p-6 bg-gray-50 rounded-lg shadow-sm">
            <i class="fas fa-shield-alt text-4xl text-blue-500 mb-4"></i>
            <h4 class="text-xl font-semibold text-gray-900 mb-2">Integrity</h4>
            <p class="text-gray-600">We are committed to transparency and accountability in all our actions and use of
              resources.</p>
          </div>
          <div class="p-6 bg-gray-50 rounded-lg shadow-sm">
            <i class="fas fa-lightbulb text-4xl text-yellow-500 mb-4"></i>
            <h4 class="text-xl font-semibold text-gray-900 mb-2">Empowerment</h4>
            <p class="text-gray-600">We believe in providing tools and knowledge to help individuals build their own
              futures.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-24 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800">Meet Our Team</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">The dedicated individuals behind our mission.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="m in team" :key="m.id" @click="openMember(m)"
            class="group bg-white rounded-xl shadow-md p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
            <img :src="m.img" :alt="m.name"
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg border-4 border-white group-hover:border-indigo-200 transition-all duration-300" />
            <h4 class="text-xl font-semibold text-gray-900">{{ m.name }}</h4>
            <p class="text-indigo-600 font-medium">{{ m.role }}</p>
          </div>
        </div>
      </div>
    </section>
    
   <Transition name="modal-fade">
      <div v-if="selectedMember" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click.self="closeMember">
        <div class="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 z-10 m-4 transform transition-all"
          :class="selectedMember ? 'scale-100' : 'scale-95'">
          <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition" @click="closeMember"
            aria-label="Close modal">
            <i class="fas fa-times fa-lg"></i>
          </button>
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img :src="selectedMember.img" :alt="selectedMember.name"
              class="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-md" />
            <div class="text-center sm:text-left">
              <h3 class="text-2xl font-bold text-gray-900">{{ selectedMember.name }}</h3>
              <p class="text-indigo-600 font-semibold">{{ selectedMember.role }}</p>
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

onMounted(() => {
  animateCounters();
  window.addEventListener('keydown', handleEsc);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc);
});

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && selectedMember.value) {
    closeMember();
  }
};
</script>

<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
  transform: scale(0.95) translateY(-20px);
}

/* Timeline styling */
.right-timeline::before {
  content: '';
  position: absolute;
  width: 50%;
  left: 0;
  top: 1.5rem;
  border-top: 2px dashed #d1d5db;
  /* gray-300 */
}

.left-timeline::before {
  content: '';
  position: absolute;
  width: 50%;
  right: 0;
  top: 1.5rem;
  border-top: 2px dashed #d1d5db;
  /* gray-300 */
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
</style>