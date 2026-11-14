import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations, durationLabel, getCategory, getDestination, packageHref, packages } from "@/lib/content";
import { Rise, Split, Unmask } from "@/components/motion";
import { Arrow, ClosingCta, PageHero, SectionHead } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const d = getDestination(slug);
  if (!d) return {};
  return { title: { absolute: d.metaTitle }, description: d.metaDescription, openGraph: { images: [d.heroImage] } };
}

/** Words that identify a destination inside package routes (e.g. "Kandy (Temple of the Tooth)" → kandy). */
const keysFor = (title: string) =>
  title
    .replace(/\(.*?\)/g, "")
    .split(/[&,/]| and /i)
    .map((s) => s.trim().toLowerCase().replace(/\s+(beach|national park|rock citadel|dutch fort)$/, ""))
    .filter((s) => s.length > 2);

export default async function DestinationPage(props: PageProps<"/destinations/[slug]">) {
  const { slug } = await props.params;
  const d = getDestination(slug);
  if (!d) notFound();
  const keys = keysFor(d.title);
  const related = packages
    .filter((p) => {
      const hay = [...p.route, ...p.destinations.map((x) => x.name)].join(" | ").toLowerCase();
      return keys.some((k) => hay.includes(k));
    })
    .slice(0, 6);
  const others = destinations.filter((x) => x.filter === d.filter && x.slug !== d.slug).slice(0, 3);

  return (
    <>
      <PageHero
        image={d.heroImage}
        eyebrow={d.badge}
        title={d.title}
        lead={d.desc}
        short
        crumbs={[{ label: "Home", href: "/" }, { label: "Destinations", href: "/destinations" }, { label: d.title }]}
      >
        <div className="pills">
          {d.highlights.map((h) => (
            <span className="pill" key={h}>
              {h}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="gap">
        <div className="wrap split split--top">
          <div className="stack-lg">
            <Rise as="p" className="eyebrow">
              {d.region}
            </Rise>
            <Split className="h2">
              Cultural &amp; natural <em>essence</em>
            </Split>
          </div>
          <div className="stack-lg">
            <Rise as="p" className="lede" style={{ fontSize: "clamp(20px,1.9vw,27px)" }}>
              {d.essence}
            </Rise>
            <Rise className="stack">
              <h3 className="h4">{d.experiencesTitle}</h3>
              <ul className="rlist">
                {d.highlights.map((h, i) => (
                  <li key={h}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
        </div>
      </section>

      <section className="gap-b">
        <div className="wrap">
          <Unmask className="ph-fig ratio-169">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.image} alt={`${d.title} Sri Lanka`} loading="lazy" />
          </Unmask>
        </div>
      </section>

      {related.length > 0 && (
        <section className="gap-sm grey">
          <div className="wrap">
            <SectionHead eyebrow="Related journeys" title={`Private tours visiting ${d.title.replace(/\s*\(.*\)/, "")}`} />
            <div className="grid g3">
              {related.map((p) => (
                <Link className="card" href={packageHref(p)} key={p.slug}>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getCategory(p.category)?.packagesSection.cards.find((c) => c.slug === p.slug)?.image || p.heroImage} alt={p.title} loading="lazy" />
                    <span className="tag tag-r">{durationLabel(p)}</span>
                  </figure>
                  <p className="k">{getCategory(p.category)?.hero.title.replace(/^Sri Lanka\s+/, "")}</p>
                  <h3>{p.title}</h3>
                  <p>{p.tagline}</p>
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
        <div className="wrap split">
          <div className="stack-lg">
            <Rise as="p" className="eyebrow">
              {d.planEyebrow}
            </Rise>
            <Split className="h2">{d.planTitle}</Split>
          </div>
          <Rise className="stack">
            <p className="body body--wide">{d.planText}</p>
            <div className="btns">
              <Link className="btn btn-white" href={`/inquiry?${new URLSearchParams({ destination: d.title })}`}>
                {d.planButton}
              </Link>
            </div>
          </Rise>
        </div>
      </section>

      {others.length > 0 && (
        <section className="gap-sm">
          <div className="wrap">
            <SectionHead eyebrow={d.region} title="More destinations to" accent="explore" />
            <div className="grid g3">
              {others.map((o) => (
                <Link className="card" href={`/destinations/${o.slug}`} key={o.slug}>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.image} alt={o.title} loading="lazy" />
                  </figure>
                  <h3>{o.title}</h3>
                  <p>{o.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ClosingCta />
    </>
  );
}
