
'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

type OrderItem = {
  name?: string;
  qty?: number;
  price?: number | string;
  [k: string]: any;
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // μην κάνεις fetch αν δεν είσαι logged in
    if (!session) return;

    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        if (!mounted) return;

        const list = Array.isArray(data?.orders) ? data.orders : [];
        setOrders(list);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]); // safe default
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [session]);

  // φόρτωση session (να μη σπάει στο πρώτο render)
  if (status === 'loading') {
    return (
      <div
        style={{
          backgroundColor: '#000',
          color: '#0ff',
          minHeight: '100vh',
          paddingTop: '80px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p style={{ textShadow: '0 0 8px #0ff4' }}>Φόρτωση...</p>
      </div>
    );
  }

  // αν δεν υπάρχει session, δείξε login
  if (!session) {
    return (
      <div
        style={{
          backgroundColor: '#000',
          color: '#0ff',
          minHeight: '100vh',
          paddingTop: '80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', textShadow: '0 0 15px #0ff' }}>
          Δεν είσαι συνδεδεμένος
        </h1>
        <button
          onClick={() => signIn()}
          style={{
            backgroundColor: '#0ff',
            color: '#000',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
        >
          Σύνδεση
        </button>
      </div>
    );
  }

  // πάντα ασφαλές array
  const list = Array.isArray(orders) ? orders : [];

  // βοηθός για ασφαλή items (μπορεί να είναι JSON string ή object)
  function normalizeItems(items: any): OrderItem[] {
    try {
      const raw = typeof items === 'string' ? JSON.parse(items) : items;
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }

  // βοηθός για νόμισμα
  function currencySymbol(cur?: string) {
    const c = (cur || 'EUR').toUpperCase();
    if (c === 'EUR') return '€';
    if (c === 'USD') return '$';
    if (c === 'GBP') return '£';
    return c;
  }

  return (
    <div
      style={{
        backgroundColor: '#000',
        color: '#0ff',
        minHeight: '100vh',
        paddingTop: '80px', // κάτω από το navbar
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textShadow: '0 0 15px #0ff, 0 0 30px #0ff',
          marginBottom: '2rem',
        }}
      >
        Ο Λογαριασμός μου
      </h1>

      {loading ? (
        <p style={{ textShadow: '0 0 8px #0ff4' }}>Φόρτωση...</p>
      ) : list.length === 0 ? (
        <p style={{ textShadow: '0 0 8px #0ff4' }}>Δεν υπάρχουν παραγγελίες.</p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '800px',
          }}
        >
          {list.map((o, idx) => {
            const total = o?.total ?? 0;
            const currency = o?.currency ?? 'EUR';
            const symbol = currencySymbol(currency);
            const created =
              o?.createdAt ? new Date(o.createdAt).toLocaleString() : '';
            const items = normalizeItems(o?.items);

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#000',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  boxShadow: '0 0 15px #0ff4',
                }}
              >
                <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                  Σύνολο: {total} {symbol}
                </p>
                <p style={{ margin: '0.5rem 0 1rem', color: '#0ff9' }}>
                  Ημερομηνία: {created || '—'}
                </p>

                {/* Λίστα προϊόντων παραγγελίας (ίδιο στυλ, ελαφρύ κείμενο) */}
                {items.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {items.map((it, i) => {
                      const name = it?.name ?? 'Προϊόν';
                      const qty = Number(it?.qty ?? 1);
                      const price = it?.price ?? 0;
                      const priceNum = typeof price === 'string' ? Number(price) : Number(price);
                      const lineTotal = isFinite(qty * priceNum) ? qty * priceNum : 0;

                      return (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#0ff', opacity: 0.9 }}>
                          <span style={{ color: '#0ff9' }}>
                            {name} × {qty}
                          </span>
                          <span>
                            {lineTotal} {symbol}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => signOut()}
        style={{
          marginTop: '2rem',
          backgroundColor: '#f00',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
        }}
      >
        Αποσύνδεση
      </button>
    </div>
  );
}
