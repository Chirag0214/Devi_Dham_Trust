<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-6">
      <h1 class="text-2xl font-bold mb-4">All Receipts</h1>

      <div class="bg-white p-4 rounded shadow">
        <div class="flex items-center justify-between mb-4">
          <div>
            <label class="text-sm">Show</label>
            <select v-model.number="perPage" class="ml-2 border rounded px-2 py-1">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
            <span class="ml-2 text-sm text-gray-500">entries per page</span>
          </div>
          <div class="flex items-center gap-2">
            <input v-model="search" placeholder="Search" class="border rounded px-2 py-1" />
            <button @click="refresh" class="px-3 py-1 bg-gray-200 rounded">Refresh</button>
          </div>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-sm text-gray-600 bg-gray-100">
              <th class="py-2 px-2">Sr.No.</th>
              <th class="py-2 px-2">Receipt ID</th>
              <th class="py-2 px-2">Type</th>
              <th class="py-2 px-2">Payer</th>
              <th class="py-2 px-2">Amount</th>
              <th class="py-2 px-2">Date</th>
              <th class="py-2 px-2">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, idx) in paged" :key="r._id || idx" class="border-t hover:bg-gray-50">
              <td class="py-3 px-2">{{ idx + 1 + (page-1)*perPage }}</td>
              <td class="py-3 px-2">{{ r.receiptId || r.id || '-' }}</td>
              <td class="py-3 px-2">{{ r.type || r.receiptFor || (r.from === 'visitor' ? 'visitor' : 'donation') }}</td>
              <td class="py-3 px-2">{{ r.payer || r.from || r.userEmail || '-' }}</td>
              <td class="py-3 px-2">₹ {{ Number(r.amount || r.value || 0).toFixed(2) }}</td>
              <td class="py-3 px-2">{{ formatDate(r.date || r.createdAt || r.created || r.timestamp) }}</td>
              <td class="py-3 px-2">
                <button @click="openView(r)" class="px-3 py-1 bg-blue-500 text-white rounded">View</button>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="7" class="py-6 text-center text-gray-500">No receipts found.</td>
            </tr>
          </tbody>
        </table>

        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-600">Showing {{ paged.length }} of {{ filtered.length }} entries</div>
          <div class="flex items-center gap-2">
            <button @click="page = Math.max(1, page-1)" class="px-2 py-1 border rounded">Prev</button>
            <div class="px-3 py-1 border rounded">{{ page }}</div>
            <button @click="page = Math.min(lastPage, page+1)" class="px-2 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>

      <div v-if="showView" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-white rounded-lg p-6 w-11/12 md:w-1/2">
          <h3 class="text-lg font-semibold mb-3">Receipt Details</h3>
          <pre class="text-sm bg-gray-100 p-3 rounded">{{ viewItem }}</pre>
          <div class="flex justify-end mt-3">
            <button @click="showView=false" class="px-3 py-1 border rounded">Close</button>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import auth from '@/stores/auth';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const user = auth;
const isAdmin = computed(() => !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org')));

const receipts = ref<any[]>([]);
const donations = ref<any[]>([]);
const combined = ref<any[]>([]);
const route = useRoute();
const sourceFilter = computed(() => (route.query.source ? String(route.query.source) : ''));

const perPage = ref(10);
const page = ref(1);
const search = ref('');

const showView = ref(false);
const viewItem = ref<any>(null);

const load = async () => {
  // load local data first
  try { receipts.value = JSON.parse(localStorage.getItem('receipts') || '[]') as any[]; } catch (e) { receipts.value = []; }
  try { donations.value = JSON.parse(localStorage.getItem('donations') || '[]') as any[]; } catch (e) { donations.value = []; }

  // If admin and token present, try to fetch server-side donations (which include receipt info)
  const token = (user.value as any)?.token;
  if (isAdmin.value && token) {
    try {
      // if a source filter is present, pass it through to the server
      const url = new URL('http://localhost:3000/api/admin/donations');
      if (sourceFilter.value) url.searchParams.set('source', sourceFilter.value);
      const resp = await fetch(String(url), { headers: { Authorization: `Bearer ${token}` } });
      if (resp.ok) {
        const data = await resp.json();
        const serverDonations = Array.isArray(data.donations) ? data.donations : [];

        // normalize server rows into receipt-like objects
        const fromServer = serverDonations.map((d:any) => ({
          _id: d.id,
          receiptId: d.receipt_id || d.transaction_id || d.id,
          type: d.type || d.purpose || (d.from === 'visitor' ? 'visitorDonation' : 'donation'),
          payer: d.from || d.email || d.name || 'visitor',
          amount: d.amount,
          date: d.date || d.created_at || d.created || d.timestamp,
          raw: d
        }));

        // build map by receiptId to avoid duplicates and prefer server data
        const byId: Record<string, any> = {};
        fromServer.forEach((r:any) => {
          const key = String(r.receiptId || r._id || Math.random());
          byId[key] = r;
        });

        // add local receipts if not present
        receipts.value.forEach((r:any, i:number) => {
          const key = String(r.receiptId || r.id || `local-r-${i}`);
          if (!byId[key]) byId[key] = { _id: r.receiptId || r.id || key, ...r };
        });

        // add local donations (fallbacks) if they have receipts or amounts
        donations.value.forEach((d:any, i:number) => {
          const key = String(d.receiptId || d.transaction_id || d.id || `local-d-${i}`);
          if (!byId[key]) byId[key] = { _id: key, receiptId: d.receiptId || d.transaction_id || key, type: d.type || d.from || 'donation', payer: d.from || d.email || 'visitor', amount: d.amount, date: d.date || d.createdAt || d.created };
        });

        combined.value = Object.values(byId).sort((a:any,b:any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        return;
      }
      console.warn('[AllReceiptsView] server responded with non-ok status', resp.status);
    } catch (err) {
      console.warn('[AllReceiptsView] failed to fetch server donations, falling back to local', err);
    }
  }

  // fallback: merge local receipts + donations
  const fromDonations = donations.value.filter(d => d.receiptId || d.amount).map((d:any, i:number) => ({ _id: d.receiptId || `d-${i}`, receiptId: d.receiptId, type: d.type || (d.from === 'visitor' ? 'visitorDonation' : 'userDonation'), payer: d.from || 'visitor', amount: d.amount, date: d.date || d.createdAt || d.created }));

  combined.value = [
    ...receipts.value.map((r:any, i:number) => ({ _id: r.receiptId || r.id || `r-${i}`, ...r })),
    ...fromDonations
  ].sort((a,b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
}

onMounted(() => { load(); });

const filtered = computed(() => {
  const q = (search.value || '').toLowerCase().trim();
  return combined.value.filter(r => {
    if (!q) return true;
    return [r.receiptId, r.type, r.payer, r.userEmail, r.amount].some(s => (s || '').toString().toLowerCase().includes(q));
  });
});

const lastPage = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)));
const paged = computed(() => filtered.value.slice((page.value-1)*perPage.value, page.value*perPage.value));

function formatDate(v:any){ if(!v) return '-'; const d = new Date(v); return d.toLocaleDateString(); }

function openView(item:any){ viewItem.value = item; showView.value = true; }
function refresh(){ load(); }

watch([perPage, search], () => { page.value = 1; });
</script>

<style scoped>
.cursor-pointer { cursor: pointer; }
</style>
