'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    // Απλό validation
    if (!email) {
      setMsg('Παρακαλώ συμπλήρωσε το email σου.');
      return;
    }
    const valid = /\S+@\S+\.\S+/.test(email);
    if (!valid) {
      setMsg('Το email δεν είναι έγκυρο.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'SEND_FAILED');
      }

      setMsg('Ευχαριστούμε για την εγγραφή! ✅');
      setEmail('');
    } catch (err) {
      setMsg('Κάτι πήγε στραβά. Δοκίμασε ξανά αργότερα.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{
      backgroundColor: '#000',
      color: '#fff',
      padding: '50px 20px',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
        Stay in the loop
      </h2>
      <p style={{ marginBottom: '20px' }}>
        Get the latest drops and exclusives straight to your inbox.
      </p>
      <form
        onSubmit={onSubmit}
        style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}
      >
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          style={{
            padding: '10px',
            width: '250px',
            borderRadius: '5px',
            border: '1px solid #0ff',
            backgroundColor: '#000',
            color: '#fff',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0ff',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Sending…' : 'Join the Syndicate'}
        </button>
      </form>

      {msg && (
        <p style={{ marginTop: '12px', fontSize: '14px', color: '#0ff' }}>{msg}</p>
      )}
    </section>
  );
}
