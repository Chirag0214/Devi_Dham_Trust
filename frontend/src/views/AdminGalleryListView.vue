<template>
<div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

  <main class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Manage Gallery Photos</h1>
    
    <div v-if="isLoading" class="text-center">Loading photos...</div>
    <div v-else-if="photos.length === 0" class="text-center text-gray-500">
      No photos found. Add some from the "Add Gallery" page.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="photo in photos" :key="photo.id" class="bg-white shadow-lg rounded-lg overflow-hidden">
        
        <img :src="photo.src" :alt="photo.caption" class="w-full h-48 object-cover">
        
        <div class="p-4">
          <p class="text-sm font-semibold truncate">{{ photo.caption }}</p>
          <p class="text-xs text-gray-500">Category: {{ photo.category }}</p>
          <button 
            @click="deletePhoto(photo.id)"
            class="mt-3 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-150"
            :disabled="isDeleting[photo.id]"
          >
            {{ isDeleting[photo.id] ? 'Deleting...' : 'Delete Photo' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import Sidebar from '@/components/Sidebar.vue';
import auth from '@/stores/auth';
import { computed } from 'vue';

const user = auth;
const isAdmin = computed(() => {
  return !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org'));
});

const photos = ref<any[]>([]);
const isLoading = ref(false);
const isDeleting = ref<Record<number, boolean>>({}); // To disable button during deletion

// --- Fetch all photos (same as GalleryView) ---
const fetchPhotos = async () => {
    isLoading.value = true;
    try {
        const response = await fetch('http://localhost:3000/api/gallery');
        const data = await response.json();
        
        photos.value = data.map((item: any) => ({
            ...item,
            // Prefix the URL for display
            src: item.src.startsWith('http') ? item.src : `http://localhost:3000${item.src}`,
        }));

    } catch (error) {
        console.error("Error fetching photos:", error);
    } finally {
        isLoading.value = false;
    }
};

// --- DELETE Photo Logic ---
const deletePhoto = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this photo?')) {
        return;
    }
    
    isDeleting.value[id] = true;

    try {
        const response = await fetch(`http://localhost:3000/api/admin/gallery/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Frontend se photo ko hatao (instant UI update)
            photos.value = photos.value.filter(p => p.id !== id);
            alert('Photo deleted successfully!');
        } else {
            const errorData = await response.json();
            alert(`Failed to delete photo: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('An unexpected error occurred during deletion.');
    } finally {
        isDeleting.value[id] = false;
    }
};

onMounted(fetchPhotos);
</script>