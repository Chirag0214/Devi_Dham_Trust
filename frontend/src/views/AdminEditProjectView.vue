<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-brand-700">Edit Project: {{ formData.title }}</h1>
    
    <div v-if="isLoading" class="text-center text-xl text-gray-500">Loading project details...</div>
    <div v-else-if="error" class="text-center text-red-600 text-xl">{{ error }}</div>

    <form v-else @submit.prevent="submitUpdate" class="bg-white p-8 shadow-lg rounded-lg max-w-2xl mx-auto">
      
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
      
      <div v-if="formData.image_src" class="mb-6">
        <p class="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
        <img :src="`http://localhost:3000${formData.image_src}`" alt="Current Project Image" class="w-32 h-32 object-cover rounded-md border">
        <p class="text-xs text-gray-500 mt-1">Image update ke liye naya feature banana hoga.</p>
      </div>

            <button type="submit" :disabled="isSubmitting"
                    class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50">
        {{ isSubmitting ? 'Updating...' : 'Save Changes' }}
      </button>

    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import auth from '@/stores/auth';

const route = useRoute();
const router = useRouter();

const projectId = route.params.id as string; // URL se ID lo
const formData = ref({
    title: '',
    description: '',
    status: '',
    image_src: '' // Display ke liye
});
const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref('');

// --- Fetch Project Data ---
const fetchProject = async () => {
    try {
        // Humne pehle single GET API nahi banaya, isliye hum All Projects API use karke filter karenge
        // For production, single ID ka API banana better hai.
        const response = await fetch(`http://localhost:3000/api/projects`);
        const data = await response.json();
        
        const project = data.find((p: any) => p.id == projectId);
        
        if (project) {
            formData.value.title = project.title;
            formData.value.description = project.description;
            formData.value.status = project.status;
            formData.value.image_src = project.image_src;
        } else {
            error.value = 'Project not found.';
        }
    } catch (err) {
        console.error('Fetch error:', err);
        error.value = 'Failed to load project data.';
    } finally {
        isLoading.value = false;
    }
};

// --- Submit Update ---
const submitUpdate = async () => {
    isSubmitting.value = true;
    try {
    const tokenFromStore = auth.value?.token;

        const defaultBackend = 'http://localhost:3000';
        const currentOrigin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
        const backendOrigin = currentOrigin.includes(':3000') ? currentOrigin : defaultBackend;

        const headers: any = { 'Content-Type': 'application/json' };
        if (tokenFromStore) headers['Authorization'] = `Bearer ${tokenFromStore}`;

        const response = await fetch(`${backendOrigin}/api/admin/projects/${projectId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                title: formData.value.title,
                description: formData.value.description,
                status: formData.value.status,
            }),
        });

        if (response.ok) {
            alert('Project details updated successfully!');
            // After editing, send admin to the public Projects page so it refetches and shows updates
            router.push('/projects');
        } else {
            const errorData = await response.json();
            alert(`Update failed: ${errorData.message}`);
        }
    } catch (err) {
        console.error('Update error:', err);
        alert('An unexpected error occurred during update.');
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(fetchProject);
</script>