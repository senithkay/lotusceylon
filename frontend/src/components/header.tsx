"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { THEMES } from "@/lib/content";
import { SITE, waLink, DEFAULT_WA_TEXT } from "@/lib/site";
import { useLenis } from "./motion";

const NAV = [
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences", label: "Experiences" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

const ArrowSm = () => (
  <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={{ width: 16, height: 16 }}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [solid, setSolid] = useState(false);
  const [hide, setHide] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const last = useRef(0);

  // close menus on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset UI when the route changes
    setOpen(false);
    setMega(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const limit = hero ? hero.offsetTop + hero.offsetHeight - 90 : 10;
      setSolid(y > limit);
      setHide(y > last.current && y > window.innerHeight * 0.6);
      last.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = open ? "hidden" : "";
  }, [open, lenis]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className={`top ${solid && !open ? "solid" : ""} ${hide && !open ? "hide" : ""}`} id="top">
        <div className="wrap">
          <Link className="logo" href="/" aria-label="Lotus Ceylon home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-light" src="/media/logo-wordmark-white.png" alt="" width={640} height={449} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-dark" src="/media/logo-wordmark.png" alt="" width={640} height={449} />
            <span className="sr-only">Lotus Ceylon</span>
          </Link>
          <nav className="menu" aria-label="Main">
            <div className={`has-mega ${mega ? "open" : ""}`} onMouseLeave={() => setMega(false)}>
              <button
                type="button"
                className="ulink"
                aria-expanded={mega}
                aria-current={isActive("/tours") ? "page" : undefined}
                onClick={() => setMega((m) => !m)}
                onKeyDown={(e) => e.key === "Escape" && setMega(false)}
              >
                Tours
              </button>
              <div className="mega" role="menu">
                <Link className="mega-all" href="/tours" role="menuitem">
                  All tour packages <ArrowSm />
                </Link>
                {THEMES.map((t) => (
                  <Link key={t.slug} href={`/tours/${t.slug}`} role="menuitem">
                    {t.name} <ArrowSm />
                  </Link>
                ))}
              </div>
            </div>
            {NAV.map((n) => (
              <Link key={n.href} className="ulink" href={n.href} aria-current={isActive(n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="top-actions">
            <Link className="btn-inq btn" href="/inquiry">
              Inquire
            </Link>
            <button type="button" className="burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="drawer" onClick={() => setOpen((o) => !o)}>
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer ${open ? "open" : ""}`} id="drawer" aria-hidden={!open} data-lenis-prevent="">
        <div className="wrap">
          <nav aria-label="Mobile">
            <Link href="/">Home</Link>
            <details>
              <summary>
                Tours &amp; packages <span className="plus">+</span>
              </summary>
              <Link href="/tours">All tour packages</Link>
              {THEMES.map((t) => (
                <Link key={t.slug} href={`/tours/${t.slug}`}>
                  {t.name}
                </Link>
              ))}
            </details>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="drawer-foot">
            <div className="btns">
              <Link className="btn btn-white" href="/inquiry">
                Plan my bespoke journey
              </Link>
              <a className="btn btn-line-light" href={waLink(DEFAULT_WA_TEXT)} target="_blank" rel="noopener noreferrer">
                WhatsApp ({SITE.whatsapp})
              </a>
            </div>
            <span>{SITE.address.full}</span>
          </div>
        </div>
      </div>
    </>
  );
}
