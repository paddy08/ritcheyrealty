import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Testimonials",
};

export default function TestimonialsPage() {
  return (
    <ComingSoon
      title="Testimonials"
      description="The full set of client stories — not just the highlights on the homepage — will live here soon."
    />
  );
}
