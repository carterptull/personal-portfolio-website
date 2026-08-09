import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CONTACT, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import { profile } from "@/content/profile";
import { SiteHeader } from "@/components/ssr/SiteHeader";
import { SiteFooter } from "@/components/ssr/SiteFooter";
import { DesktopBoundary } from "@/components/desktop/DesktopBoundary";
import "./globals.css";

const msSans = localFont({
  src: [
    { path: "../fonts/ms_sans_serif.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ms_sans_serif_bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ms",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s - Carter Tull" },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#BB0000" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D0F" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: SITE_URL,
  image: `${SITE_URL}/icons/icon-512.png`,
  jobTitle: profile.role,
  worksFor: { "@type": "Organization", name: profile.company },
  alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.school },
  sameAs: [CONTACT.github, CONTACT.linkedin, CONTACT.youtube],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={msSans.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="ssr-layer">
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </div>
        <DesktopBoundary />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {process.env.VERCEL ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
