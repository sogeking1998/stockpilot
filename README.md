# StockPilot

> **Stack:** Next.js (App Router) + TypeScript · Supabase (Postgres, Auth, RLS) · Tailwind CSS · Chart.js (react-chartjs-2) · deployed on Vercel

A small-business inventory manager. A shop owner signs in, manages products, records
stock-in / stock-out movements as they buy and sell, and gets warned before items run low.

**Core design rule:** a product's stock quantity is *never* edited directly. It is always
**derived from a ledger** of stock movements:

```
current_quantity = SUM(quantity where type = 'in') − SUM(quantity where type = 'out')
```

This keeps a complete, auditable history behind every number on the screen.

---

## Features

- 🔐 **Email/password auth** with Supabase, plus protected dashboard routes (middleware-guarded).
- 🔒 **Row Level Security** — every table is locked to `owner_id = auth.uid()`; each user only ever sees their own data.
- 📦 **Products list** — name, SKU, category, unit price, and live derived quantity, with a **low-stock badge** when quantity ≤ reorder level. Instant search + category filter.
- ✏️ **Create / edit products** with validation.
- ➕➖ **Record movements** — add a Stock In (+) or Stock Out (−) entry with quantity and an optional note; quantity recomputes from the ledger. Stock-outs can't drive quantity negative.
- 🧾 **Per-product movement history** — a simple audit trail, newest first.
- 📊 **Dashboard** — summary cards (total products, total stock value, low-stock count), a low-stock list, and a **Chart.js** bar chart of the top 5 products by total stock movement.
- 🎨 Clean, responsive UI with sensible **loading and empty states**.
- 🌱 **Seed script** + a ready-to-use **demo account** so visitors can log in and explore instantly.

---

## Data model

| Table | Columns |
| --- | --- |
| `profiles` | `id` (fk → `auth.users`), `created_at` |
| `products` | `id`, `owner_id`, `name`, `sku`, `category`, `unit_price`, `reorder_level`, `created_at` |
| `stock_movements` | `id`, `product_id`, `type` (`'in'` \| `'out'`), `quantity`, `note`, `created_at` |

A `products_with_stock` view (with `security_invoker`) exposes the derived `current_quantity`
and `total_movement` while still respecting RLS. See [`supabase/schema.sql`](supabase/schema.sql).

---

## Setup

### 1. Prerequisites
- Node.js 18+ and npm
- A free [Supabase](https://supabase.com) project

### 2. Install
```bash
npm install
```

### 3. Configure the database
In your Supabase project, open **SQL Editor**, paste the contents of
[`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the tables, the
derived-stock view, the RLS policies, and a trigger that auto-creates a profile on signup.

> For the smoothest demo, turn **off** email confirmations:
> **Authentication → Providers → Email → "Confirm email"** = off. This lets new
> sign-ups (and the demo account) log in instantly.

### 4. Environment variables
Copy the example file and fill in your project values:
```bash
cp .env.local.example .env.local
```

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → service_role key *(seed script only — keep secret)* |
| `NEXT_PUBLIC_DEMO_EMAIL` / `NEXT_PUBLIC_DEMO_PASSWORD` | Demo login (defaults: `demo@stockpilot.app` / `demo1234`) |

### 5. Seed demo data
Creates a confirmed demo user and inserts ~12 products with historical movements:
```bash
npm run seed
```

### 6. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) and click **Use demo account**.

---

## Deploy to Vercel

1. Push this repo to GitHub and **Import** it in Vercel.
2. Add the environment variables from `.env.local` to the Vercel project
   (Settings → Environment Variables). The `NEXT_PUBLIC_*` keys and — if you want to seed
   against the same database — `SUPABASE_SERVICE_ROLE_KEY`.
3. Deploy. The seed script is run locally (`npm run seed`), not on Vercel.

---

## Project structure

```
src/
  app/
    page.tsx                     Landing page
    login/                       Email/password auth
    auth/signout/                Sign-out route handler
    (dashboard)/
      layout.tsx                 Protected shell + nav
      dashboard/                 Summary cards, low-stock list, chart
      products/
        page.tsx                 Products table (search + filter)
        actions.ts               Server actions (CRUD + record movement)
        new/ · [id]/ · [id]/edit/
  components/                    UI, forms, table, chart
  lib/
    supabase/                    Browser / server / middleware clients
    types.ts · format.ts · demo.ts
supabase/schema.sql              Tables, view, RLS, trigger
scripts/seed.ts                  Demo data seeder
middleware.ts                    Session refresh + route protection
```

---

## Notes

- **Ledger integrity:** there is no mutable `quantity` column anywhere. Editing a product
  never touches stock — only movements do.
- **Security:** RLS is enforced at the database level, so even a direct API call can only
  reach the signed-in user's rows. The `service_role` key is used solely by the local seed script.

## Product photos

The product catalog uses image cards. Create or edit a product to upload a JPG,
PNG, or WebP (up to 500 KB), or paste an HTTPS image URL. Images can be removed
from the same form. Missing or unavailable images show a neutral placeholder.

For an existing database, run `supabase/migrations/20260905_product_images.sql`
in the Supabase SQL Editor once. This adds the optional image column and updates
the stock view while preserving products, movements, and row-level security.
Do not rerun `supabase/schema.sql` on an existing store: that full setup script
recreates tables. Uploaded photos are stored as small embedded images in the
product row; hosted image URLs are preferable for larger catalogs.
