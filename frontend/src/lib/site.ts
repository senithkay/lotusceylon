/** Company details and shared copy (from the legacy settings / footer / CTA banner). */
export const SITE = {
  name: "Lotus Ceylon",
  legalName: "Lotus Ceylon International Tours & Services (Private) Limited",
  shortName: "Lotus Ceylon Tours",
  slogan: "Pure Journeys. Sacred Experiences.",
  tagline: "International Tours & Services",
  founded: 2014,
  companyReg: "PV 00374439",
  director: "Mallawa Arachchige Dhushantha Gihan Mallawaarachchi",
  phone: "+94 71 54 22 384",
  phoneHref: "tel:+94715422384",
  email: "paliforbuddhism@gmail.com",
  address: {
    line1: "286/C, Niwandama South",
    city: "Ja-Ela",
    country: "Sri Lanka",
    postalCode: "11350",
    full: "286/C, Niwandama South, Ja-Ela, Sri Lanka – 11350",
  },
  coordinates: { lat: 7.0785, lng: 79.8913 },
  whatsapp: "+94 71 54 22 384",
  whatsappNumber: "94715422384",
  wechat: "FGUTaiwan90",
  line: "dpbs2024",
  linePhone: "+886 958 561 954",
  lineUrl: "https://line.me/R/ti/p/dpbs2024",
  hours: "Monday – Saturday, 08:30 – 18:30 (Sri Lanka Time, UTC+5:30)",
  hoursNote: "24/7 assistance for travellers currently on tour",
  social: {
    facebook: "https://facebook.com/lotusceylontours",
    instagram: "https://instagram.com/lotusceylontours",
    youtube: "https://youtube.com/@lotusceylontours",
    tripadvisor: "https://tripadvisor.com",
  },
  designer: { name: "Infinite Design", url: "https://infiniteweb.dev/" },
  footerBlurb:
    "Crafting bespoke, transformative travel experiences across sacred Ceylon with authentic warmth since 2014.",
  qr: {
    whatsapp: "/assets/qr/whatsapp-qr.png",
    wechat: "/assets/qr/wechat-qr.png",
    line: "/assets/qr/line-qr.png",
  },
} as const;

export const DEFAULT_WA_TEXT = "Hello Lotus Ceylon! I would like to inquire about a private tour.";

export const waLink = (text?: string) =>
  `https://wa.me/${SITE.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const inquiryHref = (params?: Record<string, string>) =>
  `/inquiry${params ? `?${new URLSearchParams(params).toString()}` : ""}`;

/** The closing banner that appears on every page of the legacy site. */
export const CLOSING_CTA = {
  title: "Ready to begin your sacred Ceylon",
  accent: "journey?",
  text: "Speak directly with our senior destination specialists in Ja-Ela or connect via WhatsApp for an immediate bespoke itinerary proposal tailored to your rhythm.",
  primary: "Plan my bespoke journey",
  secondary: "Chat on WhatsApp",
};

/** “Why discerning travelers choose us” strip shown on tour pages. */
export const WHY_LOTUS = {
  eyebrow: "The Lotus Ceylon assurance",
  title: "Why discerning travelers choose",
  accent: "us",
  sub: "Pure Journeys. Sacred Experiences. Curated to uncompromising standards since 2014.",
  pillars: [
    {
      title: "100% Private & Bespoke",
      text: "No shared coaches or rushed timetables. Your private vehicle, personal chauffeur, and schedule adapt entirely to your mood and waking hour.",
    },
    {
      title: "Certified Master Chauffeurs",
      text: "Hand-vetted SLTDA-licensed tourist guide lecturers who bring cultural depth, warm hospitality, and defensive driving excellence to every mile.",
    },
    {
      title: "Curated Boutique Sanctuaries",
      text: "We personally inspect every heritage tea bungalow, private beach pavilion, and wildlife luxury tented suite for soul, privacy, and impeccable service.",
    },
    {
      title: "24/7 Dedicated Concierge",
      text: "A senior trip director monitors your itinerary around the clock. Backed by a strict zero-commission policy—no tourist traps, guaranteed.",
    },
  ],
};

/** Default traveller FAQ used on tour category and package pages. */
export const TOUR_FAQS = {
  eyebrow: "Traveler essentials & advice",
  title: "Frequently asked",
  accent: "questions",
  sub: "Everything you need to know about planning your private luxury voyage through Sri Lanka with Lotus Ceylon.",
  items: [
    {
      q: "Can this itinerary be fully customized or reversed?",
      a: "Yes, absolutely. Every tour presented by Lotus Ceylon is an artisanal starting framework. Our destination architects can extend or reduce your stay, change boutique hotel properties, reverse the route sequence, or seamlessly weave in private wellness treatments, hot air ballooning, or specialized birdwatching excursions.",
    },
    {
      q: "What type of vehicle and chauffeur-guide is assigned to our party?",
      a: "All our journeys are 100% private. We assign modern, premium air-conditioned vehicles (such as Toyota Prado 4WDs, luxury KDH vans, or executive sedans) matched strictly to your party size. Your dedicated chauffeur-guide is a government-certified National Tourist Guide Lecturer licensed by the Sri Lanka Tourism Development Authority (SLTDA).",
    },
    {
      q: "Are entrance fees, national park safaris, and train tickets included?",
      a: "Yes. Unless you request a customized land-only option, our comprehensive quotations include VIP pre-booked entry tickets to all UNESCO monuments, exclusive private 4x4 safari jeeps with park rangers, and reserved first-class scenic mountain railway observation car seats.",
    },
    {
      q: "What are your payment terms and cancellation policies?",
      a: "Upon approving your bespoke itinerary, a modest deposit secures your boutique reservations and chauffeur allocation. Final balance payments are processed securely ahead of arrival. In the event of unforeseen flight disruptions or emergencies, we provide compassionate postponement terms with no administrative penalties.",
    },
    {
      q: "Do you arrange airport transfers and VIP meet-and-greet services?",
      a: "From the moment your flight touches down at Colombo Bandaranaike International Airport (CMB), our private airport representative and your chauffeur await you just beyond customs with cold floral towels, chilled bottled water, and your complete welcome briefing folder.",
    },
  ],
};

/** “Make it yours” enhancement options on package pages. */
export const MAKE_IT_YOURS_OPTIONS = [
  { id: "opt-extra-days", label: "Add extra leisure days in Sri Lanka (+2-3 Nights)", icon: "🗓️" },
  { id: "opt-ayurveda", label: "Include Ayurvedic restorative massage & wellness day", icon: "🌿" },
  { id: "opt-hotel-upgrade", label: "Upgrade to private plunge-pool villa / presidential suite", icon: "💎" },
  { id: "opt-safari", label: "Add exclusive 4x4 private game drive & naturalist tracker", icon: "🐆" },
  { id: "opt-chauffeur", label: "Senior national tourist guide lecturer / language specialist", icon: "🎩" },
  { id: "opt-train", label: "First-class reserved scenic mountain railway observation car", icon: "🚂" },
];
