import type { Metadata } from "next";
import { destinations, destinationsPage } from "@/lib/content";
import { ClosingCta, CtaBlock, PageHero } from "@/components/ui";
import { DestinationGrid } from "@/components/filters";

export const metadata: Metadata = {
  title: { absolute: "Sri Lanka Destinations | Sacred Sites & Famous Places | Lotus Ceylon" },
  description: destinationsPage.lead,
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        image="/assets/images/buddhist-heritage/ruwanwelisaya-2.webp"
        eyebrow={destinationsPage.badge}
        title={destinationsPage.title}
        accent={destinationsPage.accent}
        lead={destinationsPage.lead}
        crumbs={[{ label: "Home", href: "/" }, { label: "Destinations" }]}
      />
      <section className="gap-sm">
        <div className="wrap">
          <DestinationGrid items={destinations} filters={destinationsPage.filters} placeholder={destinationsPage.searchPlaceholder} />
        </div>
      </section>
      <CtaBlock
        eyebrow="Combine multiple destinations"
        title="Tailor-make your personal island"
        accent="journey"
        text="Looking to combine sacred Buddhist temple veneration with cool tea highlands and a private wildlife safari? Our senior travel designers handcraft your custom itinerary with private chauffeur transport."
        primary="Design custom journey"
        navy
      />
      <ClosingCta />
    </>
  );
}
