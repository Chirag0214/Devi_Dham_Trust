<template>
    <div class="min-h-screen flex bg-gray-50">
        <Sidebar :user="user" :is-admin="isAdmin" />
        <main class="container mx-auto p-4">
            <h1 class="text-3xl font-bold mb-6 text-indigo-700">Manage Projects</h1>

            <div v-if="isLoading" class="text-center text-xl text-gray-500">Loading projects...</div>
            <div v-else-if="projects.length === 0" class="text-center text-xl text-gray-500 p-8 border rounded-lg">
                No projects found. Add one from the "Add New Project" page.
            </div>

            <div v-else class="space-y-6">
                <div v-for="project in projects" :key="project.id"
                    class="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">

                    <div class="md:w-1/4 h-32 overflow-hidden">
                        <img :src="project.full_image_src" :alt="project.title" class="w-full h-full object-cover">
                    </div>

                    <div class="md:w-3/4 p-4 flex flex-col justify-between">
                        <div>
                            <span :class="getStatusClass(project.status)"
                                class="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1">{{
                                project.status }}</span>
                            <h2 class="text-xl font-bold text-gray-900 truncate">{{ project.title }}</h2>
                            <p class="text-sm text-gray-600 line-clamp-2">{{ project.description }}</p>
                            <p class="text-xs text-gray-400 mt-1">Created: {{ formatDate(project.created_at) }}</p>
                        </div>

                        <div class="mt-3 flex space-x-3">
                            <router-link :to="`/admin/edit-project/${project.id}`"
                                class="px-4 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150">
                                Edit
                            </router-link>
                            <button @click="deleteProject(project.id)"
                                class="px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition duration-150"
                                :disabled="isDeleting[project.id]">
                                {{ isDeleting[project.id] ? 'Deleting...' : 'Delete Project' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

import Sidebar from '@/components/Sidebar.vue';
import auth from '@/stores/auth';


const user = auth;
const isAdmin = computed(() => {
    return !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org'));
});

const projects = ref<any[]>([]);
const isLoading = ref(false);
const isDeleting = ref<Record<number, boolean>>({});

// --- Fetch all projects (Same API as frontend view) ---
const fetchProjects = async () => {
    isLoading.value = true;
    try {
        const defaultBackend = 'http://localhost:3000';
        const currentOrigin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
        const backendOrigin = currentOrigin.includes(':3000') ? currentOrigin : defaultBackend;

        const response = await fetch(`${backendOrigin}/api/projects`);
        const data = await response.json();

        projects.value = data.map((item: any) => ({
            ...item,
            full_image_src: item.image_src && item.image_src.startsWith('http')
                ? item.image_src
                : `${backendOrigin}${item.image_src}`,
        }));

    } catch (error) {
        console.error("Error fetching projects:", error);
    } finally {
        isLoading.value = false;
    }
};

// --- DELETE Project Logic ---
const deleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this project and its image?')) {
        return;
    }

    isDeleting.value[id] = true;

    try {
        const token = user.value?.token;
        if (!token) {
            alert('Authentication required: please log in as an admin before deleting projects.');
            isDeleting.value[id] = false;
            return;
        }

        const defaultBackend = 'http://localhost:3000';
        const currentOrigin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
        const backendOrigin = currentOrigin.includes(':3000') ? currentOrigin : defaultBackend;

        const response = await fetch(`${backendOrigin}/api/admin/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            // Frontend se project ko hatao (instant UI update)
            projects.value = projects.value.filter(p => p.id !== id);
            alert('Project deleted successfully!');
        } else {
            const errorData = await response.json();
            alert(`Failed to delete project: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('An unexpected error occurred during deletion.');
    } finally {
        isDeleting.value[id] = false;
    }
};

// Utility functions
const getStatusClass = (status: string) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-800';
        case 'Upcoming': return 'bg-yellow-100 text-yellow-800';
        case 'Completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
};

onMounted(fetchProjects);
</script>