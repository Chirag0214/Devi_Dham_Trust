import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import auth from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue')
    },
    {
      path: '/donate',
      name: 'donate',
      component: () => import('../views/DonateView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    
    
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('../views/GalleryView.vue') // Lazy load your Gallery View
    },
    
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue') 
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminDashboardView.vue')
    },
    {
      path: '/admin/active-members',
      name: 'admin-active-members',
      component: () => import('@/views/AdminActiveMembersView.vue')
    },
    {
      path: '/certifications',
      name: 'certifications',
      component: () => import('../views/CertificateView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },

    // src/router/index.ts ke 'routes' array mein

{
    path: '/admin',
    name: 'admin-overview',
    component: () => import('@/views/AdminOverviewView.vue'), // Ya jo bhi aapka overview view hai
},
{
    path: '/admin/users', // Users ka path
    name: 'admin-users',
    component: () => import('@/views/AdminUsersView.vue'), // Yeh component file aapko banani padegi
},

{
  path: '/admin/new-members',
  name: 'admin-new-members',
  component: () => import('@/views/NewMemberView.vue'),
},

{
  path: '/admin/all-users',
  name: 'admin-all-users',
  component: () => import('@/views/AllUserView.vue'),
},

{
  path: '/admin/blocked-users',
  name: 'admin-blocked-users',
  component: () => import('@/views/BlockedUsersView.vue'),
},
{
  path: '/admin/all-receipts',
  name: 'admin-all-receipts',
  component: () => import('@/views/AllReceiptsView.vue'),
},

{
  path: '/admin/donations', // Donations ka path
  name: 'admin-donations',
  component: () => import('@/views/TotalDonationView.vue'),
},

   // src/router/index.ts ke 'routes' array mein

{
    path: '/admin/add-gallery', // Yehi woh URL hoga jahan admin jaayega
    name: 'admin-add-gallery',
    component: () => import('../views/AddGalleryView.vue'), // Naya view file import
    // Yahan par aapko admin authentication guard lagana chahiye future mein.
}, 
{
    path: '/admin/manage-gallery', // Naya path
    name: 'AdminManageGallery',
  component: () => import('../views/ManageGalleryView.vue'),
},
{
    path: '/admin/submissions', // Naya path
    name: 'AdminContactSubmissions',
    component: () => import('../views/AdminContactListView.vue'),
},
{
    path: '/admin/add-project', 
    name: 'AdminAddProject',
    component: () => import('../views/AdminAddProjectView.vue'),
},

{
    path: '/admin/manage-projects', 
    name: 'AdminManageProjects',
    component: () => import('../views/AdminManageProjectsView.vue'),
},

{
    // :id dynamic parameter hai
    path: '/admin/edit-project/:id', 
    name: 'AdminEditProject',
    component: () => import('../views/AdminEditProjectView.vue'),
},
   
  ],
  // Scroll to top on route change
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router

// Global guard: ensure admin users land on /admin and non-admins can't access /admin
router.beforeEach((to, from, next) => {
  const user = auth.value;
  // Normalize checks: role or email may be undefined, ensure lowercase comparison
  const role = user && (user as any).role ? String((user as any).role).toLowerCase() : undefined;
  const email = user && (user as any).email ? String((user as any).email).toLowerCase() : undefined;
  const isAdmin = !!(user && (role === 'admin' || email === 'admin@devidhaam.org'));

  // If admin is logged in but tries to visit /dashboard (or root after login), send to /admin
  if (isAdmin && to.path === '/dashboard') {
    return next('/admin');
  }

  // Prevent non-admin users from visiting /admin
  if (!isAdmin && to.path.startsWith('/admin')) {
    // If user not logged in, send to login; else send to /dashboard
    if (!user) return next('/login');
    return next('/dashboard');
  }

  next();
});