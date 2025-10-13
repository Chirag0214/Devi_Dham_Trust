<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-5xl mx-auto p-8">
      <h1 class="text-2xl font-bold mb-6">My Donations</h1>

          <section class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="text-sm text-gray-600">Your donations</div>
              <div class="flex items-center space-x-2">
                <button @click="load" class="px-3 py-1 border rounded text-sm" :disabled="loading">Refresh</button>
              </div>
            </div>

            <div v-if="loading" class="text-gray-600">Loading...</div>
            <div v-else-if="error" class="text-red-600">{{ error }}</div>

            <div v-else>
              <div v-if="donations.length === 0" class="text-gray-500">You haven't made any donations yet.</div>
              <ul class="space-y-4">
                <li v-for="d in donations" :key="d.id" class="p-4 border rounded flex justify-between items-center">
                  <div>
                    <div class="font-medium">₹{{ d.amount }} <span class="text-sm text-gray-500">({{ d.purpose || 'General' }})</span></div>
                    <div class="text-sm text-gray-500">{{ formatDate(d.date) }}</div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button @click="printReceipt(d)" class="px-3 py-1 bg-orange-600 text-white rounded text-sm">Receipt</button>
                  </div>
                </li>
              </ul>
            </div>
          </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import auth from '@/stores/auth';
import { listDonationsFor } from '@/stores/donations';

const donations = ref<any[]>([]);
const loading = ref(false);
const error = ref('');

async function load() {
  loading.value = true;
  error.value = '';
  donations.value = [];

  if (!auth.value) {
    loading.value = false;
    return;
  }

  const token = (auth.value as any).token;
  if (token) {
    try {
      const res = await fetch('http://localhost:3000/api/donations/me', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const d = await res.json();
        donations.value = d.donations || d || [];
        loading.value = false;
        return;
      } else {
        const d = await res.json().catch(() => ({}));
        error.value = d.message || `Server returned ${res.status}`;
      }
    } catch (e) {
      error.value = 'Network error: could not fetch donations.';
    }
  }

  // fallback to local store
  if (auth.value?.email) {
    donations.value = listDonationsFor(auth.value.email);
  }

  loading.value = false;
}

onMounted(() => { load(); });

// reload when auth changes (login/logout)
watch(auth, (v, o) => {
  if (v !== o) load();
});

function formatDate(d: string) {
  try { return new Date(d).toLocaleString(); } catch (e) { return d; }
}

function printReceipt(d: any) {
  const w = window.open('', '_blank');
  if (!w) return alert('Popup blocked');
  const orgName = 'Devi Dhaam Trust';
  const receiptNo = d.id || ('RCPT-' + Date.now().toString(36));
  const html = `<html><body><h1>Donation Receipt</h1><p>Amount: ₹${d.amount}</p><p>Date: ${formatDate(d.date)}</p><p>Purpose: ${d.purpose || 'General'}</p><p>Receipt No: ${receiptNo}</p></body></html>`;
  w.document.write(html); w.document.close();
}
</script>

<style scoped>
</style>
