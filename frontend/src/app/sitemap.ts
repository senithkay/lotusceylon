import type { MetadataRoute } from "next";
import { blogPosts, categories, destinations, packageHref, packages } from "@/lib/content";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/tours",
    "/destinations",
    "/experiences",
    "/about",
    "/gallery",
    "/reviews",
    "/blog",
    "/contact",
    "/inquiry",
    "/inquiry/quick",
    "/privacy-policy",
    "/terms-conditions",
    "/cancellation-policy",
    "/cookie-policy",
    ...categories.map((c) => `/tours/${c.slug}`),
    ...packages.map(packageHref),
    ...destinations.map((d) => `/destinations/${d.slug}`),
    ...blogPosts.map((b) => `/blog/${b.slug}`),
  ];
  return pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : p.split("/").length > 3 ? 0.6 : 0.8 }));
}
