<template>
    <form @submit.prevent="submitForm" class="p-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h2>
        
        <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" v-model="formData.name" required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2">
        </div>

        <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" v-model="formData.email" required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2">
        </div>

        <div class="mb-4">
            <label for="subject" class="block text-sm font-medium text-gray-700">Subject (Optional)</label>
            <input type="text" id="subject" v-model="formData.subject"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2">
        </div>

        <div class="mb-6">
            <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
            <textarea id="message" v-model="formData.message" rows="4" required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2"></textarea>
        </div>

    <button type="submit" :disabled="isLoading"
        class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition duration-150">
            {{ isLoading ? 'Submitting...' : 'Submit Message' }}
        </button>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const formData = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
});

const isLoading = ref(false);

const submitForm = async () => {
    if (!formData.value.name || !formData.value.email || !formData.value.message) {
        alert('Please fill out all required fields (Name, Email, Message).');
        return;
    }
    
    isLoading.value = true; 

    try {
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData.value),
        });

        if (response.ok) {
            alert('Thank you for contacting us! We will get back to you soon.');
            // Form ko submit hone ke baad reset karein
            formData.value = { name: '', email: '', subject: '', message: '' };
        } else {
            const errorData = await response.json();
            alert(`Submission failed: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Network or server error:', error);
        alert('An unexpected error occurred. Please check your network.');
    } finally {
        isLoading.value = false;
    }
};
</script>