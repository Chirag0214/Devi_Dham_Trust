(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@devidhaam.org', password: '123' }),
    });
    const text = await res.text();
    console.log('STATUS', res.status);
    console.log('HEADERS', Object.fromEntries(res.headers.entries()));
    console.log('BODY', text);
  } catch (err) {
    console.error('FETCH ERROR', err);
  }
})();
