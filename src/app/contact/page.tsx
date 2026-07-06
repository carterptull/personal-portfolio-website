import type { Metadata } from "next";
import { SsrWindow } from "@/components/ssr/SsrWindow";
import { ContactContent } from "@/components/content/ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Carter Tull — email, LinkedIn, and GitHub.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <SsrWindow title="Contact">
      <h1 className="font-pixel mb-3 text-xl font-bold">Contact</h1>
      <ContactContent />
    </SsrWindow>
  );
}
