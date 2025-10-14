<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-6">
      <h1 class="text-2xl font-bold mb-4">All Users Data</h1>

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
              <td class="py-3 px-2">
                <button @click="openView(m)" class="px-3 py-1 bg-blue-500 text-white rounded">View</button>
              </td>
              <td class="py-3 px-2 flex items-center gap-2">
                <button @click="openEdit(m)" class="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-800 rounded">
                  <span>✏️</span>
                  <span class="text-sm">Edit</span>
                </button>
                <button @click="toggleBlock(m)" class="flex items-center gap-2 px-3 py-1 rounded" :class="[(m.blocked || m.status === 'blocked') ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800']">
                  <span class="text-sm">{{ (m.blocked || m.status === 'blocked') ? 'Unblock' : 'Block' }}</span>
                </button>
                <button @click="remove(m)" class="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded">
                  <span>🗑️</span>
                  <span class="text-sm">Remove</span>
                </button>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="5" class="py-6 text-center text-gray-500">No users found.</td>
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
          <h3 class="text-lg font-semibold mb-3">User Details</h3>
          <pre class="text-sm bg-gray-100 p-3 rounded">{{ viewItem }}</pre>
          <div class="flex justify-end mt-3">
            <button @click="showView=false" class="px-3 py-1 border rounded">Close</button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEdit" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-white rounded-lg p-6 w-11/12 md:w-1/2">
          <h3 class="text-lg font-semibold mb-3">Edit User</h3>
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
  let localUsers: any[] = [];
  try {
    const items = JSON.parse(localStorage.getItem('users') || '[]') as any[];
    localUsers = items.map((it, i) => ({ _localId: it._localId || (i+1), ...it }));
  } catch (e) {
    localUsers = [];
  }

  const token = (auth.value as any)?.token;
  if (isAdmin.value && token) {
    try {
      const res = await fetch('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const remote = (data || []).map((u:any, i:number) => ({
          _localId: u.id || (`r-${i}`),
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt || u.created_at || u.created || null
        }));

        const mergedByEmail: Record<string, any> = {};
        remote.forEach((r:any) => { if (r.email) mergedByEmail[(r.email||'').toLowerCase()] = r; });
        localUsers.forEach((l:any) => { if (l.email) mergedByEmail[(l.email||'').toLowerCase()] = { ...mergedByEmail[(l.email||'').toLowerCase()], ...l }; else localUsers.push(l); });

        const merged = Object.values(mergedByEmail);
        raw.value = merged.map((it:any, i:number) => ({ _localId: it._localId || `m-${i}`, ...it }));
        return;
      }
    } catch (e) {
      console.warn('Failed to fetch remote users, using local users only', e);
    }
  }

  raw.value = localUsers;
};

onMounted(() => { load(); });

const filtered = computed(() => {
  const q = (search.value || '').toLowerCase().trim();
  return raw.value.filter(u => {
    // show all users except admin account for clarity
    if (u.role === 'admin' || u.email === 'admin@devidhaam.org') return false;
    if (!q) return true;
    return [u.name, u.email, u.mobile, u.regNo].some(s => (s || '').toString().toLowerCase().includes(q));
  });
});

const lastPage = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)));
const paged = computed(() => filtered.value.slice((page.value-1)*perPage.value, page.value*perPage.value));

function formatDate(v:any){ if(!v) return '-'; const d = new Date(v); return d.toLocaleDateString(); }

function refresh(){ load(); }

function openView(item:any){ viewItem.value = item; showView.value = true; }

function openEdit(item:any){ editForm.value = { ...item }; showEdit.value = true; }
function closeEdit(){ showEdit.value = false; editForm.value = {}; }
function saveEdit(){
  const idx = raw.value.findIndex(r => r._localId === editForm.value._localId);
  const token = (auth.value as any)?.token;
  // If this user exists on backend (has id) and we have admin token, attempt server update
  if (editForm.value.id && token) {
    fetch(`http://localhost:3000/api/admin/users/${editForm.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: editForm.value.name, email: editForm.value.email, role: editForm.value.role })
    }).then(async res => {
      if (!res.ok) {
        console.warn('Server update failed, falling back to local update');
      }
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
  if(!confirm('Delete this user?')) return;
  const token = (auth.value as any)?.token;
  if (item.id && token) {
    fetch(`http://localhost:3000/api/admin/users/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }).then(async res => {
      if (!res.ok) {
        const msg = await res.text();
        console.warn('Server deletion failed:', msg);
        // still remove locally to keep UI consistent
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

  // local-only fallback
  item.blocked = willBlock ? 1 : 0;
  item.status = willBlock ? 'blocked' : 'active';
  persist();
}

function persist(){
  const serialized = raw.value.map(r => { const copy = { ...r }; delete copy._localId; return copy; });
  localStorage.setItem('users', JSON.stringify(serialized));
}

watch([perPage, search], () => { page.value = 1; });

</script>

<style scoped>
.cursor-pointer { cursor: pointer; }
</style>
