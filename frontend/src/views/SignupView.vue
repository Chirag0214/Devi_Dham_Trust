<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-2xl">
      <div class="flex justify-center">
          <div class="h-20 w-20 rounded-full bg-orange-50 flex items-center justify-center">
          <i class="fas fa-user-circle text-5xl text-orange-600"></i>
        </div>
      </div>
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="signup">
        <div class="space-y-4">
           <div class="relative">
            <label for="signup-name" class="sr-only">Full Name</label>
            <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input v-model="signupForm.name" id="signup-name" name="name" type="text" autocomplete="name" required class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Full Name" />
          </div>
          <div class="relative">
            <label for="signup-email-address" class="sr-only">Email address</label>
            <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input v-model="signupForm.email" id="signup-email-address" name="email" type="email" autocomplete="email" required class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Email address" />
          </div>
          <div class="relative">
            <label for="signup-password" class="sr-only">Password</label>
            <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input v-model="signupForm.password" id="signup-password" name="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" required class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Password" />
          </div>
           <div class="relative">
            <label for="confirm-password" class="sr-only">Confirm Password</label>
            <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input v-model="signupForm.confirmPassword" id="confirm-password" name="confirm-password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" required class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Confirm Password" />
          </div>
          <div class="flex items-center mt-2">
            <input id="show-password-signup" type="checkbox" v-model="showPassword" class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
            <label for="show-password-signup" class="ml-2 text-sm text-gray-600">Show password</label>
          </div>
        </div>

        <div>
          <PrimaryButton type="submit" class="w-full">
            Sign up
          </PrimaryButton>
        </div>
      </form>
      <div class="mt-3 text-center">
        <div v-if="error" class="text-sm text-red-600">{{ error }}</div>
        <div v-if="success" class="text-sm text-green-600">{{ success }}</div>
      </div>
      <p class="mt-2 text-center text-sm text-gray-600">
        Already have an account?&nbsp;
        <router-link to="/login" class="font-medium text-orange-600 hover:text-orange-500 focus:outline-none">
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PrimaryButton from '@/components/PrimaryButton.vue'; // Assuming this component exists

const router = useRouter();
const signupForm = ref({ name: '', email: '', password: '', confirmPassword: '' });
const error = ref('');
const success = ref('');
const showPassword = ref(false);

// IMPORTANT: Backend API URL
const API_URL = 'http://localhost:3000/api/register';

const signup = async () => { // 👈 Ab async function use karenge
  error.value = '';
  success.value = '';

  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    error.value = 'Passwords do not match!';
    return;
  }

  try {
    // 🛑 OLD localStorage logic removed 🛑
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Zaroori: Server ko batana ki hum JSON bhej rahe hain
      },
      body: JSON.stringify({ // Data ko JSON string mein convert karke bhejna
        name: signupForm.value.name,
        email: signupForm.value.email,
        password: signupForm.value.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Status 201 Created aane par success
      success.value = data.message || 'Account created successfully. Redirecting to login...';
      
      // Also add the newly registered user into localStorage 'users' so admin New Members view
      // can show the recent signup immediately (without requiring login).
      try {
        const rawUsers = JSON.parse(localStorage.getItem('users') || '[]') as any[];
        const email = signupForm.value.email && signupForm.value.email.toLowerCase();
        const exists = rawUsers.findIndex(u => (u.email || '').toLowerCase() === email) !== -1;
        if (!exists) {
          const now = Date.now();
          rawUsers.unshift({
            id: data.user?.id || undefined,
            name: signupForm.value.name,
            email: signupForm.value.email,
            createdAt: now,
            membershipRequested: true,
          });
          localStorage.setItem('users', JSON.stringify(rawUsers));
          // notify other parts of app if they listen
          window.dispatchEvent(new Event('auth-action'));
        }
      } catch (e) {
        console.error('Failed to add new signup to local users list', e);
      }

      // Success hone par user ko login page par redirect karein
      setTimeout(() => {
        router.push('/login');
        window.dispatchEvent(new Event('auth-action'));
      }, 1000);

    } else {
      // Status 400, 409 (Duplicate email), ya 500 aane par error dikhaayen
      error.value = data.message || `Registration failed with status: ${response.status}`;
    }

  } catch (err) {
    console.error('Registration API Error:', err);
    error.value = 'Network error or server connection failed.';
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
