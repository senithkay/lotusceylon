"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Map as LMap, LayerGroup } from "leaflet";
import { MAKE_IT_YOURS_OPTIONS, SITE } from "@/lib/site";
import type { ItineraryDay } from "@/lib/content";
import { ChatIcon } from "./ui";

/* ------------------------------------------------------------------ route map (Leaflet) */
export type MapRoute = {
  id: string;
  title: string;
  href?: string;
  stops: { name: string; lat: number; lng: number; activities?: string[] }[];
};

const ROUTE_STYLES = [
  { color: "#0A1E4A", dash: undefined },
  { color: "#16171B", dash: "6 8" },
  { color: "#7F93BF", dash: undefined },
  { color: "#0A1E4A", dash: "2 8" },
  { color: "#6B707B", dash: "10 6" },
];

export function RouteMap({ routes, wide, hq, single }: { routes: MapRoute[]; wide?: boolean; hq?: boolean; single?: boolean }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LMap | null>(null);
  const groups = useRef<Record<string, LayerGroup>>({});
  const [active, setActive] = useState<string[]>(routes.map((r) => r.id));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current || map.current) return;
      const m = L.map(el.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
      map.current = m;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(m);

      const bounds = L.latLngBounds([]);
      if (hq) {
        const icon = L.divIcon({ className: "", html: '<div class="lc-pin lc-pin--hq"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
        L.marker([SITE.coordinates.lat, SITE.coordinates.lng], { icon })
          .addTo(m)
          .bindPopup(`<b>${SITE.legalName}</b><br/>${SITE.address.full}`)
          .openPopup();
        bounds.extend([SITE.coordinates.lat, SITE.coordinates.lng]);
        m.setView([SITE.coordinates.lat, SITE.coordinates.lng], 13);
      }

      routes.forEach((r, idx) => {
        const st = ROUTE_STYLES[idx % ROUTE_STYLES.length];
        const g = L.layerGroup();
        const coords: [number, number][] = [];
        r.stops.forEach((s, i) => {
          if (typeof s.lat !== "number") return;
          coords.push([s.lat, s.lng]);
          bounds.extend([s.lat, s.lng]);
          const icon = L.divIcon({
            className: "",
            html: `<div style="width:22px;height:22px;border-radius:50%;background:${st.color};color:#fff;font:500 11px/22px var(--sans);text-align:center;border:2px solid #fff;box-shadow:0 0 0 1px ${st.color}">${i + 1}</div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });
          const acts = s.activities?.length ? `<ul style="margin:6px 0 0;padding-left:16px">${s.activities.map((a) => `<li>${a}</li>`).join("")}</ul>` : "";
          L.marker([s.lat, s.lng], { icon, title: s.name })
            .bindPopup(`<span style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#6B707B">${single ? `Stop ${i + 1}` : r.title}</span><br/><b>${s.name}</b>${acts}`)
            .addTo(g);
        });
        if (coords.length > 1) L.polyline(coords, { color: st.color, weight: 2.5, opacity: 0.85, dashArray: st.dash }).addTo(g);
        g.addTo(m);
        groups.current[r.id] = g;
      });
      if (bounds.isValid() && !hq) m.fitBounds(bounds, { padding: [30, 30] });
      if (!bounds.isValid() && !hq) m.setView([7.8731, 80.7718], 7);
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      groups.current = {};
    };
  }, [routes, hq, single]);

  const toggle = (id: string) => {
    const m = map.current;
    const g = groups.current[id];
    if (!m || !g) return;
    setActive((a) => {
      const on = a.includes(id);
      if (on) m.removeLayer(g);
      else g.addTo(m);
      return on ? a.filter((x) => x !== id) : [...a, id];
    });
  };

  return (
    <div>
      <div className={`map ${wide ? "map--wide" : ""}`} ref={el} role="region" aria-label="Interactive Sri Lanka route map" />
      {routes.length > 1 && (
        <div className="map-legend" role="group" aria-label="Toggle routes">
          {routes.map((r, idx) => {
            const st = ROUTE_STYLES[idx % ROUTE_STYLES.length];
            return (
              <button key={r.id} type="button" aria-pressed={active.includes(r.id)} onClick={() => toggle(r.id)}>
                <i style={{ background: st.dash ? `repeating-linear-gradient(90deg, ${st.color} 0 6px, transparent 6px 10px)` : st.color }} />
                {r.title}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ itinerary timeline */
export function Timeline({ days }: { days: ItineraryDay[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const items = ref.current?.querySelectorAll(".tl-item");
    if (!items) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("bloom")),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);
  const icons = ["🏨", "🍽️", "🚗"];
  return (
    <div className="tl" ref={ref}>
      {days.map((d) => (
        <article className="tl-item" key={d.day}>
          <div className="tl-day">
            <i aria-hidden="true" />
            {d.day}
          </div>
          <div>
            <h3>{d.title}</h3>
            {d.desc && <p>{d.desc}</p>}
            {d.meta.length > 0 && (
              <div className="tl-meta">
                {d.meta.map((m, i) => (
                  <span key={i}>
                    <span aria-hidden="true">{icons[i] ?? "•"}</span>
                    {m}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ booking actions */
const SAVE_KEY = "lotus_saved_tours";

export function BookingActions({ title, category, id, waHref }: { title: string; category: string; id: string; waHref: string }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(SAVE_KEY) || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read persisted preference after mount
      setSaved(list.includes(id));
    } catch {
      /* storage unavailable */
    }
  }, [id]);

  const toggleSave = () => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(SAVE_KEY) || "[]");
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
      setSaved(next.includes(id));
    } catch {
      setSaved((s) => !s);
    }
  };
  const share = () => {
    const msg = `Hello! Take a look at this luxury Sri Lanka journey by Lotus Ceylon: "${title}"\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this tour link:", window.location.href);
    }
  };

  return (
    <>
      <div style={{ display: "grid", gap: 10 }}>
        <button type="button" className="btn btn-navy btn-block" onClick={() => setOpen(true)}>
          Make it yours (tailor tour)
        </button>
        <Link className="btn btn-line btn-block" href={`/inquiry?${new URLSearchParams({ package: title })}`}>
          Inquire about this tour
        </Link>
        <a className="btn btn-line btn-block" href={waHref} target="_blank" rel="noopener noreferrer">
          <ChatIcon size={18} /> Chat on WhatsApp
        </a>
      </div>
      <div className="share-row">
        <button type="button" aria-pressed={saved} onClick={toggleSave}>
          {saved ? "Saved to favorites" : "Save trip"}
        </button>
        <button type="button" onClick={share}>
          Share
        </button>
        <button type="button" onClick={copy}>
          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>
      {open && <MakeItYours title={title} category={category} onClose={() => setOpen(false)} />}
    </>
  );
}

export function MakeItYours({ title, category, onClose }: { title: string; category: string; onClose: () => void }) {
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams({ package: title, category });
    if (picked.length) p.set("custom", picked.join(" | "));
    if (notes.trim()) p.set("notes", notes.trim());
    onClose();
    router.push(`/inquiry?${p}`);
  };
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Make it yours - tailor your tour" onClick={onClose} data-lenis-prevent="">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className="eyebrow muted">Bespoke customization</p>
        <h3 className="h3" style={{ marginTop: 14 }}>
          Make it yours: <em>{title}</em>
        </h3>
        <p className="small" style={{ marginTop: 14 }}>
          Every Lotus Ceylon journey is 100% tailor-made. Select your preferred enhancements below, and our concierge will calculate your customized proposal.
        </p>
        <form onSubmit={submit} className="form" style={{ marginTop: 26 }}>
          <div className="tiles" style={{ gridTemplateColumns: "1fr" }}>
            {MAKE_IT_YOURS_OPTIONS.map((o) => (
              <label className="tile" key={o.id}>
                <input
                  type="checkbox"
                  checked={picked.includes(o.label)}
                  onChange={(e) => setPicked((p) => (e.target.checked ? [...p, o.label] : p.filter((x) => x !== o.label)))}
                />
                <span aria-hidden="true">{o.icon}</span>
                {o.label}
                <span className="tick-box" />
              </label>
            ))}
          </div>
          <div className="field">
            <label htmlFor="wishes">Any specific wishes, dietary needs or dates?</label>
            <textarea
              id="wishes"
              className="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Traveling for anniversary in November, vegetarian meals, preference for eco-lodges..."
            />
          </div>
          <div className="btns">
            <button type="submit" className="btn btn-navy">
              Continue to detailed inquiry
            </button>
            <button type="button" className="btn btn-line" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** Mobile sticky bottom bar on package pages. */
export function MobileTourBar({ title, waHref }: { title: string; waHref: string }) {
  useEffect(() => {
    document.body.classList.add("has-mbar");
    return () => document.body.classList.remove("has-mbar");
  }, []);
  const short = title.length > 32 ? title.split(/[•|–-]/)[0].trim().slice(0, 30) : title;
  return (
    <div className="mbar">
      <div>
        <small>Pure Ceylon private journey</small>
        <b>{short}</b>
      </div>
      <div className="btns" style={{ flexWrap: "nowrap", gap: 8 }}>
        <a className="btn btn-line btn-sm" href={waHref} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
          <ChatIcon size={18} />
        </a>
        <Link className="btn btn-navy btn-sm" href={`/inquiry?${new URLSearchParams({ package: title })}`}>
          Tailor journey
        </Link>
      </div>
    </div>
  );
}
