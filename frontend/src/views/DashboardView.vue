<template>
  <div class="min-h-screen flex bg-gray-50">
    <Sidebar :user="user" :is-admin="isAdmin" />

    <main class="flex-1 p-8 relative">
      <!-- full-page animated background -->
      <div class="page-hero absolute inset-0 pointer-events-none -z-20" :style="{ opacity: heroVisible ? 1 : 0, transition: 'opacity .28s ease' }">
        <div class="hero-bg absolute inset-0"></div>
      </div>
      <div class="relative rounded-xl mb-6 overflow-hidden">
        <!-- decorative floating shapes -->
        <svg :style="{ opacity: shapesVisible ? 0.42 : 0, transition: 'opacity .45s ease' }" class="absolute left-6 top-6 transform float-anim" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="60" fill="url(#g1)" />
          <!-- restored original blue->green gradient but hidden until mount -->
          <defs><linearGradient id="g1" x1="0" x2="1"><stop offset="0" stop-color="#60a5fa"/><stop offset="1" stop-color="#34d399"/></linearGradient></defs>
        </svg>
        <svg :style="{ opacity: shapesVisible ? 0.28 : 0, transition: 'opacity .55s ease .08s' }" class="absolute right-6 top-12 transform float-anim delay-2" width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="180" height="180" rx="24" fill="url(#g2)" />
          <defs><linearGradient id="g2" x1="0" x2="1"><stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#ef4444"/></linearGradient></defs>
        </svg>
        

  <div class="p-6 md:p-8 relative max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-gradient-to-br from-indigo-400 to-green-300 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
          <span>{{ initials }}</span>
        </div>
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900">Welcome <span class="text-brand-600">{{ displayName }}</span></h1>
          <p class="text-sm text-gray-600 mt-1 hidden md:block">Here's your dashboard — quick actions to manage your account and donations.</p>
        </div>
      </div>
      
    </div>
  </div>
      </div>
      
         <!-- Quick action cards (mirror user sidebar options) -->
      <section class="mb-6">
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <router-link to="/profile" class="card-cta card-anim card-indigo" aria-label="Open Profile">
            <div class="flex items-center justify-between w-full h-44 md:h-40">
              <div class="flex items-center space-x-4">
                <div class="card-icon">👤</div>
                <div>
                  <div class="font-semibold text-lg"><span class="text-badge badge-indigo">Profile</span></div>
                  <div class="text-sm opacity-80 text-black">View & edit your profile</div>
                </div>
              </div>
              <div class="card-action" aria-hidden="true">›</div>
            </div>
          </router-link>

          <router-link to="/my-certificates" class="card-cta card-anim card-amber" aria-label="View Certificates">
            <div class="flex items-center justify-between w-full h-44 md:h-40">
              <div class="flex items-center space-x-4">
                <div class="card-icon">📜</div>
                <div>
                  <div class="font-semibold text-lg"><span class="text-badge badge-amber">Certificates</span></div>
                  <div class="text-sm opacity-80 text-black">View your certificates</div>
                </div>
              </div>
              <div class="card-action" aria-hidden="true">›</div>
            </div>
          </router-link>

          <router-link to="/my-donations" class="card-cta card-anim card-emerald" aria-label="Donations">
            <div class="flex items-center justify-between w-full h-44 md:h-40">
              <div class="flex items-center space-x-4">
                <div class="card-icon">🤝</div>
                <div>
                  <div class="font-semibold text-lg"><span class="text-badge badge-emerald">Donate</span></div>
                  <div class="text-sm opacity-80 text-black">Make a donation</div>
                </div>
              </div>
              <div class="card-action" aria-hidden="true">›</div>
            </div>
          </router-link>

          <router-link to="/receipts" class="card-cta card-anim card-pink" aria-label="Receipts">
            <div class="flex items-center justify-between w-full h-44 md:h-40">
              <div class="flex items-center space-x-4">
                <div class="card-icon">🧾</div>
                <div>
                  <div class="font-semibold text-lg"><span class="text-badge badge-pink">Receipts</span></div>
                  <div class="text-sm opacity-80 text-black">View & download your donation receipts</div>
                </div>
              </div>
              <div class="card-action" aria-hidden="true">›</div>
            </div>
          </router-link>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import auth, { clearAuth } from '@/stores/auth';
import { computed, ref, onMounted } from 'vue';
import Sidebar from '@/components/Sidebar.vue';

const user = auth;
const router = useRouter();
const route = useRoute();

const isAdmin = computed(() => {
  return !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org'));
});

// friendly display name used in template (avoids accessing ref.value in template)
const displayName = computed(() => {
  return (user.value && (user.value.name || user.value.email)) ? (user.value.name || user.value.email) : 'Member';
});

// initials for avatar fallback (two letters) — derive from cleaned name so 'TE' is stripped
const initials = computed(() => {
  let name = (displayName.value || 'M').toString();
  const up = name.toUpperCase();
  if (up.startsWith('TE') && name.length > 2) name = name.slice(2);
  else if (up.endsWith('TE') && name.length > 2) name = name.slice(0, -2);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'M';
  if (parts.length === 1) return (parts[0] ?? '').slice(0,2).toUpperCase();
  const first = parts[0] || '';
  const last = parts[parts.length - 1] || '';
  const fch = first.charAt(0) || '';
  const lach = last.charAt(0) || '';
  return (fch + lach).toUpperCase();
});

// Clean display name: remove leading or trailing "TE" only when present (case-insensitive)
const cleanName = computed(() => {
  const name = (displayName.value || '').toString();
  if (!name) return name;
  const up = name.toUpperCase();
  // remove leading 'TE' or trailing 'TE' but only if present exactly
  if (up.startsWith('TE') && name.length > 2) return name.slice(2);
  if (up.endsWith('TE') && name.length > 2) return name.slice(0, -2);
  return name;
});

// control hero visibility to avoid paint flash
const heroVisible = ref(false);
onMounted(() => {
  // small delay so initial paint uses neutral background
  setTimeout(() => (heroVisible.value = true), 30);
  // reveal decorative shapes a bit later to avoid first-paint color flash
  setTimeout(() => (shapesVisible.value = true), 180);
});

const shapesVisible = ref(false);

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

</script>

<style scoped>
/* Animated gradient hero background */
.hero-bg{ background: linear-gradient(120deg, rgba(250,251,253,0.85), rgba(255,250,240,0.7), rgba(255,255,255,0.0)); background-size: 600% 600%; animation: gradientShift 20s ease infinite; filter: blur(18px) saturate(100%); opacity: 0.7; }
@keyframes gradientShift{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

/* floating shapes */
.float-anim{ animation: floaty 6s ease-in-out infinite; }
.float-anim.delay-2{ animation-delay: 2s }
@keyframes floaty{ 0%{transform:translateY(0)}50%{transform:translateY(-12px)}100%{transform:translateY(0)} }

/* card styles */
.card-cta{ position:relative; overflow:hidden; background:linear-gradient(180deg, rgba(15,23,42,0.04), rgba(15,23,42,0.02)); padding:28px; border-radius:14px; box-shadow:0 12px 36px rgba(2,6,23,0.08); transition:transform .20s cubic-bezier(.2,.9,.2,1), box-shadow .20s ease; display:flex; align-items:center; min-height:140px }
.card-cta:hover{ transform:translateY(-8px); box-shadow:0 26px 56px rgba(2,6,23,0.18) }
/* premium glass effect and subtle border */
.card-cta{ backdrop-filter: blur(6px) saturate(115%); border:1px solid rgba(255,255,255,0.06); }
.card-cta:hover{ box-shadow:0 32px 80px rgba(59,130,246,0.06), 0 10px 30px rgba(2,6,23,0.12); }

/* subtle global dark overlay to make hover darker uniformly */
.card-cta::after{ content:""; position:absolute; inset:0; border-radius:14px; background:rgba(0,0,0,0); pointer-events:none; transition:background .18s ease, opacity .18s ease; }
.card-cta:hover::after, .card-cta:focus::after{ background:rgba(0,0,0,0.14); }

/* full-card colored variants (subtle, semi-transparent fill) */
.card-indigo{ background-image: linear-gradient(180deg, rgba(63,52,166,0.18), rgba(48,40,130,0.10)); color: #eef2ff }
.card-amber{ background-image: linear-gradient(180deg, rgba(160,56,6,0.18), rgba(140,50,8,0.10)); color: #fff7ed }
.card-emerald{ background-image: linear-gradient(180deg, rgba(6,95,69,0.18), rgba(4,74,56,0.10)); color: #ecfdf5 }
.card-pink{ background-image: linear-gradient(180deg, rgba(157,20,83,0.18), rgba(139,20,77,0.10)); color: #fff1f2 }

/* keep icons and small text readable on colored backgrounds */
.card-indigo .card-icon, .card-indigo .text-badge{ color: #f8fafc }
.card-amber .card-icon, .card-amber .text-badge{ color: #fffaf0 }
.card-emerald .card-icon, .card-emerald .text-badge{ color: #f0fdf4 }
.card-pink .card-icon, .card-pink .text-badge{ color: #fff5f9 }

/* stronger colored hover glow */
.card-indigo:hover{ background-image: linear-gradient(180deg, rgba(48,40,130,0.32), rgba(36,28,90,0.20)); box-shadow:0 44px 120px rgba(48,40,130,0.18), 0 14px 44px rgba(2,6,23,0.22); }
.card-amber:hover{ background-image: linear-gradient(180deg, rgba(140,50,8,0.32), rgba(120,45,6,0.20)); box-shadow:0 44px 120px rgba(140,50,8,0.18), 0 14px 44px rgba(2,6,23,0.22); }
.card-emerald:hover{ background-image: linear-gradient(180deg, rgba(4,74,56,0.32), rgba(3,60,46,0.20)); box-shadow:0 44px 120px rgba(4,74,56,0.18), 0 14px 44px rgba(2,6,23,0.22); }
.card-pink:hover{ background-image: linear-gradient(180deg, rgba(139,20,77,0.32), rgba(115,15,64,0.20)); box-shadow:0 44px 120px rgba(139,20,77,0.18), 0 14px 44px rgba(2,6,23,0.22); }

/* icon tile inside card */
.card-icon{ width:72px; height:72px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:28px; box-shadow:0 12px 34px rgba(2,6,23,0.12) }
/* gradient icon backgrounds for a premium feel */
.card-icon{ background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04)); }
.card-indigo .card-icon{ background: linear-gradient(135deg,#8b5cf6,#5b21b6) }
.card-amber .card-icon{ background: linear-gradient(135deg,#d97706,#b45309) }
.card-emerald .card-icon{ background: linear-gradient(135deg,#10b981,#065f46) }
.card-pink .card-icon{ background: linear-gradient(135deg,#db2777,#be185d) }

.card-cta .font-semibold{ font-size:1.02rem }

/* entry animation */
.card-anim{ opacity:0; transform:translateY(10px); animation: cardEnter .7s ease forwards }
.card-anim:nth-child(1){ animation-delay: 0.08s }
.card-anim:nth-child(2){ animation-delay: 0.16s }
.card-anim:nth-child(3){ animation-delay: 0.24s }
.card-anim:nth-child(4){ animation-delay: 0.32s }
@keyframes cardEnter{ to{ opacity:1; transform:translateY(0) } }

/* text badge backgrounds */
.text-badge{ display:inline-block; padding:6px 10px; border-radius:999px; color:white }
.badge-indigo{ background:linear-gradient(90deg,#4338ca,#3730a3) }
.badge-amber{ background:linear-gradient(90deg,#b45309,#92400e) }
.badge-emerald{ background:linear-gradient(90deg,#059669,#065f46) }
.badge-pink{ background:linear-gradient(90deg,#be185d,#9f1239) }

/* colored hover variants */

/* hover background subtle tint per variant (keeps full-card colored base) */
.card-indigo:hover{ background-image: linear-gradient(180deg, rgba(79,70,229,0.18), rgba(67,56,202,0.08)); }
.card-amber:hover{ background-image: linear-gradient(180deg, rgba(194,65,12,0.18), rgba(180,75,10,0.07)); }
.card-emerald:hover{ background-image: linear-gradient(180deg, rgba(4,120,87,0.18), rgba(16,185,129,0.08)); }
.card-pink:hover{ background-image: linear-gradient(180deg, rgba(190,24,93,0.18), rgba(236,72,153,0.07)); }

.card-indigo:hover .card-icon{ transform:scale(1.06) }
.card-amber:hover .card-icon{ transform:scale(1.06) }
.card-emerald:hover .card-icon{ transform:scale(1.06) }
.card-pink:hover .card-icon{ transform:scale(1.06) }

.card-cta{ transition: transform .18s ease, box-shadow .18s ease, background .18s ease }
.card-icon{ transition: transform .22s cubic-bezier(.2,.9,.2,1) }

/* keyboard & focus styles for accessibility */
.card-cta:focus{ outline: none; box-shadow:0 12px 40px rgba(59,130,246,0.12), 0 4px 14px rgba(2,6,23,0.12); transform:translateY(-6px); }
.card-cta:focus .card-action{ transform:translateX(0); color:rgba(255,255,255,0.95) }

/* responsive tweaks */
@media (max-width: 640px){
  .card-icon{ width:60px; height:60px; font-size:22px }
  .card-cta{ padding:20px; min-height:120px }
  .card-action{ font-size:22px }
}

@media (min-width: 1024px){
  .card-cta{ min-height:150px }
}

/* chevron action style */
.card-action{ font-size:26px; color:rgba(15,23,42,0.36); font-weight:700; transform:translateX(2px); }
.card-cta:hover .card-action{ color:rgba(15,23,42,0.7); transform:translateX(0); }

/* Small-screen defensive rules: hide decorative hero/float elements to avoid overlap */
@media (max-width: 767px) {
  .page-hero { display: none !important; }
  .float-anim { display: none !important; }
  .hero-bg { filter: none; }
}

</style>
