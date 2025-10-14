<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-5xl mx-auto p-8">
      <h1 class="text-2xl font-bold mb-6">My Certificates</h1>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <template v-if="filtered.length === 0">
          <div class="col-span-1 md:col-span-3 bg-white p-6 rounded-lg shadow text-center text-gray-600">You don't have any certificates yet.</div>
        </template>

        <div v-for="cert in filtered" :key="cert.id" class="bg-white p-5 rounded-lg shadow">
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

          <div class="flex space-x-2">
            <button @click="openPreview(cert)" class="flex-1 px-3 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700">Preview</button>
            <button @click="downloadCertificate(cert)" class="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Download</button>
          </div>
        </div>
      </section>

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
          <div class="mt-4 flex justify-end space-x-3">
            <button @click="downloadCertificate(activeCert)" class="px-4 py-2 bg-green-600 text-white rounded-md">Download</button>
            <button @click="closePreview" class="px-4 py-2 bg-gray-200 rounded-md">Close</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import auth from '@/stores/auth';

const allCertificates = ref<any[]>([]);
const previewOpen = ref(false);
const activeCert = ref<any>({ id: 0, title: '', issued: '', preview: '' });

function loadCertificates() {
  try {
    const raw = localStorage.getItem('certificates');
    allCertificates.value = raw ? JSON.parse(raw) as any[] : [];
  } catch (e) {
    allCertificates.value = [];
  }
}

function certBelongsToUser(cert: any, user: any) {
  if (!user) return false;
  const uEmail = (user.email || '').toLowerCase();
  const possibleEmails = [cert.email, cert.ownerEmail, cert.assignedEmail, cert.userEmail].filter(Boolean).map((s: string) => String(s).toLowerCase());
  if (possibleEmails.includes(uEmail)) return true;
  if (cert.userId && String(cert.userId) === String(user.id)) return true;
  return false;
}

const user = auth;

const filtered = computed(() => {
  if (!user.value) return [];
  return allCertificates.value.filter(c => certBelongsToUser(c, user.value));
});

onMounted(() => loadCertificates());
// Try fetching certificates from backend if authenticated and token is available
onMounted(() => {
  (async () => {
    const user = auth.value;
    if (!user) return;
    const token = (user as any).token;
    if (!token) return;
    try {
      const res = await fetch('http://localhost:3000/api/certificates/me', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const d = await res.json();
        allCertificates.value = d.certificates || [];
      }
    } catch (e) {
      // ignore and keep local fallback
    }
  })();
});

function openPreview(cert: any) {
  activeCert.value = cert;
  previewOpen.value = true;
}

function closePreview() {
  previewOpen.value = false;
}

async function downloadCertificate(cert: any) {
  if (!cert || !cert.preview) return alert('No file to download');
  try {
    const res = await fetch(cert.preview);
    if (!res.ok) throw new Error('Failed to fetch file');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = (cert.title || 'certificate').replace(/[^a-z0-9-_\.]/gi, '_');
    const ext = (blob.type && blob.type.split('/') && blob.type.split('/')[1]) || 'jpg';
    a.href = url;
    a.download = `${safeTitle}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Download failed', e);
    window.open(cert.preview, '_blank');
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity .2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
