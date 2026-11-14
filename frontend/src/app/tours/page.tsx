import type { Metadata } from "next";
import Link from "next/link";
import { getCategory, packageHref, packages, packagesIn, THEMES } from "@/lib/content";
import { waLink, SITE } from "@/lib/site";
import { Rise, Split } from "@/components/motion";
import { ClosingCta, PageHero, SectionHead, TourFaqs, WhyLotus } from "@/components/ui";
import { RouteMap } from "@/components/tours";
import { ThemeShowcase, TravelHub, TripFinder, type HubPanel, type ShowcaseCategory } from "@/components/tours-index";

export const metadata: Metadata = {
  title: { absolute: "Sri Lanka Tour Packages | Lotus Ceylon Private Luxury Tours" },
  description:
    "26 curated tailor-made expeditions across 11 signature holiday themes. Private luxury chauffeur journeys crafted around the rhythm of Ceylon.",
};

const SHOWCASE: { slug: string; title: string; tagline: string; image: string; desc?: string; count?: string; chips?: string[] }[] = [
  { slug: "beach", title: "Sri Lanka Luxury Beach Holidays", tagline: "Pure Journeys • Tropical Coastal Escapes", image: "/assets/tours/beach/hero.jpg" },
  {
    slug: "buddhist-heritage",
    title: "Buddhist Pilgrimage & Sacred Living Heritage",
    tagline: "Living Dhamma, Ancient Bodhi Shrines & Forest Meditation",
    image: "/assets/images/buddhist-heritage/jaya-sri-maha-bodhi-1.webp",
    desc: "Reverent, deeply peaceful journeys to Sri Lanka's most venerated Buddhist sites—from the 2,300-year-old Jaya Sri Maha Bodhi and sacred Ruwanwelisaya to Kandy’s Sri Dalada Maligawa and Ritigala forest hermitages.",
    count: "3 Sacred Pilgrimages",
    chips: ["☸️ Sacred Bodhi Tree", "🏛️ Ancient Stupas", "🧘 Vipassana & Forest Monks"],
  },
  { slug: "cultural", title: "Sri Lanka Cultural Tours", tagline: "Sacred Kingdoms • UNESCO Living Heritage", image: "/assets/tours/cultural/hero.jpg" },
  { slug: "wildlife", title: "Sri Lanka Wildlife Safaris", tagline: "Asia’s Apex Wildlife • The Big Five Sanctuary", image: "/assets/tours/wildlife/hero.jpg" },
  { slug: "hill-country", title: "Sri Lanka Hill Country & Tea Country Tours", tagline: "Misty Valleys • Heritage Tea Trails • Highland Sanctuary", image: "/assets/images/hill-country/nuwara-eliya-tea-2.webp" },
  { slug: "adventure", title: "Sri Lanka Adventure & Active Expeditions", tagline: "Wild Rapids • Peak Ascents • Ocean Surf", image: "/assets/images/adventure/kitulgala-rafting-1.webp" },
  { slug: "ayurvedic", title: "Sri Lanka Ayurvedic & Holistic Wellness Retreats", tagline: "Sacred Botanical Healing • Mindfulness • Yoga Retreats", image: "/assets/images/ayurveda/herbal-treatment-1.webp" },
  { slug: "honeymoon", title: "Sri Lanka Luxury Honeymoon Tours", tagline: "Intimate Luxury • Secluded Bays • Candlelit Ramparts", image: "/assets/images/honeymoon/seaside-villa-1.webp" },
  { slug: "family", title: "Sri Lanka Family Holiday Packages", tagline: "Safe Expeditions • Living Nature • Timeless Bonding", image: "/assets/images/hill-country/nine-arches-bridge-1.webp" },
  { slug: "ramayana", title: "Sri Lanka Ramayana Heritage Tours", tagline: "Epic Legends • Sacred Shrines • Ancient Chronicles", image: "/assets/images/ramayana/seetha-amman-temple-1.webp" },
  { slug: "golf", title: "Sri Lanka Golf Holidays & Championship Tours", tagline: "Colonial Greens • Championship Links • Tropical Fairways", image: "/media/ceylon-championship-golf-1.jpg" },
];

const HUB: HubPanel[] = [
  {
    id: "climate",
    tab: "Climate & monsoons",
    kicker: "365 Days of Tropical Sunshine",
    title: "Understanding the island's twin monsoons",
    lead: "Sri Lanka experiences two distinct monsoon seasons affecting opposite coasts at different times of the year. This geographical blessing means that whenever you visit, clear skies, golden beaches, and calm swimming waters are always flourishing on one side of the island.",
    cards: [
      { title: "South & West Coasts + Central Hills", meta: "Best Months: December to April", text: "Galle, Bentota, Mirissa, Weligama, Tangalle, Kandy, and Nuwara Eliya enjoy glorious sunshine, sapphire ocean waters, and ideal conditions for whale watching and hiking." },
      { title: "East & North Coasts + Cultural Triangle", meta: "Best Months: May to September", text: "Trincomalee, Nilaveli, Pasikudah, Arugam Bay, and Jaffna bask in dry, radiant weather with pristine glassy seas perfect for snorkeling at Pigeon Island and world-class surfing." },
    ],
    tip: { label: "Specialist Tip", text: "Even during shoulder monsoon months (October & November), rains typically arrive in brief afternoon or evening tropical showers, leaving mornings clear for exploration." },
  },
  {
    id: "visa",
    tab: "Visa & ETA",
    kicker: "Entry Requirements & Documentation",
    title: "Sri Lanka tourist visa (ETA) guidelines",
    lead: "Most international visitors traveling to Sri Lanka for leisure require an Electronic Travel Authorization (ETA) prior to arrival. The process is straightforward and completed entirely online.",
    cards: [
      {
        title: "Essential Requirements",
        items: [
          "Passport valid for at least 6 months from your date of arrival. Apply via the official government portal (eta.gov.lk). Entry rules change; your concierge will confirm the latest requirements",
          "Confirmed return or onward flight booking",
          "Adequate funds for your stay in Sri Lanka",
          "Digital payment card for standard government fee processing",
        ],
      },
      {
        title: "Validity & Processing Window",
        items: [
          "Standard tourist ETA grants 30 days initial stay with double entry",
          "Extensions up to 180 days can be arranged at the Department of Immigration in Colombo or online",
          "Apply at least 3 to 7 days before your scheduled departure flight",
          "Print a digital copy of your approved ETA confirmation to present at check-in",
        ],
      },
    ],
    tip: { label: "Official Channel", text: "Always use the official government portal (www.eta.gov.lk). Your Lotus Ceylon travel concierge will gladly verify your nationality’s latest entry protocols upon booking." },
  },
  {
    id: "etiquette",
    tab: "Sacred etiquette",
    kicker: "Reverence, Mindfulness & Respect",
    title: "Temple & cultural heritage site etiquette",
    lead: "Sri Lanka’s sacred shrines, ancient stupas, and forest hermitages are living places of unbroken daily worship. Embracing local customs demonstrates cultural respect and deepens your spiritual experience.",
    cards: [
      {
        title: "Sacred Attire Guidelines",
        items: [
          "Shoulders and knees must be fully covered (shawls or sarongs are customary)",
          "White or light-colored, modest clothing is traditional and warmly welcomed at Buddhist temples",
          "Hats, caps, and footwear must be removed before entering temple compounds (shoe-keep booths available)",
          "Socks are permitted and highly recommended during midday when stone courtyards become warm",
        ],
      },
      {
        title: "Photography & Demeanor",
        items: [
          "Never turn your back or pose for selfies in front of a Buddha image or statue",
          "Always ask gentle permission before photographing monks, temple devotees, or local artisans",
          "Maintain quiet voices; avoid loud speech, touching sacred relics, or climbing ancient brickwork",
          "Always walk clockwise (pradakshina) around stupas, shrines, and sacred bodhi trees",
        ],
      },
    ],
    tip: { label: "Lotus Tradition", text: "At major shrines like the Temple of the Sacred Tooth Relic or Ruwanwelisaya, your Lotus chauffeur guide will arrange fresh lotus flower offerings for a mindful blessing." },
  },
  {
    id: "wildlife",
    tab: "Wildlife ethics",
    kicker: "Lotus Ceylon Wildlife Charter",
    title: "Ethical wildlife safaris & conservation",
    lead: "Sri Lanka is an extraordinary global biodiversity sanctuary. We are uncompromisingly committed to ethical, cruelty-free wildlife encounters that protect habitats, reduce disturbance, and celebrate wild animals living free.",
    cards: [
      {
        title: "Our Strict Prohibitions",
        items: [
          "Zero elephant riding, chaining, or commercial exploitation: We do not endorse or book venues that force animals to perform",
          "No baiting, feeding, or touching wild animals under any circumstances",
          "No off-road tracking or driving into sensitive nesting habitats",
          "No artificial drone flights over national parks or marine sanctuaries",
        ],
      },
      {
        title: "Ethical Safari Best Practices",
        items: [
          "Drivers maintain a minimum 20-meter buffer distance from wild elephants and leopards",
          "Engines are switched off at waterholes to ensure peaceful natural behavior",
          "We partner with Department of Wildlife Conservation licensed safari trackers",
          "Support for legitimate rehabilitation centers like the Udawalawe Elephant Transit Home",
        ],
      },
    ],
    tip: { label: "Marine Ethics", text: "On Mirissa blue whale expeditions, our certified skippers adhere strictly to slow approach speeds and international whale-watching distances, never blocking their natural swimming path." },
  },
  {
    id: "packing",
    tab: "Packing checklist",
    kicker: "Pack Smart, Travel Light",
    title: "Curated Ceylon packing checklist",
    lead: "Sri Lanka offers temperatures ranging from 32°C (90°F) on sunny coastlines to a brisk 12°C (54°F) in misty mountain tea estates. A layered, versatile wardrobe ensures effortless comfort.",
    cards: [
      {
        title: "Clothing & Footwear",
        items: [
          "Lightweight, breathable natural fabrics (linen, cotton, bamboo)",
          "At least 1-2 modest white or light tops and long trousers/maxi skirts for temples",
          "Slip-on sandals or easily removable shoes for sacred sites, plus thick walking socks",
          "Warm fleece or light jacket for cool highland evenings in Nuwara Eliya and Horton Plains",
          "Sturdy walking shoes or trail runners for Sigiriya, Little Adam's Peak, and tea plantation walks",
        ],
      },
      {
        title: "Sun, Health & Tech Essentials",
        items: [
          "Reef-safe biodegradable sunscreen (SPF 50+) and polarized sunglasses",
          "Natural insect/mosquito repellent with citronella or DEET for forest reserves",
          "Lightweight compact umbrella or rain poncho for tropical mountain mists",
          "Universal UK 3-pin plug adapter (Type G / Type D common across Sri Lanka)",
          "Personal refillable water flask (chilled filtered mineral water provided in all private vehicles)",
        ],
      },
    ],
    tip: { label: "Laundry Note", text: "Boutique hotels and villas throughout Sri Lanka provide swift, affordable same-day laundry service, allowing you to travel light with carry-on or medium luggage." },
  },
];

export default function ToursIndex() {
  const showcase: ShowcaseCategory[] = SHOWCASE.map((s) => {
    const cat = getCategory(s.slug)!;
    const pk = packagesIn(s.slug);
    return {
      slug: s.slug,
      short: THEMES.find((t) => t.slug === s.slug)?.short ?? s.slug,
      image: s.image,
      count: s.count ?? `${pk.length} Signature Itineraries`,
      tagline: s.tagline,
      title: s.title,
      desc: s.desc ?? (cat.hero.lead || cat.data.description || ""),
      chips: s.chips,
      packages: pk.map((p) => ({ title: p.title, days: p.days, href: packageHref(p) })),
    };
  });

  const finder = packages.map((p) => ({
    title: p.title,
    href: packageHref(p),
    category: p.category,
    days: p.days,
    nights: p.nights,
    image: getCategory(p.category)?.packagesSection.cards.find((c) => c.slug === p.slug)?.image || p.heroImage,
    tagline: p.tagline,
  }));

  // one representative route per circuit for the island map
  const regionRoutes = ["cultural", "hill-country", "beach", "wildlife"].map((c) => {
    const p = packagesIn(c)[0];
    return { id: c, title: getCategory(c)!.hero.title.replace(/^Sri Lanka\s+/, ""), href: packageHref(p), stops: p.destinations };
  });

  return (
    <>
      <PageHero
        image="/assets/images/home/hero-sigiriya-aerial-1.webp"
        title="Sri Lanka luxury private"
        accent="tours"
        lead={`${packages.length} curated tailor-made expeditions across 11 signature holiday themes. Private luxury chauffeur journeys crafted around the rhythm of Ceylon.`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Sri Lanka Tours" }]}
      >
        <p className="lead" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(20px,2vw,28px)" }}>
          Curated Expeditions &amp; Sacred Experiences
        </p>
      </PageHero>

      <section className="gap" id="themes">
        <div className="wrap">
          <SectionHead
            eyebrow="Lotus Ceylon"
            title="11 curated holiday"
            accent="themes"
            text="Every single day, destination, and boutique stay can be customized specifically for you. Select a category below to explore signature day-by-day itineraries."
          />
          <ThemeShowcase items={showcase} />
        </div>
      </section>

      <section className="gap-sm grey" id="trip-finder">
        <div className="wrap">
          <SectionHead
            eyebrow="Bespoke trip finder"
            title="Find my perfect Ceylon"
            accent="journey"
            text="Select your travel window, preferred duration, and passions. Our smart itinerary curator will match you with our finest hand-crafted private tours."
          />
          <TripFinder pkgs={finder} />
        </div>
      </section>

      <section className="gap-sm" id="tours-island-route-map">
        <div className="wrap split split--top">
          <Rise>
            <RouteMap routes={regionRoutes} />
          </Rise>
          <div className="stack-lg">
            <Rise as="p" className="eyebrow">
              All-island private journeys &amp; expeditions
            </Rise>
            <Rise>
              <blockquote className="quote">“From mist-veiled highland peaks to sacred temple citadels and turquoise coastlines — explore Ceylon through thoughtfully paced private circuits.”</blockquote>
              <span className="quote-cap">Lotus Ceylon Signature Journeys</span>
            </Rise>
            <Split className="h3">
              Explore Sri Lanka by region: four distinct circuits, infinite <em>discoveries</em>
            </Split>
            <Rise as="p" className="body body--wide">
              Every Lotus Ceylon journey is individually tailored with dedicated private chauffeur-guides, hand-selected boutique retreats, and seamless inter-provincial transfers. Click through our signature routes on the interactive map to preview waypoint stops across Ceylon’s cultural triangle, central tea valleys, southern beaches, and untamed national parks.
            </Rise>
            <Rise className="stack" style={{ gap: 12 }}>
              <span className="small">Key island hubs:</span>
              <div className="stops">
                {["Colombo", "Sigiriya", "Kandy", "Hatton & Ella", "Yala", "Galle"].map((s, i) => (
                  <span key={s} style={{ display: "contents" }}>
                    {i > 0 && <span className="sep">→</span>}
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </Rise>
            <Rise>
              <ul className="checks dots">
                <li>8 UNESCO World Heritage Sites</li>
                <li>26 National Wildlife Parks</li>
                <li>Private Chauffeur Transfers</li>
              </ul>
            </Rise>
            <Rise className="stack" style={{ gap: 16 }}>
              <p className="small">Looking for a personalized route combining coastal stays and highland trails?</p>
              <div className="btns">
                <Link className="btn btn-navy" href="/inquiry">
                  Craft your custom circuit
                </Link>
                <a className="btn btn-line" href={waLink()} target="_blank" rel="noopener noreferrer">
                  Speak with a travel specialist
                </a>
              </div>
            </Rise>
          </div>
        </div>
      </section>

      <section className="gap-sm" id="travel-info-hub">
        <div className="wrap">
          <SectionHead
            eyebrow="Travel essentials & local wisdom"
            title="Sri Lanka travel preparation"
            accent="guide"
            text="Essential practical advice from our local destination specialists to ensure your journey is seamless, comfortable, and culturally enriching."
          />
          <Rise>
            <TravelHub panels={HUB} />
          </Rise>
        </div>
      </section>

      <section className="gap-sm navy">
        <div className="wrap split">
          <div className="stack-lg">
            <Rise as="p" className="eyebrow">
              Bespoke private travel design
            </Rise>
            <Split className="h2">
              Have a custom route in <em>mind?</em>
            </Split>
          </div>
          <Rise className="stack">
            <p className="body body--wide">
              Every single day, destination, and boutique stay can be curated specifically for you. Let our certified travel designers craft your personalized itinerary tailored to your travel dates and pace.
            </p>
            <div className="btns">
              <Link className="btn btn-white" href="/inquiry">
                Design your custom journey
              </Link>
              <a className="btn btn-line-light" href={waLink()} target="_blank" rel="noopener noreferrer">
                Chat with specialist ({SITE.phone})
              </a>
            </div>
          </Rise>
        </div>
      </section>

      <WhyLotus />
      <TourFaqs />
      <ClosingCta />
    </>
  );
}
