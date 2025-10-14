<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gray-900 text-white py-20 md:py-32 flex items-center justify-center">
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('images/bg-image.avif'); filter: saturate(0.95) contrast(0.93);"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
      <div class="relative z-10 max-w-4xl container text-center">
        <div class="glass-card p-8 md:p-12">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-white">
            Empowering Futures Through Education and Values.
          </h1>
          <p class="text-lg md:text-xl text-brand-50/90 mb-6">
            Devi Dhaam Trust is dedicated to providing every child with quality education and strong moral values to help them build a better tomorrow.
          </p>
          <PrimaryButton to="/donate">
            Donate Now &nbsp; <HeartIcon class="inline-block h-5 w-5" />
          </PrimaryButton>
        </div>
      </div>
    </section>


 <!-- Our Mission Section -->
  <section class="py-16 bg-white">
  <div class="container">
    <SectionTitle subtitle="Our Resolve">Our Mission</SectionTitle>
    
    <div class="flex flex-col md:flex-row items-center gap-6 mt-12"> 
      
      <div class="md:w-3/5"> 
        <img src="/images/children lerning.jpg" alt="Children Learning Together" class="rounded-lg shadow-elevate w-full h-auto card-hover" />
      </div>
      
      <div class="text-lg text-gray-700 leading-relaxed"> 
        <p class="mb-4">
          Devi Dhaam Trust was founded on the principle that every child deserves <strong class="text-brand-600">quality education</strong> and <strong class="text-brand-600">unwavering support</strong>, irrespective of their background. Our core identity is built on the pillars of <strong class="text-brand-600">strong values</strong>, <strong class="text-brand-600">holistic education</strong>, and <strong class="text-brand-600">equal opportunity</strong> for all.
        </p>
        <p>
          We aim to go beyond academic learning by nurturing <strong class="text-brand-600">moral character</strong> and fostering <strong class="text-brand-600">self-reliance</strong>. Our goal is to empower children to become responsible citizens who make a positive impact on the world.
        </p>
        <router-link to="/about" class="inline-block mt-6 text-brand-500 hover:text-brand-700 font-semibold transition duration-150">
          Learn more about us &rarr;
        </router-link>
      </div>
    </div>
  </div>
</section>
 
    <!-- Our Impact Section -->
  <section class="py-16 bg-brand-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="The Result of Our Efforts">Our Impact</SectionTitle>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div class="transform hover:scale-105 transition-transform duration-300">
            <ImpactCard title="2,500+" description="Students Empowered" />
          </div>
          <div class="transform hover:scale-105 transition-transform duration-300">
            <ImpactCard title="15+" description="Running Projects" />
          </div>
          <div class="transform hover:scale-105 transition-transform duration-300">
            <ImpactCard title="8" description="Years of Service" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
   

<script setup lang="ts">
import PrimaryButton from '@/components/PrimaryButton.vue';
import SectionTitle from '@/components/SectionTitle.vue';
import ImpactCard from '@/components/ImpactCard.vue';

// FontAwesome icons will need a CDN or package installation
</script>