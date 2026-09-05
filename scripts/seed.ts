/**
 * StockPilot seed script.
 *
 *   npm run seed
 *
 * Creates (or reuses) a confirmed demo user, wipes their existing catalog, and
 * inserts ~12 products plus historical stock movements so the dashboard looks
 * alive. Uses the SERVICE ROLE key, so run it locally only — never in the app.
 */
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo@stockpilot.app";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "demo1234";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "✖ Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type SeedMovement = {
  type: "in" | "out";
  quantity: number;
  daysAgo: number;
  note?: string;
};

type SeedProduct = {
  name: string;
  sku: string;
  category: string;
  unit_price: number;
  reorder_level: number;
  movements: SeedMovement[];
};

// A mix that lands some products healthy and some at/below their reorder level.
const PRODUCTS: SeedProduct[] = [
  {
    name: "Ceramic Coffee Mug",
    sku: "MUG-001",
    category: "Kitchenware",
    unit_price: 12.5,
    reorder_level: 20,
    movements: [
      { type: "in", quantity: 100, daysAgo: 30, note: "Opening stock" },
      { type: "out", quantity: 30, daysAgo: 20, note: "Wholesale order" },
      { type: "out", quantity: 25, daysAgo: 10 },
      { type: "out", quantity: 20, daysAgo: 3, note: "Weekend sales" },
    ],
  },
  {
    name: "Stainless Water Bottle",
    sku: "BTL-002",
    category: "Kitchenware",
    unit_price: 18.0,
    reorder_level: 15,
    movements: [
      { type: "in", quantity: 60, daysAgo: 28, note: "Opening stock" },
      { type: "out", quantity: 25, daysAgo: 15 },
      { type: "out", quantity: 22, daysAgo: 5, note: "Gym promo" },
    ],
  },
  {
    name: "Bamboo Cutting Board",
    sku: "BRD-003",
    category: "Kitchenware",
    unit_price: 24.0,
    reorder_level: 10,
    movements: [
      { type: "in", quantity: 40, daysAgo: 25, note: "Opening stock" },
      { type: "out", quantity: 8, daysAgo: 12 },
      { type: "out", quantity: 6, daysAgo: 4 },
    ],
  },
  {
    name: "Gel Pen (Black, 12-pack)",
    sku: "PEN-004",
    category: "Stationery",
    unit_price: 6.75,
    reorder_level: 25,
    movements: [
      { type: "in", quantity: 120, daysAgo: 30, note: "Opening stock" },
      { type: "out", quantity: 40, daysAgo: 18, note: "Office bulk order" },
      { type: "out", quantity: 35, daysAgo: 9 },
      { type: "out", quantity: 30, daysAgo: 2 },
    ],
  },
  {
    name: "A5 Dotted Notebook",
    sku: "NBK-005",
    category: "Stationery",
    unit_price: 8.25,
    reorder_level: 20,
    movements: [
      { type: "in", quantity: 80, daysAgo: 26, note: "Opening stock" },
      { type: "out", quantity: 20, daysAgo: 14 },
      { type: "out", quantity: 15, daysAgo: 6, note: "Back-to-school" },
    ],
  },
  {
    name: "Sticky Notes (Neon)",
    sku: "STK-006",
    category: "Stationery",
    unit_price: 3.5,
    reorder_level: 30,
    movements: [
      { type: "in", quantity: 90, daysAgo: 22, note: "Opening stock" },
      { type: "out", quantity: 40, daysAgo: 11 },
      { type: "out", quantity: 25, daysAgo: 3 },
    ],
  },
  {
    name: "USB-C Cable 1m",
    sku: "CBL-007",
    category: "Electronics",
    unit_price: 9.99,
    reorder_level: 15,
    movements: [
      { type: "in", quantity: 70, daysAgo: 29, note: "Opening stock" },
      { type: "out", quantity: 30, daysAgo: 16 },
      { type: "out", quantity: 20, daysAgo: 7, note: "Online orders" },
    ],
  },
  {
    name: "Wireless Mouse",
    sku: "MSE-008",
    category: "Electronics",
    unit_price: 21.5,
    reorder_level: 8,
    movements: [
      { type: "in", quantity: 30, daysAgo: 24, note: "Opening stock" },
      { type: "out", quantity: 12, daysAgo: 13 },
      { type: "out", quantity: 9, daysAgo: 5 },
    ],
  },
  {
    name: "Adjustable Phone Stand",
    sku: "STD-009",
    category: "Electronics",
    unit_price: 14.0,
    reorder_level: 12,
    movements: [
      { type: "in", quantity: 25, daysAgo: 20, note: "Opening stock" },
      { type: "out", quantity: 10, daysAgo: 10 },
      { type: "out", quantity: 8, daysAgo: 3, note: "Flash sale" },
    ],
  },
  {
    name: "Dark Roast Coffee Beans 1kg",
    sku: "COF-010",
    category: "Beverages",
    unit_price: 22.0,
    reorder_level: 10,
    movements: [
      { type: "in", quantity: 50, daysAgo: 27, note: "Opening stock" },
      { type: "out", quantity: 18, daysAgo: 15, note: "Cafe supply" },
      { type: "out", quantity: 14, daysAgo: 6 },
      { type: "out", quantity: 8, daysAgo: 1 },
    ],
  },
  {
    name: "Green Tea (50 bags)",
    sku: "TEA-011",
    category: "Beverages",
    unit_price: 7.5,
    reorder_level: 15,
    movements: [
      { type: "in", quantity: 60, daysAgo: 21, note: "Opening stock" },
      { type: "out", quantity: 20, daysAgo: 12 },
      { type: "out", quantity: 10, daysAgo: 4 },
    ],
  },
  {
    name: "All-Purpose Cleaner",
    sku: "CLN-012",
    category: "Cleaning",
    unit_price: 5.25,
    reorder_level: 18,
    movements: [
      { type: "in", quantity: 45, daysAgo: 23, note: "Opening stock" },
      { type: "out", quantity: 15, daysAgo: 10 },
      { type: "out", quantity: 12, daysAgo: 2, note: "Bulk buyer" },
    ],
  },
];

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

async function getOrCreateDemoUser() {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;

  const existing = data.users.find((u) => u.email === DEMO_EMAIL);
  if (existing) {
    console.log(`• Reusing existing demo user (${DEMO_EMAIL})`);
    return existing;
  }

  const { data: created, error: createErr } =
    await admin.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
    });
  if (createErr) throw createErr;
  console.log(`• Created demo user (${DEMO_EMAIL})`);
  return created.user;
}

async function main() {
  console.log("→ Seeding StockPilot demo data…");

  const user = await getOrCreateDemoUser();
  if (!user) throw new Error("Could not resolve demo user.");

  // Reset: deleting products cascades to their stock_movements.
  const { error: delErr } = await admin
    .from("products")
    .delete()
    .eq("owner_id", user.id);
  if (delErr) throw delErr;
  console.log("• Cleared existing demo products");

  let productCount = 0;
  let movementCount = 0;

  for (const p of PRODUCTS) {
    const { data: inserted, error: prodErr } = await admin
      .from("products")
      .insert({
        owner_id: user.id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        unit_price: p.unit_price,
        reorder_level: p.reorder_level,
      })
      .select("id")
      .single();
    if (prodErr) throw prodErr;
    productCount += 1;

    const rows = p.movements.map((m) => ({
      product_id: inserted.id,
      type: m.type,
      quantity: m.quantity,
      note: m.note ?? null,
      created_at: isoDaysAgo(m.daysAgo),
    }));

    const { error: movErr } = await admin.from("stock_movements").insert(rows);
    if (movErr) throw movErr;
    movementCount += rows.length;
  }

  console.log(
    `✔ Done. Inserted ${productCount} products and ${movementCount} movements.`
  );
  console.log(`\n  Demo login → ${DEMO_EMAIL} / ${DEMO_PASSWORD}\n`);
}

main().catch((err) => {
  console.error("✖ Seed failed:", err.message ?? err);
  process.exit(1);
});
