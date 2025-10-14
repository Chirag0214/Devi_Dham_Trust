<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-6">
  <h1 class="text-2xl font-bold mb-4">New Members Request Data</h1>

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
              <th class="py-2 px-2">Reg. No / Name / Email / Mobile</th>
              <th class="py-2 px-2">Reg.Date</th>
              <th class="py-2 px-2">Details</th>
              <th class="py-2 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(m, idx) in paged" :key="m._localId" class="border-t hover:bg-gray-50">
              <td class="py-3 px-2">{{ idx + 1 + (page-1)*perPage }}</td>
              <td class="py-3 px-2">
                <div class="font-medium">{{ m.regNo || ('MBR-' + (m._localId || idx+1)) }} / {{ m.name || '-' }}</div>
                <div class="text-sm text-gray-600">{{ m.email || '-' }} / {{ m.mobile || '-' }}</div>
              </td>
              <td class="py-3 px-2">{{ formatDate(m.createdAt) }}</td>
              <!-- fee column removed -->
              <td class="py-3 px-2">
                <button @click="openView(m)" class="px-3 py-1 bg-blue-500 text-white rounded">View</button>
              </td>
              <td class="py-3 px-2 flex items-center gap-2">
                <button @click="openEdit(m)" class="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-800 rounded">
                  <span>✏️</span>
                  <span class="text-sm">Edit</span>
                </button>
                <button @click="remove(m)" class="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded">
                  <span>🗑️</span>
                  <span class="text-sm">Remove</span>
                </button>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="5" class="py-6 text-center text-gray-500">No member requests found.</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-600">Showing {{ paged.length }} of {{ filtered.length }} entries</div>
          <div class="flex items-center gap-2">
            <button @click="page = Math.max(1, page-1)" class="px-2 py-1 border rounded">Prev</button>
            <div class="px-3 py-1 border rounded">{{ page }}</div>
            <button @click="page = Math.min(lastPage, page+1)" class="px-2 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>

      <!-- View Modal -->
      <div v-if="showView" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-white rounded-lg p-6 w-11/12 md:w-1/2">
          <h3 class="text-lg font-semibold mb-3">Member Details</h3>
          <pre class="text-sm bg-gray-100 p-3 rounded">{{ viewItem }}</pre>
          <div class="flex justify-end mt-3">
            <button @click="showView=false" class="px-3 py-1 border rounded">Close</button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEdit" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-white rounded-lg p-6 w-11/12 md:w-1/2">
          <h3 class="text-lg font-semibold mb-3">Edit Member</h3>
          <label class="block text-sm">Name</label>
          <input v-model="editForm.name" class="w-full p-2 border rounded mb-2" />
          <label class="block text-sm">Email</label>
          <input v-model="editForm.email" class="w-full p-2 border rounded mb-2" />
          <label class="block text-sm">Mobile</label>
          <input v-model="editForm.mobile" class="w-full p-2 border rounded mb-2" />
          <div class="flex justify-end gap-2 mt-3">
            <button @click="closeEdit" class="px-3 py-1 border rounded">Cancel</button>
            <button @click="saveEdit" class="px-3 py-1 bg-brand-600 text-white rounded">Save</button>
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

const user = auth;
const isAdmin = computed(() => !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org')));

const raw = ref<any[]>([]);
const perPage = ref(10);
const page = ref(1);
const search = ref('');

const showView = ref(false);
const viewItem = ref<any>(null);

const showEdit = ref(false);
const editForm = ref<any>({});

const load = async () => {
  // Load local users first (local signups)
  let localUsers: any[] = [];
  try {
    const items = JSON.parse(localStorage.getItem('users') || '[]') as any[];
    localUsers = items.map((it, i) => ({ _localId: it._localId || (i+1), ...it }));
  } catch (e) {
    localUsers = [];
  }

  // If admin and token is present, try fetching users from backend and merge
  const token = (auth.value as any)?.token;
  if (isAdmin.value && token) {
    try {
      const res = await fetch('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // data expected as array of users { id, name, email, role, createdAt? }
        const remote = (data || []).map((u:any, i:number) => ({
          _localId: u.id || (`r-${i}`),
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt || u.created_at || u.created || null
        }));

        // merge remote and local, prefer localUsers (recent signups) on duplicates by email
        const mergedByEmail: Record<string, any> = {};
        remote.forEach((r:any) => { if (r.email) mergedByEmail[(r.email||'').toLowerCase()] = r; });
        localUsers.forEach((l:any) => { if (l.email) mergedByEmail[(l.email||'').toLowerCase()] = { ...mergedByEmail[(l.email||'').toLowerCase()], ...l }; else localUsers.push(l); });

        const merged = Object.values(mergedByEmail);
        raw.value = merged.map((it:any, i:number) => ({ _localId: it._localId || `m-${i}`, ...it }));
        return;
      }
      // if not ok, fall back to local only
    } catch (e) {
      console.warn('Failed to fetch remote users, using local users only', e);
    }
  }

  // fallback: only local users
  raw.value = localUsers;
};

onMounted(() => { load(); });

const filtered = computed(() => {
  const q = (search.value || '').toLowerCase().trim();
  return raw.value.filter(u => {
    // Show only those that look like membership requests AND are new (created within last 30 days)
    const isRequest = (u.membershipRequested !== false) && (u.role !== 'admin');
    if (!isRequest) return false;
    // determine creation timestamp from common fields
    const createdTs = Number(new Date(u.createdAt || u.created || u.created_on || 0)) || 0;
    const now = Date.now();
    const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
    const isNew = createdTs && (now - createdTs) <= THIRTY_DAYS;
    if (!isNew) return false;
    if (!q) return true;
    return [u.name, u.email, u.mobile, u.regNo].some(s => (s || '').toString().toLowerCase().includes(q));
  });
});

const lastPage = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)));
const paged = computed(() => filtered.value.slice((page.value-1)*perPage.value, page.value*perPage.value));

function formatDate(v:any){ if(!v) return '-'; const d = new Date(v); return d.toLocaleDateString(); }

function refresh(){ load(); }

function openView(item:any){ viewItem.value = item; showView.value = true; }

function verifyNow(item:any){
  const token = (auth.value as any)?.token;
  // Try server-side verify if possible
  if (item.id && token) {
    fetch(`http://localhost:3000/api/admin/users/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ /* no specific verified column in DB, but you may use role/status */ status: 'verified' })
    }).then(async res => {
      if (!res.ok) {
        console.warn('Server verify failed, falling back to local mark');
      }
      item.verified = true;
      persist();
    }).catch(err => {
      console.warn('Verify request failed, marking locally', err);
      item.verified = true;
      persist();
    });
    return;
  }

  item.verified = true;
  // persist
  persist();
}

function openEdit(item:any){ editForm.value = { ...item }; showEdit.value = true; }
function closeEdit(){ showEdit.value = false; editForm.value = {}; }
function saveEdit(){
  const idx = raw.value.findIndex(r => r._localId === editForm.value._localId);
  const token = (auth.value as any)?.token;
  if (editForm.value.id && token) {
    fetch(`http://localhost:3000/api/admin/users/${editForm.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: editForm.value.name, email: editForm.value.email })
    }).then(async res => {
      if (!res.ok) console.warn('Server update failed, falling back to local');
      if(idx >= 0){ raw.value[idx] = { ...raw.value[idx], ...editForm.value }; persist(); }
    }).catch(err => {
      console.warn('Update request failed, using local update', err);
      if(idx >= 0){ raw.value[idx] = { ...raw.value[idx], ...editForm.value }; persist(); }
    }).finally(() => closeEdit());
    return;
  }

  if(idx >= 0){ raw.value[idx] = { ...raw.value[idx], ...editForm.value }; persist(); }
  closeEdit();
}

function remove(item:any){
  if(!confirm('Delete this member request?')) return;
  const token = (auth.value as any)?.token;
  if (item.id && token) {
    fetch(`http://localhost:3000/api/admin/users/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }).then(async res => {
      if (!res.ok) {
        console.warn('Server deletion failed, removing locally');
      }
      raw.value = raw.value.filter(r => r._localId !== item._localId);
      persist();
    }).catch(err => {
      console.warn('Delete request failed, removing locally', err);
      raw.value = raw.value.filter(r => r._localId !== item._localId);
      persist();
    });
    return;
  }

  raw.value = raw.value.filter(r => r._localId !== item._localId);
  persist();
}

async function toggleBlock(item:any){
  const token = (auth.value as any)?.token;
  const willBlock = !(item.blocked || item.status === 'blocked');
  if (item.id && token) {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/users/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ blocked: willBlock, status: willBlock ? 'blocked' : 'active' })
      });
      if (!res.ok) console.warn('Server block/unblock failed');
      item.blocked = willBlock ? 1 : 0;
      item.status = willBlock ? 'blocked' : 'active';
      persist();
    } catch (err) {
      console.warn('Block/unblock request failed, applying locally', err);
      item.blocked = willBlock ? 1 : 0;
      item.status = willBlock ? 'blocked' : 'active';
      persist();
    }
    return;
  }

  item.blocked = willBlock ? 1 : 0;
  item.status = willBlock ? 'blocked' : 'active';
  persist();
}

function persist(){
  // write back to localStorage without the helper _localId
  const serialized = raw.value.map(r => {
    const copy = { ...r };
    delete copy._localId;
    return copy;
  });
  localStorage.setItem('users', JSON.stringify(serialized));
}

// pagination reset when perPage or search changes
watch([perPage, search], () => { page.value = 1; });

</script>

<style scoped>
.cursor-pointer { cursor: pointer; }
</style>
