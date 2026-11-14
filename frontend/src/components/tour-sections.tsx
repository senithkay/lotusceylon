import Link from "next/link";
import type { Category, ComparisonTable, TourPackage } from "@/lib/content";
import { packageHref } from "@/lib/content";
import { waLink } from "@/lib/site";
import { Rise, Split, Unmask } from "./motion";
import { Accent, SectionHead } from "./ui";
import { RouteMap, type MapRoute } from "./tours";

/* ------------------------------------------------------------------ season strip */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function monthRatings(p: { bestSeason?: string; category: string; title: string }) {
  const season = (p.bestSeason || "").toLowerCase();
  const cat = p.category.toLowerCase();
  const title = p.title.toLowerCase();
  if (cat === "beach" || cat === "honeymoon") {
    if (season.includes("may to october") || season.includes("east") || title.includes("eastern")) return [3, 3, 2, 2, 1, 1, 1, 1, 1, 2, 3, 3];
    return [1, 1, 1, 1, 3, 3, 2, 2, 3, 3, 2, 1];
  }
  if (cat === "cultural" || cat === "ramayana") return [1, 1, 1, 2, 2, 1, 1, 1, 1, 3, 3, 2];
  if (cat === "hill-country") return [1, 1, 1, 1, 2, 2, 1, 1, 2, 3, 3, 2];
  if (cat === "wildlife") return [1, 1, 1, 2, 2, 1, 1, 1, 1, 3, 3, 1];
  if (cat === "ayurvedic") return [1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 1];
  return [1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 2, 1];
}

export function SeasonStrip({ pkg }: { pkg: TourPackage }) {
  const r = monthRatings(pkg);
  const cls = ["", "m-peak", "m-good", "m-mod"];
  const lbl = ["", "Peak", "Pleasant", "Lush"];
  return (
    <Rise className="season">
      <div className="season-head">
        <h3 className="h4">
          Best time to visit: <span className="muted">{pkg.bestSeason || "Year-round destination"}</span>
        </h3>
        <div className="season-legend">
          <span>
            <i className="m-peak" /> Peak conditions
          </span>
          <span>
            <i className="m-good" /> Pleasant touring
          </span>
          <span>
            <i className="m-mod" /> Tropical monsoon
          </span>
        </div>
      </div>
      <div className="months">
        {MONTHS.map((m, i) => (
          <div key={m} className={`month ${cls[r[i]]}`} title={`${m}: ${lbl[r[i]]}`}>
            {m}
            <i />
            <small>{lbl[r[i]]}</small>
          </div>
        ))}
      </div>
      <p className="small">
        <b style={{ color: "var(--ink)", fontWeight: 500 }}>Dual microclimate note:</b> Sri Lanka benefits from two alternating monsoon cycles on opposite coastlines. When the south is damp, the eastern and northern bays remain sun-drenched and serene — ensuring Lotus Ceylon journeys offer perfect conditions every single month of the year.
      </p>
    </Rise>
  );
}

/* ------------------------------------------------------------------ comparison */
export function Comparison({ table, intro }: { table: ComparisonTable; intro: { eyebrow: string; title: string; note: string } }) {
  const pk = table.packageDetails;
  const groups = [...table.groups].sort((a, b) => a.order - b.order);
  return (
    <section className="gap-sm" id="package-comparison">
      <div className="wrap">
        <SectionHead eyebrow={intro.eyebrow.replace(/^✦\s*/, "")} title={intro.title} text={intro.note} />
        <Rise className="ctable-wrap">
          <table className="ctable">
            <caption className="sr-only">Comparison of tour packages by destination and highlights</caption>
            <thead>
              <tr>
                <th scope="col">Destinations &amp; key sights</th>
                {pk.map((p) => (
                  <th scope="col" className="c" key={p.slug}>
                    <Link className="ulink" href={`/tours/${table.category}/${p.slug}`}>
                      {p.name}
                    </Link>
                    <small>
                      {p.nights} Nights / {p.days} Days
                    </small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <GroupRows key={g.id} g={g} pk={pk} />
              ))}
            </tbody>
          </table>
        </Rise>
      </div>
    </section>
  );
}

function GroupRows({ g, pk }: { g: ComparisonTable["groups"][number]; pk: ComparisonTable["packageDetails"] }) {
  const sights = [...g.sights].sort((a, b) => a.order - b.order);
  const groupHas = (slug: string) => g.manualTicks?.[slug] || sights.some((s) => s.includedIn.includes(slug));
  return (
    <>
      <tr className="grp">
        <th scope="row">{g.label}</th>
        {pk.map((p) => (
          <td className="c" key={p.slug} style={{ background: "var(--grey-1)" }}>
            {groupHas(p.slug) ? <span className="tick" aria-label="Included" /> : <span className="dash" aria-label="Not included" />}
          </td>
        ))}
      </tr>
      {sights.map((s) => (
        <tr className="sight" key={s.id}>
          <td>{s.label}</td>
          {pk.map((p) => (
            <td className="c" key={p.slug}>
              {s.includedIn.includes(p.slug) ? <span className="tick" aria-label="Included" /> : <span className="dash" aria-label="Not included" />}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ package list on category pages */
export function PackageList({ cat, pkgs }: { cat: Category; pkgs: TourPackage[] }) {
  return (
    <div>
      {cat.packagesSection.cards.map((c, i) => {
        const p = pkgs.find((x) => x.slug === c.slug);
        const href = `/tours/${cat.slug}/${c.slug}`;
        return (
          <article className="pcard" key={c.slug}>
            <Link href={href} aria-label={c.title}>
              <Unmask>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={`${c.title} Sri Lanka`} loading="lazy" />
                {c.badge && <span className="badge-tag">{c.badge}</span>}
              </Unmask>
            </Link>
            <Rise>
              <span className="num">
                {String(i + 1).padStart(2, "0")} · {c.duration || (p ? `${p.nights} Nights / ${p.days} Days` : "")}
              </span>
              {c.label && <p className="eyebrow muted" style={{ marginTop: 14 }}>{c.label}</p>}
              <h3>
                <Link href={href}>{c.title}</Link>
              </h3>
              {c.route && (
                <p className="route">
                  <span style={{ color: "var(--ink)" }}>Route:</span> {c.route}
                </p>
              )}
              <p className="desc">{c.desc}</p>
              {c.highlights.length > 0 && (
                <ul className="checks" style={{ marginTop: 22 }}>
                  {c.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
              {c.price && <p className="h4" style={{ marginTop: 22 }}>{c.price}</p>}
              <div className="btns">
                <Link className="btn btn-navy" href={href}>
                  View full itinerary
                </Link>
                <Link className="btn btn-line" href={`/inquiry?${new URLSearchParams({ package: c.title })}`}>
                  Inquire
                </Link>
              </div>
            </Rise>
          </article>
        );
      })}
    </div>
  );
}

export const routesFor = (pkgs: TourPackage[]): MapRoute[] =>
  pkgs.map((p) => ({ id: p.id || p.slug, title: p.title, href: packageHref(p), stops: p.destinations }));

/* ------------------------------------------------------------------ circuit (map + editorial) */
export function Circuit({ cat, pkgs }: { cat: Category; pkgs: TourPackage[] }) {
  const c = cat.circuit;
  if (!c) return null;
  const catName = cat.hero.title.replace(/^Sri Lanka\s+/, "");
  return (
    <section className="gap-sm" id={`${cat.slug}-map`}>
      <div className="wrap split split--top">
        <Rise>
          <RouteMap routes={routesFor(pkgs)} />
        </Rise>
        <div className="stack-lg">
          <Rise as="p" className="eyebrow">
            {c.eyebrow.replace(/^✦\s*/, "")}
          </Rise>
          <Rise>
            <blockquote className="quote">{c.quote}</blockquote>
            <span className="quote-cap">{c.quoteCaption}</span>
          </Rise>
          <Split className="h3">
            <Accent title={c.title} accent={c.accent} />
          </Split>
          <Rise as="p" className="body body--wide" dangerouslySetInnerHTML={{ __html: c.leadHtml }} />
          <Rise className="stack" style={{ gap: 12 }}>
            <span className="small">{c.label}</span>
            <div className="stops">
              {c.stops.map((s, i) => (
                <span key={s} style={{ display: "contents" }}>
                  {i > 0 && <span className="sep">→</span>}
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </Rise>
          <Rise>
            <ul className="checks dots">
              {c.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </Rise>
          <Rise className="btns">
            <Link className="btn btn-navy" href={`/inquiry?${new URLSearchParams({ category: cat.hero.title })}`}>
              {c.ctaPrimary.replace(/\s*➔$/, "") || "Plan your custom tour"}
            </Link>
            <a className="btn btn-line" href={waLink(`Hello Lotus Ceylon! I would like to inquire about a custom ${catName} package.`)} target="_blank" rel="noopener noreferrer">
              {c.ctaWhatsapp || "Chat on WhatsApp"}
            </a>
          </Rise>
        </div>
      </div>
    </section>
  );
}
