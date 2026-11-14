"use client";
/**
 * Motion system (ported from the Lotus Ceylon Motion artifact):
 * Lenis inertial scroll driven by the GSAP ticker, text that rises from
 * masks with blurred italic characters, images that unmask and drift,
 * counters, and the page background that fades to navy for one band.
 */
import {
  Children,
  createContext,
  Fragment,
  isValidElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const reduced = () =>
  typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type MotionCtx = { lenis: Lenis | null };
const Ctx = createContext<MotionCtx>({ lenis: null });
export const useLenis = () => useContext(Ctx).lenis;

/* ------------------------------------------------------------------ provider */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (reduced()) {
      document.documentElement.classList.remove("js-motion");
      return;
    }
    const l = new Lenis({ lerp: 0.085, smoothWheel: true });
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Lenis needs the DOM, so it can only be created here
    setLenis(l);

    // smooth in-page anchors
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!;
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        l.scrollTo(id, { duration: 1.8, offset: -80 });
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      l.destroy();
    };
  }, []);

  // new route: jump to top (or the hash) and re-measure triggers
  useEffect(() => {
    if (!lenis) return;
    const hash = window.location.hash;
    if (hash && document.querySelector(hash)) lenis.scrollTo(hash, { immediate: true, offset: -80 });
    else lenis.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    document.body.classList.remove("on-navy");
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);

  return <Ctx.Provider value={{ lenis }}>{children}</Ctx.Provider>;
}

/* ------------------------------------------------------------------ split text */
type Token =
  | { kind: "word"; text: string }
  | { kind: "em"; text: string }
  | { kind: "node"; node: ReactNode };

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node as ReactElement<{ children?: ReactNode }>).props.children);
  return "";
}

function tokenize(children: ReactNode): Token[] {
  const out: Token[] = [];
  Children.toArray(children).forEach((c) => {
    if (typeof c === "string" || typeof c === "number") {
      String(c)
        .split(/\s+/)
        .filter(Boolean)
        .forEach((t) => out.push({ kind: "word", text: t }));
    } else if (isValidElement(c) && c.type === "em") {
      textOf(c)
        .split(/\s+/)
        .filter(Boolean)
        .forEach((t) => out.push({ kind: "em", text: t }));
    } else if (isValidElement(c)) {
      out.push({ kind: "node", node: c });
    }
  });
  return out;
}

type SplitProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** play on mount (hero) instead of on scroll */
  immediate?: boolean;
  delay?: number;
  style?: React.CSSProperties;
  id?: string;
};

export function Split({ as: Tag = "h2", className = "", children, immediate, delay = 0, style, id }: SplitProps) {
  const ref = useRef<HTMLElement>(null);
  const tokens = tokenize(children);
  const label = tokens
    .map((t) => (t.kind === "node" ? "" : t.text))
    .filter(Boolean)
    .join(" ");

  useIso(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      {
        const words = Array.from(el.querySelectorAll<HTMLElement>(":scope > .wm"));
        let line = -1;
        let top: number | null = null;
        const tl = gsap.timeline({
          delay: immediate ? 0.35 + delay : delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 82%" },
        });
        words.forEach((w) => {
          if (top === null || Math.abs(w.offsetTop - top) > 4) {
            line += 1;
            top = w.offsetTop;
          }
          tl.fromTo(
            w.firstElementChild,
            { yPercent: 130, y: 0 },
            { yPercent: 0, y: 0, duration: 1.4, ease: "expo.out" },
            line * 0.09,
          );
        });
        const chars = el.querySelectorAll(".ch");
        if (chars.length)
          tl.fromTo(
            chars,
            { opacity: 0, filter: "blur(12px)", yPercent: 40 },
            { opacity: 1, filter: "blur(0px)", yPercent: 0, duration: 1.1, ease: "power3.out", stagger: 0.045 },
            0.35,
          );
        el.querySelectorAll(".pic").forEach((p, i) =>
          tl.from(p, { width: 0, marginLeft: 0, marginRight: 0, duration: 1.2, ease: "expo.inOut" }, 0.5 + i * 0.12),
        );
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Tag ref={ref} className={`split-text ${className}`} aria-label={label} style={style} id={id}>
      {tokens.map((t, i) => (
        <Fragment key={i}>
          <span className="wm" aria-hidden="true">
            <span>
              {t.kind === "word" && t.text}
              {t.kind === "em" && (
                <em>
                  {[...t.text].map((ch, j) => (
                    <span className="ch" key={j}>
                      {ch}
                    </span>
                  ))}
                </em>
              )}
              {t.kind === "node" && t.node}
            </span>
          </span>
          {i < tokens.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ rise / unmask */
export function useReveal<T extends HTMLElement>(
  kind: "rise" | "unmask",
  opts: { immediate?: boolean; delay?: number } = {},
) {
  const ref = useRef<T>(null);
  useIso(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      const st = opts.immediate ? undefined : { trigger: el, start: kind === "rise" ? "top 90%" : "top 92%" };
      if (kind === "rise")
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.3, ease: "expo.out", delay: opts.immediate ? 0.9 + (opts.delay ?? 0) : opts.delay ?? 0, scrollTrigger: st },
        );
      else
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "expo.out", delay: opts.delay ?? 0, scrollTrigger: st },
        );
    }, el);
    return () => ctx.revert();
  }, []);
  return ref;
}

type BoxProps = {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
  immediate?: boolean;
  delay?: number;
  style?: React.CSSProperties;
  id?: string;
} & Record<string, unknown>;

export function Rise({ as: Tag = "div", className, children, immediate, delay, ...rest }: BoxProps) {
  const ref = useReveal<HTMLElement>("rise", { immediate, delay });
  return (
    <Tag ref={ref} className={className} data-rise="" {...rest}>
      {children}
    </Tag>
  );
}

export function Unmask({ as: Tag = "figure", className, children, delay, ...rest }: BoxProps) {
  const ref = useReveal<HTMLElement>("unmask", { delay });
  return (
    <Tag ref={ref} className={className} data-unmask="" {...rest}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ parallax image */
export function Drift({
  src,
  alt = "",
  className,
  amount = 12,
  scale = false,
  priority,
}: {
  src: string;
  alt?: string;
  className?: string;
  amount?: number;
  scale?: boolean;
  priority?: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);
  useIso(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -amount / 2, scale: scale ? 1.12 : 1 },
        {
          yPercent: amount / 2,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
    return () => ctx.revert();
  }, []);
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt={alt} className={className} loading={priority ? "eager" : "lazy"} style={{ height: `${100 + amount}%`, marginTop: `-${amount / 2}%` }} />;
}

/** Inner-page hero: background drifts and content lifts away while leaving. */
export function HeroMotion({ children, className, id }: { children: ReactNode; className: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  useIso(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      const media = el.querySelector(".phero-media");
      const inner = el.querySelector(".phero-in");
      if (media) {
        gsap.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 2.2, ease: "expo.out" });
        gsap.to(media, { yPercent: 10, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
      }
      if (inner)
        gsap.to(inner, { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { trigger: el, start: "45% top", end: "bottom top", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={ref} className={className} id={id} data-hero="">
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ counters */
export function CountUp({ to, suffix = "", prefix = "", className }: { to: number; suffix?: string; prefix?: string; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useIso(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const o = { v: 0 };
    const ctx = gsap.context(() => {
      el.textContent = `${prefix}0${suffix}`;
      gsap.to(o, {
        v: to,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(o.v)}${suffix}`;
        },
      });
    });
    return () => ctx.revert();
  }, [to]);
  return (
    <b ref={ref} className={className}>
      {prefix}
      {to}
      {suffix}
    </b>
  );
}

/* ------------------------------------------------------------------ navy band */
export function NavyBand({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  useIso(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      el.classList.add("navy");
      return;
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 55%",
      end: "bottom 45%",
      onToggle: (s) => document.body.classList.toggle("on-navy", s.isActive),
    });
    return () => {
      st.kill();
      document.body.classList.remove("on-navy");
    };
  }, []);
  return (
    <section ref={ref} className={className} id={id}>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ wide image */
export function WideReveal({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useIso(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { clipPath: "inset(0 22% 0 22%)" }, { clipPath: "inset(0 0% 0 0%)", ease: "none", scrollTrigger: { trigger: el, start: "top 95%", end: "top 20%", scrub: true } });
      gsap.fromTo(el.querySelector("img"), { yPercent: -12 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <div className="wide" ref={ref}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

/* ------------------------------------------------------------------ drag strip */
export function DragStrip({ children, barId }: { children: ReactNode; barId?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const strip = ref.current;
    if (!strip) return;
    barRef.current = barId ? document.getElementById(barId) : null;
    let down = false,
      sx = 0,
      sl0 = 0,
      moved = 0;
    const pd = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = 0;
      sx = e.clientX;
      sl0 = strip.scrollLeft;
    };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 4) strip.classList.add("drag");
      strip.scrollLeft = sl0 - dx;
    };
    const pu = () => {
      down = false;
      setTimeout(() => strip.classList.remove("drag"), 0);
    };
    const sc = () => {
      const p = strip.scrollLeft / (strip.scrollWidth - strip.clientWidth || 1);
      if (barRef.current) barRef.current.style.transform = `translateX(${p * 233}%)`;
    };
    strip.addEventListener("pointerdown", pd);
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);
    strip.addEventListener("scroll", sc, { passive: true });
    return () => {
      strip.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerup", pu);
      strip.removeEventListener("scroll", sc);
    };
  }, [barId]);
  return (
    <div className="strip" ref={ref}>
      {children}
    </div>
  );
}

/** Unmasks every matching child figure as it enters (journal posts, strips). */
export function UnmaskChildren({ selector, children, className }: { selector: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useIso(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll(selector).forEach((f) =>
        gsap.fromTo(f, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: f, start: "top 92%" } }),
      );
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
