import { LegalPage, legalMetadata } from "@/components/legal-page";

export const metadata = legalMetadata("cookie-policy");

export default function CookiePolicyPage() {
  return <LegalPage k="cookie-policy" />;
}
