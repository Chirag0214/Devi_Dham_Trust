<template>
    <div class="min-h-screen py-12 bg-gradient-to-b from-white via-gray-50 to-gray-100">
        <div class="container mx-auto px-4">
            <!-- Hero -->
            <div class="text-center max-w-3xl mx-auto mb-10">
                <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-3">Contact Devi Dham Trust</h1>
                <p class="text-gray-600">We're here to help — reach out with questions, feedback, or to get involved.</p>
                <div class="mt-4">
                    <span class="inline-block px-4 py-2 rounded-full bg-brand-50 text-brand-700 font-semibold shadow animate-pulse">Trusted by thousands of devotees</span>
                </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-8 items-start">
                <!-- Form column -->
                <div class="w-full lg:w-2/3">
                    <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Send us a message</h2>
                        <ContactForm />
                    </div>
                </div>

                <!-- Info column -->
                <aside class="w-full lg:w-1/3 space-y-6">
                    <div class="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                        <h3 class="text-xl font-bold text-gray-800 mb-4">Contact details</h3>
                        <ul class="space-y-3 text-gray-700">
                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-blue-500 mr-3 shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <div>
                                    <div class="font-medium">Email</div>
                                    <div class="text-sm">info@devidham.org</div>
                                </div>
                            </li>

                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-green-500 mr-3 shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l.95 2.85a1 1 0 01-.217.96L8.6 9.6a11.05 11.05 0 005.8 5.8l2.21-1.34a1 1 0 01.96-.217l2.85.95A1 1 0 0121 18.72V22a2 2 0 01-2 2h-1C9.163 24 0 14.837 0 3V2a1 1 0 011-1h2z"></path></svg>
                                <div>
                                    <div class="font-medium">Phone</div>
                                    <div class="text-sm">+91 98765 43210</div>
                                </div>
                            </li>

                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-red-500 mr-3 shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1 1 0 01-1.414 0L6.343 15.243a8 8 0 1111.314 1.414z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <div>
                                    <div class="font-medium">Address</div>
                                    <div class="text-sm">Devi Dham Trust HQ, Lucknow, India</div>
                                </div>
                            </li>
                        </ul>

                        <div class="mt-6 border-t pt-4">
                            <div class="text-sm text-gray-600 mb-2">Follow us</div>
                            <div class="flex space-x-3">
                                <a href="#" class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition" title="Facebook">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.92.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0"></path></svg>
                                </a>
                                <a href="#" class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-400 hover:bg-blue-400 hover:text-white transition" title="Twitter">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.555-2.005.959-3.127 1.184A4.916 4.916 0 0016.616 3c-2.717 0-4.92 2.206-4.92 4.917 0 .386.044.762.127 1.124C7.728 8.82 4.1 6.884 1.671 3.149c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 01-2.229-.616c-.054 1.997 1.397 3.872 3.448 4.292a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.212c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"></path></svg>
                                </a>
                                <a href="#" class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-pink-100 text-pink-500 hover:bg-pink-500 hover:text-white transition" title="Instagram">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.398 3.635 1.365c-.967.967-1.235 2.14-1.293 3.417C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.058 1.277.326 2.45 1.293 3.417.967.967 2.14 1.235 3.417 1.293C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.277-.058 2.45-.326 3.417-1.293.967-.967 1.235-2.14 1.293-3.417.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.058-1.277-.326-2.45-1.293-3.417-.967-.967-2.14-1.235-3.417-1.293C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                        <h4 class="font-semibold text-gray-800 mb-3">Visit / Map</h4>
                        <div class="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">Map placeholder</div>
                        <p class="text-xs text-gray-500 mt-3">Pinpoint directions will be provided here.</p>
                        <div class="mt-4 text-center">
                            <span class="inline-block px-3 py-2 rounded bg-brand-50 text-brand-700 font-medium shadow">We welcome you to visit and experience peace.</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ContactForm from '@/components/ContactForm.vue';
// Agar aapka alias (@) kaam nahi karta, toh use karein:
// import ContactForm from '../components/ContactForm.vue';
</script>