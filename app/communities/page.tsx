import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Communities",
};

export default function CommunitiesPage() {
  return (
    <ComingSoon
      title="Communities"
      description="A deeper look at each of the eight towns Ritchey Realty covers — character, schools, and what your money buys in each — is coming soon."
    />
  );
}
