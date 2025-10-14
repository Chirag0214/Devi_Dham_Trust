<template>
<div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />
  <main class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6 text-brand-700 text-center">Add New Project</h1>
    
    <form @submit.prevent="submitForm" class="bg-white p-8 shadow-lg rounded-lg max-w-2xl mx-auto">
      
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700">Project Title</label>
        <input type="text" id="title" v-model="formData.title" required
               class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
      </div>

      <div class="mb-4">
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" v-model="formData.description" rows="4" required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"></textarea>
      </div>

      <div class="mb-4">
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
        <select id="status" v-model="formData.status"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
        </select>
      </div>

      <div class="mb-6">
        <label for="image" class="block text-sm font-medium text-gray-700">Project Image (JPG/PNG)</label>
        <input type="file" id="image" @change="handleFileUpload" required
               class="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2">
        <p v-if="formData.imageFile" class="mt-1 text-sm text-green-600">File selected: {{ formData.imageFile.name }}</p>
      </div>

      <button type="submit" :disabled="isLoading"
              class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
        {{ isLoading ? 'Creating Project...' : 'Create Project' }}
      </button>

    </form>
  </main>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import Sidebar from '@/components/Sidebar.vue';
import auth from '@/stores/auth';
import { computed } from 'vue';

const router = useRouter();

const user = auth;
const isAdmin = computed(() => {
  return !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org'));
});

const formData = ref({
    title: '',
    description: '',
    status: 'Active',
    imageFile: null as File | null
});
const isLoading = ref(false);

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        formData.value.imageFile = target.files[0] ?? null;
    } else {
        formData.value.imageFile = null;
    }
};

const submitForm = async () => {
    if (!formData.value.title || !formData.value.description || !formData.value.imageFile) {
        alert('Please fill all fields and select an image.');
        return;
    }

    isLoading.value = true;
    
    // FormData object banaya jaata hai (non-JSON data jaise files ke liye zaroori)
    const data = new FormData();
    data.append('title', formData.value.title);
    data.append('description', formData.value.description);
    data.append('status', formData.value.status);
    data.append('projectImage', formData.value.imageFile); // 'projectImage' is the field name used in server.js multer setup

    try {
        const token = user.value?.token;
        const headers: any = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

    // Determine backend origin (development default: localhost:3000)
    const defaultBackend = 'http://localhost:3000';
    const currentOrigin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
    const backendOrigin = currentOrigin.includes(':3000') ? currentOrigin : defaultBackend;

    const response = await fetch(`${backendOrigin}/api/admin/projects`, {
          method: 'POST',
          headers,
          body: data, // Headers automatically set for FormData (don't set Content-Type)
        });

    if (response.ok) {
      alert('Project created successfully!');
      // Form ko reset karein
      formData.value = { title: '', description: '', status: 'Active', imageFile: null };
      // Redirect to Our Works page so admin sees the new project
      router.push('/projects');
    } else {
            const errorData = await response.json();
            alert(`Project creation failed: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('An unexpected error occurred during project creation.');
    } finally {
        isLoading.value = false;
    }
};
</script>