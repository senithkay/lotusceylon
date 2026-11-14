"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Destination, Filter } from "@/lib/content";
import { Arrow } from "./ui";

/* ------------------------------------------------------------------ destinations */
export function DestinationGrid({ items, filters, placeholder }: { items: Destination[]; filters: Filter[]; placeholder: string }) {
  const [f, setF] = useState("all");
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter(
      (d) =>
        (f === "all" || d.filter === f) &&
        (!s || [d.title, d.region, d.desc, ...d.highlights].join(" ").toLowerCase().includes(s)),
    );
  }, [items, f, q]);
  return (
    <>
      <div className="shead-row" style={{ alignItems: "center" }}>
        <div className="chips" role="group" aria-label="Filter destinations">
          {filters.map((x) => (
            <button key={x.key} type="button" className="chip" aria-pressed={f === x.key} onClick={() => setF(x.key)}>
              {x.label}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Search destinations</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input type="search" value={q} placeholder={placeholder} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      {shown.length ? (
        <div className="grid g3">
          {shown.map((d) => (
            <Link className="card" href={`/destinations/${d.slug}`} key={d.slug} style={{ animation: "lift .6s var(--ease)" }}>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.image} alt={`${d.title} Sri Lanka`} loading="lazy" />
                <span className="tag">{d.region}</span>
              </figure>
              <h3>{d.title}</h3>
              <p>{d.desc}</p>
              <p className="meta-line">{d.highlights.join(" · ")}</p>
              <span className="tlink">
                View related journeys <Arrow />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="stack" style={{ justifyItems: "start" }}>
          <p className="body">No destinations found matching your search.</p>
          <button
            type="button"
            className="btn btn-line"
            onClick={() => {
              setQ("");
              setF("all");
            }}
          >
            Reset search
          </button>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ gallery */
type GalleryItem = { filter: string; image: string; alt: string; tag: string; title: string; desc: string; location: string };

export function GalleryGrid({ items, filters }: { items: GalleryItem[]; filters: Filter[] }) {
  const [f, setF] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const shown = items.filter((g) => f === "all" || g.filter === f);
  const current = open !== null ? shown[open] : null;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % shown.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + shown.length) % shown.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, shown.length]);

  return (
    <>
      <div className="chips" style={{ marginBottom: 48 }} role="group" aria-label="Filter imagery">
        {filters.map((x) => (
          <button key={x.key} type="button" className="chip" aria-pressed={f === x.key} onClick={() => setF(x.key)}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="grid g3">
        {shown.map((g, i) => (
          <button
            key={g.title}
            type="button"
            className="card"
            onClick={() => setOpen(i)}
            style={{ textAlign: "left", background: "none", border: 0, padding: 0, cursor: "zoom-in", animation: "lift .6s var(--ease)" }}
            aria-label={`Enlarge: ${g.title}`}
          >
            <figure style={{ aspectRatio: i % 3 === 1 ? "4 / 5" : "4 / 3" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.image} alt={g.alt} loading="lazy" />
              <span className="tag">{g.tag}</span>
            </figure>
            <h3>{g.title}</h3>
            <p>{g.desc}</p>
            <p className="meta-line">{g.location}</p>
          </button>
        ))}
      </div>
      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.title} onClick={() => setOpen(null)} data-lenis-prevent="">
          <figure onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image} alt={current.alt} />
          </figure>
          <aside onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setOpen(null)} aria-label="Close">
              ×
            </button>
            <p className="eyebrow muted">{current.tag}</p>
            <h3 className="h3">{current.title}</h3>
            <p className="small">{current.desc}</p>
            <p className="small" style={{ color: "var(--ink)" }}>
              {current.location}
            </p>
            <div className="btns">
              <button type="button" className="btn btn-line btn-sm" onClick={() => setOpen((o) => (o === null ? o : (o - 1 + shown.length) % shown.length))}>
                ← Prev
              </button>
              <button type="button" className="btn btn-line btn-sm" onClick={() => setOpen((o) => (o === null ? o : (o + 1) % shown.length))}>
                Next →
              </button>
            </div>
            <Link className="btn btn-navy" href={`/inquiry?${new URLSearchParams({ destination: current.title })}`}>
              Inquire to visit this sensation
            </Link>
          </aside>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ experiences */
type Encounter = { filter: string; image: string; alt: string; tag: string; title: string; text: string; meta: string };

export function EncounterGrid({ items, filters }: { items: Encounter[]; filters: Filter[] }) {
  const [f, setF] = useState("all");
  const shown = items.filter((e) => f === "all" || e.filter === f);
  return (
    <>
      <div className="chips" style={{ marginBottom: 48 }} role="group" aria-label="Filter experiences">
        {filters.map((x) => (
          <button key={x.key} type="button" className="chip" aria-pressed={f === x.key} onClick={() => setF(x.key)}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="grid g3">
        {shown.map((e) => (
          <article className="card" key={e.title} style={{ animation: "lift .6s var(--ease)" }}>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.image} alt={e.alt} loading="lazy" />
              <span className="tag">{e.tag.replace(/^[^\w]+/, "")}</span>
            </figure>
            <h3>{e.title}</h3>
            <p>{e.text}</p>
            <p className="meta-line">{e.meta}</p>
          </article>
        ))}
      </div>
    </>
  );
}
