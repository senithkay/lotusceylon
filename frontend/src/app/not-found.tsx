import Link from "next/link";
import { waLink } from "@/lib/site";
import { ClosingCta, PageHero } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <PageHero
        image="/assets/images/hill-country/nuwara-eliya-tea-2.webp"
        eyebrow="404 · Pure Journeys • Sacred Experiences"
        title="The path has gently drifted"
        accent="away"
        lead="Like morning mist over the Central Highlands, the sacred trail you are seeking is no longer here. Let our travel curators guide you back to our curated Sri Lanka tour collections."
      >
        <div className="btns">
          <Link className="btn btn-white" href="/tours">
            Explore tour packages
          </Link>
          <Link className="btn btn-line-light" href="/">
            Return to home
          </Link>
          <a className="btn btn-line-light" href={waLink("Hello Lotus Ceylon! I need assistance finding a tour.")} target="_blank" rel="noopener noreferrer">
            Concierge support
          </a>
        </div>
      </PageHero>
      <ClosingCta />
    </>
  );
}
