import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type IconName = "box" | "grid" | "arrow" | "movement" | "bell" | "check";
function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    box: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    movement: <path d="M4 7h16l-4-4M20 17H4l4 4" />,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const products = [
  { name: "Everyday Tote", category: "Accessories", sku: "ACC-001", count: 124, color: "sand", status: "In stock" },
  { name: "Ceramic Mug", category: "Home & living", sku: "HOM-012", count: 86, color: "rose", status: "In stock" },
  { name: "Linen Notebook", category: "Stationery", sku: "STA-008", count: 8, color: "sage", status: "Low stock" },
  { name: "Amber Candle", category: "Home & living", sku: "HOM-024", count: 42, color: "amber", status: "In stock" },
];

function DashboardPreview() {
  return (
    <div className="preview-wrap" id="preview">
      <div className="preview-caption"><span><span className="status-dot" /> A little clarity goes a long way.</span><span>PRODUCT PREVIEW · SAMPLE DATA</span></div>
      <div className="product-preview">
        <aside className="preview-sidebar" aria-label="Sample dashboard navigation">
          <div className="preview-brand"><span className="brand-mark"><Icon name="box" /></span> StockPilot<span className="workspace-label">WORKSPACE</span></div>
          <div className="sample-shop"><span>O</span><div>Oak & everyday<small>My store</small></div><span className="shop-chevron">⌄</span></div>
          <div className="preview-nav-item selected"><Icon name="grid" /> Overview</div>
          <div className="preview-nav-item"><Icon name="box" /> Products <small>128</small></div>
          <div className="preview-nav-item"><Icon name="movement" /> Stock movements</div>
          <div className="sidebar-bottom"><span className="avatar">JD</span><div>Jamie Davis<small>Store owner</small></div><span>↗</span></div>
        </aside>
        <div className="preview-content">
          <div className="preview-topbar"><span>Workspace <span>/</span> <strong>Overview</strong></span><span className="preview-live"><span className="status-dot" /> All changes saved</span></div>
          <div className="preview-main">
            <div className="preview-heading"><div><h3>Your store, at a glance</h3><p>Here’s what’s happening with your inventory.</p></div><span className="sample-date">Store overview</span></div>
            <div className="preview-metrics">
              <div><span>Total products <Icon name="box" /></span><strong>128</strong><small>Across 8 categories</small></div>
              <div><span>Inventory value <span className="metric-symbol">$</span></span><strong>$24,580<span>.00</span></strong><small>Value of stock on hand</small></div>
              <div><span>Low-stock items <Icon name="bell" /></span><strong>5 <span className="needs-attention">Needs attention</span></strong><small>Time to restock a few favorites</small></div>
            </div>
            <div className="preview-table-card"><div className="table-heading"><h4>Inventory overview <span>128 products</span></h4><Link href="/login">View all products <Icon name="arrow" /></Link></div>
              <div className="preview-table-scroll"><table className="preview-table"><thead><tr><th>Product</th><th>SKU</th><th>Stock on hand</th><th>Status</th></tr></thead><tbody>{products.map(product => <tr key={product.sku}><td><div className="sample-product"><span className={`product-swatch ${product.color}`}><Icon name="box" /></span><span>{product.name}<small>{product.category}</small></span></div></td><td>{product.sku}</td><td><strong>{product.count}</strong> <span>units</span></td><td><span className={`stock-pill ${product.status === "Low stock" ? "low" : ""}`}><span />{product.status}</span></td></tr>)}</tbody></table></div>
            </div>
            <div className="preview-footnote"><Icon name="check" /> Every item accounted for. Every movement recorded.</div>
          </div>
        </div>
      </div>
      <div className="preview-floating"><span className="floating-icon"><Icon name="check" /></span><div>Less guesswork. More control.<small>Your next chapter starts with clear stock.</small></div></div>
    </div>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <main className="landing">
      <header className="landing-header landing-container">
        <Link href="/" className="landing-brand" aria-label="StockPilot home"><span className="brand-mark"><Icon name="box" /></span>StockPilot<span className="brand-period">.</span></Link>
        <nav className="landing-nav" aria-label="Main navigation"><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#preview">Product tour <span>↗</span></a></nav>
        <Link href={user ? "/dashboard" : "/login"} className="landing-header-cta">{user ? "Go to dashboard" : "Sign in"}<Icon name="arrow" /></Link>
      </header>
      <section className="landing-hero landing-container">
        <div className="hero-eyebrow"><span className="status-dot" /> SMALL BUSINESS. BIG PEACE OF MIND.</div>
        <h1>Keep your stock in check.<br /><span>And your business moving.</span></h1>
        <p className="hero-description">A clear view of what’s in, what’s out, and what’s running low.<br className="desktop-break" /> Simple inventory management, built for your everyday.</p>
        <div className="hero-actions"><Link href="/login" className="landing-primary">Try the live demo <Icon name="arrow" /></Link><a href="#preview" className="landing-secondary"><span className="play-icon">▷</span> Take a closer look</a></div>
        <div className="hero-reassurance"><span><Icon name="check" /> No credit card needed</span><span><Icon name="check" /> Demo data included</span></div>
        <DashboardPreview />
      </section>
      <section className="landing-features landing-container" id="features">
        <div className="section-intro"><span className="section-eyebrow">A LITTLE LESS ADMIN. A LOT MORE CLARITY.</span><h2>Everything you need.<br />Nothing in your way.</h2><p>From your first product to your next restock,<br className="desktop-break" /> stay on top of the details that matter.</p></div>
        <div className="feature-grid">{[
          { icon: "movement" as const, number: "01", title: "Every movement, recorded.", body: "Follow every stock-in and stock-out with a clear history. Always know how your quantities add up." },
          { icon: "bell" as const, number: "02", title: "Stay ahead of low stock.", body: "Set your reorder levels and spot items running low. Keep your shelves ready for whatever comes next." },
          { icon: "grid" as const, number: "03", title: "The big picture. At a glance.", body: "Products, stock value, and your most active items. All the essentials in one easy-to-read dashboard." },
        ].map(feature => <article className="landing-feature" key={feature.number}><div className="feature-top"><span className="feature-icon"><Icon name={feature.icon} /></span><span>{feature.number}</span></div><h3>{feature.title}</h3><p>{feature.body}</p></article>)}</div>
      </section>
      <section className="landing-container" id="how-it-works"><div className="landing-bottom-cta"><div><span className="section-eyebrow">FROM SHELVES TO SCREEN</span><h2>Add your products. Record your stock.<br />Get on with your day.</h2><p>Explore a stocked demo store and see how it all comes together.</p></div><Link href="/login" className="landing-primary">Let’s get you started <Icon name="arrow" /></Link></div></section>
      <footer className="landing-footer landing-container"><Link href="/" className="landing-brand"><span className="brand-mark"><Icon name="box" /></span>StockPilot<span className="brand-period">.</span></Link><p>A little order. A lot of possibility.</p><span>© {new Date().getFullYear()} StockPilot</span></footer>
    </main>
  );
}
