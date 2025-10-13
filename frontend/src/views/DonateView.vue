<template>
  <div class="page-section bg-orange-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="callout bg-white rounded-lg p-8 md:p-12 shadow-xl">
        <SectionTitle subtitle="Your Support, A Bright Future">Donate Now</SectionTitle>

        <p class="text-center text-lg text-gray-700 mb-8 leading-relaxed">
          Your donation helps Devi Dhaam Trust fulfill its mission. Every contribution is important and directly reaches the children who need it most.
        </p>

        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-10 shadow">
          <h2 class="text-xl font-bold text-gray-900 mb-4">1. Share Your Details (For Receipt)</h2>
          <form @submit.prevent="submitDetails" class="space-y-4">
            <div>
              <label for="donor-name" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input v-model="donor.name" type="text" id="donor-name" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label for="donor-email" class="block text-sm font-medium text-gray-700">Email Address</label>
              <input v-model="donor.email" type="email" id="donor-email" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label for="donation-amount" class="block text-sm font-medium text-gray-700">Donation Amount (₹)</label>
              <input v-model.number="donor.amount" type="number" id="donation-amount" min="100" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <button type="submit" class="w-full px-4 py-2 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition">
              Next: Select Payment Method
            </button>
          </form>
        </div>


        <div class="space-y-8">
          
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <i class="fas fa-qrcode text-orange-600 mr-3"></i> 2. UPI / QR Code (Recommended)
            </h3>
            <p class="text-gray-700 mb-4">
              Donate instantly via UPI using your preferred app:
            </p>
            <div class="flex flex-col md:flex-row items-center gap-6">
              <div class="bg-white p-4 border border-gray-300 rounded-lg shadow-md">
                <img src="/images/devidhaam_upi_qr.png" alt="Devi Dhaam Trust UPI QR Code" class="w-48 h-48" /> 
                <p class="text-center text-sm text-gray-600 mt-2">Scan to Donate</p>
              </div>
                <p class="text-xl font-semibold text-gray-800">
                Or UPI ID: <span class="text-orange-600">devidhaamtrust@upi</span>
              </p>
            </div>
          </div>
          
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <i class="fas fa-university text-orange-600 mr-3"></i> 3. Bank Transfer
            </h3>
            <p class="text-gray-700 mb-4">
              You can directly transfer funds to our bank account:
            </p>
            <div class="bg-gray-100 p-6 rounded-lg border border-gray-200">
              <p class="mb-2 flex justify-between items-center"><strong class="text-gray-800">Bank Name:</strong> State Bank of India</p>
              <p class="mb-2 flex justify-between items-center">
                <strong class="text-gray-800">Account Name:</strong> Devi Dhamm Trust
              </p>
              <p class="mb-2 flex justify-between items-center">
                <strong class="text-gray-800">Account Number:</strong> 
                <span id="acc-num">12345678901</span>
                <button @click="copyToClipboard('12345678901', 'Account Number')" class="text-sm bg-orange-200 text-orange-800 rounded px-2 py-1 hover:bg-orange-300 transition">Copy</button>
              </p>
              <p class="mb-2 flex justify-between items-center">
                <strong class="text-gray-800">IFSC Code:</strong> 
                <span id="ifsc-code">SBIN0001234</span>
                <button @click="copyToClipboard('SBIN0001234', 'IFSC Code')" class="text-sm bg-orange-200 text-orange-800 rounded px-2 py-1 hover:bg-orange-300 transition">Copy</button>
              </p>
              <p><strong class="text-gray-800">Branch:</strong> Sector-1, Noida</p>
            </div>
          </div>
          
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <i class="fas fa-globe text-orange-600 mr-3"></i> 4. Online Payment Gateway
            </h3>
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p class="font-bold">Coming Soon!</p>
              <p>Our secure online payment gateway will be available soon. For immediate support, please use the UPI or Bank Transfer options above.</p>
            </div>
          </div>
          

          <div class="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mt-8" role="alert">
            <p class="font-bold">Tax Exemption (80G)</p>
            <p>
              Donations made to Devi Dhamm Trust are eligible for tax exemption under Section 80G. Please share your transaction details with us at 
              <strong class="text-green-800">receipts@devidhaamtrust.org</strong> to get your receipt.
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import SectionTitle from '@/components/SectionTitle.vue';
// FontAwesome icons will need a CDN or package installation
import { ref } from 'vue';

// Reactive state for donor form
const donor = reactive({
    name: '',
    email: '',
    amount: 500 // Default amount
});

// Error state for payment
const payError = ref('');

// Mock function for submitting form details
function submitDetails() {
    if (donor.name && donor.email && donor.amount >= 100) {
        alert(`Thank you ${donor.name}! Please proceed to step 2 or 3 to complete your donation of ₹${donor.amount}.`);
        // **********************************************
        // TODO: Iske baad user ko payment steps par le jaana hai.
        // Ya toh form ko hide karke payment method ko highlight karein,
        // ya is data ko backend API mein save karein.
        // **********************************************
    } else {
        alert('Please fill in all details correctly. Minimum donation is ₹100.');
    }
}

// Function to copy text to clipboard
function copyToClipboard(text: string, fieldName: string) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`${fieldName} has been copied to your clipboard: ${text}`);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

// Dummy pay function for test payment button
function pay() {
    alert(`Test payment of ₹${donor.amount} initiated! (No real transaction will occur.)`);
}
</script>

<style scoped>
/* Optional: Add custom styles here if needed */
.page-section {
    min-height: 80vh;
    padding-top: 5rem;
    padding-bottom: 5rem;
}
</style>