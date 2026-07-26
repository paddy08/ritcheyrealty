import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Property Search",
};

export default function SearchPage() {
  return (
    <ComingSoon
      title="Property Search"
      description="Full MLS/IDX search across Fort Worth and the north metroplex is being built. Reach out directly in the meantime and Kallie will do the search for you."
    />
  );
}
