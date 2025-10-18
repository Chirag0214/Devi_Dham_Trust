<script setup lang="ts">
import { reactive, ref } from 'vue'; // ref ko upar import kiya
import SectionTitle from '@/components/SectionTitle.vue';
import { QrCodeIcon, BuildingLibraryIcon, GlobeAltIcon } from '@heroicons/vue/24/solid';

// Reactive state for donor form
const donor = reactive({
    name: '',
    email: '',
    pan: '',
    mobile: '',
    amount: 500 // Default amount
});

// CHANGES START HERE ------------------------------------------
// Error and Loading state for Cashfree Payment
const payError = ref<string | null>(null);
const isLoading = ref(false);

// Function to handle payment initiation via backend API
async function handlePayment() {
    payError.value = null; // Clear previous errors
    
    // Client-side validation
    if (!donor.name || !donor.email || !donor.pan || !donor.mobile || donor.amount < 100) {
        payError.value = 'Please complete all donor details correctly. Minimum amount is ₹100.';
        return;
    }
    if (String(donor.mobile).length !== 10) {
        payError.value = 'Mobile number must be 10 digits.';
        return;
    }

    isLoading.value = true;

  try {
    // Backend API ko call karna (rollback: generic donate endpoint)
    const response = await fetch('/api/donate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: donor.amount,
        name: donor.name,
        email: donor.email,
        mobile: donor.mobile,
        pan: donor.pan
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Fallback: show a simple confirmation and clear form
      payError.value = null;
      alert(`Donation recorded (id: ${data.donation?.id || 'N/A'}). Please follow offline instructions.`);
      donor.amount = 500;
      donor.name = '';
      donor.email = '';
      donor.mobile = '';
      donor.pan = '';
    } else {
      payError.value = data.message || 'Donation failed due to an unknown error. Please try again.';
    }

  } catch (error) {
    console.error('Frontend Payment Error:', error);
    payError.value = 'Network error: Could not connect to the payment server.';
  } finally {
    isLoading.value = false;
  }
}
// CHANGES END HERE --------------------------------------------

// Mock function for submitting form details (Replaced by handlePayment)
function submitDetails() {
    // Yeh function ab zaroori nahi hai kyunki payment button hi saara kaam karega.
    // Aap isse remove kar sakte hain ya sirf basic validation ke liye rakh sakte hain.
    handlePayment();
}


// Function to copy text to clipboard (remains the same)
function copyToClipboard(text: string, fieldName: string) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`${fieldName} has been copied to your clipboard: ${text}`);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

// Dummy pay function is REMOVED. Use handlePayment now.
// function pay() { ... }

// Ensure PAN input is uppercased and trimmed (remains the same)
function onPanInput(e: Event) {
    const target = e.target as HTMLInputElement;
    // PAN ko sirf uppercase letters aur numbers tak limit karein
    target.value = target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    donor.pan = target.value;
}
</script>

<template>
  <div class="page-section bg-brand-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="callout bg-white rounded-lg p-8 md:p-12 shadow-xl">
        <SectionTitle subtitle="Your Support, A Bright Future">Donate Now</SectionTitle>

        <p class="text-center text-lg text-gray-700 mb-8 leading-relaxed">
          Your donation helps Devi Dhaam Trust fulfill its mission. Every contribution is important and directly reaches the children who need it most.
        </p>

        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-10 shadow">
          <h2 class="text-xl font-bold text-gray-900 mb-4">1. Share Your Details & Pay Online</h2>
          
          <div v-if="payError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <p class="font-bold">Payment Error</p>
            <p class="text-sm">{{ payError }}</p>
          </div>

          <form @submit.prevent="handlePayment" class="space-y-4">
            <div>
              <label for="donor-name" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input v-model="donor.name" type="text" id="donor-name" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="As on PAN / Receipt">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="donor-email" class="block text-sm font-medium text-gray-700">Email Address</label>
                <input v-model="donor.email" type="email" id="donor-email" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="you@example.com">
              </div>
              <div>
                <label for="donor-mobile" class="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input v-model="donor.mobile" type="tel" id="donor-mobile" required pattern="[0-9]{10}" maxlength="10" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="10-digit mobile">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="donor-pan" class="block text-sm font-medium text-gray-700">PAN Number</label>
                <input v-model="donor.pan" @input="onPanInput" type="text" id="donor-pan" required maxlength="10" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 uppercase" placeholder="ABCDE1234F">
                <p class="text-xs text-gray-500 mt-1">PAN will be saved/displayed in UPPERCASE. Required for 80G receipt.</p>
              </div>
              <div>
                <label for="donation-amount" class="block text-sm font-medium text-gray-700">Donation Amount (₹)</label>
                <input v-model.number="donor.amount" type="number" id="donation-amount" min="100" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Minimum ₹100">
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                :disabled="isLoading"
                class="w-full px-4 py-2 bg-brand-600 text-white font-medium rounded-md transition"
                :class="{'hover:bg-brand-700': !isLoading, 'opacity-50 cursor-not-allowed': isLoading}"
              >
                <span v-if="isLoading">Processing Payment...</span>
                <span v-else>Pay Online ₹{{ donor.amount || '0' }}</span>
              </button>
            </div>
          </form>
        </div>
        <div class="space-y-8">
          
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <QrCodeIcon class="inline-block h-5 w-5 text-brand-600 mr-3" /> 2. UPI / QR Code (Recommended)
            </h3>
            <p class="text-gray-700 mb-4">
              Donate instantly via UPI using your preferred app:
            </p>
            <div class="flex flex-col md:flex-row items-start gap-6 min-w-0">
              <div class="bg-white p-4 border border-gray-300 rounded-lg shadow-md flex-shrink-0 flex items-center justify-center">
                <img src="/images/devidhaam_upi_qr.png" alt="Devi Dhaam Trust UPI QR Code" class="max-w-[10rem] sm:max-w-[12rem] w-full h-auto object-contain" /> 
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xl font-semibold text-gray-800 break-words text-center md:text-left">
                  Or UPI ID: <span class="text-brand-600">devidhaamtrust@upi</span>
                </p>
                <p class="text-center text-sm text-gray-600 mt-2 md:text-left">Scan QR code above using your UPI app to donate instantly.</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <BuildingLibraryIcon class="inline-block h-5 w-5 text-brand-600 mr-3" /> 3. Bank Transfer
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
                <button @click="copyToClipboard('12345678901', 'Account Number')" class="text-sm bg-brand-100 text-brand-700 rounded px-2 py-1 hover:bg-brand-300 transition">Copy</button>
              </p>
              <p class="mb-2 flex justify-between items-center">
                <strong class="text-gray-800">IFSC Code:</strong> 
                <span id="ifsc-code">SBIN0001234</span>
                <button @click="copyToClipboard('SBIN0001234', 'IFSC Code')" class="text-sm bg-brand-100 text-brand-700 rounded px-2 py-1 hover:bg-brand-300 transition">Copy</button>
              </p>
              <p><strong class="text-gray-800">Branch:</strong> Sector-1, Noida</p>
            </div>
          </div>
          
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <GlobeAltIcon class="inline-block h-5 w-5 text-brand-600 mr-3" /> 4. Online Payment Gateway (Integrated Above)
            </h3>
            <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
              <p class="font-bold">Payment Gateway Active!</p>
              <p>The secure online payment gateway has been integrated into **Step 1** above. You can now use the "Share Your Details & Pay Online" form to make an instant donation.</p>
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

<style scoped>
/* Optional: Add custom styles here if needed */
.page-section {
    min-height: 80vh;
    padding-top: 5rem;
    padding-bottom: 5rem;
}
</style>