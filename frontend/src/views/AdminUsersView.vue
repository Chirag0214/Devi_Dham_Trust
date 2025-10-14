<template>
    <div class="min-h-screen flex bg-gray-50">
        <Sidebar :user="user" :is-admin="isAdmin" />

        <main class="flex-1 p-8">
            <h1 class="text-2xl font-bold mb-6">Registered Users</h1>

            <section class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-4">User List (From Database)</h2>

                <div v-if="isLoading" class="py-10 text-center text-gray-500">
                    Loading users from database...
                </div>
                
                <div v-else-if="users.length === 0" class="py-10 text-center text-gray-500">
                    No users found in the database.
                </div>
                
                <table v-else class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-sm text-gray-600 bg-gray-100">
                            <th class="py-2 px-2">#</th>
                            <th class="py-2 px-2">Name</th>
                            <th class="py-2 px-2">Email</th>
                            <th class="py-2 px-2">Role</th>
                            <th class="py-2 px-2">Action</th> 
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(u, idx) in users" :key="u.id" class="border-t hover:bg-gray-50">
                            <td class="py-3 px-2">{{ idx + 1 }}</td>
                            <td class="py-3 px-2 font-medium">{{ u.name || '-' }}</td>
                            <td class="py-3 px-2 text-sm">{{ u.email }}</td>
                            <td class="py-3 px-2 text-sm">{{ u.role || 'user' }}</td>
                            
                            <td class="py-3 px-2">
                                <button 
                                    @click="openEdit(u.id)"
                                    class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                                >Edit</button>
                                <button 
                                    @click="removeUser(u.id)"
                                    class="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition duration-150 disabled:opacity-50"
                                    :disabled="isRemoving[u.id] || u.id == user.id" 
                                >
                                    {{ isRemoving[u.id] ? 'Removing...' : (u.id == user.id ? 'Self' : 'Remove') }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
            
            <!-- Edit User Modal (conditional) -->
            <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div class="bg-white rounded-lg w-11/12 md:w-1/2 p-6">
                    <h3 class="text-lg font-semibold mb-4">Edit User</h3>

                    <label class="block text-sm font-medium">Name</label>
                    <input v-model="editForm.name" class="w-full p-2 border rounded mb-3" />

                    <label class="block text-sm font-medium">Email</label>
                    <input v-model="editForm.email" class="w-full p-2 border rounded mb-3" />

                    <label class="block text-sm font-medium">Role</label>
                    <select v-model="editForm.role" class="w-full p-2 border rounded mb-3">
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                    </select>

                    <label class="block text-sm font-medium">Password (leave empty to keep current)</label>
                    <input v-model="editForm.password" type="password" class="w-full p-2 border rounded mb-3" />

                    <div class="flex justify-end gap-3">
                        <button @click="closeEditModal" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button @click="submitEdit" :disabled="isSubmittingEdit" class="px-4 py-2 bg-brand-600 text-white rounded">Save</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import auth from '@/stores/auth'; // Assuming auth store provides user details
import { ref, computed, onMounted } from 'vue';

// Auth store se current user ki details nikalna
const user = computed(() => {
    // Ensure user always has an 'id' property, even if missing from auth.value
    const authVal: any = auth.value ?? {};
    return {
        id: typeof authVal.id === 'number' ? authVal.id : 0,
        name: authVal.name || '',
        email: authVal.email || '',
        role: authVal.role || '',
        loggedAt: authVal.loggedAt
    };
});
const isAdmin = computed(() => {
    return !!(user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org');
});

const users = ref<Array<any>>([]);
const isLoading = ref(true);
const isRemoving = ref<Record<number, boolean>>({});
const showEditModal = ref(false);
const editUserId = ref<number | null>(null);
const isSubmittingEdit = ref(false);
const editForm = ref<any>({ name: '', email: '', role: 'user', password: '' });

const openEdit = async (id: number) => {
    console.log('[DEBUG] openEdit called for id=', id);
    editUserId.value = id;
    // fetch user details
    try {
        const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const token = (auth as any).value?.token;
        const resp = await fetch(`${BASE}/api/admin/users/${id}`, { headers: token ? { 'Authorization': `Bearer ${token}` } : undefined });
        console.log('[DEBUG] fetch user resp ok=', resp.ok, 'status=', resp.status);
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({ message: 'Failed to fetch user' }));
            throw new Error(err.message || 'Failed to fetch user');
        }
        const data = await resp.json();
        console.log('[DEBUG] fetched user data=', data);
        editForm.value = { name: data.name || '', email: data.email || '', role: data.role || 'user', password: '' };
        showEditModal.value = true;
    } catch (err: any) {
        console.warn('Error fetching user for edit, falling back to local data:', err);
        // Fallback: try to find the user in the already-loaded users list
        const local = users.value.find(u => u.id === id);
        if (local) {
            editForm.value = { name: local.name || '', email: local.email || '', role: local.role || 'user', password: '' };
            showEditModal.value = true;
            return;
        }
        console.error('Error fetching user for edit and no local fallback available:', err);
        alert('Could not load user details.');
    }
};

const closeEditModal = () => {
    showEditModal.value = false;
    editUserId.value = null;
    editForm.value = { name: '', email: '', role: 'user', password: '' };
};

const submitEdit = async () => {
    if (!editUserId.value) return;
    isSubmittingEdit.value = true;
    try {
        const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const token = (auth as any).value?.token;
        const body: any = { name: editForm.value.name, email: editForm.value.email, role: editForm.value.role };
        if (editForm.value.password) body.password = editForm.value.password;

        const resp = await fetch(`${BASE}/api/admin/users/${editUserId.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
            body: JSON.stringify(body)
        });

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({ message: 'Failed to update user' }));
            throw new Error(err.message || 'Failed to update user');
        }

        alert('User updated successfully');
        closeEditModal();
        // refresh list
        fetchUsers();
    } catch (err: any) {
        console.error('Error updating user:', err);
        alert('Error updating user: ' + (err.message || 'Unknown'));
    } finally {
        isSubmittingEdit.value = false;
    }
};

// --- Fetch Users from API ---
const fetchUsers = async () => {
    isLoading.value = true;
    try {
        const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const apiUrl = `${BASE}/api/users`;
        console.log("Fetching users from:", apiUrl); // Check in browser console

        // include Authorization header if token present
        const token = (auth as any).value?.token;
        const headers: Record<string,string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(apiUrl, { headers });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        users.value = data; 
    } catch (e) {
        console.error('CRITICAL: Error fetching users:', e);
        users.value = [];
        alert("Failed to load users list. Check network and server console.");
    } finally {
        isLoading.value = false;
    }
};

// --- DELETE User Logic ---
const removeUser = async (id: number) => {
    // Current user ko delete hone se roko
    if (id === user.value.id) {
        alert("You cannot remove your own admin account.");
        return;
    }

    if (!confirm('Are you sure you want to permanently remove this user?')) {
        return;
    }
    
    isRemoving.value = { ...isRemoving.value, [id]: true };

    try {
        const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const token = (auth as any).value?.token;
        const response = await fetch(`${BASE}/api/admin/users/${id}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
        });

        if (response.ok) {
            alert('User removed successfully!');
            users.value = users.value.filter(u => u.id !== id);
        } else {
            const errorData = await response.json();
            alert(`Failed to remove user: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Delete user error:', error);
        alert('An unexpected error occurred during user removal.');
    } finally {
        isRemoving.value = { ...isRemoving.value, [id]: false };
    }
};

onMounted(() => {
    fetchUsers(); 
});
</script>