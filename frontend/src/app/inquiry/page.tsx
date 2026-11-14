import type { Metadata } from "next";
import { Suspense } from "react";
import { Rise } from "@/components/motion";
import { PageHero } from "@/components/ui";
import { InquiryForm } from "@/components/forms";

export const metadata: Metadata = {
  title: { absolute: "Travel Inquiry Form | Plan Your Bespoke Sri Lanka Journey | Lotus Ceylon" },
  description: "Share your holiday wishes and we will craft a bespoke Sri Lanka itinerary tailored to your travel dates and pace.",
};

export default function InquiryPage() {
  return (
    <>
      <PageHero
        navy
        eyebrow="Bespoke Ceylon travel · Pure Journeys. Sacred Experiences."
        title="Travel inquiry"
        accent="form"
        lead="Inspired by the lotus, a symbol of purity, sacredness and resilience, share your holiday wishes and we will craft a bespoke itinerary tailored to your travel dates and pace."
        crumbs={[{ label: "Home", href: "/" }, { label: "Travel Inquiry" }]}
      />
      <section className="gap-sm">
        <div className="wrap wrap--narrow">
          <Rise>
            <Suspense>
              <InquiryForm variant="detailed" />
            </Suspense>
          </Rise>
        </div>
      </section>
    </>
  );
}
