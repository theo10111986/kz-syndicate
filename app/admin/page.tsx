// app/admin/page.tsx
// @ts-nocheck
/* eslint-disable */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type SearchParams = {
  q?: string;        // αναζήτηση (email, id, κείμενο)
  from?: string;     // YYYY-MM-DD
  to?: string;       // YYYY-MM-DD
  page?: string;     // σελιδοποίηση
};

export default async function AdminRequests({ searchParams }: { searchParams?: SearchParams }) {
  // 1) Έλεγχος admin πρόσβασης με ADMIN_EMAILS
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || "";

  const admins = (process.env.ADMIN_EMAILS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const isAdmin = email && admins.includes(email.toLowerCase());

  if (!isAdmin) {
    return (
      <main className="kz-wrap">
        <KZStyles />
        <h1 className="kz-title">Admin · Price Requests</h1>
        <div className="kz-card" style={{maxWidth:560, textAlign:"center"}}>
          Δεν έχεις πρόσβαση σε αυτή τη σελίδα.
          <div style={{marginTop:"1rem"}}>
            <Link className="kz-link" href="/">← Επιστροφή</Link>
          </div>
        </div>
      </main>
    );
  }

  // 2) Φίλτρα + σελιδοποίηση
  const q = (searchParams?.q || "").trim();
  const page = Math.max(1, Number(searchParams?.page ?? 1));
  const PAGE_SIZE = 20;
  const take = PAGE_SIZE + 1;   // φέρνουμε 21 για να ξέρουμε αν έχει επόμενη
  const skip = (page - 1) * PAGE_SIZE;

  const createdAtFilter = buildDateFilter(searchParams?.from, searchParams?.to);

  // 3) Δεδομένα (ΜΟΝΟ Price Requests)
  const rows = await prisma.priceRequest.findMany({
    where: {
      AND: [
        createdAtFilter ? { createdAt: createdAtFilter } : {},
        q
          ? {
              OR: [
                { id: { contains: q } },
                { description: { contains: q } },
                { user: { email: { contains: q } } },
              ],
            }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      description: true,
      emailSent: true,
      user: { select: { email: true } },
    },
    skip,
    take,
  });

  const hasNext = rows.length > PAGE_SIZE;
  const pageRows = hasNext ? rows.slice(0, PAGE_SIZE) : rows;

  // 4) UI
  return (
    <main className="kz-wrap">
      <KZStyles />
      <h1 className="kz-title">Admin · Price Requests</h1>

      {/* Φίλτρα */}
      <form className="kz-filters" action="/admin" method="GET">
        <input name="q" defaultValue={q} placeholder="Αναζήτηση (email, id, περιγραφή)" />
        <input name="from" defaultValue={searchParams?.from || ""} type="date" />
        <input name="to" defaultValue={searchParams?.to || ""} type="date" />
        <button className="kz-btn" type="submit">Φίλτρα</button>
      </form>

      {/* Πίνακας Requests */}
      <section className="kz-card">
        <table className="kz-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ημερομηνία</th>
              <th>Email</th>
              <th>Περιγραφή</th>
              <th>Κατάσταση Email</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r:any) => (
              <tr key={r.id}>
                <td className="mono">#{r.id}</td>
                <td>{new Date(r.createdAt).toLocaleString("el-GR")}</td>
                <td>{r.user?.email || "-"}</td>
                <td className="clip">{r.description || "-"}</td>
                <td>
                  <span className={`pill ${r.emailSent ? "ok" : "fail"}`}>
                    {r.emailSent ? "✓ Στάλθηκε" : "✗ Εκκρεμεί/Απέτυχε"}
                  </span>
                </td>
              </tr>
            ))}
            {!pageRows.length && (
              <tr><td colSpan={5} style={{textAlign:"center", opacity:.8}}>Καμία εγγραφή</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Σελιδοποίηση */}
      <div className="kz-pager">
        {page > 1 && (
          <Link className="kz-link" href={`/admin?page=${page-1}${q?`&q=${encodeURIComponent(q)}`:""}${searchParams?.from?`&from=${searchParams.from}`:""}${searchParams?.to?`&to=${searchParams.to}`:""}`}>← Προηγούμενα</Link>
        )}
        {hasNext && (
          <Link className="kz-link" href={`/admin?page=${page+1}${q?`&q=${encodeURIComponent(q)}`:""}${searchParams?.from?`&from=${searchParams.from}`:""}${searchParams?.to?`&to=${searchParams.to}`:""}`}>Επόμενα →</Link>
        )}
      </div>
    </main>
  );
}

/* ── helpers ───────────────────────────────────────────── */
function buildDateFilter(from?: string, to?: string) {
  const f = from ? new Date(from + "T00:00:00") : undefined;
  const t = to ? new Date(to + "T23:59:59") : undefined;
  if (!f && !t) return undefined;
  return { gte: f || undefined, lte: t || undefined };
}

/* ── styles (neon minimal) ─────────────────────────────── */
function KZStyles() {
  return (
    <style>{`
      .kz-wrap { background:#000; min-height:100vh; padding:3rem 1.5rem 5rem; }
      .kz-title { color:#0ff; text-align:center; font-size:2rem; margin-bottom:1.25rem; text-shadow:0 0 10px #0ff; }
      .kz-link { color:#0ff; text-decoration:underline; text-shadow:0 0 8px #0ff; }

      .kz-filters { display:flex; gap:.5rem; justify-content:center; margin: 0 auto 1.25rem; flex-wrap:wrap; }
      .kz-filters input { background:#000; color:#bffeff; border:2px solid #044; border-radius:.75rem; padding:.45rem .65rem; }
      .kz-btn { border:2px solid #0ff; background:#000; color:#0ff; border-radius:.75rem; padding:.45rem .8rem; font-weight:700; text-shadow:0 0 6px #0ff; }

      .kz-card { border:2px solid #0ff; border-radius:1rem; padding:.5rem; background:#000; box-shadow:0 0 16px #0ff3; overflow:auto; }
      .kz-table { width:100%; border-collapse:collapse; font-size:.95rem; }
      .kz-table th, .kz-table td { padding:.6rem .5rem; border-bottom:1px solid #033; vertical-align:top; }
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
      .clip { max-width:520px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

      .pill { display:inline-block; padding:.25rem .5rem; border-radius:999px; font-weight:700; border:2px solid transparent; }
      .pill.ok { color:#0f0; border-color:#0f0; box-shadow:0 0 10px #0f05; }
      .pill.fail { color:#f55; border-color:#f55; box-shadow:0 0 10px #f005; }

      .kz-pager { margin-top:1rem; display:flex; gap:.75rem; justify-content:center; }
    `}</style>
  );
}
