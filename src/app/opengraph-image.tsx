import { ogWindow, OG_SIZE } from "@/lib/og";

export const alt = "Carter Tull — Software Engineer";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogWindow(
    "cartertull.exe",
    "Carter Tull",
    "Automation Developer · ConstructConnect · Cincinnati, OH"
  );
}
