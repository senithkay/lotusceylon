import { LegalPage, legalMetadata } from "@/components/legal-page";

export const metadata = legalMetadata("terms-conditions");

export default function TermsConditionsPage() {
  return <LegalPage k="terms-conditions" />;
}
