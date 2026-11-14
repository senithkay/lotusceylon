"use client";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Rise, Split } from "./motion";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const reduced = () => typeof window === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ hero film */
const SCENES: [number, string][] = [
  [0, "Lotus Blossom Sanctuaries · Sacred Waters of Ceylon"],
  [9.4, "Lotus Tower and Colombo Skyline · Iconic Capital Landmark (350m)"],
  [13.8, "Sigiriya Ancient Rock Citadel · 5th Century Royal Sky Palace"],
  [17.3, "Sigiriya Lion’s Paw Terrace · Royal Ascent and Ancient Ramparts"],
  [20.9, "Sacred Anuradhapura and Nuwara Wewa · Ancient Buddhist Capital"],
  [24.4, "Colossal Jetavanaramaya Stupa · UNESCO Sacred Heritage"],
  [28, "Dambulla Golden Rock Temple · Sacred Cave Monastery and Murals"],
  [31.6, "Nine Arch Demodara Bridge · Highland Colonial Railway, Ella"],
];

export type DeckSlide = { image: string; title: string; href: string };

export function HeroFilm({ slides, lead }: { slides: DeckSlide[]; lead: string }) {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [scene, setScene] = useState(SCENES[0][1]);
  const [fade, setFade] = useState(1);
  const [si, setSi] = useState(0);

  // captions synced to the film
  useEffect(() => {
    const v = film.current;
    if (!v) return;
    let current = SCENES[0][1];
    let t: number | undefined;
    const onTime = () => {
      let c = SCENES[0][1];
      SCENES.forEach(([s, label]) => {
        if (v.currentTime >= s) c = label;
      });
      if (c !== current) {
        current = c;
        setFade(0);
        t = window.setTimeout(() => {
          setScene(c);
          setFade(1);
        }, 300);
      }
    };
    v.addEventListener("timeupdate", onTime);
    if (reduced()) v.pause();
    return () => {
      v.removeEventListener("timeupdate", onTime);
      window.clearTimeout(t);
    };
  }, []);

  // vertical 3D card cycle
  useEffect(() => {
    if (reduced()) return;
    const id = window.setInterval(() => setSi((s) => (s + 1) % slides.length), 3200);
    return () => window.clearInterval(id);
  }, [slides.length]);

  // film drifts, content lifts away
  useIso(() => {
    const el = root.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.to(film.current, { scale: 1.12, yPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-in", { yPercent: -30, opacity: 0, ease: "none", scrollTrigger: { trigger: el, start: "40% top", end: "bottom top", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  const slideStyle = (i: number): React.CSSProperties => {
    const d = (i - si + slides.length) % slides.length;
    if (d === 0) return { transform: "translateY(0) rotateX(0) scale(1)", opacity: 1, zIndex: 3 };
    if (d === slides.length - 1) return { transform: "translateY(-120%) rotateX(-20deg) scale(1.05)", opacity: 0, zIndex: 2 };
    return { transform: "translateY(70%) rotateX(25deg) scale(.9)", opacity: 0, zIndex: 1 };
  };

  return (
    <section className="hero" id="hero" ref={root} data-hero="">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="poster" src="/media/hero-poster.jpg" alt="" />
      <video
        ref={film}
        src="/media/hero.mp4"
        poster="/media/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Film of Sri Lanka: lotus ponds, Colombo, Sigiriya, Anuradhapura, Dambulla and Ella"
      />
      <div className="wrap hero-in">
        <div>
          <Rise as="p" className="eyebrow" immediate delay={-0.5} style={{ marginBottom: 22, opacity: 0.9 }}>
            Sri Lanka tailor-made luxury holidays
          </Rise>
          <Split as="h1" className="h1" immediate>
            Discover Sri Lanka’s timeless <em>wonder</em>
          </Split>
          <Rise as="p" className="lead" immediate>
            {lead}
          </Rise>
          <Rise className="btns hero-ctas" immediate delay={0.1}>
            <Link className="btn btn-white" href="/tours">
              Explore tour packages
            </Link>
            <Link className="btn btn-line-light" href="/inquiry">
              Tailor your journey
            </Link>
          </Rise>
          <Rise className="scene" immediate delay={0.2} aria-live="polite">
            <i />
            <span style={{ opacity: fade, transition: "opacity .3s" }}>{scene}</span>
          </Rise>
        </div>
        <Rise className="deck" immediate delay={0.1}>
          <Link className="deck-card" href="#journeys">
            <small>Signature journeys</small>
            <div className="slides">
              {slides.map((s, i) => (
                <div className="slide" key={s.title} style={slideStyle(i)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt="" />
                  <b>{s.title}</b>
                </div>
              ))}
            </div>
          </Link>
          <Link className="btn btn-white" href="/inquiry">
            Plan my trip
          </Link>
        </Rise>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ destination swap */
export type SwapRow = { label: string; href: string; image: string; caption: string; alt: string };

/** Two-column wrapper so the swap figure sits in the right column. */
export function DestinationSwapSection({ rows, children }: { rows: SwapRow[]; children: React.ReactNode }) {
  const [i, setI] = useState(0);
  return (
    <div className="wrap dest">
      <div>
        {children}
        <nav className="rows" aria-label="Destinations">
          {rows.map((r, j) => (
            <Link key={r.label} href={r.href} aria-current={j === i ? "true" : undefined} onMouseEnter={() => setI(j)} onFocus={() => setI(j)}>
              {r.label}
              <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </Link>
          ))}
        </nav>
      </div>
      <figure className="swap">
        {rows.map((r, j) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={r.label} className={j === i ? "on" : ""} src={r.image} alt={r.alt} loading="lazy" />
        ))}
        <figcaption>{rows[i].caption}</figcaption>
      </figure>
    </div>
  );
}

/* ------------------------------------------------------------------ sticky journeys */
export type Journey = { bg: string; image: string; title: string; sub: string; href: string };

export function FeatureJourneys({ items, intro }: { items: Journey[]; intro: string }) {
  const root = useRef<HTMLElement>(null);
  const [fi, setFi] = useState(0);
  const [shown, setShown] = useState(0);
  const [fade, setFade] = useState(1);

  useIso(() => {
    const el = root.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (s) => setFi(Math.min(items.length - 1, Math.floor(s.progress * items.length))),
      });
      gsap.fromTo(".feature-bg", { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, [items.length]);

  // crossfade the card photo + text like the artifact
  useEffect(() => {
    if (fi === shown) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start of a timed crossfade
    setFade(0);
    const t = window.setTimeout(() => {
      setShown(fi);
      setFade(1);
    }, 300);
    return () => window.clearTimeout(t);
  }, [fi, shown]);

  const j = items[shown];
  return (
    <section className="feature" id="journeys" ref={root} style={{ height: `${100 + items.length * 40}svh` }}>
      <div className="feature-stick">
        <div className="feature-bg">
          {items.map((it, k) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={it.title} className={k === fi ? "on" : ""} src={it.bg} alt="" loading={k === 0 ? "eager" : "lazy"} />
          ))}
        </div>
        <div className="feature-card">
          <h2 className="h2" style={{ fontSize: "clamp(34px,3.2vw,46px)" }}>
            Curated private <em>journeys</em>
          </h2>
          <p className="small" style={{ marginTop: 14 }}>
            {intro}
          </p>
          <div className="ph">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={j.image} alt="" style={{ opacity: fade }} />
          </div>
          <p className="t" style={{ opacity: fade }}>
            {j.title}
          </p>
          <p className="s">{j.sub}</p>
          <Link className="tlink ulink go" href={j.href}>
            Explore itinerary
          </Link>
          <p className="count">
            <b>{String(shown + 1).padStart(2, "0")}</b>
            <span>/{String(items.length).padStart(2, "0")}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
