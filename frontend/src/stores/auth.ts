import { ref, watch } from 'vue';

// CRITICAL FIX: Added 'token?: string' to the Auth type.
// The component needs to read the token from this object.
type Auth = { name: string; email?: string; loggedAt?: number; role?: string; token?: string } | null;

const auth = ref<Auth>(null);

// Initialize from localStorage
try {
  const raw = localStorage.getItem('auth');
  auth.value = raw ? JSON.parse(raw) : null;
} catch (e) {
  // If parsing fails, reset auth state
  console.error("Error reading auth from localStorage:", e);
  auth.value = null;
}

// Keep localStorage in sync
watch(auth, (v) => {
  if (v) {
    localStorage.setItem('auth', JSON.stringify(v));
  } else {
    localStorage.removeItem('auth');
  }
});

export function setAuth(value: Auth) {
  auth.value = value;
}

export function clearAuth() {
  auth.value = null;
}

// The 'auth' ref is exported as default.
export default auth;
