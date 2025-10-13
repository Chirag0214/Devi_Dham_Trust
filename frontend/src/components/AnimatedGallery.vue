<template>
  <div class="py-12 bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-extrabold text-gray-900 text-center mb-10">Our Latest Moments</h2>

      <div class="relative overflow-hidden rounded-lg shadow-2xl">

        <Transition name="slide" mode="out-in">
          <div v-if="currentPhoto" :key="currentIndex" class="w-full h-[36rem]">

            <img :src="currentPhoto.src" :alt="currentPhoto.caption" class="w-full h-full object-cover object-center" />

            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4">
              <p class="text-white text-lg font-medium">{{ currentPhoto.caption }}</p>
              <p class="text-sm text-gray-300 mt-1">Category: {{ currentPhoto.category }}</p>
            </div>
          </div>
        </Transition>

        <button @click="prevPhoto"
          class="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-white bg-opacity-70 rounded-full text-gray-800 hover:bg-white transition z-10">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <button @click="nextPhoto"
          class="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-white bg-opacity-70 rounded-full text-gray-800 hover:bg-white transition z-10">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          <button v-for="(photo, index) in photos" :key="photo.id" @click="setIndex(index)"
            :class="['w-3 h-3 rounded-full transition duration-300', currentIndex === index ? 'bg-orange-500 scale-110' : 'bg-gray-300 hover:bg-gray-100']"
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
const currentPhoto = computed(() => {
  if (photos.value.length === 0) return null;
  return photos.value[currentIndex.value];
});

const nextPhoto = () => {
  if (photos.value.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % photos.value.length;
};

const prevPhoto = () => {
  if (photos.value.length === 0) return;
  currentIndex.value = (currentIndex.value - 1 + photos.value.length) % photos.value.length;
};

const setIndex = (index: number) => {
  if (index >= 0 && index < photos.value.length) {
    currentIndex.value = index;
  }
};
</script>

<style scoped>
/* Slide Animation CSS (Same as before) */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
  position: absolute;
}
</style>