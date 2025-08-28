// lib/analytics.ts
export function track(
  event: string,
  data?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;
  const w = window as any;

  // Umami v2 (νέο API)
  if (w.umami && typeof w.umami.track === "function") {
    w.umami.track(event, data);
    return;
  }

  // Umami (παλιό API fallback)
  if (typeof w.umami === "function") {
    w.umami(event, data);
    return;
  }

  // Plausible fallback (σε περίπτωση που τρέχεις ακόμα το παλιό script)
  if (typeof w.plausible === "function") {
    w.plausible(event, data ? { props: data } : undefined);
  }
}
