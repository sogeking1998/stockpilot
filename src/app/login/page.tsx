"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppIcon from "@/components/AppIcon";
import { createClient } from "@/lib/supabase/client";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/demo";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const supabase = createClient();
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setError(error.message); return; }
        router.push("/dashboard");
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) { setError(error.message); return; }
        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setInfo("Account created. Check your email to confirm, then sign in.");
          setMode("signin");
        }
      }
    } catch {
      setError("We couldn’t connect. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setMode("signin");
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError(null);
    setInfo("Demo details are ready. Select Sign in to explore the store.");
  }

  return <main className="auth-page">
    <aside className="auth-story">
      <Link href="/" className="landing-brand"><span className="brand-mark"><AppIcon name="box" /></span>StockPilot<span className="brand-period">.</span></Link>
      <div className="auth-story-content">
        <span className="auth-eyebrow"><span />A LITTLE ORDER. A LOT OF POSSIBILITY.</span>
        <h2>Your shelves, sorted.<br /><span>Your mind, at ease.</span></h2>
        <p>Keep track of the little things that keep your business moving. One clear view of every product and every movement.</p>
        <div className="auth-illustration" aria-label="Illustration of recorded inventory movements">
          <div className="auth-ledger"><div className="auth-ledger-title"><span><AppIcon name="box" />Inventory, in harmony</span><span className="auth-sample-label">ILLUSTRATION</span></div>
            {[{ name: "New stock arrives", detail: "Every delivery accounted for", icon: "box" as const, badge: "Stock in", cls: "in" }, { name: "Another order out the door", detail: "Every sale part of the story", icon: "wallet" as const, badge: "Stock out", cls: "out" }, { name: "A clear view of what’s next", detail: "Know when it’s time to restock", icon: "bell" as const, badge: "Stay ready", cls: "ready" }].map(row => <div className="auth-ledger-row" key={row.name}><span className={`auth-ledger-icon ${row.cls}`}><AppIcon name={row.icon} /></span><div><strong>{row.name}</strong><small>{row.detail}</small></div><span className={`auth-ledger-badge ${row.cls}`}>{row.badge}</span></div>)}
            <div className="auth-ledger-footer"><AppIcon name="check" />Every movement recorded. Every count explained.</div>
          </div>
        </div>
        <div className="auth-story-points"><span><AppIcon name="check" />Simple by design</span><span><AppIcon name="check" />Built for small businesses</span></div>
      </div>
      <p className="auth-story-footer">Less guesswork. More room to grow.<span>StockPilot</span></p>
    </aside>
    <section className="auth-form-panel" aria-labelledby="auth-title">
      <header className="auth-form-header"><Link href="/" className="auth-mobile-brand"><span className="brand-mark"><AppIcon name="box" /></span>StockPilot</Link><Link href="/" className="auth-home"><AppIcon name="arrow" />Back to home</Link></header>
      <div className="auth-form-content">
        <span className="auth-form-icon"><AppIcon name={mode === "signin" ? "box" : "plus"} /></span>
        <p className="section-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
        <h1 id="auth-title">{mode === "signin" ? "Welcome back." : "Make yourself at home."}</h1>
        <p className="auth-subtitle">{mode === "signin" ? "A clearer day starts with your inventory. Let’s sign you in." : "Create an account and bring a little order to your stock."}</p>
        <button type="button" disabled={loading} onClick={fillDemo} className="auth-demo-button"><AppIcon name="grid" />Explore with a demo account<span aria-hidden="true">↗</span></button>
        <div className="auth-divider"><span />or {mode === "signin" ? "sign in" : "sign up"} with email<span /></div>
        <form onSubmit={handleSubmit} className="auth-form" aria-busy={loading}>
          <div><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required disabled={loading} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourstore.com" /></div>
          <div><label htmlFor="password">Password</label><div className="auth-password"><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={6} disabled={loading} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"} /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>{showPassword ? "Hide" : "Show"}</button></div></div>
          {error && <p className="auth-message auth-error" role="alert">{error}</p>}
          {info && <p className="auth-message auth-info" role="status">{info}</p>}
          <button type="submit" disabled={loading} className="auth-submit">{loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}<span aria-hidden="true">→</span></button>
        </form>
        <p className="auth-switch">{mode === "signin" ? "New to StockPilot?" : "Already have an account?"} <button type="button" disabled={loading} onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }}>{mode === "signin" ? "Create an account" : "Sign in"}</button></p>
        <div className="auth-demo-note"><span><AppIcon name="grid" /></span><div><strong>Just looking around?</strong><p>The demo comes with products and stock history, so you can explore right away. No credit card needed.</p></div></div>
      </div>
      <footer className="auth-form-footer">Your stock. Your store. All in one place.</footer>
    </section>
  </main>;
}
