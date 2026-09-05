"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppIcon from "@/components/AppIcon";

export default function Nav({ email }: { email: string }) {
  const pathname = usePathname();
  return <header className="workspace-header">
    <div className="workspace-nav-main">
      <Link href="/" className="landing-brand"><span className="brand-mark"><AppIcon name="box" /></span>StockPilot<span className="brand-period">.</span></Link>
      <span className="workspace-tag">YOUR WORKSPACE</span>
      <div className="workspace-account"><span className="workspace-avatar">{email.slice(0, 1).toUpperCase() || "S"}</span><span className="workspace-email">{email}<small>Store owner</small></span><Link href="/" className="workspace-home"><AppIcon name="arrow" />Back to home</Link><form action="/auth/signout" method="post"><button type="submit" className="workspace-signout">Sign out</button></form></div>
    </div>
    <div className="workspace-nav-bottom"><nav aria-label="Workspace navigation">{[{ href: "/dashboard", label: "Overview", icon: "grid" as const }, { href: "/products", label: "Products", icon: "box" as const }].map(link => {
      const active = pathname === link.href || (link.href === "/products" && pathname.startsWith("/products/"));
      return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={active ? "active" : ""}><AppIcon name={link.icon} />{link.label}</Link>;
    })}</nav></div>
  </header>;
}

