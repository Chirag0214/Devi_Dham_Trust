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
  // Normalize role to lowercase string when storing so checks are consistent across app
  if (value && (value as any).role) {
    try {
      (value as any).role = String((value as any).role).toLowerCase();
    } catch (e) {
      // ignore normalization errors
    }
  }

  auth.value = value;

  // Ensure the logged in user appears in the local 'users' list so
  // admin "New Members" view can show recent signups.
  try {
    if (value && (value as any).email) {
      const userObj = value as any;
      // don't add admin user to users list
      if (userObj.role && userObj.role === 'admin') return;

      const rawUsers = JSON.parse(localStorage.getItem('users') || '[]') as any[];
      const idx = rawUsers.findIndex(u => (u.email && userObj.email && u.email.toLowerCase() === userObj.email.toLowerCase()) || (u.id && userObj.id && String(u.id) === String(userObj.id)));
      if (idx === -1) {
        // create a minimal user record
        const now = Date.now();
        const newUser = {
          id: userObj.id || undefined,
          name: userObj.name || userObj.email || '',
          email: userObj.email,
          createdAt: userObj.createdAt || now,
          membershipRequested: true,
        };
        rawUsers.unshift(newUser); // add to front so it's recent
      } else {
        // update existing user record but preserve createdAt if present
        const existing = rawUsers[idx];
        rawUsers[idx] = {
          ...existing,
          name: userObj.name || existing.name,
          email: userObj.email || existing.email,
          id: existing.id || userObj.id,
          // preserve existing createdAt if present
          createdAt: existing.createdAt || userObj.createdAt || Date.now(),
          membershipRequested: existing.membershipRequested !== false,
        };
      }
      localStorage.setItem('users', JSON.stringify(rawUsers));
    }
  } catch (e) {
    console.error('setAuth: failed to sync user into local users list', e);
  }
}

export function clearAuth() {
  auth.value = null;
}

// The 'auth' ref is exported as default.
export default auth;
