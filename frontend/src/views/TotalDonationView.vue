<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-8">
      <h1 class="text-2xl font-bold mb-6">Total Donations</h1>

      <div v-if="loading" class="text-gray-500">Loading donations...</div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white border min-w-[720px]">
          <thead>
            <tr class="bg-gray-100 text-left">
              <th class="px-4 py-2">#</th>
              <th class="px-4 py-2">Name</th>
              <th class="px-4 py-2">Member Id / Email</th>
              <th class="px-4 py-2">Receipt</th>
              <th class="px-4 py-2">Amount</th>
              <th class="px-4 py-2">Txn Id</th>
              <th class="px-4 py-2">Mode</th>
              <th class="px-4 py-2">Date</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d, idx) in donations" :key="d.id" class="border-t">
              <td class="px-4 py-2">{{ idx + 1 }}</td>
              <td class="px-4 py-2">{{ d.name || d.email || '-' }}</td>
              <td class="px-4 py-2">{{ d.email || d.memberId || '-' }}</td>
              <td class="px-4 py-2">{{ d.receipt_id || d.receiptId || '-' }}</td>
              <td class="px-4 py-2">{{ formatCurrency(d.amount) }}</td>
              <td class="px-4 py-2">{{ d.transaction_id || d.transactionId || '-' }}</td>
              <td class="px-4 py-2">{{ d.mode || d.paymentMode || d.type || '-' }}</td>
              <td class="px-4 py-2">{{ formatDate(d.date) }}</td>
              <td class="px-4 py-2">
                <button class="px-2 py-1 bg-blue-500 text-white rounded mr-2" @click="viewDetails(d)">View</button>
                <button class="px-2 py-1 bg-green-600 text-white rounded" @click="downloadReceipt(d)">Download</button>
              </td>
            </tr>
            <tr v-if="donations.length === 0">
              <td class="px-4 py-6" colspan="9">No donation records found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div v-if="selected" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white p-6 rounded w-full max-w-2xl min-w-0">
          <h2 class="text-xl font-bold mb-4">Donation Details</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><strong>Name:</strong> {{ selected.name || selected.email }}</div>
            <div><strong>Receipt:</strong> {{ selected.receipt_id || selected.receiptId || '-' }}</div>
            <div><strong>Amount:</strong> {{ formatCurrency(selected.amount) }}</div>
            <div><strong>Transaction Id:</strong> {{ selected.transaction_id || selected.transactionId || '-' }}</div>
            <div class="col-span-2"><strong>Mode:</strong> {{ selected.mode || selected.paymentMode || '-' }}</div>
            <div class="col-span-2"><strong>Purpose:</strong> {{ selected.purpose || '-' }}</div>
            <div class="col-span-2"><strong>Date:</strong> {{ formatDate(selected.date) }}</div>
          </div>

          <div class="mt-6 flex justify-end">
            <button class="px-3 py-1 mr-2 border rounded" @click="selected = null">Close</button>
            <button class="px-3 py-1 bg-green-600 text-white rounded" @click="downloadReceipt(selected)">Download</button>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import auth from '@/stores/auth';
import donationsStore, { listDonationsFor } from '@/stores/donations';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const user = auth;
const isAdmin = computed(() => !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org')));

const loading = ref(true);
const donations = ref<any[]>([]);
const selected = ref<any | null>(null);
const route = useRoute();

function formatCurrency(v: any) {
  const n = Number(v || 0);
  return n.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}

function formatDate(d: any) {
  if (!d) return '-';
  const dt = new Date(d);
  return dt.toLocaleString();
}

async function fetchDonations() {
  loading.value = true;
  try {
    // Try backend API
    const token = user.value?.token;
    if (token) {
      const resp = await fetch('/api/admin/donations', { headers: { 'Authorization': `Bearer ${token}` } });
      if (resp.ok) {
        const payload = await resp.json();
        let list = payload.donations || [];
        // If query param asks for user-only donations, filter accordingly
        if (route.query && route.query.source === 'user') {
          list = list.filter((d: any) => d.type === 'user' || d.from === 'user' || (d.email && d.email.includes('@')) );
        }
        donations.value = list;
        loading.value = false;
        return;
      }
    }
  } catch (e) {
    console.warn('fetchDonations: backend fetch failed, will fallback to local store', e);
  }

  // Fallback to local store
  try {
    donations.value = (donationsStore.value || []) as any[];
    if ((!donations.value || donations.value.length === 0) && user.value?.email) {
      donations.value = listDonationsFor(user.value.email) as any[];
    }
  } catch (e) {
    donations.value = [];
  }
  loading.value = false;
}

function viewDetails(d: any) {
  selected.value = d;
}

function downloadReceipt(d: any) {
  // For now, generate a simple text-based receipt and trigger download
  const content = `Receipt\n\nName: ${d.name || d.email}\nAmount: ${d.amount}\nReceipt: ${d.receipt_id || d.receiptId || ''}\nTransaction: ${d.transaction_id || d.transactionId || ''}\nDate: ${formatDate(d.date)}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${d.receipt_id || d.id || Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

onMounted(() => {
  fetchDonations();
});

// expose to template
</script>

<style scoped>
/* minimal styling for table */
table { border-collapse: collapse; width: 100%; }
th, td { border-bottom: 1px solid #e5e7eb; }
</style>
