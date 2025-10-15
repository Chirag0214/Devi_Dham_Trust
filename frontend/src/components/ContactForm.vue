<template>
    <form @submit.prevent="submitForm" class="p-6 bg-white shadow-lg rounded-lg">
        <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/></svg>
            </div>
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Send us a message</h2>
                <p class="text-sm text-gray-500">We'll respond as soon as possible. Required fields are marked with <span class="text-red-500">*</span>.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="name" class="sr-only">Name</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 1118.88 6.196 9 9 0 015.12 17.804z"/></svg>
                    </span>
                    <input type="text" id="name" v-model="formData.name" :aria-invalid="errors.name ? 'true' : 'false'" aria-required="true"
                        placeholder="Your full name*"
                        class="mt-1 block w-full pl-10 border-gray-200 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 bg-white" />
                </div>
                <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
            </div>

            <div>
                <label for="email" class="sr-only">Email</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H8m8-4H8m8 8H8M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </span>
                    <input type="email" id="email" v-model="formData.email" :aria-invalid="errors.email ? 'true' : 'false'" aria-required="true"
                        placeholder="you@example.com*"
                        class="mt-1 block w-full pl-10 border-gray-200 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 bg-white" />
                </div>
                <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
            </div>

            <div class="md:col-span-2">
                <label for="subject" class="sr-only">Subject</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </span>
                    <input type="text" id="subject" v-model="formData.subject" placeholder="Subject (optional)"
                        class="mt-1 block w-full pl-10 border-gray-200 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 bg-white" />
                </div>
            </div>

            <div class="md:col-span-2">
                <label for="message" class="sr-only">Message</label>
                <div class="relative">
                    <span class="absolute top-2 left-0 pl-3 flex items-start text-gray-400">
                        <svg class="w-5 h-5 mt-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                    </span>
                    <textarea id="message" v-model="formData.message" rows="5" :aria-invalid="errors.message ? 'true' : 'false'" aria-required="true"
                        placeholder="Write your message here...*"
                        class="mt-1 block w-full pl-10 pr-3 border-gray-200 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 bg-white"></textarea>
                </div>
                <div class="flex justify-between items-center mt-1">
                    <p v-if="errors.message" class="text-xs text-red-600">{{ errors.message }}</p>
                    <p class="text-xs text-gray-400 ml-auto">{{ messageLength }}/1000</p>
                </div>
            </div>
        </div>

        <div class="mt-4 flex items-center justify-between">
            <div class="text-sm text-gray-500">We respect your privacy. Your information will not be shared.</div>
            <div class="flex items-center gap-3">
                <button type="submit" :disabled="isLoading"
                    class="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition duration-150">
                    <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    {{ isLoading ? 'Submitting...' : 'Send Message' }}
                </button>

                <!-- Reset button removed per user request -->
            </div>
        </div>

        <div v-if="successMessage" class="mt-4 p-3 rounded bg-green-50 border border-green-100 text-green-700">{{ successMessage }}</div>
    </form>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

const formData = reactive({
    name: '',
    email: '',
    subject: '',
    message: ''
});

const errors = reactive({ name: '', email: '', message: '' });
const isLoading = ref(false);
const successMessage = ref('');

const messageLength = computed(() => formData.message ? formData.message.length : 0);

const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(email);
};

const validate = () => {
    errors.name = formData.name.trim() ? '' : 'Name is required.';
    errors.email = formData.email.trim() ? (validateEmail(formData.email) ? '' : 'Enter a valid email.') : 'Email is required.';
    errors.message = formData.message.trim() ? '' : 'Message is required.';

    return !errors.name && !errors.email && !errors.message;
};

const resetForm = () => {
    formData.name = '';
    formData.email = '';
    formData.subject = '';
    formData.message = '';
    errors.name = errors.email = errors.message = '';
    successMessage.value = '';
};

const submitForm = async () => {
    successMessage.value = '';
    if (!validate()) return;

    isLoading.value = true;
    try {
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData })
        });

        if (response.ok) {
            successMessage.value = 'Thank you! Your message has been sent.';
            resetForm();
        } else {
            const data = await response.json().catch(() => ({ message: 'Server error' }));
            successMessage.value = `Submission failed: ${data.message}`;
        }
    } catch (err) {
        console.error(err);
        successMessage.value = 'Network error. Please try again later.';
    } finally {
        isLoading.value = false;
    }
};
</script>