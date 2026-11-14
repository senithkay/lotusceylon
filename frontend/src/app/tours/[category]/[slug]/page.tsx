import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { durationLabel, getCategory, getPackage, packageHref, packages, packagesIn } from "@/lib/content";
import { SITE, TOUR_FAQS, waLink } from "@/lib/site";
import { Rise, Split, Unmask } from "@/components/motion";
import { Arrow, ClosingCta, PageHero, SectionHead, TourFaqs, WhyLotus } from "@/components/ui";
import { SeasonStrip } from "@/components/tour-sections";
import { BookingActions, MobileTourBar, RouteMap, Timeline } from "@/components/tours";

export const dynamicParams = false;

export function generateStaticParams() {
  return packages.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/tours/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await props.params;
  const p = getPackage(category, slug);
  if (!p) return {};
  return { title: { absolute: p.metaTitle }, description: p.metaDescription, openGraph: { images: [p.heroImage] } };
}

export default async function PackagePage(props: PageProps<"/tours/[category]/[slug]">) {
  const { category, slug } = await props.params;
  const p = getPackage(category, slug);
  const cat = getCategory(category);
  if (!p || !cat) notFound();

  const duration = durationLabel(p);
  const catName = cat.hero.title;
  const waHref = waLink(`Hello Lotus Ceylon, I would like to inquire about the ${p.title} (${duration}) private tour.`);
  const facts = p.facts.map((f) => (f.label === "Duration" ? { ...f, value: duration } : f));
  const related = packagesIn(category).filter((x) => x.slug !== p.slug);
  const cardFor = (slug: string) => cat.packagesSection.cards.find((c) => c.slug === slug);

  const tripJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: p.title,
    description: p.metaDescription,
    touristType: catName,
    itinerary: {
      "@type": "ItemList",
      itemListElement: p.itinerary.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: `${d.day}: ${d.title}` })),
    },
    provider: { "@type": "TravelAgency", name: SITE.legalName },
  };

  return (
    <>
      <PageHero
        image={p.heroImage}
        title={p.title}
        lead={p.tagline}
        crumbs={[{ label: "Home", href: "/" }, { label: "Tours", href: "/tours" }, { label: catName, href: `/tours/${category}` }, { label: p.title }]}
      >
        {p.titleAccent && (
          <p className="lead" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(20px,2vw,28px)", marginBottom: 14 }}>
            {p.titleAccent}
          </p>
        )}
        <div className="pills" style={{ marginBottom: 22 }}>
          <span className="pill">{duration}</span>
          <span className="pill">{catName}</span>
          <span className="pill">Private Chauffeur Guided</span>
        </div>
        <div className="btns">
          <Link className="btn btn-white" href={`/inquiry?${new URLSearchParams({ package: p.title })}`}>
            Inquire about this tour
          </Link>
          <a className="btn btn-line-light" href="#itinerary">
            View day-by-day journey ↓
          </a>
        </div>
      </PageHero>

      <section>
        <div className="wrap">
          <dl className="facts">
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="gap-sm" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <SeasonStrip pkg={p} />
        </div>
      </section>

      <section className="gap-sm" id="itinerary">
        <div className="wrap tour-layout">
          <div>
            <SectionHead eyebrow="Itinerary" title="Detailed day-by-day" accent="journey" text={p.itineraryIntro} />
            <Timeline days={p.itinerary} />

            <div className="grid g2" style={{ marginTop: "clamp(56px,6vw,88px)" }}>
              <Rise className="stack">
                <h3 className="h4">What&apos;s included</h3>
                <ul className="checks">
                  {p.inclusions.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </Rise>
              <Rise className="stack" delay={0.08}>
                <h3 className="h4">What&apos;s excluded</h3>
                <ul className="checks x">
                  {p.exclusions.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </Rise>
            </div>

            {p.destinations.length > 0 && (
              <div style={{ marginTop: "clamp(56px,6vw,88px)" }}>
                <SectionHead eyebrow="Route" title="Waypoints along the" accent="way" text={p.route.length ? p.route.join(" → ") : undefined} />
                <Rise>
                  <RouteMap single wide routes={[{ id: p.slug, title: p.title, stops: p.destinations }]} />
                </Rise>
                <div className="grid g3" style={{ marginTop: 40 }}>
                  {p.destinations.map((d, i) => (
                    <Rise key={d.name} delay={(i % 3) * 0.06} className="stack" style={{ borderTop: "1px solid var(--grey-2)", paddingTop: 18, gap: 10 }}>
                      <span className="small">Stop {i + 1}</span>
                      <h4 className="h4">{d.name}</h4>
                      <ul className="checks dots">
                        {d.activities.map((a) => (
                          <li key={a} style={{ fontSize: 14.5 }}>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </Rise>
                  ))}
                </div>
              </div>
            )}

            {(p.pace || p.difficulty || p.groupSize) && (
              <ul className="rlist" style={{ marginTop: "clamp(56px,6vw,88px)" }}>
                {p.pace && (
                  <li>
                    <span>Pace &amp; style</span>
                    <span>{p.pace}</span>
                  </li>
                )}
                {p.difficulty && (
                  <li>
                    <span>Difficulty</span>
                    <span>{p.difficulty}</span>
                  </li>
                )}
                {p.groupSize && (
                  <li>
                    <span>Group size</span>
                    <span>{p.groupSize}</span>
                  </li>
                )}
                {typeof p.childFriendly === "boolean" && (
                  <li>
                    <span>Child friendly</span>
                    <span>{p.childFriendly ? "Yes" : "Adults recommended"}</span>
                  </li>
                )}
                {p.accessibilityNotes && (
                  <li>
                    <span>Accessibility</span>
                    <span style={{ textAlign: "right", maxWidth: "48ch" }}>{p.accessibilityNotes}</span>
                  </li>
                )}
              </ul>
            )}
          </div>

          <aside className="tour-aside">
            <div className="booking">
              <div>
                <p className="eyebrow muted">{p.price.sub || "Custom private journey"}</p>
                <p className="price">{p.price.value || "Tailor-made quote"}</p>
                <p className="small" style={{ marginTop: 8 }}>
                  {p.price.note}
                </p>
              </div>
              <hr className="rule" />
              <div className="stack" style={{ gap: 14 }}>
                <p className="eyebrow">Journey highlights</p>
                <ul className="checks">
                  {p.highlights.map((h) => (
                    <li key={h} style={{ fontSize: 14.5 }}>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <BookingActions title={p.title} category={category} id={p.id || p.slug} waHref={waHref} />
            </div>
            <div className="booking" style={{ gap: 12 }}>
              <h4 className="h4">{p.assistance.title || "Speak with our travel specialists"}</h4>
              <p className="small">{p.assistance.text}</p>
              <a className="tlink ulink" href={SITE.phoneHref}>
                {SITE.phone}
              </a>
              <Link className="tlink" href="/tours#travel-info-hub">
                Travel prep: visa, weather &amp; etiquette <Arrow />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="gap-sm grey">
          <div className="wrap">
            <SectionHead eyebrow={p.relatedEyebrow || "More experiences"} title={p.relatedTitle || `Other signature ${catName}`} />
            <div className="grid g3">
              {related.map((r, i) => (
                <Link className="card" href={packageHref(r)} key={r.slug}>
                  <Unmask delay={i * 0.08}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cardFor(r.slug)?.image || r.heroImage} alt={r.title} loading="lazy" />
                    <span className="tag tag-r">{durationLabel(r)}</span>
                  </Unmask>
                  <h3>{r.title}</h3>
                  <p>{r.tagline}</p>
                  <span className="tlink">
                    Explore itinerary <Arrow />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="gap-sm navy">
        <div className="wrap" style={{ display: "grid", gap: 32, justifyItems: "center", textAlign: "center" }}>
          <Rise as="p" className="eyebrow">
            {p.cta.eyebrow || "Pure Journeys • Sacred Experiences"}
          </Rise>
          <Split className="h2 center" style={{ maxWidth: "18ch" }}>
            Ready to experience <em>{p.title}?</em>
          </Split>
          <Rise as="p" className="body center">
            {p.cta.text}
          </Rise>
          <Rise className="btns center">
            <Link className="btn btn-white" href={`/inquiry?${new URLSearchParams({ package: p.title })}`}>
              Inquire about this tour
            </Link>
            <a className="btn btn-line-light" href={waHref} target="_blank" rel="noopener noreferrer">
              WhatsApp travel specialist
            </a>
          </Rise>
        </div>
      </section>

      <WhyLotus />
      <TourFaqs items={[...(p.faqs ?? []), ...TOUR_FAQS.items]} />
      <ClosingCta />
      <MobileTourBar title={p.title} waHref={waHref} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tripJsonLd) }} />
    </>
  );
}
