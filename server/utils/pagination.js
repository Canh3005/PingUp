export function parseLimit(limit, fallback = 30, max = 100) {
  const n = Number(limit || fallback);
  if (Number.isNaN(n) || n <= 0) return fallback;
  return Math.min(n, max);
}
