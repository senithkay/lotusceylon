import type { Metadata } from "next";
import { SITE, waLink } from "@/lib/site";
import { NavyBand, Rise, Split, Unmask } from "@/components/motion";
import { ClosingCta, CtaBlock, PageHero, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: { absolute: "About Lotus Ceylon | Premier Sri Lankan Inbound Tour Operator Since 2014" },
  description:
    "Lotus Ceylon International Tours & Services (Private) Limited is a premier Sri Lankan inbound tourism company creating authentic, meaningful and memorable travel experiences since 2014.",
};

const GOVERNANCE = [
  { title: "Registered Inbound Operator", text: "Officially incorporated and registered Inbound Tour Operator in the Democratic Socialist Republic of Sri Lanka.", k: "Company Reg No", v: SITE.companyReg },
  { title: "Company Leadership", text: "Guided by strategic leadership committed to international standards, ethical tourism, and personalized service.", k: "Director", v: SITE.director },
  { title: "Established Since 2014", text: "Operating dedicated inbound journeys across Sri Lanka with local representative desks across approximately 10 countries, delivering genuine Ceylon hospitality.", k: "Tenure", v: "Since 2014" },
  { title: "Global Multilingual Concierge", text: "Active representative desks and fluent travel designers supporting English, Chinese, German, Russian, and Arabic travelers.", k: "Channels", v: "WhatsApp, WeChat & LINE" },
];

const TEAM = [
  { name: SITE.director, role: "Director", country: "🇱🇰 Sri Lanka", alt: `Director ${SITE.director}` },
  { name: "Mr. Kuenga Yarpel", role: "The Lotus Representative, Bhutan", country: "🇧🇹 Bhutan", alt: "Mr. Kuenga Yarpel, The Lotus Representative, Bhutan" },
];

const PILLARS = [
  { t: "Sacred & Spiritual Respect", d: "We provide scholarly, respectful access to Sri Lanka's revered Buddhist shrines—including the Sacred Temple of the Tooth Relic, Jaya Sri Maha Bodhi, and cave temples of Dambulla—honoring traditions and offering true spiritual clarity." },
  { t: "Unrivaled Personalization", d: "No rigid group schedules or cookie-cutter routes. Every itinerary is 100% tailor-made to your pace, dietary needs, mobility preferences, and personal curiosities by our senior travel designers." },
  { t: "Safety, Fleet & Chauffeur Excellence", d: "Travel in modern, comprehensively insured, air-conditioned luxury vehicles driven by government-licensed, background-verified national chauffeur guides who double as your private cultural ambassadors." },
  { t: "Sustainable Community Value", d: "We support local artisan communities, heritage preservation, rural eco-lodges, and ethical wildlife conservation. Your journey directly benefits Sri Lankan families and protects island ecosystems." },
];

const STATS = [
  { v: "10+", l: "Years of Excellence", s: "Operating dedicated inbound journeys since 2014" },
  { v: "100%", l: "Tailor-Made", s: "Bespoke itineraries customized to your desires" },
  { v: "24/7", l: "Dedicated Concierge", s: "Around-the-clock trip coordination & support" },
  { v: SITE.companyReg, l: "Company Reg", s: "Incorporated in Sri Lanka" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        image="/assets/images/buddhist-heritage/ruwanwelisaya-2.webp"
        eyebrow="About Lotus Ceylon"
        title="Journeys that connect you with nature, culture &"
        accent="spirit"
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <section className="gap" id="story">
        <div className="wrap" style={{ display: "grid", gap: "clamp(56px,7vw,110px)" }}>
          <Split as="p" className="say center" style={{ font: "500 clamp(28px,3.6vw,54px)/1.15 var(--sans)", letterSpacing: "-0.035em", maxWidth: "24ch", margin: "0 auto" }}>
            “Inspired by the lotus—a symbol of purity, sacredness, resilience and natural beauty—LOTUS invites you to discover Sri Lanka through journeys that connect you with its nature, culture, heritage and <em>spirit.”</em>
          </Split>
          <div className="split">
            <Unmask className="ph-fig ratio-45">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/buddhist-heritage/ruwanwelisaya-2.webp" alt="Ruwanwelisaya Stupa, Anuradhapura" loading="lazy" />
              <figcaption>
                <b>Pure Journeys • Sacred Experiences</b>Curating bespoke expeditions across Sri Lanka&apos;s cultural, spiritual and natural wonders since 2014.
              </figcaption>
            </Unmask>
            <div className="stack-lg">
              <Rise as="p" className="lede">
                LOTUS CEYLON INTERNATIONAL TOURS &amp; SERVICES (PRIVATE) LIMITED is a premier Sri Lankan inbound tourism company dedicated to creating authentic, meaningful and memorable travel experiences across Sri Lanka.
              </Rise>
              <Rise as="p" className="body body--wide">
                From cultural heritage and sacred Buddhist sites to wildlife, pristine coasts, misty tea mountains, and the world-renowned flavours of Ceylon, we connect travellers with the people, places and experiences that make Sri Lanka unique with deep cultural understanding and genuine Sri Lankan hospitality.
              </Rise>
              <Rise as="p" className="body body--wide">
                We believe that travel is not merely transit, but a sacred encounter. Whether walking quietly around ancient stupas that have stood for two millennia, breathing in the fresh morning air of high-altitude tea plantations, or watching wild elephants congregate by water reservoirs at dusk, our journeys leave enduring memories in the hearts of our guests.
              </Rise>
            </div>
          </div>
        </div>
      </section>

      <section className="gap-sm grey">
        <div className="wrap">
          <SectionHead eyebrow="Our guiding compass" title="Vision, mission &" accent="governance" text="Our foundation is rooted in professional accountability, respect for Sri Lankan heritage, and unwavering dedication to responsible travel." />
          <div className="grid g2" style={{ marginBottom: "clamp(56px,6vw,88px)" }}>
            <Rise className="stack" style={{ borderTop: "1px solid var(--ink)", paddingTop: 24 }}>
              <h3 className="h3">
                Our <em>vision</em>
              </h3>
              <p className="body body--wide">To become a trusted gateway to Sri Lanka, connecting travellers with authentic experiences, diverse cultures, beautiful places and meaningful human connections.</p>
            </Rise>
            <Rise className="stack" delay={0.08} style={{ borderTop: "1px solid var(--ink)", paddingTop: 24 }}>
              <h3 className="h3">
                Our <em>mission</em>
              </h3>
              <p className="body body--wide">To provide personalized, safe and responsible travel experiences that highlights Sri Lanka&apos;s heritage, nature, culture, spirituality and hospitality while creating meaningful value for travellers and local communities.</p>
            </Rise>
          </div>
          <div className="grid g4">
            {GOVERNANCE.map((g, i) => (
              <Rise key={g.title} delay={i * 0.06} className="stack" style={{ borderTop: "1px solid var(--grey-2)", paddingTop: 20, gap: 12 }}>
                <h4 className="h4">{g.title}</h4>
                <p className="small">{g.text}</p>
                <p className="small" style={{ color: "var(--ink)" }}>
                  <span className="muted">{g.k}:</span> {g.v}
                </p>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      <section className="gap-sm" id="headquarters" style={{ scrollMarginTop: 80 }}>
        <div className="wrap split split--top">
          <SectionHead eyebrow="Official headquarters & registered office" title={SITE.legalName.replace(/ \(Private\) Limited$/, "")} accent="(Private) Limited" style={{ marginBottom: 0 }} />
          <Rise>
            <ul className="rlist">
              <li>
                <span>Physical office address</span>
                <span style={{ textAlign: "right" }}>
                  {SITE.address.line1},<br />
                  {SITE.address.city}, {SITE.address.country} – {SITE.address.postalCode}
                </span>
              </li>
              <li>
                <span>Direct phone &amp; WhatsApp hotline</span>
                <a className="ulink" href={SITE.phoneHref}>
                  {SITE.phone}
                </a>
              </li>
              <li>
                <span>Email</span>
                <a className="ulink" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </li>
              <li>
                <span>WeChat ID</span>
                <span>
                  {SITE.wechat} ({SITE.phone})
                </span>
              </li>
              <li>
                <span>LINE ID</span>
                <span>
                  {SITE.line} (Line Phone: {SITE.linePhone})
                </span>
              </li>
            </ul>
          </Rise>
        </div>
      </section>

      <section className="gap-sm" id="ourPeople">
        <div className="wrap">
          <SectionHead
            eyebrow="Dedicated local leadership"
            title="Our people & global"
            accent="representatives"
            text="Founded in 2014, Lotus Ceylon International Tours & Services crafts private, tailor-made journeys across the sacred island of Sri Lanka. With dedicated local representatives across approximately 10 countries and seamless concierge support via WhatsApp, WeChat, and LINE, we offer travelers around the globe authentic, culturally coherent, and deeply respectful travel experiences."
          />
          <div className="grid g2">
            {TEAM.map((m, i) => (
              <article className="card" key={m.name}>
                <Unmask delay={i * 0.08} style={{ aspectRatio: "3 / 2" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/about/hospitality-scenes-1.webp" alt={m.alt} loading="lazy" />
                  <span className="tag">{m.country}</span>
                </Unmask>
                <h3>{m.name}</h3>
                <p className="k" style={{ marginTop: 0 }}>
                  {m.role}
                </p>
                <p>Introduction coming soon</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gap-sm">
        <div className="wrap">
          <SectionHead eyebrow="Our core ethos" title="Four pillars of every Lotus Ceylon" accent="journey" text="Every bespoke itinerary is carefully constructed around these principles to ensure deep cultural resonance, peace of mind, and authentic delight." />
          <div className="grid g4">
            {PILLARS.map((p, i) => (
              <Rise key={p.t} delay={i * 0.06} className="stack" style={{ borderTop: "1px solid var(--ink)", paddingTop: 22, gap: 12 }}>
                <span className="small">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h4">{p.t}</h3>
                <p className="small">{p.d}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      <NavyBand className="gap">
        <div className="wrap">
          <Rise as="p" className="eyebrow center">
            Proven heritage
          </Rise>
          <Split className="h2 center" style={{ maxWidth: "18ch", marginTop: 28 }}>
            Why discerning travelers choose Lotus <em>Ceylon</em>
          </Split>
          <Rise as="p" className="body center" style={{ marginTop: 28 }}>
            From VIP airport concierge greetings to your final departure wave, our dedicated team accompanies your journey with attentiveness and warmth.
          </Rise>
          <div className="figs figs--4">
            {STATS.map((s) => (
              <div className="fig" key={s.l}>
                <b style={{ fontSize: s.v.length > 6 ? "clamp(26px,2.6vw,40px)" : undefined }}>{s.v}</b>
                <span>{s.l}</span>
                <small>{s.s}</small>
              </div>
            ))}
          </div>
        </div>
      </NavyBand>

      <CtaBlock
        eyebrow="Begin your adventure"
        title="Ready to experience the authentic soul of Sri"
        accent="Lanka?"
        text="Connect directly with our master travel designers to craft your personalized private journey across Ceylon's ancient temples, wildlife sanctuaries, and tranquil shores."
        primary="Design your custom tour"
        secondaryHref={waLink()}
      />
      <ClosingCta />
    </>
  );
}
