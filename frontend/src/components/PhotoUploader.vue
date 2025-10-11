<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Upload New Gallery Photo</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="photo" class="block text-sm font-medium text-gray-700">Select Image File</label>
        <input 
          type="file" 
          id="photo" 
          ref="fileInput"
          @change="onFileChange"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label for="caption" class="block text-sm font-medium text-gray-700">Caption (Description)</label>
        <input 
          type="text" 
          id="caption" 
          v-model="caption" 
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g., Medical camp in village X"
        />
      </div>

      <div>
        <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
        <select 
          id="category" 
          v-model="category"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="General">General</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          <option value="Events">Events</option>
        </select>
      </div>

      <button 
        type="submit" 
        :disabled="isUploading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
      >
        <span v-if="isUploading">Uploading...</span>
        <span v-else>Upload Photo</span>
      </button>

      <p v-if="message" :class="['text-sm font-medium mt-3', isError ? 'text-red-600' : 'text-green-600']">{{ message }}</p>

    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import auth from '@/stores/auth';

const file = ref<File | null>(null);
const caption = ref('');
const category = ref('General');
const isUploading = ref(false);
const message = ref('');
const isError = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0] as File; 
  } else {
    file.value = null;
  }
};

const handleSubmit = async () => {
  // ... (Submission Logic - checks for file, sends FormData to API)
  if (!file.value) {
    message.value = 'Please select a file to upload.';
    isError.value = true;
    return;
  }

  isUploading.value = true;
  isError.value = false;
  message.value = '';

  const formData = new FormData();
  formData.append('photo', file.value);
  formData.append('caption', caption.value);
  formData.append('category', category.value);

  try {
    const token = auth.value?.token;
    if (!token) {
      message.value = 'Authentication required: please log in as admin to upload gallery photos.';
      isError.value = true;
      isUploading.value = false;
      return;
    }

    const defaultBackend = 'http://localhost:3000';
    const currentOrigin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
    const backendOrigin = currentOrigin.includes(':3000') ? currentOrigin : defaultBackend;

    const response = await fetch(`${backendOrigin}/api/admin/gallery`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      message.value = `Success! ${result.message} Gallery page par dikhne ke liye refresh karein.`;
      isError.value = false;
      // Form reset
      caption.value = '';
      category.value = 'General';
      file.value = null;
      if (fileInput.value) {
          fileInput.value.value = '';
      }
    } else {
      throw new Error(result.message || 'Server error occurred.');
    }
  } catch (error: any) {
    message.value = `Error: ${error.message}`;
    isError.value = true;
  } finally {
    isUploading.value = false;
  }
};
</script>