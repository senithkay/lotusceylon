import type { Metadata } from "next";
import { SITE, waLink, DEFAULT_WA_TEXT } from "@/lib/site";
import { Rise } from "@/components/motion";
import { ClosingCta, PageHero, SectionHead } from "@/components/ui";
import { ContactForm } from "@/components/forms";
import { RouteMap } from "@/components/tours";
import { CopyButton } from "@/components/copy-button";

export const metadata: Metadata = {
  title: { absolute: "Contact Lotus Ceylon | Speak With Our Ceylon Specialists" },
  description:
    "Whether you seek advice on seasonal weather, bespoke routing, or unique cultural sanctuaries, our dedicated concierge in Ja-Ela, Sri Lanka awaits your message.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        image="/assets/images/contact/negombo-lagoon-1.webp"
        eyebrow="Connect with us"
        title="Speak with our Ceylon"
        accent="specialists"
        lead="Whether you seek advice on seasonal weather, bespoke routing, or unique cultural sanctuaries, our dedicated concierge awaits your message."
        short
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="gap-sm">
        <div className="wrap split split--top">
          <div className="stack-lg">
            <SectionHead
              eyebrow="Registered executive office"
              title="Island"
              accent="headquarters"
              text={`${SITE.legalName} operates from our registered executive office in Ja-Ela, conveniently situated near Colombo Bandaranaike International Airport.`}
              style={{ marginBottom: 0 }}
            />
            <Rise>
              <ul className="rlist">
                <li>
                  <span>Registered office</span>
                  <span style={{ textAlign: "right" }}>{SITE.address.full}</span>
                </li>
                <li>
                  <span>Voice telephone</span>
                  <a className="ulink" href={SITE.phoneHref}>
                    {SITE.phone}
                  </a>
                </li>
                <li>
                  <span>Official correspondence</span>
                  <a className="ulink" href={`mailto:${SITE.email}`}>
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <span>Hours &amp; time zone</span>
                  <span style={{ textAlign: "right" }}>
                    {SITE.hours}
                    <br />
                    <span className="muted">{SITE.hoursNote}</span>
                  </span>
                </li>
                <li>
                  <span>Messaging</span>
                  <span style={{ textAlign: "right" }}>
                    WhatsApp {SITE.whatsapp}
                    <br />
                    WeChat: {SITE.wechat}
                    <br />
                    LINE: {SITE.line} ({SITE.linePhone})
                  </span>
                </li>
              </ul>
            </Rise>
          </div>
          <Rise className="stack-lg">
            <div className="stack">
              <h2 className="h3">
                Send us a direct <em>message</em>
              </h2>
              <p className="small">Share your intended travel window, party size, or questions. Our senior destination designers will respond with thoughtful guidance.</p>
            </div>
            <ContactForm />
          </Rise>
        </div>
      </section>

      <section className="gap-sm grey">
        <div className="wrap">
          <SectionHead eyebrow="Scan QR code to chat directly" title="Instant mobile" accent="concierge" text="Instant mobile concierge access for tour inquiries, custom itineraries, and active guest assistance." />
          <div className="grid g3">
            <Rise className="qr" style={{ background: "var(--white)" }}>
              <p className="eyebrow">WhatsApp</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SITE.qr.whatsapp} alt="Scan WhatsApp QR Code - Lotus Ceylon" loading="lazy" />
              <b style={{ fontWeight: 500 }}>WhatsApp Concierge</b>
              <span className="small">{SITE.whatsapp}</span>
              <a className="btn btn-navy btn-sm" href={waLink(DEFAULT_WA_TEXT)} target="_blank" rel="noopener noreferrer">
                Open chat
              </a>
            </Rise>
            <Rise className="qr" delay={0.08} style={{ background: "var(--white)" }}>
              <p className="eyebrow">WeChat</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SITE.qr.wechat} alt="Scan WeChat QR Code - Lotus Ceylon" loading="lazy" />
              <b style={{ fontWeight: 500 }}>WeChat Official</b>
              <span className="small">{SITE.wechat}</span>
              <CopyButton text={SITE.wechat} label="Copy ID" />
            </Rise>
            <Rise className="qr" delay={0.16} style={{ background: "var(--white)" }}>
              <p className="eyebrow">LINE</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SITE.qr.line} alt="Scan LINE QR Code - Lotus Ceylon" loading="lazy" />
              <b style={{ fontWeight: 500 }}>LINE Official</b>
              <span className="small">{SITE.line}</span>
              <a className="btn btn-navy btn-sm" href={SITE.lineUrl} target="_blank" rel="noopener noreferrer">
                Add friend
              </a>
            </Rise>
          </div>
        </div>
      </section>

      <section aria-label="Headquarters location map">
        <RouteMap routes={[]} hq wide />
      </section>

      <ClosingCta />
    </>
  );
}
