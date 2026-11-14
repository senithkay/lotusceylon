import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPost } from "@/lib/content";
import { SITE } from "@/lib/site";
import { Rise, Unmask } from "@/components/motion";
import { ArrowUpRight, ClosingCta, PageHero } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const b = getPost(slug);
  if (!b) return {};
  return { title: { absolute: b.metaTitle }, description: b.metaDescription, openGraph: { type: "article", images: [b.cover] } };
}

const niceDate = (d: string) => (/^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : d);

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const b = getPost(slug);
  if (!b) notFound();
  const a = b.activity;
  const more = blogPosts.filter((x) => x.slug !== b.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: b.title,
    description: b.metaDescription,
    image: b.cover,
    author: { "@type": "Organization", name: b.author || SITE.name },
    publisher: { "@type": "Organization", name: SITE.legalName },
  };

  return (
    <>
      <PageHero
        image={b.cover}
        eyebrow={`${b.category} · ${b.readTime} · ${niceDate(b.date)}${a ? ` · ★ ${a.rating} (100+ Reviews)` : ""}`}
        title={b.title}
        short
        crumbs={[{ label: "Home", href: "/" }, { label: "Journal", href: "/blog" }, { label: b.category }]}
      />
      <article className="gap-sm">
        <div className="wrap wrap--text">
          <Rise as="p" className="small" style={{ marginBottom: 40 }}>
            By <b style={{ color: "var(--ink)", fontWeight: 500 }}>{b.byline || b.author}</b>
          </Rise>

          {a && (
            <Rise className="booking" style={{ marginBottom: 56 }}>
              <div className="pills" style={{ color: "var(--ink)" }}>
                <span className="pill">★ {a.rating}</span>
                <span className="pill">{a.reviews}</span>
                <span className="pill">{a.badge}</span>
              </div>
              <h2 className="h3">{a.title}</h2>
              <p className="small">{a.text}</p>
              <p className="callout">
                <b style={{ fontWeight: 500 }}>🏆 {a.calloutTitle}</b>
                <br />
                {a.calloutText}
              </p>
              <div className="season-head" style={{ alignItems: "center" }}>
                <p className="price" style={{ margin: 0 }}>
                  <span className="small">From </span>
                  {a.priceFrom} <span className="small">{a.priceUnit}</span>
                </p>
                <Link className="btn btn-navy" href={a.href}>
                  {a.cta}
                </Link>
              </div>
            </Rise>
          )}

          <Rise className="prose" dangerouslySetInnerHTML={{ __html: b.bodyHtml }} />

          <Rise className="btns" style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid var(--grey-2)" }}>
            {b.footerLinks.map((l, i) => (
              <Link key={l.href + l.label} className={`btn ${i === 0 ? "btn-line" : "btn-navy"}`} href={l.href}>
                {l.label.replace(/\s*➔$/, "")}
              </Link>
            ))}
          </Rise>
        </div>
      </article>

      <section className="gap-sm grey">
        <div className="wrap">
          <h2 className="h3" style={{ marginBottom: 40 }}>
            More from the Lotus <em>journal</em>
          </h2>
          <div className="grid g3">
            {more.map((m, i) => (
              <Link className="card" href={`/blog/${m.slug}`} key={m.slug}>
                <Unmask delay={i * 0.08}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.cover} alt="" loading="lazy" />
                </Unmask>
                <p className="k">{m.category}</p>
                <h3>{m.title}</h3>
                <span className="tlink">
                  {m.readTime} <ArrowUpRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ClosingCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
