<template>
  <div class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle >Devi Dhamm Trust</SectionTitle>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        <div>
          <h3 class="text-3xl font-bold text-gray-900 mb-6">Connect With Us</h3>
          <p class="text-lg text-gray-700 leading-relaxed mb-6">
            If you have any questions, or want to know more about our work, please contact us. We are always ready to help you.
          </p>

          <div class="space-y-6">
            <div class="flex items-center">
              <i class="fas fa-map-marker-alt text-indigo-600 text-2xl mr-4"></i>
              <div>
                <h4 class="font-semibold text-xl text-gray-900">Address</h4>
                <p class="text-gray-700">123 Gyanoday Marg, Sector-5, Noida, Uttar Pradesh - 201301, India</p>
              </div>
            </div>

            <div class="flex items-center">
              <i class="fas fa-phone-alt text-indigo-600 text-2xl mr-4"></i>
              <div>
                <h4 class="font-semibold text-xl text-gray-900">Phone</h4>
                <p class="text-gray-700">+91 98765 43210</p>
              </div>
            </div>

            <div class="flex items-center">
              <i class="fas fa-envelope text-indigo-600 text-2xl mr-4"></i>
              <div>
                <h4 class="font-semibold text-xl text-gray-900">Email</h4>
                <p class="text-gray-700">contact@devidhaam.org</p>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <h4 class="font-semibold text-xl text-gray-900 mb-4">Follow Us</h4>
            <div class="flex space-x-4">
              <a href="#" class="text-indigo-600 hover:text-indigo-800 text-3xl transition duration-150"><i class="fab fa-facebook-square"></i></a>
              <a href="#" class="text-indigo-600 hover:text-indigo-800 text-3xl transition duration-150"><i class="fab fa-twitter-square"></i></a>
              <a href="#" class="text-indigo-600 hover:text-indigo-800 text-3xl transition duration-150"><i class="fab fa-instagram-square"></i></a>
              <a href="#" class="text-indigo-600 hover:text-indigo-800 text-3xl transition duration-150"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>

        <div class="bg-indigo-50 p-8 rounded-lg shadow-lg">
          <h3 class="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
          <form @submit.prevent="submitForm" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Your Name</label>
              <input type="text" id="name" v-model="form.name" required
                     class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="email" v-model="form.email" required
                     class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
              <input type="text" id="subject" v-model="form.subject" required
                     class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700">Your Message</label>
              <textarea id="message" v-model="form.message" rows="5" required
                        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
            </div>
            <PrimaryButton type="submit" class="w-full">
              Send Message
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SectionTitle from '@/components/SectionTitle.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const submitForm = () => {
  // You can send the form data to an API endpoint here (e.g., email service, backend)
  console.log('Form Submitted:', form.value);
  alert('Your message has been sent! We will contact you soon.');
  // Reset the form
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };
};

// FontAwesome icons will need a CDN or package installation
</script>