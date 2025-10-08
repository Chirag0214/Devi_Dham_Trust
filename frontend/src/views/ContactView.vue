<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="container mx-auto px-4">
            <h1 class="text-4xl font-extrabold text-center mb-10 text-indigo-800">Contact Us</h1>
            
            <div class="flex flex-col lg:flex-row justify-center items-start lg:space-x-12">
                
                <div class="w-full lg:w-1/2 mb-8 lg:mb-0">
                    <ContactForm />
                </div>
                
                <div class="w-full lg:w-1/3 p-6 bg-white shadow-lg rounded-lg">
                    <h2 class="text-xl font-bold mb-4 text-indigo-700">Our Details</h2>
                    <p class="mb-2"><strong>Email:</strong> info@devidham.org</p>
                    <p class="mb-2"><strong>Phone:</strong> +91 98765 43210</p>
                    <p class="mb-2"><strong>Address:</strong> Devi Dham Trust HQ, Lucknow, India</p>
                    </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ContactForm from '@/components/ContactForm.vue';
// Agar aapka alias (@) kaam nahi karta, toh use karein:
// import ContactForm from '../components/ContactForm.vue';
</script>