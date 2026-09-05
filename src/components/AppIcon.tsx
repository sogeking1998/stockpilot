import type { ReactNode } from "react";
export default function AppIcon({ name }: { name: "box" | "grid" | "arrow" | "bell" | "wallet" | "plus" | "check" }) {
  const paths: Record<typeof name, ReactNode> = {
    box: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    arrow: <path d="M20 12H4m6-6-6 6 6 6"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    wallet: <><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 8V5l13-3v3M21 11h-6v5h6M17 13.5h.01"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    check: <path d="m5 12 4 4L19 6"/>,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
