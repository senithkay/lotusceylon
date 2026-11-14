import type { Metadata } from "next";
import { gallery } from "@/lib/content";
import { ClosingCta, CtaBlock, PageHero } from "@/components/ui";
import { GalleryGrid } from "@/components/filters";

export const metadata: Metadata = {
  title: { absolute: "Sri Lanka Photo Gallery | Sacred Ceylon Visual Chronicles | Lotus Ceylon" },
  description:
    "Gaze upon two millennia of living Buddhist chronicle, mist-cloaked tea ridges, wild leopard sanctuaries, and the timeless warmth of authentic Ceylon hospitality.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        image="/assets/images/cultural/galle-fort-5.webp"
        eyebrow="Sacred Ceylon visual chronicles"
        title="Moments of pure"
        accent="splendor"
        lead="Living heritage in frames. Gaze upon two millennia of living Buddhist chronicle, mist-cloaked tea ridges, wild leopard sanctuaries, and the timeless warmth of authentic Ceylon hospitality."
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />
      <section className="gap-sm">
        <div className="wrap">
          <GalleryGrid items={gallery.items} filters={gallery.filters} />
        </div>
      </section>
      <CtaBlock
        eyebrow="Inspired by Ceylon's wonders?"
        title="Let us turn these frames into your"
        accent="reality"
        text="Whether standing beneath thousand-year stupas or listening to the dawn calls of Sinharaja, your private chauffeured itinerary is prepared with care."
        primary="Plan my custom itinerary"
        secondary="WhatsApp concierge"
        navy
      />
      <ClosingCta />
    </>
  );
}
