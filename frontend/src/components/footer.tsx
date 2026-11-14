import Link from "next/link";
import { THEMES } from "@/lib/content";
import { SITE, waLink, DEFAULT_WA_TEXT } from "@/lib/site";
import { ChatIcon } from "./ui";

const QUICK = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "All Tour Packages" },
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences", label: "Curated Experiences" },
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Visual Gallery" },
  { href: "/reviews", label: "Guest Reviews" },
  { href: "/blog", label: "Travel Journal" },
  { href: "/contact", label: "Contact Us" },
  { href: "/inquiry/quick", label: "Quick Inquiry Form" },
  { href: "/inquiry", label: "Detailed Travel Inquiry" },
];

const LEGAL = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-conditions", label: "Terms & Conditions" },
  { href: "/cancellation-policy", label: "Cancellation Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-g">
          <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
            <Link className="foot-logo" href="/" aria-label="Lotus Ceylon home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/logo-full-white.png" alt="Lotus — 蓮花 — Lotus Travel Sri Lanka" width={900} height={843} loading="lazy" />
            </Link>
            <p className="muted" style={{ maxWidth: "34ch" }}>
              {SITE.footerBlurb}
            </p>
            <div style={{ display: "grid", gap: 4 }}>
              <span className="muted" style={{ fontSize: 13 }}>
                24/7 Travel Concierge Hotline
              </span>
              <a className="ulink" href={SITE.phoneHref} style={{ justifySelf: "start" }}>
                {SITE.phone}
              </a>
            </div>
            <div style={{ display: "grid", gap: 4 }}>
              <span className="muted" style={{ fontSize: 13 }}>
                Email Inquiries
              </span>
              <a className="ulink" href={`mailto:${SITE.email}`} style={{ justifySelf: "start" }}>
                {SITE.email}
              </a>
            </div>
            <Link className="ulink muted" href="/about#headquarters" style={{ justifySelf: "start" }}>
              Registered office &amp; headquarters details →
            </Link>
          </div>
          <div>
            <h4>Quick links</h4>
            <ul>
              {QUICK.map((l) => (
                <li key={l.href}>
                  <Link className="ulink" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Signature themes</h4>
            <ul>
              {THEMES.map((t) => (
                <li key={t.slug}>
                  <Link className="ulink" href={`/tours/${t.slug}`}>
                    {t.footer}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Island headquarters</h4>
            <ul>
              <li className="muted">{SITE.address.full}</li>
            </ul>
            <h4 style={{ marginTop: 32 }}>Direct messaging</h4>
            <ul>
              <li>
                <a className="ulink" href={waLink(DEFAULT_WA_TEXT)} target="_blank" rel="noopener noreferrer">
                  WhatsApp: {SITE.whatsapp}
                </a>
              </li>
              <li className="muted">WeChat: {SITE.wechat}</li>
              <li>
                <a className="ulink" href={SITE.lineUrl} target="_blank" rel="noopener noreferrer">
                  LINE: {SITE.line} ({SITE.linePhone})
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Follow</h4>
            <ul>
              <li>
                <a className="ulink" href={SITE.social.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a className="ulink" href={SITE.social.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a className="ulink" href={SITE.social.youtube} target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </li>
              <li>
                <a className="ulink" href={SITE.social.tripadvisor} target="_blank" rel="noopener noreferrer">
                  Tripadvisor
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© {new Date().getFullYear()} {SITE.legalName}. All Rights Reserved.</span>
          <nav aria-label="Legal">
            {LEGAL.map((l) => (
              <Link key={l.href} className="ulink" href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <span>
            Designed &amp; Developed by{" "}
            <a className="ulink" href={SITE.designer.url} target="_blank" rel="noopener noreferrer">
              {SITE.designer.name}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <a className="wa" href={waLink(DEFAULT_WA_TEXT)} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
      <ChatIcon />
    </a>
  );
}
