<template>
  <div class="page-section bg-gray-50 flex items-center justify-center min-h-[80vh]">
    <div class="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-2xl text-center">
      
      <div v-if="isLoading">
        <svg class="animate-spin h-10 w-10 text-brand-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mt-4">Verifying Payment Status...</h2>
        <p class="text-gray-600 mt-2">Please do not close this window.</p>
        <p class="text-sm text-gray-500 mt-4">Order ID: {{ orderId || '...' }}</p>
      </div>

      <div v-else-if="paymentStatus === 'PAID'">
        <svg class="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-3xl font-bold text-green-700 mt-4">Donation Successful!</h2>
        <p class="text-lg text-gray-700 mt-2">Thank you for your generous contribution.</p>
        <p class="text-md text-gray-500 mt-4">Your Payment ID: {{ cfOrderId }}</p>
        <p class="text-md text-gray-500">Receipt will be emailed to you shortly for 80G exemption.</p>

        <a href="/" class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
          Go to Homepage
        </a>
      </div>

      <div v-else>
        <svg class="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-3xl font-bold text-red-700 mt-4">Payment Failed / Pending</h2>
        <p class="text-lg text-gray-700 mt-2">{{ verificationMessage || 'We could not confirm your payment status.' }}</p>
        
        <p v-if="orderId" class="text-md text-gray-500 mt-4">Order ID: {{ orderId }}</p>
        <p class="text-md text-gray-500">Please try donating again or use UPI/Bank Transfer.</p>
        
        <a href="/donate" class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
          Try Again
        </a>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // Assuming you use Vue Router

const route = useRoute();

const isLoading = ref(true);
const paymentStatus = ref<'PAID' | 'FAILED' | 'PENDING' | null>(null);
const verificationMessage = ref<string | null>(null);
const orderId = ref<string | null>(null);
const cfOrderId = ref<string | null>(null);

// Cashfree removed in rollback: show a friendly message instead of remote verification
const verifyPayment = async (id: string) => {
  // Without a payment gateway, we cannot verify remote transaction status here.
  // Show a neutral message instructing the donor to check their email or contact support.
  paymentStatus.value = 'PENDING';
  verificationMessage.value = 'Payment gateway integration has been removed. If you completed a payment, please contact receipts@devidhaamtrust.org with your transaction details.';
  isLoading.value = false;
};

onMounted(() => {
  // 1. URL se order_id nikalna
  // Cashfree return URL structure: .../payment/success?order_id={order_id}&order_token={order_token}
  
  const id = route.query.order_id as string; 
  
  if (id) {
    orderId.value = id;
    // 2. Verification function call karna
    verifyPayment(id);
  } else {
    // Agar order_id URL mein nahi mila to seedhe fail dikhana
    paymentStatus.value = 'FAILED';
    verificationMessage.value = 'Invalid payment URL. Order ID is missing.';
    isLoading.value = false;
  }
});
</script>

<style scoped>
.page-section {
  padding-top: 5rem;
  padding-bottom: 5rem;
}
</style>