// Bundled demo imagery. Custom product photos always take priority.
const demoPhotos: Record<string, string> = {
  "Ceramic Coffee Mug": "mug",
  "Stainless Water Bottle": "bottle",
  "Bamboo Cutting Board": "cutting-board",
  "Gel Pen (Black, 12-pack)": "pens",
  "A5 Dotted Notebook": "notebook",
  "Sticky Notes (Neon)": "sticky-notes",
  "USB-C Cable 1m": "usb-cable",
  "Wireless Mouse": "mouse",
  "Adjustable Phone Stand": "phone-stand",
  "Dark Roast Coffee Beans 1kg": "coffee",
  "Green Tea (50 bags)": "tea",
  "All-Purpose Cleaner": "cleaner",
};
export function demoProductPhoto(name: string) {
  const slug = demoPhotos[name];
  return slug ? `/images/products/${slug}.webp` : undefined;
}
