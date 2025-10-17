<template>
  <footer class="bg-gray-900 text-white py-6 relative z-20">
    <div class="container grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
      <div class="min-w-0">
  <h3 class="text-lg sm:text-xl font-bold mb-4 text-brand-300">Devi Dhamm Trust</h3>
        <p class="text-gray-400 text-sm leading-relaxed">
          Empowering futures through education and values. We are committed to providing every child with the tools to build a better tomorrow.
        </p>
      </div>

      <div class="min-w-0">
  <h3 class="text-lg sm:text-xl font-bold mb-4 text-brand-300">Quick Links</h3>
        <ul class="space-y-2">
          <li><router-link to="/about" class="text-gray-400 hover:text-white transition duration-150">About Us</router-link></li>
          <li><router-link to="/projects" class="text-gray-400 hover:text-white transition duration-150">Our Work</router-link></li>
          <li><router-link to="/donate" class="text-gray-400 hover:text-white transition duration-150">Donate</router-link></li>
          <li><router-link to="/contact" class="text-gray-400 hover:text-white transition duration-150">Contact Us</router-link></li>
        </ul>
      </div>

      <div class="min-w-0">
  <h3 class="text-lg sm:text-xl font-bold mb-4 text-brand-300">Contact Us</h3>
        <p class="text-gray-400 text-sm mb-2 break-words">
          Email: contact@devidhaam.org <br>
          Phone: +91 98765 43210 <br>
          Address: 123 Gyanoday Marg, Noida, India
        </p>
        <div class="flex justify-center md:justify-start space-x-4 mt-4 text-lg">
          <!-- Facebook -->
          <a href="#" aria-label="Facebook" class="text-gray-400 hover:text-white">
            <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.06 5.66 21.13 10.44 21.98v-7.02H8.08v-2.89h2.36V9.1c0-2.33 1.39-3.62 3.52-3.62 1.02 0 2.09.18 2.09.18v2.3h-1.17c-1.15 0-1.51.71-1.51 1.43v1.74h2.57l-.41 2.89h-2.16V22C18.34 21.13 22 17.06 22 12.07z" />
            </svg>
          </a>

          <!-- X / Twitter -->
          <a href="#" aria-label="Twitter" class="text-gray-400 hover:text-white">
            <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.2 4.2 0 0 0 1.84-2.32 8.4 8.4 0 0 1-2.66 1.02 4.18 4.18 0 0 0-7.13 3.81A11.86 11.86 0 0 1 3.15 4.6a4.18 4.18 0 0 0 1.29 5.58c-.66-.02-1.28-.2-1.82-.5v.05c0 2.02 1.44 3.7 3.35 4.08-.35.1-.72.14-1.1.14-.27 0-.53-.03-.78-.07.53 1.64 2.07 2.84 3.9 2.87A8.39 8.39 0 0 1 2 19.54a11.82 11.82 0 0 0 6.41 1.88c7.69 0 11.9-6.37 11.9-11.9v-.54A8.5 8.5 0 0 0 22.46 6z" />
            </svg>
          </a>

          <!-- Instagram -->
          <a href="#" aria-label="Instagram" class="text-gray-400 hover:text-white">
            <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" ry="5" stroke-width="1.5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke-width="1.5" fill="currentColor" />
              <circle cx="18.5" cy="5.5" r="1.2" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-800 mt-6 pt-4 text-center text-gray-500 text-sm">
      &copy; {{ currentYear }} Devi Dhamm Trust. All rights reserved.
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
// Social icons use generic globe placeholders (replace with brand SVGs if desired)
</script>