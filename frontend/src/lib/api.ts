/**
 * Frontend ⇄ backend contract.
 *
 * The backend (inquiries, contact messages, reviews, chat) is not built yet.
 * Every form in the app calls `submitForm()`. When `NEXT_PUBLIC_API_URL` is
 * set, the payload is POSTed to `${NEXT_PUBLIC_API_URL}/<endpoint>`. When it is
 * not set (or the request fails) the caller falls back to the WhatsApp
 * concierge, exactly like the legacy site did.
 */
import { SITE } from "./site";

export type FormKind = "inquiry-detailed" | "inquiry-quick" | "contact" | "review" | "customize";

export const ENDPOINTS: Record<FormKind, string> = {
  "inquiry-detailed": "/inquiries/detailed",
  "inquiry-quick": "/inquiries/quick",
  contact: "/contact",
  review: "/reviews",
  customize: "/inquiries/customize",
};

export type InquiryPayload = {
  referenceId: string;
  formType: "quick" | "detailed";
  name: string;
  country: string;
  email: string;
  whatsapp?: string;
  arrivalDate: string;
  departureDate: string;
  pax?: string;
  adults?: string;
  children?: string;
  totalPax: string;
  hotelCategory: string[];
  rooms?: string;
  mealPlan?: string[];
  interests?: string[];
  budget?: string;
  otherRequirements?: string;
  prefill?: string;
  custom?: string;
  language: string;
  timestamp: string;
};

export type SubmitResult = { ok: true; data?: unknown } | { ok: false; reason: "not-configured" | "network" | "server" };

export const apiBase = () => process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export async function submitForm(kind: FormKind, payload: unknown): Promise<SubmitResult> {
  const base = apiBase();
  if (!base) return { ok: false, reason: "not-configured" };
  try {
    const res = await fetch(base + ENDPOINTS[kind], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, reason: "server" };
    const data = await res.json().catch(() => undefined);
    return { ok: true, data };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export const makeReference = () =>
  `LC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

/** WhatsApp message identical in shape to the legacy concierge fallback. */
export function inquiryWhatsAppMessage(d: InquiryPayload) {
  const line = "━━━━━━━━━━━━━━━━━━━━\n";
  let msg = `🌺 *LOTUS CEYLON - ${d.formType === "quick" ? "QUICK" : "TRAVEL"} INQUIRY*\n${line}`;
  msg += `📌 *Reference:* ${d.referenceId}\n👤 *Name:* ${d.name}\n🌍 *Country:* ${d.country}\n✉️ *Email:* ${d.email}\n`;
  if (d.whatsapp) msg += `📱 *WhatsApp:* ${d.whatsapp}\n`;
  msg += line;
  msg += `✈️ *Arrival Date:* ${d.arrivalDate}\n🛫 *Departure Date:* ${d.departureDate}\n`;
  msg +=
    d.formType === "detailed"
      ? `👥 *Travelers:* ${d.totalPax} Pax (${d.adults ?? 2} Adults, ${d.children ?? 0} Children)\n`
      : `👥 *Total Pax:* ${d.totalPax} Persons\n`;
  msg += `🏨 *Hotel Preferences:* ${d.hotelCategory.join(", ") || "Standard"}\n`;
  if (d.rooms) msg += `🛏️ *No. Rooms:* ${d.rooms}\n`;
  if (d.mealPlan?.length) msg += `🍽️ *Meal Plan:* ${d.mealPlan.join(", ")}\n`;
  if (d.interests?.length) msg += `🎯 *Interests:* ${d.interests.join(", ")}\n`;
  if (d.budget) msg += `💰 *Targeted Budget (USD/person):* ${d.budget}\n`;
  if (d.prefill) msg += `🔖 *Enquiring About:* ${d.prefill}\n`;
  if (d.custom) msg += `✨ *Enhancements:* ${d.custom}\n`;
  if (d.otherRequirements) msg += `${line}📝 *Other Requirements:*\n${d.otherRequirements}\n`;
  return msg;
}

export const conciergeWhatsApp = (text: string) =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
