<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-8">
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

      <section class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Welcome to your dashboard</h2>
        <p class="text-gray-600 mb-4">Use the left menu to view your certificate or manage your account.</p>

        <div class="mt-6">
          <h3 class="font-medium mb-2">Donation History</h3>
          <div class="space-y-3">
            <div v-if="donations.length === 0" class="text-sm text-gray-500">No donations yet.</div>
            <div v-for="d in donations" :key="d.id" class="p-3 border rounded flex justify-between items-center">
              <div>
                <div class="font-medium">₹{{ d.amount }} <span class="text-sm text-gray-500">({{ d.purpose || 'General' }})</span></div>
                <div class="text-sm text-gray-500">{{ new Date(d.date).toLocaleString() }}</div>
              </div>
              <div class="flex items-center space-x-2">
                <button @click="printReceipt(d)" class="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Receipt</button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="font-medium mb-2">Add Donation (test)</h3>
          <div class="flex items-center space-x-2">
            <input v-model.number="newAmount" type="number" class="border px-3 py-2 rounded w-40" placeholder="Amount" />
            <input v-model="newPurpose" class="border px-3 py-2 rounded" placeholder="Purpose" />
            <button @click="addDonation" class="px-4 py-2 bg-green-600 text-white rounded">Add</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import auth, { clearAuth } from '@/stores/auth';
import { ref, onMounted, computed } from 'vue';
import { listDonationsFor, addDonation as addDonationEntry } from '@/stores/donations';
import Sidebar from '@/components/Sidebar.vue';

const user = auth;
const router = useRouter();
const route = useRoute();

const isAdmin = computed(() => {
  return !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org'));
});

const handleLogout = () => {
  // Clear auth and redirect
  clearAuth();
  router.push('/');
  // show a short logout toast via window event (header listens)
  window.dispatchEvent(new Event('auth-action'));
};

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/');
};

// Donations
const donations = ref([] as any[]);
const newAmount = ref<number | null>(null);
const newPurpose = ref('');

onMounted(() => {
  if (auth.value?.email) {
    donations.value = listDonationsFor(auth.value.email);
  }
});

function addDonation() {
  if (!auth.value?.email || !newAmount.value) return alert('Provide amount');
  const created = addDonationEntry({ email: auth.value.email, amount: newAmount.value, date: new Date().toISOString(), purpose: newPurpose.value });
  donations.value.unshift(created);
  newAmount.value = null;
  newPurpose.value = '';
}

function printReceipt(d: any) {
  const w = window.open('', '_blank');
  if (!w) return alert('Popup blocked');
  // build a professional receipt layout
  const orgName = 'Devi Dhaam Trust';
  const orgAddress = '123 Trust Street, City, State - PIN';
  const orgEmail = 'contact@devidhaam.org';
  const orgPhone = '+91 98765 43210';
  const receiptNo = d.id || ('RCPT-' + Date.now().toString(36));
  const donorName = (auth && auth.value && auth.value.name) ? auth.value.name : d.email;
  const amountText = '₹' + Number(d.amount).toLocaleString('en-IN');

  const html = '<html><head><meta charset="utf-8"><title>Donation Receipt</title>' +
    '<style>body{font-family:Inter, Arial, sans-serif;margin:30px;color:#111} .header{display:flex;align-items:center;gap:16px} .logo{width:64px;height:64px;border-radius:8px;background:#eef2ff;display:flex;align-items:center;justify-content:center;font-weight:700;color:#4f46e5} h1{margin:0;font-size:20px} .meta{margin-top:8px;color:#555} .box{border:1px solid #e5e7eb;padding:18px;border-radius:8px;margin-top:18px} table{width:100%;border-collapse:collapse;margin-top:8px} td{padding:8px;vertical-align:top} .label{color:#6b7280;width:35%} .value{color:#111} .amount{font-size:18px;font-weight:700;color:#111} .footer{margin-top:22px;font-size:13px;color:#444;border-top:1px dashed #e5e7eb;padding-top:12px}</style>' +
    '</head><body>' +
    '<div class="header"><div class="logo">DD</div><div><h1>' + orgName + '</h1><div class="meta">' + orgAddress + '<br/>' + orgEmail + ' | ' + orgPhone + '</div></div></div>' +
    '<div class="box">' +
      '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '<div>' +
          '<strong>Receipt</strong><div style="color:#6b7280;font-size:13px">Thank you for your support</div>' +
        '</div>' +
        '<div style="text-align:right">' +
          '<div style="font-weight:700">Receipt No: ' + receiptNo + '</div>' +
          '<div style="color:#6b7280;font-size:13px">' + new Date(d.date).toLocaleString() + '</div>' +
        '</div>' +
      '</div>' +
      '<table>' +
        '<tr><td class="label">Donor</td><td class="value">' + donorName + ' (' + d.email + ')</td></tr>' +
        '<tr><td class="label">Amount</td><td class="value amount">' + amountText + '</td></tr>' +
        '<tr><td class="label">Purpose</td><td class="value">' + (d.purpose || 'General Donation') + '</td></tr>' +
        '<tr><td class="label">Transaction ID</td><td class="value">' + (d.id || '-') + '</td></tr>' +
      '</table>' +
      '<div class="footer">This is a system generated receipt. For any queries, contact us at ' + orgEmail + '.</div>' +
    '</div>' +
    // trigger print and close
    '<scr' + 'ipt>window.print();setTimeout(function(){ window.close(); },500);</scr' + 'ipt>' +
    '</body></html>';
  w.document.write(html);
  w.document.close();
}
</script>

<style scoped>
.active-link {
  position: relative;
}
.active-link::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 6px;
  height: 3px;
  background: linear-gradient(90deg,#6366f1,#10b981);
  border-radius: 2px;
  transform-origin: left center;
  animation: underline 0.4s ease forwards;
}

@keyframes underline {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
</style>
