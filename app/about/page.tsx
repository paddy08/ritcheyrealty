import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <ComingSoon
      title="About Kallie"
      description="Kallie's full story — background, approach, and what almost fifteen years of North Texas real estate looks like — is on its way."
    />
  );
}
