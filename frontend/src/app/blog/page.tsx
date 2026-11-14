import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/content";
import { UnmaskChildren } from "@/components/motion";
import { ArrowUpRight, ClosingCta, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: { absolute: "Sri Lanka Travel Journal | Stories from Ceylon | Lotus Ceylon" },
  description: "Thoughtful travel chronicles, wildlife encounters, sacred perspectives, and seasonal guides from our destination specialists in Sri Lanka.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        image="/assets/images/blog/ella-tea-making-banner.webp"
        eyebrow="Editorial & Ceylon stories"
        title="Stories from"
        accent="Ceylon"
        lead="Insights, journeys & heritage. Thoughtful travel chronicles, wildlife encounters, sacred perspectives, and seasonal guides from our destination specialists in Sri Lanka."
        crumbs={[{ label: "Home", href: "/" }, { label: "Journal" }]}
      />
      <section className="gap-sm">
        <div className="wrap">
          <UnmaskChildren selector=".post figure">
            {blogPosts.map((p) => (
              <Link className="post" href={`/blog/${p.slug}`} key={p.slug} style={{ borderTop: 0 }}>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.cover} alt={p.title} loading="lazy" />
                </figure>
                <div>
                  <p className="k">{p.category}</p>
                  <h3>{p.title}</h3>
                  <p className="body">{p.excerpt}</p>
                  <div className="meta">
                    <span>
                      {p.readTime}
                      {p.cardRating ? ` · ${p.cardRating}` : ""}
                      {p.cardPrice ? ` · ${p.cardPrice}` : ` · ${p.date}`}
                    </span>
                    <span className="tlink">
                      Read story <ArrowUpRight />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </UnmaskChildren>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
