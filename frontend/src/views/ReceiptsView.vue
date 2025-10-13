<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">Your Receipts</h1>
        <p class="text-sm text-gray-600 mb-6">Only donations made by you are shown here. Click a receipt to view and download/print it.</p>

        <div v-if="donations.length === 0" class="bg-white rounded-md p-6 text-center text-gray-600">No donations found. Make a donation to see receipts here.</div>

        <div v-else class="space-y-4">
          <div v-for="d in donations" :key="d.id" class="bg-white p-4 rounded-md shadow-sm flex items-start justify-between">
            <div>
              <div class="text-sm text-gray-500">Receipt ID: <span class="font-mono text-xs">{{ d.id }}</span></div>
              <div class="text-lg font-semibold">₹ {{ d.amount }} <span class="text-sm text-gray-500">• {{ new Date(d.date).toLocaleString() }}</span></div>
              <div class="text-sm text-gray-600">Purpose: {{ d.purpose || 'General Donation' }}</div>
            </div>
            <div class="flex flex-col items-end space-y-2">
              <button @click="openReceipt(d)" class="px-3 py-1 rounded-md bg-sky-600 text-white text-sm">Open</button>
              <button @click="downloadReceipt(d)" class="px-3 py-1 rounded-md bg-emerald-600 text-white text-sm">Download</button>
            </div>
          </div>
        </div>
      </div>

      <!-- printable area hidden by default, shown in print via media queries -->
      <div id="print-area" style="display:none"></div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import auth from '@/stores/auth';
import { ref, computed, onMounted } from 'vue';

const user = auth;
const isAdmin = computed(() => !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org')));

const donations = ref<any[]>([]);
const loading = ref(false);
const errorMsg = ref('');

async function loadMyReceipts() {
  loading.value = true;
  errorMsg.value = '';
  try {
    const token = user.value?.token;
    const res = await fetch('http://localhost:3000/api/donations/me', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      // if unauthorized, show helpful message
      if (res.status === 401 || res.status === 403) {
        errorMsg.value = 'You must be logged in to view receipts.';
        donations.value = [];
        loading.value = false;
        return;
      }
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    donations.value = data && data.donations ? data.donations : [];
  } catch (err: any) {
    console.error('Error loading receipts:', err);
    errorMsg.value = 'Failed to load receipts. Check server or network.';
    donations.value = [];
  } finally {
    loading.value = false;
  }
}

function openReceipt(d: any) {
  const html = renderReceiptHtml(d);
  const w = window.open('', '_blank', 'noopener,noreferrer');
  if (!w) return alert('Failed to open print window');
  w.document.write(html);
  w.document.close();
}

function downloadReceipt(d: any) {
  openReceipt(d);
}

function renderReceiptHtml(d: any) {
  const site = 'Devi Dhaam Trust';
  const date = new Date(d.date).toLocaleString();
  return `<!doctype html><html><head><meta charset=\"utf-8\"><title>Receipt ${d.id}</title>\n  <style>body{font-family:Helvetica,Arial,sans-serif;padding:24px;color:#111} .receipt{max-width:680px;margin:0 auto} .header{display:flex;justify-content:space-between;align-items:center} .amount{font-size:28px;font-weight:700;margin-top:12px} .meta{margin-top:8px;color:#444} .footer{margin-top:32px;color:#666;font-size:13px}</style>\n  </head><body onload=\"window.print()\"><div class=\"receipt\"><div class=\"header\"><div><h2>${site}</h2><div class=\"meta\">Donation Receipt</div></div><div class=\"meta\">Receipt #: ${d.receipt_id || d.id}</div></div>\n  <div class=\"amount\">₹ ${d.amount}</div>\n  <div class=\"meta\">Donor: ${d.email}</div>\n  <div class=\"meta\">Date: ${date}</div>\n  <div class=\"meta\">Purpose: ${d.purpose || 'General Donation'}</div>\n  <div class=\"footer\">Thank you for your support! This is an automated receipt from Devi Dhaam Trust.</div></div></body></html>`;
}

onMounted(() => {
  loadMyReceipts();
});
</script>

<style scoped>
/* Hide print-area container by default; not used here but reserved */
@media print {
  #print-area{display:block}
}
</style>
