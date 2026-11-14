import { LegalPage, legalMetadata } from "@/components/legal-page";

export const metadata = legalMetadata("cancellation-policy");

export default function CancellationPolicyPage() {
  return <LegalPage k="cancellation-policy" />;
}
