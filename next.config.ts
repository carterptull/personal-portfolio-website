import type { NextConfig } from "next";

// unsafe-eval only in dev: React's dev build needs it, production never does.
const devOnlyScriptSrc = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

// See DECISIONS.md for why each non-default value here is load-bearing.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${devOnlyScriptSrc} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self'",
  "connect-src 'self' https://va.vercel-scripts.com",
  // 'self': the resume PDF <object> renders through Chrome's internal viewer frame.
  "frame-src 'self' https://www.youtube-nocookie.com",
  "object-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  // 'self', not 'none': these headers also apply to the PDF itself.
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" }, // matches frame-ancestors 'self'
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      // YouTube thumbnails for the Media Player facade
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
