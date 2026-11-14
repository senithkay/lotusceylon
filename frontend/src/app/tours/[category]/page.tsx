import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, comparisons, getCategory, packagesIn } from "@/lib/content";
import { Rise, Split } from "@/components/motion";
import { Accent, ClosingCta, FaqJsonLd, FaqList, PageHero, SectionHead, TourFaqs, WhyLotus } from "@/components/ui";
import { Circuit, Comparison, PackageList } from "@/components/tour-sections";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: PageProps<"/tours/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  const c = getCategory(category);
  if (!c) return {};
  return {
    title: { absolute: c.metaTitle },
    description: c.metaDescription,
    openGraph: { images: [c.hero.image] },
  };
}

export default async function CategoryPage(props: PageProps<"/tours/[category]">) {
  const { category } = await props.params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const pkgs = packagesIn(cat.slug);
  const table = comparisons[cat.slug];
  const ov = cat.overview;
  const ps = cat.packagesSection;
  const shortName = cat.hero.title.replace(/^Sri Lanka\s+/, "");

  return (
    <>
      <PageHero
        image={cat.hero.image}
        eyebrow={cat.hero.badge.replace(/^\S+\s/, (m) => (/[A-Za-z]/.test(m) ? m : ""))}
        title={cat.hero.title}
        lead={cat.hero.lead || undefined}
        crumbs={[{ label: "Home", href: "/" }, { label: "Tours", href: "/tours" }, { label: shortName }]}
      >
        {cat.hero.accent && <p className="lead" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(20px,2vw,28px)", marginBottom: 6 }}>{cat.hero.accent}</p>}
        <div className="btns" style={{ marginTop: 6 }}>
          <a className="btn btn-white" href="#packages">
            {cat.hero.primaryCta || "Explore itineraries"}
          </a>
          <Link className="btn btn-line-light" href={`/inquiry?${new URLSearchParams({ category: cat.hero.title })}`}>
            {cat.hero.secondaryCta || "Design your custom tour"}
          </Link>
        </div>
      </PageHero>

      {/* overview */}
      <section className="gap">
        <div className="wrap split split--top">
          <div className="stack-lg">
            {ov.watermark && (
              <Rise as="p" className="eyebrow">
                {ov.watermark}
              </Rise>
            )}
            <Split className="h2">
              <Accent title={ov.title ?? ""} accent={ov.accent || undefined} />
            </Split>
          </div>
          <div className="stack">
            {ov.paragraphs.map((p, i) => (
              <Rise as="p" key={i} className={i === 0 ? "lede" : "body body--wide"} style={i === 0 ? { fontSize: "clamp(20px,1.9vw,27px)" } : undefined}>
                {p}
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* packages */}
      <section className="gap-b" id="packages">
        <div className="wrap">
          <SectionHead
            eyebrow={ps.watermark || "Signature itineraries"}
            title={ps.title || `Curated ${shortName.replace(/ Tours$/, "")} packages`}
            accent={ps.accent || undefined}
            text={ps.subtitle || "Each itinerary is 100% customizable. Adjust destinations, duration, hotel tiers, and experiences to match your travel rhythm."}
          />
          <PackageList cat={cat} pkgs={pkgs} />
        </div>
      </section>

      {table && <Comparison table={table} intro={cat.comparisonIntro} />}

      <Circuit cat={cat} pkgs={pkgs} />

      {cat.seasons && (
        <section className="gap-sm">
          <div className="wrap">
            <SectionHead eyebrow={cat.seasons.watermark} title={cat.seasons.title ?? ""} accent={cat.seasons.accent || undefined} />
            <div className="grid g2">
              {cat.seasons.cards.map((s, i) => (
                <Rise key={s.title} delay={i * 0.08} className="stack" style={{ borderTop: "1px solid var(--ink)", paddingTop: 26 }}>
                  <span className="pill" style={{ justifySelf: "start" }}>
                    {s.badge}
                  </span>
                  <h3 className="h3">{s.title}</h3>
                  <p className="small">{s.locations}</p>
                  <p className="body body--wide">{s.text}</p>
                  <ul className="rlist">
                    {s.perks.map((pk) => (
                      <li key={pk.label} style={{ display: "grid", gap: 4 }}>
                        <span>{pk.label}</span>
                        <span style={{ color: "var(--ink)" }}>{pk.text}</span>
                      </li>
                    ))}
                  </ul>
                </Rise>
              ))}
            </div>
          </div>
        </section>
      )}

      {cat.experiences && (
        <section className="gap-sm">
          <div className="wrap">
            <SectionHead eyebrow={cat.experiences.watermark} title={cat.experiences.title ?? ""} accent={cat.experiences.accent || undefined} />
            <div className="grid g3">
              {cat.experiences.items.map((e, i) => (
                <Rise key={e.title} delay={(i % 3) * 0.08} className="stack" style={{ borderTop: "1px solid var(--grey-2)", paddingTop: 22, gap: 12 }}>
                  <span className="small" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="h4">{e.title}</h3>
                  <p className="small">{e.text}</p>
                </Rise>
              ))}
            </div>
          </div>
        </section>
      )}

      {cat.faqs && (
        <section className="gap-sm" id="category-faqs">
          <div className="wrap split split--top split--wide">
            <SectionHead eyebrow={cat.faqs.watermark} title={cat.faqs.title ?? ""} accent={cat.faqs.accent || undefined} text={cat.faqs.subtitle || undefined} />
            <Rise>
              <FaqList items={cat.faqs.items} />
            </Rise>
          </div>
          <FaqJsonLd items={cat.faqs.items} />
        </section>
      )}

      {cat.planCta && (
        <section className="gap-sm navy">
          <div className="wrap split">
            <div className="stack-lg">
              <Rise as="p" className="eyebrow">
                {cat.planCta.eyebrow}
              </Rise>
              <Split className="h2">
                <Accent title={cat.planCta.title} />
              </Split>
            </div>
            <Rise className="stack">
              <p className="body body--wide">{cat.planCta.text}</p>
              <div className="btns">
                {(cat.planCta.buttons.length ? cat.planCta.buttons : [{ label: "Start your inquiry", href: "/inquiry" }]).map((b, i) =>
                  b.href.startsWith("http") ? (
                    <a key={b.label} className={`btn ${i === 0 ? "btn-white" : "btn-line-light"}`} href={b.href} target="_blank" rel="noopener noreferrer">
                      {b.label.replace(/\s*➔$/, "")}
                    </a>
                  ) : (
                    <Link key={b.label} className={`btn ${i === 0 ? "btn-white" : "btn-line-light"}`} href={b.href}>
                      {b.label.replace(/\s*➔$/, "")}
                    </Link>
                  ),
                )}
              </div>
            </Rise>
          </div>
        </section>
      )}

      {cat.slug !== "buddhist-heritage" && (
        <>
          <WhyLotus />
          <TourFaqs />
        </>
      )}

      <ClosingCta />
    </>
  );
}
