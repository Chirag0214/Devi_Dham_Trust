<template>
  <div class="py-16 bg-indigo-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle >Our Work</SectionTitle>

      <div class="mt-12 space-y-16">
        <div class="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.01] transition duration-300">
          <div class="md:w-1/2">
            <img src="/images/children.jpg" alt="Education Project" class="w-full h-64 md:h-full object-cover" />
          </div>
          <div class="md:w-1/2 p-8">
            <h3 class="text-3xl font-bold text-indigo-700 mb-4">Ray of Education</h3>
            <p class="text-gray-700 text-lg mb-4 leading-relaxed">
              Through this flagship project, we offer **free, quality education** to underprivileged children. We cover school fees, books, and uniforms, ensuring that financial constraints do not hinder their learning. To date, we have supported over 1500+ students.
            </p>
            <ul class="list-disc list-inside text-gray-600 mb-4">
              <li>Computer Shiksha</li>
              <li>Extra Coaching Classes</li>
              <li>Educational Excursions</li>
            </ul>
            <a href="#" class="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition duration-150">
              Learn More <i class="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>

        <div class="flex flex-col md:flex-row-reverse items-center bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.01] transition duration-300">
          <div class="md:w-1/2">
            <img src="/images/healthcamp.jpg" alt="Health Camp" class="w-full h-64 md:h-full object-cover" />
          </div>
          <div class="md:w-1/2 p-8">
            <h3 class="text-3xl font-bold text-indigo-700 mb-4">Health Service Campaign</h3>
            <p class="text-gray-700 text-lg mb-4 leading-relaxed">
              Our trust organizes **free health camps** in remote and underserved areas, providing essential medical check-ups, distributing necessary medicines, and conducting health awareness programs to promote community well-being.
            </p>
            <ul class="list-disc list-inside text-gray-600 mb-4">
              <li>General Health Check-ups</li>
              <li>Eye Check-up Camps</li>
              <li>Awareness Programs on Hygiene</li>
            </ul>
            <a href="#" class="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition duration-150">
              Learn More <i class="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>

        
        <div class="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.01] transition duration-300">
          <div class="md:w-1/2">
            <img src="/images/plantation.avif" alt="Plantation Project" class="w-full h-64 md:h-full object-cover" />
          </div>
          <div class="md:w-1/2 p-8">
            <h3 class="text-3xl font-bold text-indigo-700 mb-4">Tree Plantation</h3>
            <p class="text-gray-700 text-lg mb-4 leading-relaxed">
              As part of our commitment to the environment, we conduct large-scale **tree plantation drives** in both urban and rural settings. Our goal is to combat climate change, improve air quality, and promote ecological sustainability.
            </p>
            <ul class="list-disc list-inside text-gray-600 mb-4">
              <li>Community Involvement</li>
              <li>Awareness Campaigns</li>
              <li>Collaboration with Local NGOs</li>
            </ul>
            <a href="#" class="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition duration-150">
              Learn More <i class="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>

        <div class="mt-20">
          <h3 class="text-3xl font-bold text-center text-gray-900 mb-8">Our Past Successes</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition duration-300">
              <img src="/images/plantation1.avif" alt="Tree Plantation" class="rounded-md mb-4 w-full object-cover h-48" />
              <h4 class="text-xl font-bold text-gray-900 mb-2">Environment Conservation Campaign</h4>
              <p class="text-gray-600 text-sm">
                Planted 5000+ trees and raised environmental awareness in the community.
              </p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition duration-300">
              <img src="/images/plantation1.avif" alt="Skill Development" class="rounded-md mb-4 w-full object-cover h-48" />
              <h4 class="text-xl font-bold text-gray-900 mb-2">Skill Development Program</h4>
              <p class="text-gray-600 text-sm">
                Trained 100+ youth in computer and vocational skills.
              </p>
            </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SectionTitle from '@/components/SectionTitle.vue';
</script>