<template>
  <footer class="bg-gray-900 text-white py-6 relative z-20">
    <div class="container grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
      <div>
  <h3 class="text-xl font-bold mb-4 text-brand-300">Devi Dhamm Trust</h3>
        <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
          Empowering futures through education and values. We are committed to providing every child with the tools to build a better tomorrow.
        </p>
      </div>

      <div>
  <h3 class="text-xl font-bold mb-4 text-brand-300">Quick Links</h3>
        <ul class="space-y-2">
          <li><router-link to="/about" class="text-gray-400 hover:text-white transition duration-150">About Us</router-link></li>
          <li><router-link to="/projects" class="text-gray-400 hover:text-white transition duration-150">Our Work</router-link></li>
          <li><router-link to="/donate" class="text-gray-400 hover:text-white transition duration-150">Donate</router-link></li>
          <li><router-link to="/contact" class="text-gray-400 hover:text-white transition duration-150">Contact Us</router-link></li>
        </ul>
      </div>

      <div>
  <h3 class="text-xl font-bold mb-4 text-brand-300">Contact Us</h3>
        <p class="text-gray-400 text-sm mb-2">
          Email: contact@devidhaam.org <br>
          Phone: +91 98765 43210 <br>
          Address: 123 Gyanoday Marg, Noida, India
        </p>
        <div class="flex justify-center md:justify-start space-x-4 mt-4 text-lg">
          <a href="#" aria-label="Facebook" class="text-gray-400 hover:text-white"><GlobeAltIcon class="h-5 w-5" /></a>
          <a href="#" aria-label="Twitter" class="text-gray-400 hover:text-white"><GlobeAltIcon class="h-5 w-5" /></a>
          <a href="#" aria-label="Instagram" class="text-gray-400 hover:text-white"><GlobeAltIcon class="h-5 w-5" /></a>
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
import { GlobeAltIcon } from '@heroicons/vue/24/solid';

const currentYear = ref(new Date().getFullYear());
// Social icons use generic globe placeholders (replace with brand SVGs if desired)
</script>