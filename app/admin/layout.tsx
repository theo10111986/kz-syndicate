// app/admin/layout.tsx
/* eslint-disable */
import Link from "next/link";

export const metadata = {
  title: "Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body style={{ background: "#000" }}>
        <style>{`
          .kz-shell { min-height:100vh; padding:2rem 1rem 4rem; }
          .kz-top { display:flex; align-items:center; justify-content:center; gap:.75rem; margin-bottom:1.5rem; flex-wrap:wrap; }
          .kz-tab { padding:.5rem .9rem; border:2px solid #0ff; border-radius:999px; color:#0ff; text-shadow:0 0 6px #0ff; }
          .kz-title { color:#0ff; text-align:center; font-size:2rem; margin:.25rem 0 1rem; text-shadow:0 0 10px #0ff; }
          .kz-divider { height:2px; background:linear-gradient(90deg, transparent, #0ff, transparent); margin: 0 auto 1.25rem; width:min(92vw, 980px); box-shadow:0 0 12px #0ff; opacity:.7; }
          .kz-link { color:#0ff; text-decoration:underline; text-shadow:0 0 8px #0ff; }
        `}</style>

        <div className="kz-shell">
          <h1 className="kz-title">Admin</h1>
          <div className="kz-top">
            <Link className="kz-tab" href="/admin">Price Requests</Link>
            <Link className="kz-tab" href="/admin/orders">Orders</Link>
            <Link className="kz-tab" href="/admin/users">Users</Link>
          </div>
          <div className="kz-divider" />
          {children}
        </div>
      </body>
    </html>
  );
}
