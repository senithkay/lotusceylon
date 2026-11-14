import type { NextConfig } from "next";

/** Old static-site URLs (thai/*.html) → new routes, so existing links and search results keep working. */
const legacy: [string, string][] = [
  ["/index.html", "/"],
  ["/about.html", "/about"],
  ["/contact.html", "/contact"],
  ["/destinations.html", "/destinations"],
  ["/experiences.html", "/experiences"],
  ["/gallery.html", "/gallery"],
  ["/reviews.html", "/reviews"],
  ["/blog.html", "/blog"],
  ["/inquiry-detailed.html", "/inquiry"],
  ["/inquiry-quick.html", "/inquiry/quick"],
  ["/privacy-policy.html", "/privacy-policy"],
  ["/terms-conditions.html", "/terms-conditions"],
  ["/cancellation-policy.html", "/cancellation-policy"],
  ["/cookie-policy.html", "/cookie-policy"],
  ["/tours.html", "/tours"],
  ["/sri-lanka-tours.html", "/tours"],
  ["/category.html", "/tours"],
  ["/tour-package-detail.html", "/tours"],
  ["/tours/detail.html", "/tours"],
  ["/cultural-tours.html", "/tours/cultural"],
  ["/buddhist-heritage-tours.html", "/tours/buddhist-heritage"],
  ["/wildlife-tours.html", "/tours/wildlife"],
  ["/beach-tours.html", "/tours/beach"],
  ["/hill-country-tours.html", "/tours/hill-country"],
  ["/ayurvedic-tours.html", "/tours/ayurvedic"],
  ["/honeymoon-tours.html", "/tours/honeymoon"],
  ["/family-tours.html", "/tours/family"],
  ["/adventure-tours.html", "/tours/adventure"],
  ["/golf-tours.html", "/tours/golf"],
  ["/ramayana-tours.html", "/tours/ramayana"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...legacy.map(([source, destination]) => ({ source, destination, permanent: true })),
      // folder-style legacy pages: /tours/cultural/index.html, /destinations/kandy/index.html, /blog/x/index.html
      { source: "/:path*/index.html", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
