<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-2xl">
      <div class="flex justify-center">
        <i class="fas fa-user-circle text-5xl text-indigo-600"></i>
      </div>
  <transition name="fade" mode="out-in">
  <!-- Login Form -->
  <div key="login">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
  <form class="mt-8 space-y-6" @submit.prevent="login">
          <div class="space-y-4">
            <div class="relative">
              <label for="login-email-address" class="sr-only">Email address</label>
              <i class="fas fa-envelope absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input v-model="loginForm.email" id="login-email-address" name="email" type="email" autocomplete="email" required class="w-full pl-1 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email address" />
            </div>
            <div class="relative">
              <label for="login-password" class="sr-only">Password</label>
              <i class="fas fa-lock absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input v-model="loginForm.password" id="login-password" name="password" type="password" autocomplete="current-password" required class="w-full pl-1 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password" />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <PrimaryButton type="submit" class="w-full">
              Sign in
            </PrimaryButton>
          </div>
        </form>
  <div v-if="error" class="mt-3 text-sm text-red-600 text-center">{{ error }}</div>
        <p class="mt-2 text-center text-sm text-gray-600">
          Don't have an account?&nbsp;
          <router-link to="/signup" class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
            Sign up
          </router-link>
        </p>
      </div>
    </transition>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { setAuth } from '@/stores/auth';

const router = useRouter();
const loginForm = ref({ email: '', password: '' });
const error = ref('');

const login = () => {
  // Simple mock auth using localStorage (for demo only)
  console.log('Login attempt:', loginForm.value);
  error.value = '';
  const usersJson = localStorage.getItem('users') || '[]';
  const users = JSON.parse(usersJson);
  const user = users.find((u: any) => u.email === loginForm.value.email && u.password === loginForm.value.password);
  if (user) {
    const authObj = { email: user.email, name: user.name, loggedAt: Date.now(), role: user.role };
    setAuth(authObj as any);
    // navigate to dashboard or admin
    if (user.role === 'admin' || user.email === 'admin@devidhaam.org') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
      // notify header to show short welcome toast
      window.dispatchEvent(new Event('auth-action'));
  } else {
    error.value = 'Invalid email or password';
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
