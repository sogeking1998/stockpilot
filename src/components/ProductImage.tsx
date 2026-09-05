"use client";
import { useState } from "react";
import AppIcon from "@/components/AppIcon";
import { demoProductPhoto } from "@/lib/demo-product-photos";
export default function ProductImage({ src: customSrc, name, useDemo = true }: { src?: string | null; name: string; useDemo?: boolean }) {
  const src = customSrc || (useDemo ? demoProductPhoto(name) : undefined);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return <div className="catalog-image">{src && failedSrc !== src ?
    // User images may be embedded uploads or hosted at any HTTPS image provider.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailedSrc(src)} />
    : <div className="catalog-image-placeholder"><AppIcon name="box" /><span>{src ? "Image unavailable" : "Add a product photo"}</span></div>}</div>;
}
