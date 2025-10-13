<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-8 max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">My Profile</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Left: profile card -->
          <aside class="col-span-1 bg-white p-6 rounded shadow">
            <div class="flex flex-col items-center">
              <div class="w-28 h-28 rounded-full bg-orange-50 flex items-center justify-center text-3xl font-bold text-orange-700">{{ initials }}</div>
              <div class="mt-4 text-lg font-semibold">{{ userName }}</div>
              <div class="text-sm text-gray-500">{{ userEmail }}</div>

              <div class="mt-4 text-center">
                <div class="text-xs text-gray-400">Member since</div>
                <div class="text-sm font-medium">{{ joinedAt }}</div>
              </div>

              <div class="mt-4 w-full">
                <div class="text-sm text-gray-600">Membership status</div>
                <div class="mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium" :class="membershipClass">{{ membershipLabel }}</div>
              </div>
            </div>
          </aside>

          <!-- Center: editable profile -->
          <section class="col-span-1 md:col-span-2 bg-white p-6 rounded shadow">
            <h2 class="text-lg font-semibold mb-4">Account</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block mb-2 text-sm font-medium">Full name</label>
                <input v-model="form.name" class="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium">Email</label>
                <input v-model="form.email" class="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium">Phone</label>
                <input v-model="form.phone" class="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium">Member ID</label>
                <input v-model="memberId" disabled class="w-full border px-3 py-2 rounded bg-gray-50" />
              </div>
            </div>

            <div class="mt-5 flex items-center space-x-3">
              <button @click="save" class="px-4 py-2 bg-orange-600 text-white rounded">Save Changes</button>
              <button @click="cancel" class="px-4 py-2 border rounded">Cancel</button>
              <button @click="openChangePassword" class="ml-auto text-sm text-orange-600">Change password</button>
            </div>

            <div v-if="showPasswordBox" class="mt-6 border rounded p-4 bg-gray-50">
              <h3 class="font-medium mb-2">Change Password</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input v-model="pw.current" type="password" placeholder="Current password" class="w-full border px-3 py-2 rounded" />
                <input v-model="pw.new" type="password" placeholder="New password" class="w-full border px-3 py-2 rounded" />
              </div>
              <div class="mt-3">
                <button @click="changePassword" class="px-3 py-2 bg-green-600 text-white rounded">Update password</button>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="font-medium mb-3">Recent activity</h3>
              <div v-if="recentDonations.length === 0" class="text-sm text-gray-500">No recent donations</div>
              <ul class="space-y-3">
                <li v-for="d in recentDonations" :key="d.id" class="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div class="font-medium">₹{{ d.amount }}</div>
                    <div class="text-sm text-gray-500">{{ formatDate(d.date) }} • {{ d.purpose || 'General' }}</div>
                  </div>
                  <div>
                    <button @click="printReceipt(d)" class="px-3 py-1 bg-orange-600 text-white rounded text-sm">Receipt</button>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import auth, { setAuth } from '@/stores/auth';
import Sidebar from '@/components/Sidebar.vue';
import { listDonationsFor } from '@/stores/donations';

const user = auth;
const route = useRoute();

const isAdmin = computed(() => {
  return !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org'));
});

const form = reactive({ name: user.value?.name || '', email: user.value?.email || '', phone: '' });
const pw = reactive({ current: '', new: '' });
const showPasswordBox = ref(false);

const memberId = ref(user.value?.id || '');

const userName = computed(() => user.value?.name || 'Guest');
const userEmail = computed(() => user.value?.email || '');
const initials = computed(() => {
  if (!user.value?.name) return (user.value?.email || '').charAt(0).toUpperCase();
  return user.value.name.split(' ').map((s: string) => s.charAt(0).toUpperCase()).slice(0,2).join('');
});

// membership label & class
const membershipLabel = computed(() => 'Active');
const membershipClass = computed(() => 'bg-emerald-100 text-emerald-700');

const recentDonations = ref<any[]>([]);

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString();
  } catch (e) {
    return d;
  }
}

const joinedAt = computed(() => {
  if (user.value?.createdAt) return new Date(user.value.createdAt).toLocaleDateString();
  if (user.value?.loggedAt) return new Date(user.value.loggedAt).toLocaleDateString();
  // try users list in localStorage
  try {
    const raw = JSON.parse(localStorage.getItem('users') || '[]');
    const u = raw.find((x: any) => (x.email || '').toLowerCase() === (user.value?.email || '').toLowerCase());
    if (u && u.createdAt) return new Date(u.createdAt).toLocaleDateString();
  } catch (e) {}
  return '—';
});

onMounted(() => {
  // Try to fetch current profile and recent donations from backend when authenticated
  (async () => {
    if (!user.value) return;
    const token = (user.value as any).token;

    // 1) Fetch fresh profile from backend
    if (token) {
      try {
        const pRes = await fetch('http://localhost:3000/api/me', { headers: { Authorization: `Bearer ${token}` } });
        if (pRes.ok) {
          const pd = await pRes.json();
          const remoteUser = pd.user || pd;
          // preserve token
          const merged = { ...(remoteUser || {}), token };
          setAuth(merged as any);
          // update local form values
          form.name = merged.name || '';
          form.email = merged.email || '';
          memberId.value = merged.id || memberId.value;
        }
      } catch (e) {
        // ignore and continue to donations fetch / fallback
      }
    }

    // 2) Fetch recent donations from backend
    if (token) {
      try {
        const res = await fetch('http://localhost:3000/api/donations/me', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          recentDonations.value = (data.donations || data || []).slice(0,5);
          return;
        }
      } catch (e) {
        // continue to fallback
      }
    }

    // Fallback to local store
    if (user.value?.email) {
      recentDonations.value = listDonationsFor(user.value.email).slice(0,5);
    }
  })();
});

function save() {
  // Try to persist profile to backend if token present
  const updated = { ...(user.value || {}), name: form.name, email: form.email };
  const token = (user.value as any)?.token;
  if (token) {
    fetch('http://localhost:3000/api/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: form.name, email: form.email }),
    }).then(async (res) => {
      if (res.ok) {
        const d = await res.json();
        const newUser = { ...(d.user || updated), token: d.token || token };
        setAuth(newUser as any);
        memberId.value = newUser.id || memberId.value;
        window.dispatchEvent(new Event('auth-action'));
        alert('Profile saved');
      } else {
        // fallback to local behavior
        setAuth(updated as any);
        memberId.value = updated.id || memberId.value;
        window.dispatchEvent(new Event('auth-action'));
        alert('Profile saved (offline)');
      }
    }).catch(() => {
      setAuth(updated as any);
      memberId.value = updated.id || memberId.value;
      window.dispatchEvent(new Event('auth-action'));
      alert('Profile saved (offline)');
    });
    return;
  }

  // no token: local update only
  setAuth(updated as any);
  memberId.value = updated.id || memberId.value;
  window.dispatchEvent(new Event('auth-action'));
  alert('Profile saved');
}

function cancel() {
  form.name = user.value?.name || '';
  form.email = user.value?.email || '';
}

function openChangePassword() {
  showPasswordBox.value = !showPasswordBox.value;
}

async function changePassword() {
  if (!pw.current || !pw.new) {
    alert('Provide current and new password');
    return;
  }

  const token = (user.value as any)?.token;
  if (!token) {
    alert('You must be logged in to change password');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/me/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ current: pw.current, newPassword: pw.new }),
    });

    if (res.ok) {
      pw.current = '';
      pw.new = '';
      showPasswordBox.value = false;
      alert('Password updated successfully.');
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.message || 'Failed to change password.');
    }
  } catch (e) {
    console.error('Password change failed:', e);
    alert('Network error: Could not change password.');
  }
}

function printReceipt(d: any) {
  const w = window.open('', '_blank');
  if (!w) return alert('Popup blocked');
  const html = `<html><body><h1>Receipt</h1><p>Amount: ${d.amount}</p><p>Date: ${formatDate(d.date)}</p></body></html>`;
  w.document.write(html);
  w.document.close();
}
</script>

<style scoped>
/* Profile page custom styles */
.profile-avatar {
  width: 112px;
  height: 112px;
  border-radius: 9999px;
}

.rounded-card {
  border-radius: 12px;
}

.muted { color: #6b7280 }
</style>
*** End Patch
