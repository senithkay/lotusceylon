import type { Metadata } from "next";
import Link from "next/link";
import { legalPages } from "@/lib/content";
import { Rise } from "./motion";
import { ClosingCta, PageHero } from "./ui";

export const legalMetadata = (key: string): Metadata => {
  const l = legalPages[key];
  return { title: { absolute: l.metaTitle }, description: l.metaDescription };
};

const OTHERS = [
  { href: "/privacy-policy", label: "Privacy Policy", key: "privacy-policy" },
  { href: "/terms-conditions", label: "Terms & Conditions", key: "terms-conditions" },
  { href: "/cancellation-policy", label: "Cancellation Policy", key: "cancellation-policy" },
  { href: "/cookie-policy", label: "Cookie Policy", key: "cookie-policy" },
];

export function LegalPage({ k }: { k: string }) {
  const l = legalPages[k];
  const [updated, sub] = l.paragraphs.length > 1 ? l.paragraphs : ["", l.paragraphs[0]];
  return (
    <>
      <PageHero navy eyebrow={l.badge.replace(/^✦\s*/, "")} title={l.title} lead={sub} crumbs={[{ label: "Home", href: "/" }, { label: l.title }]}>
        {updated && <p className="small" style={{ color: "#B8C2D6" }}>{updated}</p>}
      </PageHero>
      <section className="gap-sm">
        <div className="wrap split split--top split--wide">
          <Rise as="nav" aria-label="Policies" className="stack" style={{ position: "sticky", top: 100, gap: 0 }}>
            <ul className="rlist">
              {OTHERS.map((o) => (
                <li key={o.key}>
                  <Link className="ulink" href={o.href} aria-current={o.key === k ? "page" : undefined} style={{ color: o.key === k ? "var(--ink)" : "var(--grey-3)" }}>
                    {o.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Rise>
          <div className="stack-lg">
            {l.disclaimerHtml && <Rise className="callout" dangerouslySetInnerHTML={{ __html: l.disclaimerHtml }} />}
            <Rise className="prose" dangerouslySetInnerHTML={{ __html: l.bodyHtml }} />
          </div>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
