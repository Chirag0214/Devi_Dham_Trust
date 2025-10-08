<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-2xl">
      <div class="flex justify-center">
        <i class="fas fa-user-circle text-5xl text-indigo-600"></i>
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
            <input v-model="signupForm.name" id="signup-name" name="name" type="text" autocomplete="name" required class="w-full pl-1 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Full Name" />
          </div>
          <div class="relative">
            <label for="signup-email-address" class="sr-only">Email address</label>
            <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input v-model="signupForm.email" id="signup-email-address" name="email" type="email" autocomplete="email" required class="w-full pl-1 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email address" />
          </div>
          <div class="relative">
            <label for="signup-password" class="sr-only">Password</label>
            <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input v-model="signupForm.password" id="signup-password" name="password" type="password" autocomplete="new-password" required class="w-full pl-1 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password" />
          </div>
           <div class="relative">
            <label for="confirm-password" class="sr-only">Confirm Password</label>
            <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input v-model="signupForm.confirmPassword" id="confirm-password" name="confirm-password" type="password" autocomplete="new-password" required class="w-full pl-1 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Confirm Password" />
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
        <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PrimaryButton from '@/components/PrimaryButton.vue';

const router = useRouter();
const signupForm = ref({ name: '', email: '', password: '', confirmPassword: '' });
const error = ref('');
const success = ref('');

const signup = () => {
  error.value = '';
  success.value = '';
  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    error.value = 'Passwords do not match!';
    return;
  }

  const usersJson = localStorage.getItem('users') || '[]';
  const users = JSON.parse(usersJson);
  const exists = users.some((u: any) => u.email === signupForm.value.email);
  if (exists) {
    error.value = 'A user with this email already exists';
    return;
  }

  const newUser = { name: signupForm.value.name, email: signupForm.value.email, password: signupForm.value.password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  success.value = 'Account created successfully. Redirecting to login...';
  setTimeout(() => {
    router.push('/login');
    window.dispatchEvent(new Event('auth-action'));
  }, 1000);
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
