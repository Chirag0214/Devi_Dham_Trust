import auth, { clearAuth } from '@/stores/auth';

// Simple fetch wrapper: intercept responses and if server indicates blocked account (403 with message),
// clear local auth and notify the user. This is a lightweight approach to inform already-logged-in users
// when their account is later blocked by an admin.

const origFetch = window.fetch.bind(window) as typeof fetch;
window.fetch = async (...args: Parameters<typeof fetch>) => {
  try {
  const res = await (origFetch as any)(...args);
    if (res.status === 403) {
      let text = '';
      try {
        const j = await res.clone().json();
        text = j && j.message ? j.message.toString().toLowerCase() : '';
      } catch (e) {
        try {
          text = (await res.clone().text()).toLowerCase();
        } catch (e) {
          text = '';
        }
      }
      if (text.includes('blocked')) {
        // Clear local auth and inform user
        try { clearAuth(); } catch (e) { /* ignore */ }
        try { alert('Your account has been blocked by the administrator. You will be logged out.'); } catch (e) { /* ignore */ }
        // Send user to home so they can't stay on protected pages
        try { window.location.href = '/'; } catch (e) { /* ignore */ }
      }
    }
    return res;
  } catch (err) {
    throw err;
  }
};

export default true;
