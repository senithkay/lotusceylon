/**
 * Typed access to the site content.
 *
 * Every JSON file in `src/content` was extracted from the legacy static site
 * (see `scripts/extract-legacy-content.py`). When the backend arrives these
 * loaders are the single place to swap static JSON for API calls.
 */
import categoriesJson from "@/content/categories.json";
import packagesJson from "@/content/packages.json";
import comparisonJson from "@/content/comparison.json";
import destinationsJson from "@/content/destinations.json";
import blogJson from "@/content/blog.json";
import legalJson from "@/content/legal.json";
import galleryJson from "@/content/gallery.json";
import experiencesJson from "@/content/experiences.json";

export type Heading = { watermark?: string; title?: string; accent?: string };

export type CategoryCard = {
  slug: string;
  image: string;
  badge: string;
  duration: string;
  label: string;
  title: string;
  route: string;
  desc: string;
  highlights: string[];
  price?: string;
};

export type Category = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  data: {
    title?: string;
    titleHighlight?: string;
    tagline?: string;
    description?: string;
    heroImage?: string;
  };
  hero: { badge: string; title: string; accent: string; lead: string; primaryCta?: string; secondaryCta?: string; image: string };
  overview: Heading & { paragraphs: string[] };
  packagesSection: Heading & { subtitle: string; cards: CategoryCard[] };
  comparisonIntro: { eyebrow: string; title: string; note: string };
  circuit?: {
    eyebrow: string;
    quote: string;
    quoteCaption: string;
    title: string;
    accent: string;
    leadHtml: string;
    label: string;
    stops: string[];
    highlights: string[];
    ctaPrimary: string;
    ctaWhatsapp: string;
  };
  seasons?: Heading & {
    cards: { badge: string; title: string; locations: string; text: string; perks: { label: string; text: string }[] }[];
  };
  experiences?: Heading & { items: { title: string; text: string }[] };
  faqs?: Heading & { subtitle?: string; items: { q: string; a: string }[] };
  planCta?: { eyebrow: string; title: string; text: string; buttons: { label: string; href: string }[] };
};

export type ItineraryDay = { day: string; title: string; desc: string; meta: string[] };

export type PackageDestination = { name: string; lat: number; lng: number; activities: string[] };

export type TourPackage = {
  slug: string;
  category: string;
  id: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  titleAccent: string;
  tagline: string;
  heroBadges: string[];
  heroImage: string;
  facts: { icon: string; label: string; value: string }[];
  itineraryIntro: string;
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  price: { sub: string; value: string; note: string };
  highlights: string[];
  assistance: { title: string; text: string };
  relatedTitle: string;
  relatedEyebrow: string;
  cta: { eyebrow: string; title: string; text: string };
  nights: number;
  days: number;
  tags: string[];
  route: string[];
  destinations: PackageDestination[];
  pace?: string;
  difficulty?: string;
  bestSeason?: string;
  groupSize?: string;
  childFriendly?: boolean;
  accessibilityNotes?: string;
  badge?: string;
  priceNote?: string;
  images: string[];
  faqs?: { q: string; a: string }[];
};

export type ComparisonTable = {
  category: string;
  title: string;
  note: string;
  packages: string[];
  packageDetails: { name: string; slug: string; nights: number; days: number }[];
  groups: {
    id: string;
    label: string;
    order: number;
    manualTicks: Record<string, boolean>;
    sights: { id: string; label: string; order: number; includedIn: string[] }[];
  }[];
};

export type Destination = {
  slug: string;
  filter: string;
  region: string;
  title: string;
  desc: string;
  image: string;
  highlights: string[];
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  badge: string;
  essenceTitle: string;
  essence: string;
  experiencesTitle: string;
  planTitle: string;
  planText: string;
  planButton: string;
  planEyebrow: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  cover: string;
  excerpt: string;
  cardRating: string;
  cardPrice: string;
  byline: string;
  bodyHtml: string;
  activity: null | {
    rating: string;
    reviews: string;
    badge: string;
    title: string;
    text: string;
    calloutTitle: string;
    calloutText: string;
    priceFrom: string;
    priceUnit: string;
    cta: string;
    href: string;
  };
  footerLinks: { href: string; label: string }[];
};

export type LegalPage = {
  metaTitle: string;
  metaDescription: string;
  badge: string;
  title: string;
  paragraphs: string[];
  disclaimerHtml: string;
  bodyHtml: string;
};

export type Filter = { key: string; label: string };

export const categories = categoriesJson as unknown as Category[];
export const packages = packagesJson as unknown as TourPackage[];
export const comparisons = comparisonJson as unknown as Record<string, ComparisonTable>;
export const destinationsPage = destinationsJson.page as unknown as {
  badge: string;
  title: string;
  accent: string;
  lead: string;
  filters: Filter[];
  searchPlaceholder: string;
};
export const destinations = destinationsJson.items as unknown as Destination[];
export const blogPosts = blogJson as unknown as BlogPost[];
export const legalPages = legalJson as unknown as Record<string, LegalPage>;
export const gallery = galleryJson as unknown as {
  filters: Filter[];
  items: { filter: string; image: string; alt: string; tag: string; title: string; desc: string; location: string }[];
};
export const experiences = experiencesJson as unknown as {
  hero: { badge: string; title: string; accent: string; lead: string };
  pillarsHead: { eyebrow: string; title: string; text: string };
  pillars: {
    id: string;
    image: string;
    alt: string;
    icon: string;
    kicker: string;
    title: string;
    text: string;
    tags: string[];
    cta: string;
    href: string;
  }[];
  encountersHead: { eyebrow: string; title: string; text: string };
  filters: Filter[];
  encounters: { filter: string; image: string; alt: string; tag: string; title: string; text: string; meta: string }[];
  plan: { eyebrow: string; title: string; text: string };
};

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getPackage = (category: string, slug: string) =>
  packages.find((p) => p.category === category && p.slug === slug);
export const packagesIn = (category: string) => {
  const order = getCategory(category)?.packagesSection.cards.map((c) => c.slug) ?? [];
  return packages
    .filter((p) => p.category === category)
    .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
};
export const getDestination = (slug: string) => destinations.find((d) => d.slug === slug);
export const getPost = (slug: string) => blogPosts.find((b) => b.slug === slug);

export const packageHref = (p: { category: string; slug: string }) => `/tours/${p.category}/${p.slug}`;
export const durationLabel = (p: { nights: number; days: number }) => `${p.nights} Nights / ${p.days} Days`;

/** Short, human names for the eleven holiday themes (used in menus, filters and the home strip). */
export const THEMES: { slug: string; name: string; short: string; icon: string; footer: string }[] = [
  { slug: "cultural", name: "Cultural Heritage", short: "Cultural", icon: "🏛️", footer: "Cultural Heritage" },
  { slug: "buddhist-heritage", name: "Buddhist Heritage", short: "Buddhist", icon: "☸️", footer: "Buddhist Pilgrimage" },
  { slug: "wildlife", name: "Wildlife Safaris", short: "Wildlife", icon: "🐆", footer: "Wildlife & Safari" },
  { slug: "beach", name: "Pristine Beaches", short: "Beach", icon: "🏖️", footer: "Coast & Beaches" },
  { slug: "hill-country", name: "Hill Country & Tea", short: "Hill Country", icon: "⛰️", footer: "Highlands & Tea" },
  { slug: "ayurvedic", name: "Ayurvedic Healing", short: "Ayurvedic", icon: "🌿", footer: "Ayurvedic Wellness" },
  { slug: "honeymoon", name: "Honeymoon Romance", short: "Honeymoon", icon: "💍", footer: "Honeymoon Sanctuaries" },
  { slug: "family", name: "Family Discovery", short: "Family", icon: "👨‍👩‍👧‍👦", footer: "Family Journeys" },
  { slug: "adventure", name: "Active Adventure", short: "Adventure", icon: "🏄", footer: "Active Adventure" },
  { slug: "golf", name: "Championship Golf", short: "Golf", icon: "⛳", footer: "Championship Golf" },
  { slug: "ramayana", name: "Ramayana Trail", short: "Ramayana", icon: "🏹", footer: "Ramayana Heritage" },
];
