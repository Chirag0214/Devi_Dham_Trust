<template>
  <div class="py-12 bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-extrabold text-gray-900 text-center mb-10">Our Latest Moments</h2>

      <div class="relative overflow-hidden rounded-lg shadow-2xl">

        <!-- Use out-in mode so leave finishes before enter starts (no overlap) and
             apply v-if/key directly to the slide container so transition classes
             target the element that has the dark background. This prevents the
             page background from showing during transforms. -->
        <Transition :name="transitionName" mode="out-in">
          <div v-if="currentPhoto" :key="currentPhoto?.id ?? currentIndex" class="w-full slide-wrapper h-72 sm:h-96 md:h-[36rem]">
            <img :src="currentPhoto.src" :alt="currentPhoto.caption" class="slide-image" />

            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4">
              <p class="text-white text-lg font-medium">{{ currentPhoto.caption }}</p>
              <p class="text-sm text-gray-300 mt-1">Category: {{ currentPhoto.category }}</p>
            </div>
          </div>
        </Transition>

        <button @click="prevPhoto"
          class="hidden sm:flex absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-white bg-opacity-70 rounded-full text-gray-800 hover:bg-white transition z-10">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <button @click="nextPhoto"
          class="hidden sm:flex absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-white bg-opacity-70 rounded-full text-gray-800 hover:bg-white transition z-10">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          <button v-for="(photo, index) in photos" :key="photo.id" @click="setIndex(index)"
            :class="['w-3 h-3 rounded-full transition duration-300', currentIndex === index ? 'bg-brand-500 scale-110' : 'bg-gray-300 hover:bg-gray-100']"
            aria-label="Go to slide"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

// Interface (optional, but good practice)
interface GalleryItem {
  id: number;
  src: string;
  caption: string;
  category: string;
  date: string;
}

// State variables
const photos = ref<GalleryItem[]>([]);
const currentIndex = ref(0);
const isLoading = ref(true); // Loading state

// --- DATA FETCHING LOGIC using fetch API ---
const fetchGalleryPhotos = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('http://localhost:3000/api/gallery');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Response ko JSON mein convert karein

    // Data format MySQL API se aaya hai
    photos.value = data.map((item: any) => ({
      ...item,
      // Ensure the URL is correctly prefixed for the backend server
      src: item.src.startsWith('http') ? item.src : `http://localhost:3000${item.src}`,
    }));

    if (photos.value.length === 0) {
      console.log("No photos found in the database.");
    }

  } catch (error) {
    console.error("Error fetching gallery photos:", error);
  } finally {
    isLoading.value = false;
  }
};

// Component load hone par data fetch karo
onMounted(fetchGalleryPhotos);


// --- Slider Logic ---
const dir = ref<'left' | 'right'>('right');

const transitionName = computed(() => (dir.value === 'right' ? 'slide-right' : 'slide-left'));

const currentPhoto = computed(() => {
  if (photos.value.length === 0) return null;
  return photos.value[currentIndex.value];
});

const nextPhoto = () => {
  if (photos.value.length === 0) return;
  // Clicking the right arrow should make the visible motion go to the right.
  // We use the 'slide-left' animation (incoming from left, outgoing to right)
  dir.value = 'left';
  currentIndex.value = (currentIndex.value + 1) % photos.value.length;
};

const prevPhoto = () => {
  if (photos.value.length === 0) return;
  // Clicking the left arrow should make the visible motion go to the left.
  // We use the 'slide-right' animation (incoming from right, outgoing to left)
  dir.value = 'right';
  currentIndex.value = (currentIndex.value - 1 + photos.value.length) % photos.value.length;
};

const setIndex = (index: number) => {
  if (index >= 0 && index < photos.value.length) {
    // Determine direction: if target index is greater than current, move to the right visually
    dir.value = index > currentIndex.value ? 'left' : 'right';
    currentIndex.value = index;
  }
};
</script>

<style scoped>
/* Generic timing */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.45s ease-in-out;
}

/* With `mode="out-in"` we no longer need to absolutely position the
   slides. The single slide will be clipped by the .slide-wrapper overflow
   during translateX animations, avoiding any peek of the previous slide. */

/* Important: make the outgoing (leave) slide render above the incoming (enter) slide
   so the current image remains visible while the next one animates in underneath. */

/* Right arrow: incoming from right (enter), outgoing moves left (leave)
   - incoming has lower z-index (10)
   - outgoing has higher z-index (20) so it stays above while moving out */
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.slide-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Left arrow: incoming from left (enter), outgoing moves right (leave) */
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Keep container height stable during transitions */
.relative > .slide-wrapper { position: relative; }

/* slide wrapper positioning and background to hide page color during transforms */
.slide-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #000; /* neutral dark background so any gaps aren't the page bg */
}

.slide-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  will-change: transform, opacity;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* Defensive small-screen cap: avoid extremely tall slides on tiny viewports */
@media (max-width: 420px) {
  .slide-wrapper { height: 220px !important; }
  .slide-wrapper .absolute { padding-left: 0.5rem; padding-right: 0.5rem; }
  .slide-wrapper p { word-break: break-word; }
}
</style>