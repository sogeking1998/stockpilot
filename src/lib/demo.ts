// Single source of truth for the public demo account credentials.
// Shown on the login screen and created by scripts/seed.ts.
export const DEMO_EMAIL =
  process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo@stockpilot.app";
export const DEMO_PASSWORD =
  process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "demo1234";
