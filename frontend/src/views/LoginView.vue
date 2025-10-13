<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-2xl">
      <div class="flex justify-center">
        <div class="h-20 w-20 rounded-full bg-orange-50 flex items-center justify-center">
          <i class="fas fa-user-circle text-5xl text-orange-600"></i>
        </div>
      </div>
      <transition name="fade" mode="out-in">
        <div key="login">
          <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p class="mt-2 text-center text-sm text-gray-500">Welcome back — please enter your credentials to continue.</p>
          </div>
          <form class="mt-8 space-y-6" @submit.prevent="login">
            <div class="space-y-4">
              <div class="relative">
                <label for="login-email-address" class="sr-only">Email address</label>
                <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="loginForm.email" id="login-email-address" name="email" type="email" autocomplete="email" required 
                       class="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md placeholder-gray-500 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" 
                       placeholder="Email address" />
              </div>
              <div class="relative">
                <label for="login-password" class="sr-only">Password</label>
                <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      <input v-model="loginForm.password" id="login-password" name="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required 
        class="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md placeholder-gray-500 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" 
                       placeholder="Password" />
              </div>
              <div class="flex items-center mt-2">
                <input id="show-password" type="checkbox" v-model="showPassword" class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                <label for="show-password" class="ml-2 text-sm text-gray-600">Show password</label>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" type="checkbox" class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                <label for="remember-me" class="ml-2 block text-sm text-gray-600">Remember me</label>
              </div>
              <div class="text-sm">
                <a href="#" class="font-medium text-orange-600 hover:text-orange-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <PrimaryButton type="submit" class="w-full py-3 primary-gradient focus-ring" aria-label="Sign in">
                <span class="inline-block mr-2">🔐</span>
                Sign in
              </PrimaryButton>
            </div>
          </form>
          <div v-if="error" class="mt-3 text-sm text-red-600 text-center font-bold">{{ error }}</div>
          <p class="mt-2 text-center text-sm text-gray-600">
            Don't have an account?&nbsp;
            <router-link to="/signup" class="font-medium text-orange-600 hover:text-orange-500 focus:outline-none">
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
const showPassword = ref(false);

// ✅ API URL is correct!
const API_URL = 'http://localhost:3000/api/login'; 

const login = async () => { 
  console.log('Login attempt:', loginForm.value.email);
  error.value = '';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginForm.value.email,
        password: loginForm.value.password,
      }),
    });

    // 🛑 Response parsing ko robust karte hain 🛑
    let data;
    try {
        data = await response.json();
    } catch (e) {
        console.error('Failed to parse JSON response:', e);
        // Agar response.json() fail ho, toh yeh server se HTML error page aane ki nishani hai (like a 500 error page from Node)
        error.value = 'Server Error: Invalid response from backend.';
        return; 
    }

    if (response.ok) {
      // Login successful.
      const user = data.user;
      const token = data.token;

      // Normalize role and email to avoid case-sensitivity issues
      const normalizedRole = user.role ? String(user.role).toLowerCase() : undefined;
      const normalizedEmail = user.email ? String(user.email).toLowerCase() : undefined;

      const authObj = {
        email: normalizedEmail,
        name: user.name,
        loggedAt: Date.now(),
        role: normalizedRole,
        id: user.id,
        token: token, // store token so API calls can use it
      };

  setAuth(authObj as any);
  // notify UI parts (sidebar/header) immediately so sidebar can open
  window.dispatchEvent(new Event('auth-action'));
      
  // Admin ya user ke hisaab se redirect karo
  // Redirect admins to /admin. Accept either role === 'admin' (case-insensitive) or the admin email.
  const isAdmin = (normalizedRole === 'admin') || (normalizedEmail === 'admin@devidhaam.org');
  const redirectPath = isAdmin ? '/admin' : '/dashboard';
      router.push(redirectPath);
      
      window.dispatchEvent(new Event('auth-action'));

    } else {
      // Login failed (e.g., Status 401, 400)
      error.value = data.message || `Login failed with status: ${response.status}.`;
    }

  } catch (err) {
    // Network/CORS error ya server down hone par
    console.error('Login Network Error:', err);
    error.value = 'Network error: Cannot connect to server (Is Node.js server running on port 3000?).';
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
/* Note: inputs use explicit padding classes (pl-10) so no global override is needed here. */

.primary-gradient {
  background: linear-gradient(90deg,#fb923c,#f97316);
}

.primary-gradient:hover {
  filter: brightness(0.95);
}

.focus-ring:focus {
  outline: 2px solid rgba(249,115,22,0.18);
  outline-offset: 2px;
}
</style>