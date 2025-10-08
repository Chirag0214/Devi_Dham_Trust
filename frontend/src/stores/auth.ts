import { ref, watch } from 'vue';

type Auth = { name: string; email?: string; loggedAt?: number; role?: string } | null;

const auth = ref<Auth>(null);

// Initialize from localStorage
try {
  const raw = localStorage.getItem('auth');
  auth.value = raw ? JSON.parse(raw) : null;
} catch (e) {
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

export default auth;
