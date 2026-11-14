import { LegalPage, legalMetadata } from "@/components/legal-page";

export const metadata = legalMetadata("privacy-policy");

export default function PrivacyPolicyPage() {
  return <LegalPage k="privacy-policy" />;
}
