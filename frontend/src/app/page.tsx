import Link from "next/link";
import { blogPosts } from "@/lib/content";
import { CountUp, DragStrip, NavyBand, Rise, Split, Unmask, UnmaskChildren, WideReveal } from "@/components/motion";
import { DestinationSwapSection, FeatureJourneys, HeroFilm } from "@/components/home";
import { Arrow, ArrowUpRight, ClosingCta, FaqJsonLd, FaqList, SectionHead } from "@/components/ui";

const HERO_LEAD =
  "Step into an island of extraordinary heritage, misty tea hills, untamed wildlife, and sun-kissed coasts — curated with unmatched luxury and heartfelt devotion.";

const DECK = [
  { image: "/assets/images/cultural/polonnaruwa-gal-vihara-3.webp", title: "Three Millennia of Living Heritage", href: "/tours/cultural/three-millennia-of-living-heritage" },
  { image: "/assets/images/wildlife/yala-leopard-1.webp", title: "The Sri Lanka Big Five Expedition", href: "/tours/wildlife/the-sri-lanka-big-five-expedition" },
  { image: "/assets/images/beach/mirissa-1.webp", title: "Southern Sands Serenade", href: "/tours/beach/southern-sands-serenade" },
  { image: "/media/ceylon-tea-tasting-terrace.jpg", title: "Ceylon Tea Trails and Colonial Grandeur", href: "/tours/hill-country/ceylon-tea-trails-colonial-grandeur" },
];

const ROWS = [
  { label: "Anuradhapura", href: "/destinations/anuradhapura", image: "/assets/images/buddhist-heritage/jaya-sri-maha-bodhi-1.webp", alt: "Anuradhapura sacred stupas and Bodhi tree", caption: "Ancient capital of great stupas and the revered Sri Maha Bodhi tree." },
  { label: "Kandy", href: "/destinations/kandy", image: "/assets/images/cultural/kandy-temple-of-tooth-4.webp", alt: "Temple of the Sacred Tooth Relic, Kandy", caption: "Home of the Sacred Tooth Relic, surrounded by tranquil hills and living traditions." },
  { label: "Sigiriya", href: "/destinations/sigiriya-rock-citadel", image: "/assets/images/cultural/sigiriya-1.webp", alt: "Sigiriya fifth-century rock citadel", caption: "Dramatic fifth-century rock citadel rising from the jungle with ancient frescoes and water gardens." },
  { label: "Ella and Highlands", href: "/destinations/ella-demodara", image: "/assets/images/hill-country/nine-arches-bridge-1.webp", alt: "Ella Demodara Nine Arches and scenic ridges", caption: "Misty mountain ridges, cascading waterfalls, emerald tea trails and the scenic railway." },
  { label: "Explore all 24 destinations", href: "/destinations", image: "/assets/images/beach/mirissa-1.webp", alt: "Sri Lanka coast", caption: "Sacred sites, cultural capitals, tea highlands, wildlife parks and pristine coasts." },
];

const FIGURES = [
  { n: 12, s: "+", label: "Years of Inbound Excellence" },
  { n: 10, s: "+", label: "Global Country Representatives" },
  { n: 29, s: "", label: "Signature private journeys" },
  { n: 100, s: "%", label: "Tailor-Made Private Itineraries" },
  { n: 24, s: "/7", label: "Dedicated Trip Concierge" },
  { n: 11, s: "", label: "Holiday themes" },
];

const WHY_POINTS = [
  ["100% Tailor-Made Itineraries", "Every journey is customized to your personal pace, interests, and budget."],
  ["Sacred Buddhist & Heritage Guidance", "Scholarly access to ancient stupas, sacred relics, and cultural immersion."],
  ["24/7 Dedicated Trip Concierge", "Seamless airport VIP arrival greeting and around-the-clock coordinator care."],
  ["Private Luxury Fleet & Chauffeur Guides", "Impeccable air-conditioned vehicles driven by licensed national guides."],
  ["Handpicked Eco & Boutique Stays", "Audited heritage tea bungalows, Ayurvedic sanctuaries, and luxury seaside villas."],
];

const JOURNEYS = [
  { bg: "/assets/images/cultural/polonnaruwa-gal-vihara-3.webp", image: "/assets/images/cultural/dambulla-cave-temple-2.webp", title: "Three Millennia of Living Heritage", sub: "Cultural & Heritage Triangle · 14 Nights & 15 Days", href: "/tours/cultural/three-millennia-of-living-heritage" },
  { bg: "/assets/images/wildlife/yala-leopard-1.webp", image: "/assets/images/wildlife/mirissa-blue-whale-4.webp", title: "The Sri Lanka Big Five Expedition", sub: "Big Five Wildlife Expedition · 13 Nights / 14 Days", href: "/tours/wildlife/the-sri-lanka-big-five-expedition" },
  { bg: "/assets/images/beach/mirissa-1.webp", image: "/assets/images/beach/unawatuna-2.webp", title: "Southern Sands Serenade", sub: "Luxury Coastal Escape · 9 Nights / 10 Days", href: "/tours/beach/southern-sands-serenade" },
  { bg: "/media/ceylon-tea-tasting-terrace.jpg", image: "/assets/images/hill-country/nine-arches-bridge-1.webp", title: "Ceylon Tea Trails & Colonial Grandeur", sub: "Highlands & Planter Estates · 7 Nights / 8 Days", href: "/tours/hill-country/ceylon-tea-trails-colonial-grandeur" },
  { bg: "/assets/images/ayurveda/sri-lanka-yoga-3.webp", image: "/assets/images/ayurveda/herbal-treatment-1.webp", title: "Lotus Ayu Holistic Rejuvenation", sub: "Sacred Wellness & Panchakarma · 9 Nights / 10 Days", href: "/tours/ayurvedic/lotus-ayu-holistic-rejuvenation" },
  { bg: "/assets/images/honeymoon/mirissa-sunset-2.webp", image: "/assets/images/honeymoon/seaside-villa-1.webp", title: "Pure Serenade Coastal & Highland Romance", sub: "Luxury Honeymoon Romance · 11 Nights / 12 Days", href: "/tours/honeymoon/pure-serenade-coastal-highland-romance" },
];

const THEME_STRIP = [
  { slug: "cultural", image: "/assets/images/cultural/sigiriya-1.webp", title: "Cultural Tours", text: "Ancient UNESCO kingdoms, sacred temples & living heritage" },
  { slug: "buddhist-heritage", image: "/assets/images/buddhist-heritage/jaya-sri-maha-bodhi-1.webp", title: "Buddhist Heritage", text: "Sacred Jaya Sri Maha Bodhi, Dalada Maligawa and forest hermitages" },
  { slug: "wildlife", image: "/assets/images/wildlife/yala-leopard-1.webp", title: "Wildlife Tours", text: "Wild leopard safaris, elephant gatherings & untamed wilderness" },
  { slug: "beach", image: "/assets/images/beach/mirissa-1.webp", title: "Beach Tours", text: "Golden sandy shores, private seaside villas & whale watching" },
  { slug: "hill-country", image: "/assets/images/hill-country/nine-arches-bridge-1.webp", title: "Highlands & Tea", text: "Misty emerald tea estates, iconic train railways & waterfalls" },
  { slug: "ayurvedic", image: "/assets/images/ayurveda/herbal-treatment-1.webp", title: "Ayurveda Wellness", text: "Physician-led panchakarma, sacred herbs & forest serenity" },
  { slug: "honeymoon", image: "/assets/images/beach/unawatuna-2.webp", title: "Romantic Escapes", text: "Private plunge-pool villas, candlelight ramparts & sunsets" },
  { slug: "family", image: "/assets/images/wildlife/minneriya-elephant-gathering-2.webp", title: "Family Journeys", text: "Gentle safaris, turtle hatcheries & multi-gen comfort" },
  { slug: "adventure", image: "/assets/images/adventure/kitulgala-rafting-1.webp", title: "Adventure Tours", text: "Whitewater rapids, mountain peaks & ocean point breaks" },
  { slug: "ramayana", image: "/assets/images/ramayana/seetha-amman-temple-1.webp", title: "Ramayana Trails", text: "Sacred legend shrines, Seetha Amman temple & epic trails" },
  { slug: "golf", image: "/media/ceylon-championship-golf-1.jpg", title: "Championship Golf", text: "Asia’s oldest royal courses, highland pine links & resorts" },
];

const PILLARS = [
  { image: "/assets/images/cultural/sigiriya-1.webp", kicker: "Heritage & Living Art", title: "Cultural Depth & Sacred Sanctuaries", text: "Three millennia of living Buddhist heritage, UNESCO rock citadels, private temple rituals, and Geoffrey Bawa architectural journeys.", href: "/experiences#artisan-heritage", cta: "Explore heritage pillar" },
  { image: "/assets/images/wildlife/yala-leopard-1.webp", kicker: "Untamed Nature & Safaris", title: "Wild Encounters & Coastal Solitude", text: "Private leopard safaris in Yala, the Minneriya elephant gathering, ethical blue whale catamaran excursions, and Sinharaja rainforest expeditions.", href: "/experiences#nature-odyssey", cta: "Explore nature pillar" },
  { image: "/assets/images/hill-country/nuwara-eliya-tea-2.webp", kicker: "Holistic Wellness & Healing", title: "Lotus Ayu & Highland Serenity", text: "Authentic physician-guided Ceylon Ayurveda, Panchakarma restorative retreats, silent forest meditation, and colonial tea country repose.", href: "/experiences#lotus-ayu", cta: "Explore wellness pillar" },
];

const FAQS = [
  { q: "Best time to visit Sri Lanka?", a: "You can visit Sri Lanka year-round! As a tropical island, Sri Lanka enjoys abundant sunshine and warm temperatures throughout the year. The island experiences two gentle monsoon seasons: the southwest monsoon (May to September) makes the East and North coasts ideal, while the northeast monsoon (November to March) makes the West and South beaches sunny and dry." },
  { q: "Is it safe to travel to Sri Lanka?", a: "Sri Lanka is a popular and welcoming destination; we recommend checking your government's current travel advice. The nation is renowned for its hospitable people, tranquil Buddhist cultural traditions, and safe travel corridors. Lotus Ceylon provides government-licensed National Tourist Guide Lecturers, modern private air-conditioned touring vehicles, and direct coordinator support via WhatsApp, WeChat, and LINE for complete peace of mind." },
  { q: "Do I need a visa to enter Sri Lanka?", a: "Yes, most international travelers require an Electronic Travel Authorization (ETA) prior to arrival. Your passport should have at least 6 months of validity from your arrival date. Visas can be easily applied online via the official government immigration portal (www.eta.gov.lk), and our team provides visa guidance to all our traveling guests." },
  { q: "What should I pack for my trip?", a: "Lightweight cotton or linen attire is recommended for the warm coastal and cultural regions. When traveling into the central Hill Country (Nuwara Eliya, Ella), pack light sweaters or cardigans as evening temperatures can dip to 12°C. When visiting sacred Buddhist or Hindu temples, shoulders and knees must be respectfully covered." },
  { q: "What currency is used & are credit cards accepted?", a: "The Sri Lankan Rupee (LKR) is the local currency. Major international credit cards (Visa, MasterCard, and Amex) are widely accepted at hotels, boutique restaurants, and shopping centers throughout the island. ATMs are readily accessible in all major towns." },
  { q: "Why should I book through a professional tour operator?", a: "Sri Lanka is an experiential touring destination where local road navigation, VIP ticket access to national parks, train reservations, and vetted boutique hotels require established local connections. Lotus Ceylon eliminates logistic stress, guarantees pre-reserved scenic train seats, and offers dedicated chauffeur guides." },
];

export default function Home() {
  const journal = [
    blogPosts.find((b) => b.slug.startsWith("sacred-footsteps"))!,
    ...blogPosts.filter((b) => !b.slug.startsWith("sacred-footsteps")),
  ];
  return (
    <>
      <HeroFilm slides={DECK} lead={HERO_LEAD} />

      {/* the spirit of Lotus Ceylon */}
      <section className="gap statement">
        <div className="wrap" style={{ display: "grid", gap: 44 }}>
          <Rise as="p" className="eyebrow center">
            The spirit of Lotus Ceylon
          </Rise>
          <Split as="p" className="say">
            Inspired by the lotus, a symbol of purity, sacredness, resilience and natural beauty, LOTUS invites you to discover Sri Lanka through journeys that connect you with its <em>nature</em>{" "}
            <span className="pic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/hill-country/nine-arches-bridge-1.webp" alt="" />
            </span>{" "}
            culture{" "}
            <span className="pic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/cultural/kandy-temple-of-tooth-4.webp" alt="" />
            </span>{" "}
            heritage and <em>spirit</em>{" "}
            <span className="pic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/buddhist-heritage/jaya-sri-maha-bodhi-1.webp" alt="" />
            </span>
          </Split>
          <div className="split split--top" style={{ marginTop: "clamp(40px,6vw,96px)" }}>
            <Rise className="stack">
              <p className="lede">
                LOTUS CEYLON INTERNATIONAL TOURS &amp; SERVICES (PRIVATE) LIMITED is a premier Sri Lankan inbound tourism company dedicated to creating authentic, meaningful and memorable travel experiences across Sri Lanka.
              </p>
            </Rise>
            <Rise className="stack">
              <p className="body body--wide">
                From cultural heritage and sacred Buddhist sites to wildlife, pristine coasts, misty tea mountains, and the world-renowned flavours of Ceylon, we connect travellers with the people, places and experiences that make Sri Lanka unique with deep cultural understanding and genuine Sri Lankan hospitality.
              </p>
              <ul className="rlist">
                <li><span>UNESCO Sacred Heritage</span><span>Pure Journeys</span></li>
                <li><span>Private Chauffeur Fleet</span><span>Wild &amp; Pristine</span></li>
                <li><span>100% Bespoke Curation</span><span>100% Bespoke Luxury</span></li>
              </ul>
              <div className="btns">
                <Link className="btn btn-navy" href="/about">
                  About us
                </Link>
                <Link className="btn btn-line" href="/inquiry">
                  Plan your journey
                </Link>
              </div>
            </Rise>
          </div>
          <div className="grid g2" style={{ marginTop: "clamp(40px,6vw,80px)" }}>
            <Unmask className="ph-fig ratio-43">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/home/hero-sigiriya-aerial-1.webp" alt="Sigiriya Ancient Rock Fortress - Sri Lanka Heritage" loading="lazy" />
              <figcaption>
                <b>Sigiriya Rock Fortress</b>Ancient 5th Century Citadel
              </figcaption>
            </Unmask>
            <Unmask className="ph-fig ratio-43" delay={0.1}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/buddhist-heritage/ruwanwelisaya-2.webp" alt="Sacred Ruwanwelisaya Stupa, Anuradhapura" loading="lazy" />
              <figcaption>
                <b>Pure Journeys &amp; Sacred Experiences</b>The Authentic Soul of Sri Lanka
              </figcaption>
            </Unmask>
          </div>
        </div>
      </section>

      {/* sacred destinations */}
      <section id="destinations" className="gap-b">
        <DestinationSwapSection rows={ROWS}>
          <Rise as="p" className="eyebrow" style={{ marginBottom: 24 }}>
            Sacred destinations
          </Rise>
          <Split className="h2">
            Sacred footsteps and living <em>landscapes</em>
          </Split>
          <Rise as="p" className="body" style={{ marginTop: 28 }}>
            Sri Lanka has been a place of pilgrimage for more than two thousand years. Walk beneath the Sri Maha Bodhi tree in Anuradhapura, climb the hill at Mihintale where, according to tradition, Buddhism first reached the island, and visit the Temple of the Sacred Tooth Relic in Kandy. Between these holy places, lakes, tea hills and quiet coasts give you room to rest.
          </Rise>
        </DestinationSwapSection>
      </section>

      {/* why journey with us — navy band */}
      <NavyBand className="gap" id="figures">
        <div className="wrap">
          <Rise as="p" className="eyebrow center">
            Why journey with us
          </Rise>
          <Split className="h2 center" style={{ maxWidth: "15ch", marginTop: 28 }}>
            Pure journeys, sacred experiences, since <em>2014</em>
          </Split>
          <Rise as="p" className="body center" style={{ marginTop: 28, maxWidth: "60ch" }}>
            Founded in 2014, Lotus Ceylon was created on a single enduring principle: that travel should be unhurried, deeply personal, and spiritually enriching. We craft private voyages that honor the sacred rhythm of our island and the individual spirit of each traveler.
          </Rise>
          <div className="figs">
            {FIGURES.map((f) => (
              <div className="fig" key={f.label}>
                <CountUp to={f.n} suffix={f.s} />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
          <div className="grid g3" style={{ marginTop: "clamp(56px,7vw,96px)" }}>
            {WHY_POINTS.map(([t, d], i) => (
              <Rise key={t} delay={i * 0.06} style={{ borderTop: "1px solid rgba(255,255,255,.28)", paddingTop: 20, display: "grid", gap: 8 }}>
                <b style={{ fontWeight: 500, fontSize: 17 }}>{t}</b>
                <span className="small">{d}</span>
              </Rise>
            ))}
          </div>
        </div>
      </NavyBand>

      <FeatureJourneys
        items={JOURNEYS}
        intro="Each itinerary presented here is an artisanal starting canvas, ready to be customized in duration, boutique stays, and daily experiences to match your exact vision."
      />

      {/* about */}
      <section className="gap" id="about" style={{ paddingBottom: 0 }}>
        <div className="wrap" style={{ display: "grid", gap: 36, justifyItems: "center" }}>
          <Rise as="p" className="eyebrow">
            About us
          </Rise>
          <Split className="h2 center" style={{ maxWidth: "20ch" }}>
            A premier Sri Lankan inbound company, connecting travellers with the people, places and experiences that make <em>Ceylon</em> unique
          </Split>
          <Rise className="btns center">
            <Link className="btn btn-navy" href="/about">
              About us
            </Link>
            <Link className="btn btn-line" href="/tours">
              Explore all tour packages
            </Link>
          </Rise>
        </div>
        <WideReveal src="/media/ceylon-tea-tasting-terrace.jpg" alt="Tea country terrace" />
      </section>

      {/* tour categories */}
      <section className="gap" id="themes">
        <div className="wrap strip-top">
          <div style={{ display: "grid", gap: 22 }}>
            <Split className="h2">
              Tour <em>categories</em>
            </Split>
            <Rise as="p" className="body">
              As Sri Lanka’s premier luxury travel specialist, we craft private journeys across eleven signature holiday themes, from tranquil coastal sanctuaries to ancient UNESCO citadels.
            </Rise>
          </div>
          <div style={{ display: "grid", gap: 20, justifyItems: "end" }}>
            <Link className="tlink ulink" href="/tours">
              Explore all <Arrow />
            </Link>
            <div className="bar" aria-hidden="true">
              <i id="barI" />
            </div>
          </div>
        </div>
        <UnmaskChildren selector=".th figure">
          <DragStrip barId="barI">
            {THEME_STRIP.map((t) => (
              <Link className="th" href={`/tours/${t.slug}`} key={t.slug}>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.image} alt="" loading="lazy" draggable={false} />
                </figure>
                <b>{t.title}</b>
                <p>{t.text}</p>
              </Link>
            ))}
          </DragStrip>
        </UnmaskChildren>
      </section>

      {/* tailor-made */}
      <section className="gap-b">
        <div className="wrap split">
          <div className="stack-lg">
            <Rise as="p" className="eyebrow">
              Tailor-made bespoke tours
            </Rise>
            <Split className="h2">
              Create your perfect Sri Lankan <em>adventure</em>
            </Split>
            <Rise as="p" className="body">
              Create your perfect Sri Lankan adventure with our holiday artisans. Tailor-made itineraries are our defining hallmark at Lotus Ceylon. For over a decade, we have been crafting fully customized holidays tailored precisely to your family&apos;s pace, budget, and travel interests. Our destination experts curate the finest private villas, exclusive culinary stops, and insider excursions.
            </Rise>
            <Rise>
              <Link className="btn btn-navy" href="/inquiry">
                Design your trip
              </Link>
            </Rise>
          </div>
          <div className="grid g2" style={{ alignItems: "end" }}>
            <Unmask className="ph-fig ratio-45">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/beach/mirissa-1.webp" alt="Bespoke luxury travel Sri Lanka" loading="lazy" />
            </Unmask>
            <Unmask className="ph-fig ratio-45" delay={0.12} style={{ marginBottom: "18%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/hill-country/nuwara-eliya-tea-2.webp" alt="Misty Hill Country tea trails" loading="lazy" />
            </Unmask>
          </div>
        </div>
      </section>

      {/* experiences pillars */}
      <section className="gap-b" id="experiences">
        <div className="wrap">
          <SectionHead
            eyebrow="Signature travel pillars"
            title="Moments of pure wonder: handcrafted"
            accent="encounters"
            text="Beyond standard sightseeing lies the true soul of Ceylon—intimate moments of stillness, living heritage, authentic Ayurveda, and wild natural encounters."
          />
          <div className="grid g3">
            {PILLARS.map((p, i) => (
              <Link href={p.href} className="card" key={p.title}>
                <Unmask delay={i * 0.08}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" loading="lazy" />
                </Unmask>
                <p className="k">{p.kicker}</p>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <span className="tlink">
                  {p.cta} <Arrow />
                </span>
              </Link>
            ))}
          </div>
          <Rise style={{ marginTop: 56 }}>
            <Link className="btn btn-line" href="/experiences">
              Explore all experiences &amp; signature brands
            </Link>
          </Rise>
        </div>
      </section>

      {/* guest stories */}
      <section className="gap-sm grey">
        <div className="wrap split">
          <SectionHead eyebrow="Real stories" title="Guest" accent="stories" text="Hear from our global guests who experienced the authentic warmth, flawless planning, and sacred memories of Sri Lanka." style={{ marginBottom: 0 }} />
          <Rise className="stack" style={{ borderTop: "1px solid var(--ink)", paddingTop: 28 }}>
            <h3 className="h4">Guest reviews coming soon</h3>
            <p className="body">We are currently welcoming our upcoming season guests across Sri Lanka. Verified guest reviews and reflections will appear here as they are published.</p>
            <div className="btns">
              <Link className="btn btn-navy" href="/contact">
                Plan your bespoke tour
              </Link>
              <Link className="btn btn-line" href="/reviews">
                Leave a reflection
              </Link>
            </div>
          </Rise>
        </div>
      </section>

      {/* travel smart */}
      <section className="gap">
        <div className="wrap split">
          <div className="grid g2" style={{ alignItems: "start" }}>
            <Unmask className="ph-fig ratio-45" style={{ marginTop: "18%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/family/kosgoda-turtle-hatchery-1.webp" alt="Sea turtle conservation sanctuary at Kosgoda" loading="lazy" />
            </Unmask>
            <Unmask className="ph-fig ratio-45" delay={0.12}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/family/scenic-train-ride-2.webp" alt="Scenic highland train ride through Ceylon tea country" loading="lazy" />
            </Unmask>
          </div>
          <div className="stack-lg">
            <Rise as="p" className="eyebrow">
              Responsible travel
            </Rise>
            <Split className="h2">
              Travel smart, tread <em>lightly</em>
            </Split>
            <Rise as="p" className="lede" style={{ fontSize: "clamp(20px,1.8vw,26px)" }}>
              Join us in our responsible journey to give back to mother earth…
            </Rise>
            <Rise as="p" className="body">
              With deep reverence for the sacred island, its local communities, and fragile wildlife ecosystems, Lotus Ceylon is committed to carbon-conscious tours, single-use plastic elimination across our fleet, reforestation in the Sinharaja rainforest, and community empowerment.
            </Rise>
            <Rise>
              <Link className="tlink ulink" href="/blog/growing-a-greener-future-volunteer-reforestation-sinharaja">
                Explore <Arrow />
              </Link>
            </Rise>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="gap-b" id="faq">
        <div className="wrap split split--top split--wide">
          <div className="stack-lg">
            <Split className="h2">
              Everything you need to <em>know</em>
            </Split>
            <Unmask className="ph-fig ratio-43">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/about/hospitality-scenes-1.webp" alt="Sri Lanka travel planning FAQ" loading="lazy" />
            </Unmask>
            <Rise>
              <Link className="btn btn-navy" href="/inquiry">
                Ask our experts
              </Link>
            </Rise>
          </div>
          <Rise>
            <FaqList items={FAQS} />
          </Rise>
        </div>
        <FaqJsonLd items={FAQS} />
      </section>

      {/* journal */}
      <section id="journal" className="gap-b">
        <div className="wrap">
          <div className="news-head">
            <div style={{ display: "grid", gap: 18 }}>
              <Split className="h2">
                The Lotus <em>journal</em>
              </Split>
              <Rise as="p" className="body">
                Chronicles of Ceylon: thoughtful stories, seasonal travel advice, and cultural perspectives from our Ceylon destination specialists.
              </Rise>
            </div>
            <Link className="btn btn-line" href="/blog">
              View all news
            </Link>
          </div>
          <UnmaskChildren selector=".post figure">
            {journal.map((p) => (
              <Link className="post" href={`/blog/${p.slug}`} key={p.slug}>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.cover} alt="" loading="lazy" />
                </figure>
                <div>
                  <p className="k">{p.category}</p>
                  <h3>{p.title}</h3>
                  <p className="body">{p.excerpt}</p>
                  <div className="meta">
                    <span>{p.readTime}</span>
                    <ArrowUpRight />
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
