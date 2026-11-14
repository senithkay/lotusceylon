import type { Metadata } from "next";
import Link from "next/link";
import { experiences as E } from "@/lib/content";
import { Rise, Split, Unmask } from "@/components/motion";
import { Arrow, ClosingCta, CtaBlock, PageHero, SectionHead } from "@/components/ui";
import { EncounterGrid } from "@/components/filters";

export const metadata: Metadata = {
  title: { absolute: "Sri Lanka Experiences | Curated Encounters & Signature Brands | Lotus Ceylon" },
  description: E.hero.lead,
};

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        image="/assets/images/hill-country/kandy-ella-train-5.webp"
        eyebrow={E.hero.badge}
        title={E.hero.title}
        lead={E.hero.lead}
        crumbs={[{ label: "Home", href: "/" }, { label: "Experiences" }]}
      >
        <p className="lead" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(20px,2vw,28px)" }}>
          {E.hero.accent}
        </p>
      </PageHero>

      <section className="gap" id="brandsPillars">
        <div className="wrap">
          <SectionHead eyebrow={E.pillarsHead.eyebrow} title={E.pillarsHead.title} text={E.pillarsHead.text} />
          <div className="stack-lg" style={{ gap: "clamp(64px,8vw,120px)" }}>
            {E.pillars.map((p, i) => (
              <article className="split" id={p.id} key={p.id} style={{ scrollMarginTop: 100 }}>
                <Unmask className="ph-fig ratio-43" style={{ order: i % 2 ? 2 : 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.alt} loading="lazy" />
                </Unmask>
                <div className="stack">
                  <Rise as="p" className="eyebrow muted">
                    {p.kicker}
                  </Rise>
                  <Split className="h2">
                    {p.title.split(" ").slice(0, -1).join(" ")} <em>{p.title.split(" ").slice(-1)}</em>
                  </Split>
                  <Rise as="p" className="body body--wide">
                    {p.text}
                  </Rise>
                  <Rise className="pills">
                    {p.tags.map((t) => (
                      <span className="pill" key={t}>
                        {t}
                      </span>
                    ))}
                  </Rise>
                  <Rise>
                    <Link className="tlink ulink" href={p.href}>
                      {p.cta} <Arrow />
                    </Link>
                  </Rise>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gap-sm grey" id="encountersGrid">
        <div className="wrap">
          <SectionHead eyebrow={E.encountersHead.eyebrow} title={E.encountersHead.title} text={E.encountersHead.text} />
          <EncounterGrid items={E.encounters} filters={E.filters} />
        </div>
      </section>

      <CtaBlock eyebrow={E.plan.eyebrow} title={E.plan.title} text={E.plan.text} primary="Design custom journey" />
      <ClosingCta />
    </>
  );
}
