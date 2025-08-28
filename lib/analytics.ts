// lib/analytics.ts
export function track(
  event: string,
  props?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && (window as any).plausible) {
    (window as any).plausible(event, props ? { props } : undefined);
  }
}
