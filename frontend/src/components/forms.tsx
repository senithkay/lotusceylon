"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES, type Country } from "@/lib/countries";
import { conciergeWhatsApp, inquiryWhatsAppMessage, makeReference, submitForm, type InquiryPayload } from "@/lib/api";
import { SITE } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const today = () => new Date().toISOString().slice(0, 10);

const HOTELS = [
  { v: "Boutique", icon: "🏰" },
  { v: "5-star", icon: "👑" },
  { v: "4-star", icon: "🌟" },
  { v: "3-star", icon: "✨" },
  { v: "Budget", icon: "🏡" },
];
const MEALS = ["Bed & Breakfast (BB)", "Half Board (HB)", "Full Board (FB)"];
const INTERESTS = [
  { v: "Culture & Heritage", icon: "🏛️" },
  { v: "Nature", icon: "⛰️" },
  { v: "Ancient & Archaeology", icon: "🏺" },
  { v: "Wildlife", icon: "🐆" },
  { v: "Adventure", icon: "🏄" },
  { v: "Beach", icon: "🏖️" },
  { v: "Shopping", icon: "🛍️" },
  { v: "Buddhist Pilgrimage", icon: "☸" },
  { v: "Ayurveda & Wellness", icon: "🌿" },
];
const BUDGETS = ["Under $1,000", "$1,000 - $2,000", "$2,000 - $3,500", "$3,500 - $5,000", "$5,000+", "Not sure yet"];

/* ------------------------------------------------------------------ country combobox */
function CountryPicker({ value, onChange, id, invalid }: { value: Country | null; onChange: (c: Country) => void; id: string; invalid?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return COUNTRIES;
    return COUNTRIES.filter((c) => [c.name, c.code, c.dial_code, ...(c.aliases ?? [])].some((x) => x.toLowerCase().includes(s)));
  }, [q]);
  useEffect(() => {
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const pick = (c: Country) => {
    onChange(c);
    setQ("");
    setOpen(false);
  };
  return (
    <div className="combo" ref={box}>
      <input
        id={id}
        className="input"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-invalid={invalid || undefined}
        autoComplete="off"
        placeholder={value ? `${value.flag} ${value.name}` : "Search your country…"}
        value={open ? q : value ? `${value.flag} ${value.name}` : q}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setHi(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHi((h) => Math.min(h + 1, list.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHi((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter" && open && list[hi]) {
            e.preventDefault();
            pick(list[hi]);
          } else if (e.key === "Escape") setOpen(false);
        }}
      />
      {open && (
        <ul className="combo-list" id={`${id}-list`} role="listbox" data-lenis-prevent="">
          {list.map((c, i) => (
            <li key={c.code} role="option" aria-selected={i === hi} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(c)}>
              <span>{c.flag}</span>
              {c.name}
              <small>{c.dial_code}</small>
            </li>
          ))}
          {!list.length && <li role="option" aria-selected={false} aria-disabled="true">No matches</li>}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ thank-you modal */
function ThankYou({ reference, waText, onClose }: { reference: string; waText: string; onClose: () => void }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Inquiry received" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center", display: "grid", gap: 18, justifyItems: "center" }}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/logo-wordmark.png" alt="" width={140} height={98} />
        <h3 className="h3">
          Inquiry received with Lotus <em>grace</em>
        </h3>
        <p className="small">Thank you! We will reply within 24 hours with a bespoke travel itinerary.</p>
        <div className="total" style={{ display: "grid", gap: 4 }}>
          <span>Inquiry reference</span>
          <b>{reference}</b>
        </div>
        <div className="btns center">
          <a className="btn btn-navy" href={conciergeWhatsApp(waText)} target="_blank" rel="noopener noreferrer">
            Connect via WhatsApp
          </a>
          <button className="btn btn-line" type="button" onClick={onClose}>
            Close window
          </button>
        </div>
      </div>
    </div>
  );
}

function FailBanner({ waText }: { waText: string }) {
  return (
    <div className="banner" role="alert">
      <span>We were unable to transmit your inquiry to the server right now. Please send your details directly to our travel concierge via WhatsApp:</span>
      <a className="btn btn-navy btn-sm" href={conciergeWhatsApp(waText)} target="_blank" rel="noopener noreferrer">
        Send via WhatsApp ({SITE.whatsapp})
      </a>
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? (
    <span className="err" role="alert">
      {msg}
    </span>
  ) : null;
}

/* ------------------------------------------------------------------ travel inquiry (detailed / quick) */
type Errors = Partial<Record<string, string>>;

export function InquiryForm({ variant }: { variant: "detailed" | "quick" }) {
  const sp = useSearchParams();
  const prefill = sp.get("package") || sp.get("tour") || sp.get("category") || sp.get("brand") || sp.get("destination") || "";
  const custom = sp.get("custom") || "";
  const notes = sp.get("notes") || "";
  const quick = variant === "quick";

  const [country, setCountry] = useState<Country | null>(null);
  const [dial, setDial] = useState("+94");
  const [arrival, setArrival] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [other, setOther] = useState(notes ? `${notes}${custom ? `\n\nEnhancements: ${custom}` : ""}` : custom ? `Enhancements: ${custom}` : "");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ ref: string; wa: string } | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- keep the dial code in step with the chosen country
    if (country) setDial(country.dial_code);
  }, [country]);

  const total = adults + children;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("company")) return; // honeypot
    const errs: Errors = {};
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("whatsapp") || "").trim();
    const dep = String(fd.get("departure") || "");
    const hotels = fd.getAll("hotelCategory").map(String);
    if (name.length < 2) errs.name = "Please enter your full name.";
    if (!country) errs.country = "Please select your country of residence.";
    if (!EMAIL_RE.test(email)) errs.email = "Please enter a valid email address (e.g. name@example.com).";
    if (phone && !/^[0-9\s-]{6,15}$/.test(phone)) errs.whatsapp = "Please enter a valid number without the country code.";
    if (!arrival) errs.arrival = "Please choose your arrival date.";
    if (!dep) errs.departure = "Please choose your departure date.";
    else if (arrival && dep <= arrival) errs.departure = "Departure must be after your arrival date.";
    if (!hotels.length) errs.hotelCategory = "Please select at least one preferred stay style.";
    if (!quick && total > 20) errs.pax = "Total group size cannot exceed 20 guests. Please adjust counts or contact concierge.";
    if (!fd.get("consent")) errs.consent = "Please agree to the Privacy Policy to continue.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"], #${Object.keys(errs)[0]}`)?.focus();
      return;
    }

    const payload: InquiryPayload = {
      referenceId: makeReference(),
      formType: variant,
      name,
      country: country!.name,
      email,
      whatsapp: phone ? `${dial} ${phone}` : "",
      arrivalDate: arrival,
      departureDate: dep,
      totalPax: quick ? String(fd.get("pax") || "2") : String(total),
      hotelCategory: hotels,
      prefill,
      custom: custom || undefined,
      language: document.documentElement.lang || "en",
      timestamp: new Date().toISOString(),
    };
    if (quick) payload.pax = payload.totalPax;
    else {
      payload.adults = String(adults);
      payload.children = String(children);
      payload.rooms = String(fd.get("rooms") || "");
      payload.mealPlan = fd.getAll("mealPlan").map(String);
      payload.interests = fd.getAll("interests").map(String);
      payload.budget = String(fd.get("budget") || "");
      payload.otherRequirements = other.trim();
    }

    setBusy(true);
    setFailed(null);
    const res = await submitForm(quick ? "inquiry-quick" : "inquiry-detailed", payload);
    setBusy(false);
    const wa = inquiryWhatsAppMessage(payload);
    if (res.ok) {
      setDone({ ref: payload.referenceId, wa });
      e.currentTarget?.reset?.();
    } else if (res.reason === "not-configured") {
      // No backend yet: hand the full inquiry to the WhatsApp concierge.
      setDone({ ref: payload.referenceId, wa });
      window.open(conciergeWhatsApp(wa), "_blank", "noopener");
    } else setFailed(wa);
  };

  const fieldCls = (k: string) => `field ${errors[k] ? "invalid" : ""}`;

  return (
    <form className="form" noValidate onSubmit={onSubmit}>
      {prefill && (
        <div className="banner">
          <span>You are enquiring about:</span>
          <b>{prefill}</b>
        </div>
      )}
      <p className="small">
        {quick ? (
          <>
            Have specific requirements?{" "}
            <Link className="ulink" href={`/inquiry${sp.toString() ? `?${sp}` : ""}`} style={{ color: "var(--ink)" }}>
              Use our full detailed inquiry form →
            </Link>
          </>
        ) : (
          <>
            Short on time?{" "}
            <Link className="ulink" href={`/inquiry/quick${sp.toString() ? `?${sp}` : ""}`} style={{ color: "var(--ink)" }}>
              Use our quick inquiry form →
            </Link>
          </>
        )}
      </p>
      <div className="hp" aria-hidden="true">
        <label>
          Do not fill this field
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="form-grid">
        <div className={fieldCls("name")}>
          <label htmlFor="name">
            Name<span className="req">*</span>
          </label>
          <input id="name" name="name" className="input" autoComplete="name" required />
          <FieldError msg={errors.name} />
        </div>
        <div className={fieldCls("country")}>
          <label htmlFor="country">
            Country<span className="req">*</span>
          </label>
          <CountryPicker id="country" value={country} onChange={setCountry} invalid={!!errors.country} />
          <FieldError msg={errors.country} />
        </div>
        <div className={fieldCls("email")}>
          <label htmlFor="email">
            Email address<span className="req">*</span>
          </label>
          <input id="email" name="email" type="email" className="input" autoComplete="email" required />
          <FieldError msg={errors.email} />
        </div>
        {!quick && (
          <div className={fieldCls("whatsapp")}>
            <label htmlFor="whatsapp">
              WhatsApp number <span className="hint">(Optional · International format with country code)</span>
            </label>
            <div className="phone">
              <select className="select" aria-label="Dial code" value={dial} onChange={(e) => setDial(e.target.value)}>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.dial_code}>
                    {c.flag} {c.dial_code}
                  </option>
                ))}
              </select>
              <input id="whatsapp" name="whatsapp" type="tel" className="input" autoComplete="tel-national" inputMode="tel" />
            </div>
            <span className="hint">Defaults to the dial code of your selected country. Validated only if filled.</span>
            <FieldError msg={errors.whatsapp} />
          </div>
        )}
        <div className={fieldCls("arrival")}>
          <label htmlFor="arrival">
            Arrival date <span className="hint">(to Sri Lanka)</span>
            <span className="req">*</span>
          </label>
          <input id="arrival" name="arrival" type="date" className="input" min={today()} value={arrival} onChange={(e) => setArrival(e.target.value)} required />
          <FieldError msg={errors.arrival} />
        </div>
        <div className={fieldCls("departure")}>
          <label htmlFor="departure">
            Departure date <span className="hint">(from Sri Lanka)</span>
            <span className="req">*</span>
          </label>
          <input id="departure" name="departure" type="date" className="input" min={arrival || today()} required />
          <FieldError msg={errors.departure} />
        </div>

        {quick ? (
          <div className="field">
            <label htmlFor="pax">
              No. pax<span className="req">*</span>
            </label>
            <select id="pax" name="pax" className="select" defaultValue="2">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n === 1 ? "1 Person (Solo Traveler)" : n === 2 ? "2 Persons (Couple / Pair)" : n === 20 ? "20 Persons (Max Online Group)" : `${n} Persons`}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className={`${fieldCls("pax")} full`}>
            <span className="lbl">
              No. pax<span className="req">*</span>
            </span>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="adults" className="hint">
                  Adults (12+ yrs)
                </label>
                <select id="adults" className="select" value={adults} onChange={(e) => setAdults(+e.target.value)}>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} Adult{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="children" className="hint">
                  Children (6–12 yrs)
                </label>
                <select id="children" className="select" value={children} onChange={(e) => setChildren(+e.target.value)}>
                  {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Child" : "Children"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="total" aria-live="polite">
              <span>Total travellers</span>
              <b>{total}</b>
              <span>
                ({adults} Adults, {children} Children · Max 20 Total)
              </span>
            </div>
            <FieldError msg={errors.pax} />
          </div>
        )}

        <div className={`${fieldCls("hotelCategory")} full`} id="hotelCategory" tabIndex={-1}>
          <span className="lbl">
            Hotel category<span className="req">*</span> <span className="hint">Select one or multiple preferred stay styles:</span>
          </span>
          <div className="tiles">
            {HOTELS.map((h) => (
              <label className="tile" key={h.v}>
                <input type="checkbox" name="hotelCategory" value={h.v} />
                <span aria-hidden="true">{h.icon}</span>
                {h.v}
                <span className="tick-box" />
              </label>
            ))}
          </div>
          <FieldError msg={errors.hotelCategory} />
        </div>

        {!quick && (
          <>
            <div className="field">
              <label htmlFor="rooms">No. rooms</label>
              <select id="rooms" name="rooms" className="select" defaultValue="1 Room">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n}>{`${n} Room${n > 1 ? "s" : ""}`}</option>
                ))}
                <option>Not sure yet</option>
              </select>
            </div>
            <div className="field">
              <span className="lbl">Meal plan</span>
              <div className="tiles" style={{ gridTemplateColumns: "1fr" }}>
                {MEALS.map((m) => (
                  <label className="tile" key={m}>
                    <input type="checkbox" name="mealPlan" value={m} />
                    {m}
                    <span className="tick-box" />
                  </label>
                ))}
              </div>
            </div>
            <div className="field full">
              <span className="lbl">Interests</span>
              <div className="tiles">
                {INTERESTS.map((it) => (
                  <label className="tile" key={it.v}>
                    <input type="checkbox" name="interests" value={it.v} />
                    <span aria-hidden="true">{it.icon}</span>
                    {it.v}
                    <span className="tick-box" />
                  </label>
                ))}
              </div>
            </div>
            <div className="field">
              <label htmlFor="budget">
                Targeted package budget <span className="hint">(per person in USD)</span>
              </label>
              <select id="budget" name="budget" className="select" defaultValue="Not sure yet">
                {BUDGETS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              <span className="hint">Gives us an accurate benchmark to select ideal boutique hotels and private experiences.</span>
            </div>
            <div className="field full">
              <label htmlFor="other">Other requirements</label>
              <textarea id="other" className="textarea" maxLength={1000} value={other} onChange={(e) => setOther(e.target.value)} />
              <span className="hint" style={{ justifySelf: "end" }}>
                {other.length} / 1000
              </span>
            </div>
          </>
        )}
      </div>

      <div className={fieldCls("consent")}>
        <label className="consent">
          <input type="checkbox" name="consent" id="consent" />
          <span>
            I agree to the{" "}
            <Link className="ulink" href="/privacy-policy" style={{ color: "var(--ink)" }}>
              Privacy Policy
            </Link>{" "}
            and consent to Lotus Ceylon contacting me regarding this inquiry.
          </span>
        </label>
        <FieldError msg={errors.consent} />
      </div>

      {failed && <FailBanner waText={failed} />}

      <div className="stack" style={{ gap: 12, justifyItems: "start" }}>
        <button type="submit" className="btn btn-navy" disabled={busy}>
          {busy ? "Sending…" : quick ? "Submit quick inquiry" : "Submit inquiry"}
        </button>
        <span className="small">We reply within 24 hours · 100% Privacy Guaranteed · Zero Obligation</span>
      </div>

      {done && <ThankYou reference={done.ref} waText={done.wa} onClose={() => setDone(null)} />}
    </form>
  );
}

/* ------------------------------------------------------------------ contact */
const THEMES_OPT = [
  "Cultural & Ancient Kingdoms",
  "Wildlife & Leopard Safaris",
  "Coastal Serenity & Beaches",
  "Highlands & Ceylon Tea Trails",
  "Ayurvedic Healing & Wellness",
  "Romantic Escapes & Honeymoon",
  "Family Adventures",
  "100% Tailor-Made Custom Journey",
];

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "busy" | "sent" | "fallback">("idle");
  const [wa, setWa] = useState("");
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const errs: Errors = {};
    if ((data.name || "").trim().length < 2) errs.name = "Please enter your full name.";
    if (!EMAIL_RE.test(data.email || "")) errs.email = "Please enter a valid email address.";
    if ((data.message || "").trim().length < 5) errs.message = "Please share your travel wishes and approximate dates.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("busy");
    const msg = `🌺 *LOTUS CEYLON - CONTACT MESSAGE*\n👤 ${data.name}\n✉️ ${data.email}\n📱 ${data.phone || "-"}\n🎯 ${data.theme}\n━━━━━━━━━━━━━━━━━━━━\n${data.message}`;
    setWa(msg);
    const res = await submitForm("contact", { ...data, timestamp: new Date().toISOString() });
    if (res.ok) {
      setState("sent");
      form.reset();
    } else setState("fallback");
  };
  const fieldCls = (k: string) => `field ${errors[k] ? "invalid" : ""}`;
  return (
    <form className="form" noValidate onSubmit={onSubmit}>
      <div className="form-grid">
        <div className={fieldCls("name")}>
          <label htmlFor="c-name">
            Your full name<span className="req">*</span>
          </label>
          <input id="c-name" name="name" className="input" autoComplete="name" />
          {errors.name && <span className="err">{errors.name}</span>}
        </div>
        <div className={fieldCls("email")}>
          <label htmlFor="c-email">
            Email address<span className="req">*</span>
          </label>
          <input id="c-email" name="email" type="email" className="input" autoComplete="email" />
          {errors.email && <span className="err">{errors.email}</span>}
        </div>
        <div className="field">
          <label htmlFor="c-phone">Mobile / WhatsApp number</label>
          <input id="c-phone" name="phone" type="tel" className="input" autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="c-theme">Interested travel theme</label>
          <select id="c-theme" name="theme" className="select" defaultValue={THEMES_OPT[THEMES_OPT.length - 1]}>
            {THEMES_OPT.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className={`${fieldCls("message")} full`}>
          <label htmlFor="c-msg">
            Your travel wishes &amp; approximate dates<span className="req">*</span>
          </label>
          <textarea id="c-msg" name="message" className="textarea" />
          {errors.message && <span className="err">{errors.message}</span>}
        </div>
      </div>
      {state === "sent" && (
        <div className="banner" role="status">
          Thank you — your message has reached our concierge. We will respond with thoughtful guidance shortly.
        </div>
      )}
      {state === "fallback" && (
        <div className="banner" role="status">
          <span>Our online inbox is being set up. Send this message straight to our concierge instead:</span>
          <a className="btn btn-navy btn-sm" href={conciergeWhatsApp(wa)} target="_blank" rel="noopener noreferrer">
            Send via WhatsApp
          </a>
          <a className="btn btn-line btn-sm" href={`mailto:${SITE.email}?subject=${encodeURIComponent("Lotus Ceylon inquiry")}&body=${encodeURIComponent(wa.replace(/\*/g, ""))}`}>
            Send via email
          </a>
        </div>
      )}
      <div>
        <button type="submit" className="btn btn-navy" disabled={state === "busy"}>
          {state === "busy" ? "Sending…" : "Send message to concierge"}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ review */
const RATINGS = ["★★★★★ Exceptional (5 / 5)", "★★★★☆ Very Good (4 / 5)", "★★★☆☆ Good (3 / 5)", "★★☆☆☆ Fair (2 / 5)", "★☆☆☆☆ Poor (1 / 5)"];

export function ReviewForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "busy" | "sent" | "fallback">("idle");
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const errs: Errors = {};
    if ((data.guest_name || "").trim().length < 2) errs.guest_name = "Please enter your name.";
    if ((data.country || "").trim().length < 2) errs.country = "Please enter your country of residence.";
    if ((data.review_text || "").trim().length < 10) errs.review_text = "Please share a few words about your journey.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("busy");
    const res = await submitForm("review", { ...data, rating: 5 - RATINGS.indexOf(data.rating), timestamp: new Date().toISOString() });
    if (res.ok) {
      setState("sent");
      form.reset();
    } else setState("fallback");
  };
  const fieldCls = (k: string) => `field ${errors[k] ? "invalid" : ""}`;
  return (
    <form className="form" noValidate onSubmit={onSubmit}>
      <div className="form-grid">
        <div className={fieldCls("guest_name")}>
          <label htmlFor="r-name">
            Your name<span className="req">*</span>
          </label>
          <input id="r-name" name="guest_name" className="input" autoComplete="name" />
          {errors.guest_name && <span className="err">{errors.guest_name}</span>}
        </div>
        <div className={fieldCls("country")}>
          <label htmlFor="r-country">
            Country of residence<span className="req">*</span>
          </label>
          <input id="r-country" name="country" className="input" autoComplete="country-name" />
          {errors.country && <span className="err">{errors.country}</span>}
        </div>
        <div className="field">
          <label htmlFor="r-tour">Tour / experience taken</label>
          <input id="r-tour" name="tour_taken" className="input" />
        </div>
        <div className="field">
          <label htmlFor="r-rating">
            Rating<span className="req">*</span>
          </label>
          <select id="r-rating" name="rating" className="select" defaultValue={RATINGS[0]}>
            {RATINGS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className={`${fieldCls("review_text")} full`}>
          <label htmlFor="r-text">
            Your reflections &amp; review<span className="req">*</span>
          </label>
          <textarea id="r-text" name="review_text" className="textarea" />
          {errors.review_text && <span className="err">{errors.review_text}</span>}
        </div>
      </div>
      {state === "sent" && (
        <div className="banner" role="status">
          Thank you for sharing your reflection. It will appear once verified by our team.
        </div>
      )}
      {state === "fallback" && (
        <div className="banner" role="status">
          Online review submission opens soon. In the meantime, please send your reflection to{" "}
          <a className="ulink" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
          .
        </div>
      )}
      <div>
        <button type="submit" className="btn btn-navy" disabled={state === "busy"}>
          {state === "busy" ? "Sending…" : "Submit reflection for verification"}
        </button>
      </div>
    </form>
  );
}
