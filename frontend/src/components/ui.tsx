import Link from "next/link";
import type { ReactNode } from "react";
import { HeroMotion, Rise, Split } from "./motion";
import { CLOSING_CTA, SITE, TOUR_FAQS, WHY_LOTUS, DEFAULT_WA_TEXT, waLink } from "@/lib/site";

/* ------------------------------------------------------------------ icons */
export const Arrow = () => (
  <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);
export const ArrowUpRight = () => (
  <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const ChatIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.2A8.5 8.5 0 1 1 20 11.5z" />
  </svg>
);

/* ------------------------------------------------------------------ text helpers */
/** Render a heading with one italic serif word: the `accent` (or last word) becomes <em>. */
export function Accent({ title, accent }: { title: string; accent?: string }) {
  if (accent) {
    return (
      <>
        {title} <em>{accent}</em>
      </>
    );
  }
  const words = title.trim().split(/\s+/);
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <em>{last}</em>
    </>
  );
}

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i} style={{ display: "contents" }}>
          {i > 0 && <span aria-hidden="true">/</span>}
          {it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ hero */
export function PageHero({
  image,
  eyebrow,
  title,
  accent,
  lead,
  crumbs,
  children,
  short,
  navy,
  alt = "",
}: {
  image?: string;
  eyebrow?: string;
  title: string;
  accent?: string;
  lead?: string;
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  short?: boolean;
  navy?: boolean;
  alt?: string;
}) {
  return (
    <HeroMotion className={`phero ${short ? "phero--short" : ""} ${navy || !image ? "phero--navy" : ""}`}>
      {image && !navy && (
        <div className="phero-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} />
        </div>
      )}
      <div className="wrap phero-in">
        {crumbs && (
          <Rise immediate delay={-0.4}>
            <Crumbs items={crumbs} />
          </Rise>
        )}
        {eyebrow && (
          <Rise as="p" className="eyebrow" immediate delay={-0.3}>
            {eyebrow}
          </Rise>
        )}
        <Split as="h1" className="h1" immediate>
          {accent ? (
            <>
              {title} <em>{accent}</em>
            </>
          ) : (
            title
          )}
        </Split>
        {lead && (
          <Rise as="p" className="lead" immediate>
            {lead}
          </Rise>
        )}
        {children && <Rise immediate delay={0.1}>{children}</Rise>}
      </div>
    </HeroMotion>
  );
}

/* ------------------------------------------------------------------ section head */
export function SectionHead({
  eyebrow,
  title,
  accent,
  text,
  center,
  as = "h2",
  children,
  className = "",
  style,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  text?: string;
  center?: boolean;
  as?: "h1" | "h2";
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`shead ${center ? "center" : ""} ${className}`} style={style}>
      {eyebrow && (
        <Rise as="p" className="eyebrow">
          {eyebrow}
        </Rise>
      )}
      <Split as={as} className="h2" style={center ? { maxWidth: "18ch" } : { maxWidth: "20ch" }}>
        <Accent title={title} accent={accent} />
      </Split>
      {text && (
        <Rise as="p" className="body body--wide">
          {text}
        </Rise>
      )}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ faq */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="acc">
      {items.map((f, i) => (
        <details key={i} open={i === 0}>
          <summary>
            {f.q}
            <span className="pm" aria-hidden="true" />
          </summary>
          <div className="ans">
            <p>{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function TourFaqs({ items = TOUR_FAQS.items, eyebrow = TOUR_FAQS.eyebrow, title = TOUR_FAQS.title, accent = TOUR_FAQS.accent, sub = TOUR_FAQS.sub }: {
  items?: { q: string; a: string }[];
  eyebrow?: string;
  title?: string;
  accent?: string;
  sub?: string;
}) {
  return (
    <section className="gap-sm" id="faqs">
      <div className="wrap split split--top split--wide">
        <SectionHead eyebrow={eyebrow} title={title} accent={accent} text={sub} />
        <Rise>
          <FaqList items={items} />
        </Rise>
      </div>
      <FaqJsonLd items={items} />
    </section>
  );
}

/* ------------------------------------------------------------------ why lotus strip */
export function WhyLotus() {
  return (
    <section className="gap-sm grey" id="why-lotus">
      <div className="wrap">
        <SectionHead eyebrow={WHY_LOTUS.eyebrow} title={WHY_LOTUS.title} accent={WHY_LOTUS.accent} text={WHY_LOTUS.sub} />
        <div className="grid g4">
          {WHY_LOTUS.pillars.map((p, i) => (
            <Rise key={p.title} className="stack" delay={i * 0.08} style={{ borderTop: "1px solid var(--ink)", paddingTop: 22, gap: 14 }}>
              <span className="small" style={{ fontVariantNumeric: "tabular-nums" }}>
                0{i + 1}
              </span>
              <h3 className="h4">{p.title}</h3>
              <p className="small">{p.text}</p>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ closing banner (every page) */
export function ClosingCta({ title = CLOSING_CTA.title, accent = CLOSING_CTA.accent, text = CLOSING_CTA.text, waText = DEFAULT_WA_TEXT, href = "/inquiry" }: {
  title?: string;
  accent?: string;
  text?: string;
  waText?: string;
  href?: string;
}) {
  return (
    <section className="gap grey" id="contact">
      <div className="wrap" style={{ display: "grid", gap: 40, justifyItems: "center" }}>
        <Split className="h2 center" style={{ maxWidth: "17ch" }}>
          <Accent title={title} accent={accent} />
        </Split>
        <Rise as="p" className="body center">
          {text}
        </Rise>
        <Rise className="btns center">
          <Link className="btn btn-navy" href={href}>
            {CLOSING_CTA.primary}
          </Link>
          <a className="btn btn-line" href={waLink(waText)} target="_blank" rel="noopener noreferrer">
            {CLOSING_CTA.secondary}
          </a>
        </Rise>
      </div>
    </section>
  );
}

/** A compact two-button CTA block used inside pages. */
export function CtaBlock({ eyebrow, title, accent, text, primary, primaryHref = "/inquiry", secondary = "Chat on WhatsApp", secondaryHref = waLink(), navy }: {
  eyebrow?: string;
  title: string;
  accent?: string;
  text: string;
  primary: string;
  primaryHref?: string;
  secondary?: string;
  secondaryHref?: string;
  navy?: boolean;
}) {
  return (
    <section className={`gap-sm ${navy ? "navy" : ""}`}>
      <div className="wrap split">
        <SectionHead eyebrow={eyebrow} title={title} accent={accent} className="" style={{ marginBottom: 0 }} />
        <Rise className="stack">
          <p className="body body--wide">{text}</p>
          <div className="btns">
            <Link className={`btn ${navy ? "btn-white" : "btn-navy"}`} href={primaryHref}>
              {primary}
            </Link>
            <a className={`btn ${navy ? "btn-line-light" : "btn-line"}`} href={secondaryHref} target={secondaryHref.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
              {secondary}
            </a>
          </div>
        </Rise>
      </div>
    </section>
  );
}

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: SITE.legalName,
  alternateName: SITE.name,
  slogan: SITE.slogan,
  logo: "/media/logo-full.png",
  foundingDate: String(SITE.founded),
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.line1,
    addressLocality: SITE.address.city,
    postalCode: SITE.address.postalCode,
    addressCountry: "LK",
  },
  geo: { "@type": "GeoCoordinates", latitude: SITE.coordinates.lat, longitude: SITE.coordinates.lng },
  sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.youtube],
};
