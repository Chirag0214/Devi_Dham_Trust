<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import Sidebar from '@/components/Sidebar.vue';
import auth from '@/stores/auth';
import { computed } from 'vue';

const user = auth;
const isAdmin = computed(() => {
    return !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org'));
});

// NOTE: Replaced 'useAuth' with default export 'authRef' from store (keeps behavior unchanged).
import authRef from '@/stores/auth';

// --- State Variables ---
const submissions = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Using the imported store reference
const authStore = authRef;
const router = useRouter();

// API base URL (your Node.js backend)
const API_BASE_URL = 'http://localhost:3000/api';

// --- Function to fetch submissions ---
const fetchSubmissions = async () => {
    loading.value = true;
    error.value = null;

    // Token access करने के लिए authStore.value?.token का use किया।
    const token = authStore.value?.token;

    if (!token) {
        // If token is missing, show error
        error.value = 'Authentication token missing. Please log in again.';
        loading.value = false;
        // router.push('/login'); // uncomment to redirect to login page
        return;
    }

    try {
        // Step 1: Fetch API call
        const response = await fetch(`${API_BASE_URL}/admin/submissions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Step 2: Handle non-200 responses
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        // Step 3: Parse JSON data
        const data = await response.json();

        // Step 4: Access 'submissions' key from response
        if (data && data.submissions && Array.isArray(data.submissions)) {
            submissions.value = data.submissions;
        } else {
            // If unexpected format, set empty array and show error
            submissions.value = [];
            error.value = 'Received unexpected data format from server.';
        }


    } catch (err: any) {
        console.error('Error fetching contact submissions:', err);
        error.value = err.message || 'Error fetching submissions. Server might be down.';
        submissions.value = []; // Clear previous data on error
    } finally {
        loading.value = false;
    }
};

// NOTE: Reply now opens the user's mail client via mailto: (openMailClient below)

// Open default mail client using mailto: to allow admin to send an email directly
const openMailClient = (submission: any) => {
    const to = encodeURIComponent(submission.email || '');
    const subject = encodeURIComponent(`Re: ${submission.subject || 'Regarding your message'}`);
    const bodyGreeting = encodeURIComponent(`Hello ${submission.name || ''},\n\n`);
    const body = encodeURIComponent(`\n\n---\nOriginal message:\n${submission.message || ''}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${bodyGreeting}${body}`;
};

// Delete a contact submission (ask for confirmation first)
const deleteSubmission = async (id: number) => {
    if (!confirm('Are you sure you want to remove this submission? This action cannot be undone.')) return;

    const token = authStore.value?.token;
    if (!token) {
        alert('Authentication token missing. Please log in again.');
        return;
    }

    try {
        const resp = await fetch(`${API_BASE_URL}/admin/submissions/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({ message: 'Unknown server error' }));
            throw new Error(err.message || 'Failed to delete submission');
        }

        // Remove from local array
        submissions.value = submissions.value.filter(s => s.id !== id);
        alert('Submission removed successfully.');
    } catch (err: any) {
        console.error('Error deleting submission:', err);
        alert('Error deleting submission: ' + (err.message || 'Unknown'));
    }
};

// Note: Quick server-side reply removed; using mailto: to open admin's mail client for direct replies.

// --- Lifecycle Hook ---
onMounted(() => {
    fetchSubmissions();
});

// Helper function for date formatting
const formatDate = (dateString: string) => {
    try {
        // Assuming dateString is a valid format that Date can parse
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
        return dateString; // Parsing fail होने पर original return करें
    }
};

</script>

<template>
    <div class="min-h-screen flex bg-gray-50">
        <Sidebar :user="user" :is-admin="isAdmin" />
        <main class="p-6">
            <h1 class="text-3xl font-bold mb-6 text-purple-800">Contact Form Submissions</h1>

            <div v-if="loading" class="text-center py-10">
                <p class="text-lg text-gray-600">Loading submissions... (सबमिशन लोड हो रहे हैं...)</p>
                <!-- Simple Loading Spinner (Tailwind) -->
                <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mx-auto mt-4">
                </div>
            </div>

            <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p class="font-bold">Error:</p>
                <p>{{ error }}</p>
            </div>

            <div v-else class="bg-white shadow-xl rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-orange-600 text-white">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">S.No.</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Subject</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Message</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="submissions.length === 0">
                            <td colspan="7" class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                No contact submissions found in the database.
                            </td>
                        </tr>
                        <tr v-for="(submission, index) in submissions" :key="submission.id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ index + 1 }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ submission.name }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ submission.email }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                                {{ submission.subject }}
                            </td>
                            <!-- Message is truncated for brevity -->
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                                {{ submission.message.substring(0, 50) + (submission.message.length > 50 ? '...' : '')
                                }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ formatDate(submission.created_at || submission.date) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                                <button @click.prevent="openMailClient(submission)" class="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700">Reply</button>
                                <button @click.prevent="deleteSubmission(submission.id)" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Remove</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            

        </main>
    </div>
</template>

<!-- CRITICAL FIX: <style> tag top-level पर है -->
<style scoped>
.loader {
    border-top-color: #f97316;
    /* Tailwind orange-600 */
    -webkit-animation: spinner 1.5s linear infinite;
    animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
    0% {
        -webkit-transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
    }
}

@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
