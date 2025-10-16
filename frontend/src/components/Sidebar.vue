<template>
  <aside v-if="isAdmin"
    :class="[collapsed ? 'w-16' : 'w-64', 'bg-[#2f4552] text-white flex flex-col transition-all duration-200 overflow-hidden hidden md:flex']"
    class="min-w-0 md:relative md:static">
    <div class="px-4 py-6 border-b border-black/10">
      <router-link :to="'/profile'" class="flex items-center gap-3 no-underline">
        <div v-show="!collapsed" class="text-sm font-semibold">Profile</div>
      </router-link>

    </div>

  <nav class="flex-1 overflow-auto py-4 min-w-0">
      <!-- make ul fill nav height and distribute items according to sidebar height -->
      <ul class="flex flex-col justify-between h-full px-2">
        <!-- Admin menu (unchanged) -->
        <template v-if="isAdmin">
          <li>
            <router-link :to="'/admin/new-members'" :class="navClass('/admin/new-members')">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <!-- user-plus -->
                  <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M19 8v6M22 11h-6" />
                  </svg>
                  <span v-show="!collapsed">New Members</span>
                </div>
              </div>
            </router-link>
          </li>
          <!-- keep all existing admin links by reusing the original blocks -->
          <li>
            <router-link :to="'/admin/active-members'" :class="navClass('/admin/active-members')">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 00-3-3.87" />
                    <path d="M7 21v-2a4 4 0 013-3.87" />
                    <path d="M12 7a4 4 0 110-8 4 4 0 010 8z" />
                  </svg>
                  <span v-show="!collapsed">Active Members</span>
                </div>
              </div>
            </router-link>
          </li>
          <li>
            <router-link :to="'/admin/submissions'" :class="navClass('/admin/submissions')">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <!-- reply / mail icon -->
                  <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 10v6a2 2 0 002 2h12a2 2 0 002-2v-6" />
                    <path d="M21 7l-9 6L3 7" />
                  </svg>
                  <span v-show="!collapsed">Reply</span>
                </div>
              </div>
            </router-link>
          </li>
          <li>
            <router-link :to="'/admin/add-project'" :class="navClass('/admin/add-project')">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 11V6a2 2 0 012-2h2a2 2 0 012 2v5" />
                    <path d="M21 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2" />
                    <path d="M12 17v-6" />
                    <path d="M9 14h6" />
                  </svg>
                  <span v-show="!collapsed">Add Work/Project</span>
                </div>
              </div>
            </router-link>
          </li>
          <li>
            <router-link :to="'/admin/manage-projects'" :class="navClass('/admin/manage-projects')">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.59 13.41L12 5l-8.59 8.41" />
                    <path d="M12 3v12" />
                    <path d="M6 21h12" />
                  </svg>
                  <span v-show="!collapsed">Manage Work/Project</span>
                </div>
              </div>
            </router-link>
          </li>
          <li>
            <router-link :to="'/admin/all-users'" :class="navClass('/admin/all-users')">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 3h18v18H3z" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                  <span v-show="!collapsed">All Users Data</span>
                </div>
              </div>
            </router-link>
          </li>
          <li>
            <router-link :to="'/admin/blocked-users'" :class="navClass('/admin/blocked-users')">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M4.2 4.2l15.6 15.6" />
                  </svg>
                  <span v-show="!collapsed">Blocked Users</span>
                </div>
              </div>
            </router-link>
          </li>
          <li>
            <router-link :to="'/admin/donations'" :class="navClass('/admin/donations')">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <path d="M7 9h.01M17 15h.01" />
                    <path d="M21 12H3" />
                  </svg>
                  <span v-show="!collapsed">Total Donation</span>
                </div>
              </div>
            </router-link>
          </li>
          <li>
            <router-link :to="'/admin/add-gallery'" :class="navClass('/admin/add-gallery')">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="14" rx="2" />
                    <path d="M8 21v-3" />
                    <path d="M16 21v-3" />
                    <path d="M12 8v8" />
                  </svg>
                  <span v-show="!collapsed">Add Gallery</span>
                </div>
              </div>
            </router-link>
          </li>

          <li>
            <router-link :to="'/admin/manage-gallery'" :class="navClass('/admin/manage-gallery')">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 7h18v10H3z" />
                    <path d="M7 7v10" />
                    <path d="M3 11h18" />
                  </svg>
                  <span v-show="!collapsed">Manage Gallery</span>
                </div>
              </div>
            </router-link>
          </li>
        </template>

        <!-- Non-admin (regular user) menu -->
        <template v-else>
          <li>
            <router-link :to="'/profile'" :class="navClass('/profile')">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span v-show="!collapsed">Profile</span>
              </div>
            </router-link>
          </li>
          <li>
            <router-link :to="'/certifications'" :class="navClass('/certifications')">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M8 9h8M8 13h8" />
                </svg>
                <span v-show="!collapsed">Certificates</span>
              </div>
            </router-link>
          </li>
          <li>
            <router-link :to="'/donate'" :class="navClass('/donate')">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10V7a2 2 0 00-2-2h-3" />
                  <path d="M3 14v3a2 2 0 002 2h3" />
                  <path d="M7 10l5 5 5-5" />
                </svg>
                <span v-show="!collapsed">Donate</span>
              </div>
            </router-link>
          </li>
          <li>
            <router-link :to="'/gallery'" :class="navClass('/gallery')">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="14" rx="2" />
                  <path d="M8 21v-3" />
                </svg>
                <span v-show="!collapsed">Gallery</span>
              </div>
            </router-link>
          </li>
          <li>
            <router-link :to="'/contact'" :class="navClass('/contact')">
              <div class="flex items-center gap-3">
                <!-- reply / mail icon -->
                <svg class="w-5 h-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 10v6a2 2 0 002 2h12a2 2 0 002-2v-6" />
                  <path d="M21 7l-9 6L3 7" />
                </svg>
                <span v-show="!collapsed">Reply</span>
              </div>
            </router-link>
          </li>
        </template>
      </ul>
    </nav>
  <div class="p-3 border-t border-black/10 flex items-center justify-center">
      <button @click="collapsed = !collapsed"
        class="w-10 h-10 bg-[#2b3940] rounded flex items-center justify-center text-white">
        <svg v-if="!collapsed" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted, watch, computed } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
  user: { type: Object as PropType<any>, default: null },
  isAdmin: { type: Boolean, default: false },
});

const route = useRoute();

// collapsed state for sidebar (exported so parent could toggle if needed in future)
const collapsed = ref(false);

// determine admin status reliably from prop or user object
const isAdmin = computed(() => {
  if (props.isAdmin) return true;
  const u = props.user as any;
  if (!u) return false;
  const role = u.role ? String(u.role).toLowerCase() : undefined;
  const email = u.email ? String(u.email).toLowerCase() : undefined;
  return role === 'admin' || email === 'admin@devidhaam.org';
});

// open sidebar automatically when auth-action is dispatched (login/signup)
function openSidebarOnAuth() {
  // open (set collapsed=false) for a short time so user sees menu
  collapsed.value = false;
}

onMounted(() => {
  window.addEventListener('auth-action', openSidebarOnAuth);
});

// cleanup if component unmounts
// (using a simple event removal via watch of route change isn't necessary but safe)
onMounted(() => {
  // no-op; kept for possible future cleanup
});

function navClass(path: string) {
  const base = 'block px-3 py-2 rounded text-sm hover:bg-white/5 cursor-pointer';
  const normalize = (p: string) => p.replace(/\/+$|^\s+/g, '') || '/';
  if (normalize(route.path).startsWith(normalize(path))) {
    return base + ' bg-emerald-600/90';
  }
  return base;
}
</script>

<style scoped>
/* ... rest of the styles (no changes needed) ... */
/* Removed animated underline for sidebar links (user requested).
     Sidebar will still highlight active items with background color only. */
</style>