"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Rise } from "./motion";
import { Arrow } from "./ui";

export type ShowcaseCategory = {
  slug: string;
  short: string;
  image: string;
  count: string;
  tagline: string;
  title: string;
  desc: string;
  chips?: string[];
  packages: { title: string; days: number; href: string }[];
};

export function ThemeShowcase({ items }: { items: ShowcaseCategory[] }) {
  const [f, setF] = useState("all");
  const filters = items.filter((i) => i.slug !== "buddhist-heritage");
  const shown = items.filter((i) => f === "all" || i.slug === f);
  return (
    <>
      <Rise className="chips" style={{ marginBottom: 48 }} role="group" aria-label="Filter themes">
        <button type="button" className="chip" aria-pressed={f === "all"} onClick={() => setF("all")}>
          All themes ({items.length})
        </button>
        {filters.map((c) => (
          <button key={c.slug} type="button" className="chip" aria-pressed={f === c.slug} onClick={() => setF(c.slug)}>
            {c.short}
          </button>
        ))}
      </Rise>
      <div>
        {shown.map((c, i) => (
          <article className="pcard" key={c.slug}>
            <Link href={`/tours/${c.slug}`} aria-label={c.title}>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.title} loading="lazy" />
                <span className="badge-tag">{c.count}</span>
              </figure>
            </Link>
            <div>
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <p className="eyebrow muted" style={{ marginTop: 14 }}>
                {c.tagline}
              </p>
              <h3>
                <Link href={`/tours/${c.slug}`}>{c.title}</Link>
              </h3>
              <p className="desc">{c.desc}</p>
              {c.chips && (
                <div className="pills" style={{ marginTop: 18 }}>
                  {c.chips.map((ch) => (
                    <span className="pill" key={ch}>
                      {ch}
                    </span>
                  ))}
                </div>
              )}
              <ul className="rlist" style={{ marginTop: 24 }}>
                {c.packages.map((p) => (
                  <li key={p.href}>
                    <Link className="ulink" href={p.href} style={{ color: "var(--ink)" }}>
                      {p.title}
                    </Link>
                    <span>{p.days} Days</span>
                  </li>
                ))}
              </ul>
              <div className="btns">
                <Link className="btn btn-navy" href={`/tours/${c.slug}`}>
                  Explore {c.title.replace(/^Sri Lanka\s+/, "")}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ trip finder */
export type FinderPackage = { title: string; href: string; category: string; days: number; nights: number; image: string; tagline: string; family?: boolean };

const WINDOWS = [
  { v: "any", l: "Flexible / Year-Round" },
  { v: "nov-apr", l: "Nov – Apr (South Coast & West)" },
  { v: "may-sep", l: "May – Sep (East Coast & Safaris)" },
  { v: "festivals", l: "July – Aug (Kandy Esala Perahera)" },
];
const DURATIONS = [
  { v: "any", l: "Any Duration" },
  { v: "short", l: "5 – 7 Days (Highlights Sprint)" },
  { v: "medium", l: "8 – 11 Days (Classic Circuit)" },
  { v: "long", l: "12 – 16 Days (Grand In-Depth)" },
];
const PASSIONS = [
  { v: "any", l: "All Highlights" },
  { v: "beach", l: "Golden Beaches & Marine Life" },
  { v: "cultural", l: "Ancient UNESCO Citadels & Temples" },
  { v: "wildlife", l: "Wild Big Five Safaris & Leopards" },
  { v: "hill-country", l: "Tea Country & Mountain Railways" },
  { v: "adventure", l: "River Rapids & Cloud Treks" },
  { v: "ayurvedic", l: "Panchakarma & Sacred Meditation" },
  { v: "honeymoon", l: "Intimate Luxury & Plunge Pool Villas" },
  { v: "family", l: "Safe Multi-Gen Discovery with Kids" },
  { v: "ramayana", l: "Sacred Ramayana Legends & Shrines" },
  { v: "golf", l: "Historic Golf Fairways & Coastal Links" },
];
const WHO = [
  { v: "couple", l: "Couple / Romance" },
  { v: "family", l: "Family with Children" },
  { v: "small-group", l: "Friends / Private Group" },
  { v: "solo", l: "Solo Explorer" },
];

const WINDOW_FIT: Record<string, string[]> = {
  "nov-apr": ["beach", "hill-country", "honeymoon", "golf", "ayurvedic", "family", "cultural", "buddhist-heritage", "ramayana"],
  "may-sep": ["wildlife", "cultural", "buddhist-heritage", "adventure", "ramayana", "family"],
  festivals: ["cultural", "buddhist-heritage", "ramayana", "hill-country"],
};

export function TripFinder({ pkgs }: { pkgs: FinderPackage[] }) {
  const [form, setForm] = useState({ window: "any", duration: "any", passion: "any", who: "couple" });
  const [revealed, setRevealed] = useState(false);

  const matches = useMemo(() => {
    const scored = pkgs
      .map((p) => {
        let s = 0;
        if (form.passion !== "any") s += p.category === form.passion ? 6 : -10;
        if (form.duration === "short") s += p.days <= 7 ? 3 : p.days <= 9 ? 0 : -3;
        if (form.duration === "medium") s += p.days >= 8 && p.days <= 11 ? 3 : -2;
        if (form.duration === "long") s += p.days >= 12 ? 3 : -3;
        if (form.window !== "any") s += WINDOW_FIT[form.window]?.includes(p.category) ? 2 : -1;
        if (form.who === "family") s += p.category === "family" ? 3 : p.category === "honeymoon" ? -4 : 0;
        if (form.who === "couple") s += p.category === "honeymoon" ? 2 : 0;
        if (form.who === "solo") s += ["adventure", "buddhist-heritage", "ayurvedic"].includes(p.category) ? 1 : 0;
        return { p, s };
      })
      .filter((x) => x.s > -5)
      .sort((a, b) => b.s - a.s);
    return scored.slice(0, 3).map((x) => x.p);
  }, [pkgs, form]);

  const sel = (key: keyof typeof form, label: string, opts: { v: string; l: string }[]) => (
    <div className="field">
      <label htmlFor={`f-${key}`}>{label}</label>
      <select id={`f-${key}`} className="select" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}>
        {opts.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="stack-lg">
      <form
        className="grid g4"
        style={{ alignItems: "end" }}
        onSubmit={(e) => {
          e.preventDefault();
          setRevealed(true);
        }}
      >
        {sel("window", "1. Travel window", WINDOWS)}
        {sel("duration", "2. Duration", DURATIONS)}
        {sel("passion", "3. Primary passion", PASSIONS)}
        {sel("who", "4. Who travels?", WHO)}
        <div style={{ gridColumn: "1 / -1" }}>
          <button type="submit" className="btn btn-navy">
            Reveal my curated matches
          </button>
        </div>
      </form>
      {revealed && (
        <div aria-live="polite" className="stack-lg">
          <h4 className="h4">Your curated matches:</h4>
          {matches.length ? (
            <div className="grid g3">
              {matches.map((m) => (
                <Link className="card" href={m.href} key={m.href}>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.image} alt={m.title} loading="lazy" />
                    <span className="tag tag-r">
                      {m.nights} Nights / {m.days} Days
                    </span>
                  </figure>
                  <h3>{m.title}</h3>
                  <p>{m.tagline}</p>
                  <span className="tlink">
                    Explore itinerary <Arrow />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="body">
              No exact match — every journey is tailor-made, so{" "}
              <Link className="ulink" href="/inquiry">
                tell us what you have in mind
              </Link>
              .
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ travel hub tabs */
export type HubPanel = {
  id: string;
  tab: string;
  kicker: string;
  title: string;
  lead: string;
  cards: { title: string; meta?: string; text?: string; items?: string[] }[];
  tip: { label: string; text: string };
};

export function TravelHub({ panels }: { panels: HubPanel[] }) {
  const [active, setActive] = useState(panels[0].id);
  const p = panels.find((x) => x.id === active)!;
  return (
    <div>
      <div className="tabs" role="tablist" aria-label="Travel preparation guide">
        {panels.map((x) => (
          <button key={x.id} type="button" role="tab" id={`tab-${x.id}`} aria-controls={`panel-${x.id}`} aria-selected={x.id === active} className="tab" onClick={() => setActive(x.id)}>
            {x.tab}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${p.id}`} aria-labelledby={`tab-${p.id}`} key={p.id} style={{ animation: "lift .6s var(--ease)" }}>
        <div className="split split--top">
          <div className="stack">
            <p className="eyebrow muted">{p.kicker}</p>
            <h3 className="h3">{p.title}</h3>
            <p className="body body--wide">{p.lead}</p>
          </div>
          <div className="grid g2">
            {p.cards.map((c) => (
              <div key={c.title} className="stack" style={{ borderTop: "1px solid var(--ink)", paddingTop: 20, gap: 12 }}>
                <h4 className="h4">{c.title}</h4>
                {c.meta && <p className="small" style={{ color: "var(--ink)" }}>{c.meta}</p>}
                {c.text && <p className="small">{c.text}</p>}
                {c.items && (
                  <ul className="checks dots">
                    {c.items.map((it) => (
                      <li key={it} style={{ fontSize: 14.5 }}>
                        {it}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="note">
          <b>{p.tip.label}:</b> {p.tip.text}
        </p>
      </div>
    </div>
  );
}
