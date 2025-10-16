<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

  <main class="flex-1 p-8 min-w-0">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold">Admin Dashboard</h1>
          <p class="text-sm text-gray-600">Welcome back, {{ user.value?.name || user.value?.email || 'admin' }}</p>
        </div>
      </div>

      <section class="space-y-6">
        <!-- Member heading pill -->
        <div class="flex justify-center mb-2">
          <div class="px-4 py-1 rounded-full text-white font-semibold" style="background: linear-gradient(90deg,#06b6d4,#064e3b);">Member</div>
        </div>

        <!-- Top summary cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardGradient :title="'Total Members'" subtitle="(All users)" :value="totalUsers" colorFrom="#0ea5a4" colorTo="#2563eb" :to="{ path: '/admin/all-users' }">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </template>
          </CardGradient>
          <CardGradient title="New Members" subtitle="(Recently added)" :value="totalNewMembers" colorFrom="#7c3aed" colorTo="#ec4899" :to="{ path: '/admin/new-members' }">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
            </template>
          </CardGradient>
          <CardGradient title="Active Members" subtitle="(Active accounts)" :value="totalActiveMembers" colorFrom="#06b6d4" colorTo="#8b5cf6" :to="{ path: '/admin/active-members' }">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10"/></svg>
            </template>
          </CardGradient>
          <CardGradient title="Blocked Members" subtitle="(Blocked accounts)" :value="totalBlockedMembers" colorFrom="#fb7185" colorTo="#f97316" :to="{ path: '/admin/blocked-users' }">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M4.2 4.2l15.6 15.6"/></svg>
            </template>
          </CardGradient>
        </div>

        <!-- Donation heading pill -->
        <div class="flex justify-center mt-4 mb-2">
          <div class="px-4 py-1 rounded-full text-white font-semibold" style="background: linear-gradient(90deg,#06b6d4,#064e3b);">Donation</div>
        </div>

        <!-- Donation cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardGradient title="Total Donations" subtitle="(All donations & fees)" :value="formatCurrency(totalDonations)" colorFrom="#047857" colorTo="#06b6d4" :to="{ path: '/admin/donations' }">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M7 9h.01M17 15h.01"/><path d="M21 12H3"/></svg>
            </template>
          </CardGradient>
          <CardGradient title="Users Donation" subtitle="(From users)" :value="formatCurrency(totalUserDonations)" colorFrom="#7c3aed" colorTo="#ef4444" :to="{ path: '/admin/all-receipts', query: { source: 'user' } }">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </template>
          </CardGradient>
          <CardGradient title="Visitor Donation" subtitle="(Direct donations)" :value="formatCurrency(totalVisitorDonations)" colorFrom="#06b6d4" colorTo="#8b5cf6" :to="{ path: '/admin/all-receipts', query: { source: 'visitor' } }">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7"/><path d="M12 12V7"/><path d="M20 7h-4.5a2.5 2.5 0 00-2.5 2.5V10"/><path d="M4 7h4.5A2.5 2.5 0 0111 9.5V10"/></svg>
            </template>
          </CardGradient>
        </div>

        <!-- Receipt section -->
        <div class="mt-6">
          <div class="flex justify-center mb-2">
            <div class="px-4 py-1 rounded-full text-white font-semibold" style="background: linear-gradient(90deg,#06b6d4,#064e3b);">Receipt</div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardGradient title="Members Receipt" subtitle="(Active)" :value="membershipReceiptCount" colorFrom="#0ea5a4" colorTo="#2563eb" :to="{ path: '/admin/all-receipts', query: { type: 'membership' } }">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v5.5"/><path d="M7 20l2-2 2 2 2-2 2 2"/><path d="M7 13h10"/></svg>
              </template>
            </CardGradient>
            <CardGradient title="User Donation Receipt" subtitle="(Blocked By Admin)" :value="userDonationReceiptCount" colorFrom="#7c3aed" colorTo="#ec4899" :to="{ path: '/admin/all-receipts', query: { source: 'user' } }">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v5.5"/><path d="M7 20l2-2 2 2 2-2 2 2"/><path d="M7 13h10"/></svg>
              </template>
            </CardGradient>
            <CardGradient title="Visitor Donation Receipt" subtitle="(Direct User Certificate)" :value="visitorDonationReceiptCount" colorFrom="#06b6d4" colorTo="#8b5cf6" :to="{ path: '/admin/all-receipts', query: { source: 'visitor' } }">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v5.5"/><path d="M7 20l2-2 2 2 2-2 2 2"/><path d="M7 13h10"/></svg>
              </template>
            </CardGradient>
          </div>
        </div>

        <!-- Managers section -->
        <div class="mt-6">
          <div class="flex justify-center mb-2">
            <div class="px-4 py-1 rounded-full text-white font-semibold" style="background: linear-gradient(90deg,#06b6d4,#064e3b);">Certificates</div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardGradient title="All Certificates" subtitle="(Total certificates)" :value="totalCertificates" colorFrom="#0ea5a4" colorTo="#2563eb" :to="{ path: '/admin/all-certificates' }">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </template>
            </CardGradient>
            <CardGradient title="Users Certificates" subtitle="(By Users)" :value="activeUserCertificateCount" colorFrom="#7c3aed" colorTo="#ec4899" :to="{ path: '/admin/active-certificates' }">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M4.2 4.2l15.6 15.6"/></svg>
              </template>
            </CardGradient>
            <CardGradient title="Visitor Certificate" subtitle="(Direct User Certificate)" :value="visitorCertificateCount" colorFrom="#06b6d4" colorTo="#8b5cf6" :to="{ path: '/admin/visitor-certificate' }">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9h8"/></svg>
              </template>
            </CardGradient>
          </div>
        </div>

      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import auth from '@/stores/auth';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import CardGradient from '@/components/CardGradient.vue';

const route = useRoute();

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/');
};

const user: any = auth;
const isAdmin = computed(() => {
  return !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org'));
});
const totalUsers = ref(0);
const totalNewMembers = ref(0);
const totalActiveMembers = ref(0);
const totalBlockedMembers = ref(0);

const totalMembershipFee = ref(0);
const totalUserDonations = ref(0);
const totalVisitorDonations = ref(0);
const totalCashDonations = ref(0);

const totalDonations = computed(() => {
  return Number(totalMembershipFee.value || 0) + Number(totalUserDonations.value || 0) + Number(totalVisitorDonations.value || 0) + Number(totalCashDonations.value || 0);
});

// Receipt counts
const membershipReceiptCount = ref(0);
const userDonationReceiptCount = ref(0);
const visitorDonationReceiptCount = ref(0);
const cashDonationReceiptCount = ref(0);

// Managers & certificates
const totalManagers = ref(0);
const visitorCertificateCount = ref(0);
const activeUserCertificateCount = ref(0);

const totalCertificates = computed(() => {
  return Number(visitorCertificateCount.value || 0) + Number(activeUserCertificateCount.value || 0);
});

const formatCurrency = (v: number | string) => {
  const n = Number(v) || 0;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
};

onMounted(() => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as any[];
    totalUsers.value = users.length;
    totalActiveMembers.value = users.filter(u => !!u.active || u.status === 'active').length;
    totalBlockedMembers.value = users.filter(u => u.blocked || u.status === 'blocked').length;
    // new members: those created within last 30 days if createdAt exists
    const now = Date.now();
    totalNewMembers.value = users.filter(u => {
      const t = Number(new Date(u.createdAt || u.created || 0));
      return t && (now - t) <= (1000 * 60 * 60 * 24 * 30);
    }).length;

    const donations = JSON.parse(localStorage.getItem('donations') || '[]') as any[];
    totalUserDonations.value = donations.filter(d => d.type === 'user' || d.from === 'user').reduce((s, d) => s + Number(d.amount || 0), 0);
    totalVisitorDonations.value = donations.filter(d => d.type === 'visitor' || d.from === 'visitor').reduce((s, d) => s + Number(d.amount || 0), 0);
    totalCashDonations.value = donations.filter(d => d.mode === 'cash' || d.to === 'admin').reduce((s, d) => s + Number(d.amount || 0), 0);

    // receipts: tolerant checks across possible keys
    try {
      const receipts = JSON.parse(localStorage.getItem('receipts') || '[]') as any[];
      membershipReceiptCount.value = receipts.filter(r => r.type === 'membership' || r.receiptFor === 'membership').length;
      userDonationReceiptCount.value = receipts.filter(r => r.type === 'userDonation' || r.receiptFor === 'donation' || r.from === 'user').length;
      visitorDonationReceiptCount.value = receipts.filter(r => r.type === 'visitorDonation' || r.from === 'visitor').length;
      cashDonationReceiptCount.value = receipts.filter(r => r.mode === 'cash' || r.to === 'admin').length;
    } catch (e) {
      // fallback heuristics using donations/users
      membershipReceiptCount.value = users.filter(u => !!u.membershipReceipt || !!u.membershipReceiptId).length;
      userDonationReceiptCount.value = donations.filter(d => !!d.receiptId && (d.from === 'user' || d.type === 'user')).length;
      visitorDonationReceiptCount.value = donations.filter(d => !!d.receiptId && (d.from === 'visitor' || d.type === 'visitor')).length;
      cashDonationReceiptCount.value = donations.filter(d => !!d.receiptId && (d.mode === 'cash' || d.to === 'admin')).length;
    }

    // managers
    try {
      const managers = JSON.parse(localStorage.getItem('managers') || '[]') as any[];
      totalManagers.value = managers.length;
      // blocked managers count not tracked separately here
    } catch (e) {
      // fallback to users with role 'manager'
      totalManagers.value = users.filter(u => u.role === 'manager').length;
      // blocked managers count not tracked separately here
    }

    // certificates
    try {
      const certs = JSON.parse(localStorage.getItem('certificates') || '[]') as any[];
      visitorCertificateCount.value = certs.filter(c => c.type === 'visitor' || c.for === 'visitor').length;
      activeUserCertificateCount.value = certs.filter(c => c.type === 'user' || c.for === 'user').length;
    } catch (e) {
      visitorCertificateCount.value = 0;
      activeUserCertificateCount.value = users.filter(u => !!u.certificateId || !!u.certificate).length;
    }

    // membership fees from users (if user.membershipFee exists)
    totalMembershipFee.value = users.reduce((s, u) => s + Number(u.membershipFee || 0), 0);
  } catch (e) {
    // ignore parsing errors
  }
});

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
