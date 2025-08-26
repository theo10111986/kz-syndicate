// lib/fetcher.ts
export async function jsonFetcher(input: any, init?: RequestInit) {
  const res = await fetch(input, init);

  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    const msg = ct.includes("application/json")
      ? (await res.json())?.error ?? `HTTP ${res.status}`
      : (await res.text()) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
