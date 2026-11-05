export function isolatedBetaUrl(beta: string | undefined, amc: string | undefined): boolean {
  if (!beta || !amc) return false;
  try { const a = new URL(beta); const b = new URL(amc); return a.protocol === "https:" && a.origin !== b.origin; }
  catch { return false; }
}
