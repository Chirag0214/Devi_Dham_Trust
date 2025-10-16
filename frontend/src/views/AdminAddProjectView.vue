<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-6 lg:p-12">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-semibold mb-6 text-center text-brand-700">Add New Project</h1>

        <form @submit.prevent="submitForm" class="bg-white p-6 md:p-8 shadow rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Project Title</label>
              <input id="title" type="text" v-model="formData.title" required
                     class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-brand-200" />
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
              <select id="status" v-model="formData.status"
                      class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div class="mt-4">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" v-model="formData.description" rows="5" required
                      class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
          </div>

          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <label class="block text-sm font-medium text-gray-700">Project Image (JPG / PNG)</label>
              <input type="file" accept="image/*" @change="handleFileUpload"
                     class="mt-1 block w-full text-sm text-gray-700 border border-gray-200 rounded-md p-2 cursor-pointer bg-gray-50" />
              <p v-if="imageError" class="text-sm text-red-600 mt-1">{{ imageError }}</p>
            </div>

            <div class="flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-md p-4 bg-gray-50">
              <div v-if="previewUrl" class="w-full h-48 overflow-hidden rounded-md">
                <img :src="previewUrl" alt="Preview" class="object-cover w-full h-full" />
              </div>
              <div v-else class="text-sm text-gray-500">Image preview will appear here</div>
              <p v-if="formData.imageFile" class="mt-2 text-sm text-gray-600">{{ formData.imageFile.name }}</p>
            </div>
          </div>

          <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <button type="submit" :disabled="isLoading"
                    :class="['w-full sm:flex-1 py-2 px-4 text-white rounded-md focus:outline-none transform transition text-center', isLoading ? 'bg-green-500 cursor-wait' : 'bg-green-600 hover:bg-green-700 active:scale-95']">
              <span v-if="!isLoading">Create Project</span>
              <span v-else class="inline-flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Creating...
              </span>
            </button>

            <button type="button" @click="resetForm" class="w-full sm:w-auto py-2 px-4 border rounded-md hover:bg-gray-100 active:scale-95 transition">Reset</button>
          </div>
        </form>

        <transition name="success-scale">
          <div v-if="showSuccess" class="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
            <!-- backdrop -->
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <!-- card -->
            <div class="relative z-10 w-full max-w-md mx-4 bg-white rounded-lg shadow-xl p-8 text-center">
              <div class="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-green-50 mb-4">
                <svg class="h-12 w-12 text-green-600 animate-pop" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </div>
              <h2 class="text-xl font-semibold">Project created!</h2>
              <p class="text-sm text-gray-600 mt-2">The project was created successfully.</p>

              <div class="mt-4">
                <button @click="onDone" class="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:scale-95 transition">Done</button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import Sidebar from '@/components/Sidebar.vue';
import auth from '@/stores/auth';

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
const previewUrl = ref<string | null>(null);
const imageError = ref<string | null>(null);
const showSuccess = ref(false);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  imageError.value = null;
  const file = target.files && target.files.length > 0 ? target.files[0] : null;

  if (!file) {
    formData.value.imageFile = null;
    previewUrl.value = null;
    return;
  }

  // basic validation
  if (!file.type || !file.type.startsWith('image/')) {
    imageError.value = 'Please select a valid image file.';
    formData.value.imageFile = null;
    previewUrl.value = null;
    return;
  }

  formData.value.imageFile = file;
  // create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string | null;
  };
  reader.readAsDataURL(file);
};

const resetForm = () => {
  formData.value = { title: '', description: '', status: 'Active', imageFile: null };
  previewUrl.value = null;
  imageError.value = null;
};

const submitForm = async () => {
  if (!formData.value.title || !formData.value.description || !formData.value.imageFile) {
    alert('Please fill all fields and select an image.');
    return;
  }

  isLoading.value = true;

  const data = new FormData();
  data.append('title', formData.value.title);
  data.append('description', formData.value.description);
  data.append('status', formData.value.status);
  data.append('projectImage', formData.value.imageFile as File);

  try {
    const token = user.value?.token;
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const defaultBackend = 'http://localhost:3000';
    const currentOrigin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
    const backendOrigin = currentOrigin.includes(':3000') ? currentOrigin : defaultBackend;

    const response = await fetch(`${backendOrigin}/api/admin/projects`, {
      method: 'POST',
      headers,
      body: data,
    });

    if (response.ok) {
      // Show success state; do NOT redirect automatically
      showSuccess.value = true;
      // clear loading state but keep form hidden; the admin can choose to create another
      isLoading.value = false;
    } else {
      const errorData = await response.json();
      alert(`Project creation failed: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('An unexpected error occurred during project creation.');
  } finally {
    // keep isLoading false here; success branch sets it earlier
    isLoading.value = false;
  }
};

const onCreateAnother = () => {
  // hide success overlay and reset form to add another project
  showSuccess.value = false;
  resetForm();
};

const goToProjects = () => {
  router.push('/projects');
};

const onDone = () => {
  // close the success overlay and reset form
  showSuccess.value = false;
  resetForm();
};
</script>

<style scoped>
/* form fade/scale */
.form-fade-enter-from { opacity: 0; transform: translateY(6px) scale(.995); }
.form-fade-enter-active { transition: all 220ms cubic-bezier(.2,.8,.2,1); }
.form-fade-enter-to { opacity: 1; transform: translateY(0) scale(1); }

/* preview scale */
.preview-scale-enter-from { opacity: 0; transform: scale(.96); }
.preview-scale-enter-active { transition: all 200ms ease-out; }
.preview-scale-enter-to { opacity: 1; transform: scale(1); }

/* success overlay scale */
.success-scale-enter-from { opacity: 0; transform: scale(.96); }
.success-scale-enter-active { transition: all 300ms cubic-bezier(.2,.8,.2,1); }
.success-scale-enter-to { opacity: 1; transform: scale(1); }

/* pop animation for check */
.animate-pop { animation: pop 520ms cubic-bezier(.2,.85,.32,1); }
@keyframes pop {
  0% { transform: scale(.6); opacity: 0; }
  60% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); }
}
</style>