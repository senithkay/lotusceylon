import type { Metadata } from "next";
import { NavyBand, Rise } from "@/components/motion";
import { ClosingCta, CtaBlock, PageHero, SectionHead } from "@/components/ui";
import { ReviewForm } from "@/components/forms";

export const metadata: Metadata = {
  title: { absolute: "Guest Reviews | Voices of Serenity | Lotus Ceylon" },
  description:
    "Read genuine reflections and pilgrimage memories from travelers who entrusted their sacred journeys, family holidays, and bespoke retreats to Lotus Ceylon.",
};

const METRICS = [
  ["100% Bespoke", "Tailored Private Journeys"],
  ["100%", "Private Chauffeured Safety"],
  ["Since 2014", "Dedicated Ceylon Mastery"],
  ["10 Languages", "Global Concierge Desks"],
];

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        image="/assets/images/honeymoon/tea-bungalow-3.webp"
        eyebrow="Discerning traveler reflections"
        title="Voices of"
        accent="serenity"
        lead="Heartfelt memories of Ceylon. Read genuine reflections and pilgrimage memories from travelers who entrusted their sacred journeys, family holidays, and bespoke retreats to Lotus Ceylon."
        crumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
      />
      <NavyBand className="gap-sm">
        <div className="wrap">
          <div className="figs figs--4" style={{ marginTop: 0 }}>
            {METRICS.map(([v, l]) => (
              <div className="fig" key={l}>
                <b style={{ fontSize: "clamp(30px,3.4vw,52px)" }}>{v}</b>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </NavyBand>
      <section className="gap">
        <div className="wrap split split--top">
          <div className="stack-lg">
            <SectionHead
              eyebrow="Guest stories"
              title="Memories shared with"
              accent="gratitude"
              text="From sacred chanting at the Temple of the Tooth to dawn leopard safaris in Yala, read how our master travel designers transformed every moment."
              style={{ marginBottom: 0 }}
            />
            <Rise className="stack" style={{ borderTop: "1px solid var(--ink)", paddingTop: 24 }}>
              <h3 className="h4">Guest reviews coming soon</h3>
              <p className="body">We are currently welcoming our upcoming season guests across Sri Lanka. Verified guest reviews and reflections will appear here as they are published.</p>
            </Rise>
          </div>
          <Rise className="stack-lg">
            <div className="stack">
              <h3 className="h3">
                Leave your traveler <em>reflection</em>
              </h3>
              <p className="small">
                Have you traveled with Lotus Ceylon? Share your personal pilgrimage memories, wildlife encounters, or bespoke journey reflections. Submitted reviews are verified prior to publication.
              </p>
            </div>
            <ReviewForm />
          </Rise>
        </div>
      </section>
      <CtaBlock
        eyebrow="Begin your own journey"
        title="Ready to create your own Ceylon"
        accent="memories?"
        text="Discover the sacred soul of Sri Lanka through customized private journeys curated with profound reverence and care."
        primary="Plan my bespoke itinerary"
        secondary="Chat with concierge"
      />
      <ClosingCta />
    </>
  );
}
