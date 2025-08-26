// app/account/requests/page.tsx
// @ts-nocheck
/* eslint-disable */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type SearchParams = { page?: string };

export default async function RequestsPage({ searchParams }: { searchParams?: SearchParams }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <main className="kz-wrap">
        <KZStyles />
        <h1 className="kz-title">Τα αιτήματά μου</h1>
        <div className="kz-card" style={{ maxWidth: 520, textAlign: "center" }}>
          Πρέπει να συνδεθείς για να δεις τα αιτήματά σου.
          <div style={{ marginTop: "1rem" }}>
            <Link href="/auth/login" className="kz-link">Μετάβαση σε σύνδεση →</Link>
          </div>
        </div>
      </main>
    );
  }

  // --- Pagination (γρήγορο) ---
  const page = Math.max(1, Number(searchParams?.page ?? 1));
  const PAGE_SIZE = 12;
  const take = PAGE_SIZE + 1;
  const skip = (page - 1) * PAGE_SIZE;

  // ✅ Ζητάμε και emailSent για το status
  let rows:
    { id: string; description: string | null; createdAt: Date; emailSent: boolean }[] = [];
  try {
    rows = await prisma.priceRequest.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: "desc" },
      select: { id: true, description: true, createdAt: true, emailSent: true },
      skip,
      take,
    });
  } catch {
    rows = [];
  }

  const hasNext = rows.length > PAGE_SIZE;
  const requests = hasNext ? rows.slice(0, PAGE_SIZE) : rows;

  return (
    <main className="kz-wrap">
      <KZStyles />
      <h1 className="kz-title">Τα αιτήματά μου</h1>

      <div className="kz-list">
        {requests.length === 0 && (
          <div className="kz-card" style={{ textAlign: "center" }}>
            Δεν έχεις κάνει κανένα αίτημα ακόμα.
          </div>
        )}

        {requests.map((r) => {
          const dateStr = new Date(r.createdAt).toLocaleString("el-GR");
          const text = r.description?.trim()
            ? r.description.trim()
            : "Αίτημα χωρίς περιγραφή.";

          const ok = !!r.emailSent;

          return (
            <div key={r.id} className="kz-card kz-row">
              <div className="kz-content">
                <div className="kz-topline">
                  <div className="kz-id">#{r.id}</div>
                  <div className="kz-date">{dateStr}</div>
                </div>
                <div className="kz-sentence">{text}</div>
              </div>

              {/* ✅ Status pill: Πράσινο / Κόκκινο */}
              <div className="kz-status">
                <span
                  className={`kz-pill ${ok ? "kz-pill-ok" : "kz-pill-fail"}`}
                  title={ok ? "Το email στάλθηκε" : "Το email απέτυχε ή εκκρεμεί"}
                >
                  {ok ? "✓ Στάλθηκε" : "✗ Εκκρεμεί/Απέτυχε"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="kz-pager">
        {page > 1 && (
          <Link className="kz-link" href={`/account/requests?page=${page - 1}`}>← Προηγούμενα</Link>
        )}
        {hasNext && (
          <Link className="kz-link" href={`/account/requests?page=${page + 1}`}>Επόμενα →</Link>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link href="/customizer" className="kz-link">Κάνε νέο Request Price →</Link>
      </div>
    </main>
  );
}

/* ---------- ΣΤΥΛ (neon, ελαφριά) ---------- */
function KZStyles() {
  return (
    <style>{`
      .kz-wrap { background:#000; min-height:100vh; padding:4rem 2rem; display:flex; flex-direction:column; align-items:center; }
      .kz-title { text-align:center; color:#00ffff; font-size:2rem; margin-bottom:2rem; text-shadow:0 0 10px #0ff; }
      .kz-link { color:#00ffff; text-decoration:underline; text-shadow:0 0 8px #0ff; font-weight:600; }

      .kz-list { display:flex; flex-direction:column; gap:1rem; width:100%; max-width: 900px; }
      .kz-card { background:#000; border:2px solid #00ffff; border-radius:1.5rem; box-shadow:0 0 15px #0ff33; color:#bffeff; transition:transform .2s, box-shadow .2s; display:flex; align-items:center; gap:1rem; }
      .kz-card:hover { transform:scale(1.01); box-shadow:0 0 28px #0ff66; }
      .kz-row { padding:1rem 1.25rem; width:100%; display:flex; align-items:center; justify-content:space-between; }
      .kz-content { flex:1; min-width:0; }
      .kz-topline { display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:.35rem; }
      .kz-id { font-weight:700; color:#aefcff; }
      .kz-date { opacity:.8; font-size:.9rem; }
      .kz-sentence { opacity:.95; line-height:1.5; text-wrap:pretty; }

      .kz-status { margin-left: 1rem; }
      .kz-pill { display:inline-block; padding:.35rem .6rem; border-radius:999px; font-weight:700; border:2px solid transparent; }
      .kz-pill-ok { color:#0f0; border-color:#0f0; box-shadow:0 0 12px #0f05; }
      .kz-pill-fail { color:#f55; border-color:#f55; box-shadow:0 0 12px #f005; }

      .kz-pager { margin-top:1.5rem; display:flex; gap:0.75rem; }
      @media (max-width:640px){
        .kz-row{flex-direction:column; align-items:stretch;}
        .kz-topline{align-items:flex-start;}
        .kz-status{align-self:flex-end;}
      }
    `}</style>
  );
}
