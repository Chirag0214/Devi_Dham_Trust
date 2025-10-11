<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-5xl mx-auto p-8">
      <h1 class="text-2xl font-bold mb-6">Certifications</h1>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="cert in certificates" :key="cert.id" class="bg-white p-5 rounded-lg shadow">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold">{{ cert.title }}</h3>
              <p class="text-sm text-gray-500">Issued: {{ cert.issued }}</p>
            </div>
            <div class="text-sm text-gray-400">#{{ cert.id }}</div>
          </div>

          <div class="h-40 bg-gray-100 rounded-md flex items-center justify-center mb-4">
            <img v-if="cert.preview" :src="cert.preview" alt="preview" class="max-h-36" />
            <div v-else class="text-gray-400">Certificate preview</div>
          </div>

          <div class="flex">
            <button @click="openPreview(cert)" class="w-full px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Preview</button>
          </div>
        </div>
      </section>

      <!-- Modal -->
      <div v-if="previewOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-5 shadow-lg">
          <div class="flex justify-between items-start">
            <h2 class="text-xl font-semibold">{{ activeCert.title }}</h2>
            <button @click="closePreview" class="text-gray-500 hover:text-gray-700">Close</button>
          </div>
          <div class="mt-4">
            <img v-if="activeCert.preview" :src="activeCert.preview" alt="active preview" class="w-full h-auto rounded" />
            <div v-else class="h-64 flex items-center justify-center text-gray-400">No preview available</div>
          </div>
          <div class="mt-4 flex justify-end">
            <button @click="closePreview" class="px-4 py-2 bg-gray-200 rounded-md">Close</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';

// Demo certificates (static for now). In future you can load from API.
const certificates = ref([
  { id: 1, title: 'Volunteer Participation', issued: '2024-12-01', preview: '/images/demo%20certificates/demo%20certificta%201.jpg' },
  { id: 2, title: 'Tree Plantation Drive', issued: '2025-03-15', preview: '/images/demo%20certificates/demo%20certificta%202.jpg' },
  { id: 3, title: 'Community Service', issued: '2025-07-20', preview: '/images/demo%20certificates/demo%20certificta%203.jpg' }
]);

const previewOpen = ref(false);
const activeCert = ref({ id: 0, title: '', issued: '', preview: '' });

function openPreview(cert: any) {
  activeCert.value = cert;
  previewOpen.value = true;
}

function closePreview() {
  previewOpen.value = false;
}

// downloadCertificate removed — downloads are intentionally disabled. Use Preview to view certificates.
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity .2s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
