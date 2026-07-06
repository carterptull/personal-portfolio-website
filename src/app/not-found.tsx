import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-void p-4">
      <div className="bevel-window w-full max-w-md bg-chrome p-0.5">
        <div className="titlebar-active flex items-center px-2 py-1">
          <span className="font-pixel text-sm font-bold">
            CarterOS — Illegal Operation
          </span>
        </div>
        <div className="space-y-4 p-4 text-[15px]">
          <p className="font-pixel font-bold">
            A fatal exception 404 has occurred at 0xC0DE:0xBB0000.
          </p>
          <p>
            The page you asked for could not be found. It may have been moved,
            deleted, or never existed in the first place.
          </p>
          <ul className="list-disc pl-5 text-sm">
            <li>Press the button below to return to the desktop.</li>
            <li>If the problem persists, the link you followed is broken.</li>
          </ul>
          <p>
            <Link href="/" className="btn95 inline-block font-bold">
              Return to desktop
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
