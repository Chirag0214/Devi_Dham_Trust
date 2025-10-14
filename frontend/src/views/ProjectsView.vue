<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
  <h1 class="text-4xl font-extrabold text-center mb-10 text-brand-700">Our Works & Causes</h1>
      
      <div v-if="isLoading" class="text-center p-10">
        <p class="text-xl text-gray-600">Loading our latest projects...</p>
      </div>
      
      <div v-else-if="projects.length === 0" class="text-center p-10">
        <p class="text-xl text-gray-500">Currently, there are no active projects to display.</p>
      </div>

      <div v-else class="space-y-16"> 
        <div v-for="(project, index) in projects" :key="project.id" 
             class="flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden"
             :class="{'md:flex-row-reverse': index % 2 !== 0}"> <div class="md:w-1/2 h-64 md:h-auto overflow-hidden">
            <img :src="project.full_image_src" :alt="project.title" 
                 class="w-full h-full object-cover" 
                 @error="handleImageError" 
                 loading="lazy">
          </div>
          
          <div class="md:w-1/2 p-8 flex flex-col justify-center">
            
            <span :class="getStatusClass(project.status)" class="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 self-start">
              {{ project.status }}
            </span>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ project.title }}</h2>
            <p class="text-gray-600 mb-6">{{ project.description }}</p>
            
            <router-link to="#" class="text-brand-500 font-semibold hover:text-brand-700 transition duration-150 self-start">
              Read More & Donate →
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// --- Interface for Projects (Optional but good practice) ---
interface Project {
    id: number;
    title: string;
    description: string;
    image_src: string;
    full_image_src: string; // Frontend ke liye
    status: 'Active' | 'Completed' | 'Upcoming';
}

const projects = ref<Project[]>([]);
const isLoading = ref(false);

const fetchProjects = async () => {
    isLoading.value = true;
  try {
    // Determine backend origin. If running dev frontend on a different port, default to localhost:3000
    const defaultBackend = 'http://localhost:3000';
    const currentOrigin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
    const backendOrigin = currentOrigin.includes(':3000') ? currentOrigin : defaultBackend;

    const response = await fetch(`${backendOrigin}/api/projects`);

    if (!response.ok) {
      throw new Error('Failed to fetch projects data.');
    }

    const data = await response.json();

    // Build full image URL using backend origin when necessary
    projects.value = data.map((item: any) => ({
      ...item,
      full_image_src: item.image_src && item.image_src.startsWith('http')
              ? item.image_src
              : `${backendOrigin}${item.image_src}`,
    }));

    } catch (error) {
        console.error("Error fetching projects:", error);
        alert('Could not load projects. Check the server connection (port 3000).');
    } finally {
        isLoading.value = false;
    }
};

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-800';
        case 'Upcoming': return 'bg-yellow-100 text-yellow-800';
        case 'Completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const handleImageError = (event: Event) => {
  // If image fails to load, use a local fallback image from public/images
  (event.target as HTMLImageElement).src = '/images/plantation.avif';
    (event.target as HTMLImageElement).classList.add('p-10'); 
};

onMounted(fetchProjects);
</script>