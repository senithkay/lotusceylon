import type { Metadata } from "next";
import { Suspense } from "react";
import { Rise } from "@/components/motion";
import { PageHero } from "@/components/ui";
import { InquiryForm } from "@/components/forms";

export const metadata: Metadata = {
  title: { absolute: "Quick Inquiry Form | Lotus Ceylon" },
  description: "Short on time? Provide your essential dates and travel preferences and we will craft a preliminary customized itinerary promptly.",
};

export default function QuickInquiryPage() {
  return (
    <>
      <PageHero
        navy
        eyebrow="Express travel coordination · Pure Journeys. Sacred Experiences."
        title="Quick inquiry"
        accent="form"
        lead="Short on time? Provide your essential dates and travel preferences below. We will craft a preliminary customized itinerary promptly."
        crumbs={[{ label: "Home", href: "/" }, { label: "Quick Inquiry" }]}
      />
      <section className="gap-sm">
        <div className="wrap wrap--narrow">
          <Rise>
            <Suspense>
              <InquiryForm variant="quick" />
            </Suspense>
          </Rise>
        </div>
      </section>
    </>
  );
}
