import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Carter Tull — Software Engineer",
    short_name: "Carter Tull",
    description:
      "Portfolio of Carter Tull, Automation Developer at ConstructConnect — built as a retro Windows 95 desktop.",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0D0F",
    theme_color: "#BB0000",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
