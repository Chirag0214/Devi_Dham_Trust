<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-indigo-700">Contact Form Submissions</h1>
    
    <div v-if="isLoading" class="text-center text-xl text-gray-500">Loading submissions...</div>
    <div v-else-if="submissions.length === 0" class="text-center text-xl text-gray-500 p-8 border rounded-lg">
      No contact submissions found in the database.
    </div>

    <div v-else class="overflow-x-auto shadow-lg rounded-lg">
      <table class="min-w-full bg-white border border-gray-200">
        <thead class="bg-indigo-600 text-white">
          <tr>
            <th class="py-3 px-4 text-left">S.No.</th> 
            <th class="py-3 px-4 text-left">Name</th>
            <th class="py-3 px-4 text-left">Email</th>
            <th class="py-3 px-4 text-left">Subject</th>
            <th class="py-3 px-4 text-left">Message</th>
            <th class="py-3 px-4 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sub, index) in submissions" :key="sub.id" class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">{{ index + 1 }}</td> <td class="py-3 px-4 font-medium">{{ sub.name }}</td>
            <td class="py-3 px-4 text-sm">{{ sub.email }}</td>
            <td class="py-3 px-4 text-sm">{{ sub.subject || 'N/A' }}</td>
            <td class="py-3 px-4 text-sm max-w-xs truncate" :title="sub.message">{{ sub.message }}</td>
            <td class="py-3 px-4 text-xs text-gray-500">{{ formatDate(sub.submission_date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const submissions = ref<any[]>([]);
const isLoading = ref(false);

const fetchSubmissions = async () => {
    isLoading.value = true;
    try {
        const response = await fetch('http://localhost:3000/api/admin/contacts');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch submissions: ${response.status}`);
        }
        
        const data = await response.json();
        submissions.value = data; // Data reverse order mein aata hai (3, 2, 1)

    } catch (error) {
        console.error("Error fetching contact submissions:", error);
    } finally {
        isLoading.value = false;
    }
};

// ✅ Naya Sorting Function: Data ko ID ke hisaab se sidha (1, 2, 3...) order mein karega
const sortSubmissions = () => {
  submissions.value.sort((a, b) => a.id - b.id);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

onMounted(async () => {
  await fetchSubmissions(); // Data lao
  sortSubmissions();      // Data ko sidha karo (1, 2, 3...)
});
</script>