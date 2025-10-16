<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-6">
      <!-- Toasts -->
      <div class="fixed top-4 right-4 z-50">
        <div v-for="t in toasts" :key="t.id" :class="['toast', t.type]">
          {{ t.msg }}
        </div>
      </div>
      <h1 class="text-2xl font-bold mb-4">Active Members</h1>

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

  <div class="overflow-x-auto">
  <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-sm text-gray-600 bg-gray-100">
              <th class="py-2 px-2">Sr.No.</th>
              <th class="py-2 px-2">Reg. No / Name / Email / Mobile</th>
              <th class="py-2 px-2">Reg.Date</th>
              <th class="py-2 px-2">View</th>
              <th class="py-2 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(m, idx) in paged" :key="m._localId || m.id || idx" :class="['border-t hover:bg-gray-50', rowAnim[(m._localId || m.id || idx)], (m.blocked || m.status === 'blocked') ? 'blocked-row' : '' ]">
              <td class="py-3 px-2">{{ idx + 1 + (page-1)*perPage }}</td>
              <td class="py-3 px-2">
                <div class="font-medium">{{ m.regNo || ('MBR-' + (m._localId || m.id || (idx+1))) }} / {{ m.name || '-' }} <span v-if="m.blocked || m.status === 'blocked'" class="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">Blocked</span></div>
                <div class="text-sm text-gray-600">{{ m.email || '-' }} / {{ m.mobile || '-' }}</div>
              </td>
              <td class="py-3 px-2">{{ formatDate(m.createdAt) }}</td>
              <td class="py-3 px-2">
                <button @click="openView(m)" class="px-3 py-1 bg-blue-500 text-white rounded">View</button>
              </td>
              <td class="py-3 px-2 flex items-center gap-2">
                <button @click="appointment(m)" class="px-3 py-1 bg-green-500 text-white rounded">Appointment Letter</button>
                <button @click="toggleActive(m)" class="px-3 py-1 bg-yellow-400 text-white rounded">{{ (m.status === 'inactive') ? 'Activate' : 'Deactivate' }}</button>
                <button @click="toggleBlock(m)" class="px-3 py-1 bg-red-500 text-white rounded">{{ (m.blocked || m.status === 'blocked') ? 'Unblock' : 'Block' }}</button>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="5" class="py-6 text-center text-gray-500">No active members found.</td>
            </tr>
          </tbody>
  </table>
  </div>

        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-600">Showing {{ paged.length }} of {{ filtered.length }} entries</div>
          <div class="flex items-center gap-2">
            <button @click="page = Math.max(1, page-1)" class="px-2 py-1 border rounded">Prev</button>
            <div class="px-3 py-1 border rounded">{{ page }}</div>
            <button @click="page = Math.min(lastPage, page+1)" class="px-2 py-1 border rounded">Next</button>
          </div>
        </div>

        <!-- View Modal -->
        <div v-if="showView" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div class="bg-white rounded-lg p-6 w-full max-w-xl mx-4">
            <h3 class="text-lg font-semibold mb-3">Member Details</h3>
            <div class="grid grid-cols-1 gap-2">
              <div><strong>Name:</strong> {{ viewItem.name || '-' }}</div>
              <div><strong>Email:</strong> {{ viewItem.email || '-' }}</div>
              <div><strong>Mobile:</strong> {{ viewItem.mobile || '-' }}</div>
              <div><strong>Reg No:</strong> {{ viewItem.regNo || '-' }}</div>
              <div><strong>Registered At:</strong> {{ formatDate(viewItem.createdAt) }}</div>
              <div><strong>Role:</strong> {{ viewItem.role || 'user' }}</div>
              <div><strong>Status:</strong> {{ viewItem.status || (viewItem.blocked ? 'blocked' : 'active') }}</div>
              <div v-if="viewItem.address"><strong>Address:</strong> {{ viewItem.address }}</div>
              <div v-if="viewItem.extra"><strong>Extra:</strong> {{ viewItem.extra }}</div>
            </div>
            <div class="flex gap-2 mt-4">
              <button @click="toggleActiveView(viewItem)" class="px-3 py-1 bg-yellow-400 text-white rounded">{{ (viewItem.status === 'inactive') ? 'Activate' : 'Deactivate' }}</button>
              <button @click="toggleBlockView(viewItem)" class="px-3 py-1 bg-red-500 text-white rounded">{{ (viewItem.blocked || viewItem.status === 'blocked') ? 'Unblock' : 'Block' }}</button>
            </div>
            <div class="flex justify-end mt-3">
              <button @click="showView=false" class="px-3 py-1 border rounded">Close</button>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import auth from '@/stores/auth';
import { ref, computed, onMounted } from 'vue';

const user = auth;
const isAdmin = computed(() => !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org')));

  const raw = ref<any[]>([]);
const perPage = ref(10);
const page = ref(1);
const search = ref('');

  // Toast notifications
  const toasts = ref<Array<{ id: number; msg: string; type: 'success' | 'error' }>>([]);
  function addToast(msg: string, type: 'success' | 'error' = 'success'){
    const id = Date.now() + Math.floor(Math.random()*1000);
    toasts.value.push({ id, msg, type });
    setTimeout(()=>{ toasts.value = toasts.value.filter(t=>t.id!==id); }, 3500);
  }

  // Row animations map
  const rowAnim = ref<Record<string,string>>({});
  function flashRow(key: string, type: 'success'|'error' = 'success'){
    const cls = type === 'success' ? 'flash-success' : 'flash-error';
    rowAnim.value = { ...rowAnim.value, [key]: cls };
    setTimeout(()=>{ const copy = { ...rowAnim.value }; delete copy[key]; rowAnim.value = copy; }, 900);
  }

const showView = ref(false);
const viewItem = ref<any>(null);

const load = async () => {
  let localUsers: any[] = [];
  try { localUsers = JSON.parse(localStorage.getItem('users') || '[]') as any[]; } catch(e){ localUsers = []; }

  const token = (auth.value as any)?.token;
  if (isAdmin.value && token) {
    try {
      const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${BASE}/api/users`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        const remote = (data || []).map((u:any,i:number) => ({ _localId: u.id || `r-${i}`, id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt || u.created_at || u.created || null, blocked: u.blocked }));

        // merge by email
        const mergedByEmail: Record<string, any> = {};
        remote.forEach((r:any) => { if (r.email) mergedByEmail[(r.email||'').toLowerCase()] = r; });
        localUsers.forEach((l:any) => { if (l.email) mergedByEmail[(l.email||'').toLowerCase()] = { ...mergedByEmail[(l.email||'').toLowerCase()], ...l }; else localUsers.push(l); });
        raw.value = Object.values(mergedByEmail).map((it:any,i:number) => ({ _localId: it._localId || `m-${i}`, ...it }));
        return;
      }
    } catch(e) {
      console.warn('Failed to fetch remote users, using local users only', e);
    }
  }

  raw.value = localUsers.map((it:any,i:number) => ({ _localId: it._localId || (i+1), ...it }));
};

onMounted(() => { load(); });

const filtered = computed(() => {
  const q = (search.value || '').toLowerCase().trim();
  // Include blocked users so admin can immediately Unblock them; hide admin account itself
  return raw.value.filter(u => {
    if (u.role === 'admin' || u.email === 'admin@devidhaam.org') return false; // hide admin
    if (!q) return true;
    return [u.name, u.email, u.mobile, u.regNo].some(s => (s || '').toString().toLowerCase().includes(q));
  });
});

const lastPage = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)));
const paged = computed(() => filtered.value.slice((page.value-1)*perPage.value, page.value*perPage.value));

function formatDate(v:any){ if(!v) return '-'; const d = new Date(v); return d.toLocaleDateString(); }
function refresh(){ load(); }
async function openView(item:any){
  // Fetch detailed user from backend if possible
  const token = (auth.value as any)?.token;
  if (item.id && token) {
    try {
      const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${BASE}/api/admin/users/${item.id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        viewItem.value = { ...item, ...data };
        showView.value = true;
        return;
      }
    } catch (e) {
      console.warn('Failed to fetch full user details, showing partial', e);
    }
  }
  viewItem.value = item; showView.value = true;
}
function appointment(item:any){ alert('Appointment Letter: not implemented yet'); }
function idCard(item:any){ alert('ID Card: not implemented yet'); }
function receipt(item:any){ alert('Receipt: not implemented yet'); }

async function deactivate(item:any){
  // set status to 'inactive' locally and via API if possible
  const token = (auth.value as any)?.token;
  const willDeactivate = true;
  if (item.id && token) {
    try {
      const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      await fetch(`${BASE}/api/admin/users/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'inactive' })
      });
      item.status = 'inactive';
      // UI feedback
      addToast('Member deactivated', 'success');
      const key = String(item._localId || item.id || 'r'); flashRow(key, 'success');
      persist();
      return;
    } catch (e) {
      console.warn('Deactivate API failed, applying locally', e);
    }
  }
  item.status = 'inactive';
  addToast('Member deactivated (local)', 'success');
  const key = String(item._localId || item.id || 'r'); flashRow(key, 'success');
  persist();
}

async function toggleBlock(item:any){
  const token = (auth.value as any)?.token;
  const willBlock = !(item.blocked || item.status === 'blocked');
  if (item.id && token) {
    try {
      const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      await fetch(`${BASE}/api/admin/users/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ blocked: willBlock, status: willBlock ? 'blocked' : 'active' })
      });
      item.blocked = willBlock ? 1 : 0;
      item.status = willBlock ? 'blocked' : 'active';
      addToast(willBlock ? 'Member blocked' : 'Member unblocked', 'success');
      const key = String(item._localId || item.id || 'r'); flashRow(key, willBlock ? 'error' : 'success');
      persist();
      return;
    } catch (e) {
      console.warn('Block/unblock API failed, applying locally', e);
    }
  }
  item.blocked = willBlock ? 1 : 0;
  item.status = willBlock ? 'blocked' : 'active';
  addToast(willBlock ? 'Member blocked (local)' : 'Member unblocked (local)', 'success');
  const key = String(item._localId || item.id || 'r'); flashRow(key, willBlock ? 'error' : 'success');
  persist();
}

// Toggle active/inactive status
async function toggleActive(item:any){
  const token = (auth.value as any)?.token;
  const willDeactivate = item.status !== 'inactive';
  if (item.id && token) {
    try {
      const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      await fetch(`${BASE}/api/admin/users/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: willDeactivate ? 'inactive' : 'active' })
      });
      item.status = willDeactivate ? 'inactive' : 'active';
      addToast(willDeactivate ? 'Member deactivated' : 'Member activated', 'success');
      const key = String(item._localId || item.id || 'r'); flashRow(key, willDeactivate ? 'success' : 'success');
      persist();
      return;
    } catch (e) {
      console.warn('Toggle active API failed, applying locally', e);
    }
  }
  item.status = willDeactivate ? 'inactive' : 'active';
  addToast(willDeactivate ? 'Member deactivated (local)' : 'Member activated (local)', 'success');
  const key = String(item._localId || item.id || 'r'); flashRow(key, 'success');
  persist();
}

async function toggleActiveView(item:any){
  await toggleActive(item);
  const idx = raw.value.findIndex(r => (r.id && item.id && r.id === item.id) || r._localId === item._localId);
  if (idx >= 0) { raw.value[idx] = { ...raw.value[idx], ...item }; persist(); }
  showView.value = false;
}

function persist(){
  try {
    const serialized = raw.value.map(r => { const copy = { ...r }; delete copy._localId; return copy; });
    localStorage.setItem('users', JSON.stringify(serialized));
  } catch (e) {
    console.warn('Failed to persist users locally', e);
  }
}

async function deactivateView(item:any){
  await deactivate(item);
  // update raw list and persist
  const idx = raw.value.findIndex(r => (r.id && item.id && r.id === item.id) || r._localId === item._localId);
  if (idx >= 0) { raw.value[idx] = { ...raw.value[idx], ...item }; persist(); }
  showView.value = false;
}

async function toggleBlockView(item:any){
  await toggleBlock(item);
  const idx = raw.value.findIndex(r => (r.id && item.id && r.id === item.id) || r._localId === item._localId);
  if (idx >= 0) { raw.value[idx] = { ...raw.value[idx], ...item }; persist(); }
  showView.value = false;
}

</script>

<style scoped>
.cursor-pointer { cursor: pointer; }
.toast { padding: 10px 14px; border-radius: 6px; margin-bottom: 8px; color: #fff; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08); transform-origin: right center; animation: toast-in 0.22s ease; }
.toast.success { background: linear-gradient(90deg, #10b981, #059669); }
.toast.error { background: linear-gradient(90deg, #ef4444, #f97316); }

@keyframes toast-in { from { opacity: 0; transform: translateX(8px) scale(0.98); } to { opacity: 1; transform: translateX(0) scale(1); } }

.flash-success { animation: flash-success-ani 0.9s ease; }
.flash-error { animation: flash-error-ani 0.9s ease; }

@keyframes flash-success-ani { 0% { background: rgba(16, 185, 129, 0.12); } 40% { background: rgba(16, 185, 129, 0.24); } 100% { background: transparent; } }
@keyframes flash-error-ani { 0% { background: rgba(239, 68, 68, 0.12); } 40% { background: rgba(239, 68, 68, 0.24); } 100% { background: transparent; } }

.blocked-row { background: rgba(239,68,68,0.03); }
</style>
