import type { Metadata, Viewport } from "next";
import { Inter_Tight, Playfair_Display } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { MotionProvider } from "@/components/motion";
import { Header } from "@/components/header";
import { Footer, WhatsAppFab } from "@/components/footer";
import { siteJsonLd } from "@/components/ui";

const sans = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans", display: "swap" });
const serif = Playfair_Display({ subsets: ["latin"], weight: ["400", "500"], style: ["italic"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Sri Lanka Tours | Lotus Ceylon Luxury Holidays Official Site",
    template: "%s | Lotus Ceylon",
  },
  description:
    "Lotus Ceylon International Tours & Services crafts private, tailor-made Sri Lanka holidays since 2014 — cultural heritage, Buddhist pilgrimage, wildlife safaris, beaches, tea country, Ayurveda and more.",
  applicationName: "Lotus Ceylon",
  openGraph: { type: "website", siteName: "Lotus Ceylon", images: ["/media/hero-poster.jpg"] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0A1E4A", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Hide reveal targets before first paint only when motion is allowed. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to main content
        </a>
        <MotionProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppFab />
        </MotionProvider>
      </body>
    </html>
  );
}
